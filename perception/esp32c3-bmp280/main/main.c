/* HTTP GET Example using plain POSIX sockets

   This example code is in the Public Domain (or CC0 licensed, at your option.)

   Unless required by applicable law or agreed to in writing, this
   software is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
   CONDITIONS OF ANY KIND, either express or implied.
*/
#include <string.h>
#include <stdio.h>
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "esp_system.h"
#include "esp_wifi.h"
#include "esp_event.h"
#include "esp_log.h"
#include "nvs_flash.h"
#include "protocol_examples_common.h"

#include "lwip/err.h"
#include "lwip/sockets.h"
#include "lwip/sys.h"
#include "lwip/netdb.h"
#include "lwip/dns.h"
#include <bmp280.h>
#include "../config.h"


/* HTTP constants that aren't configurable in menuconfig */
#define MEASUREMENT_WEB_PATH "/measurement"
#define DEVICE_WEB_PATH "/device"
#define MAC_ADDR_SIZE 6

static const char *TAG = "temp_collector";

static char *BODY = "id=%s&name=%s&key=%02x:%02x:%02x:%02x:%02x:%02x&t=%.2f&h=%.0f&p=%.0f";
static char *BODY2= "id=%s&name=%s&key=%02x:%02x:%02x:%02x:%02x:%02x";

static char *MEASUREMENT_REQUEST_POST = "POST "MEASUREMENT_WEB_PATH" HTTP/2.0\r\n"
    "Host: "API_IP_PORT"\r\n"
    "User-Agent: "USER_AGENT"\r\n"
    "Content-Type: application/x-www-form-urlencoded\r\n"
    "Content-Length: %d\r\n"
    "\r\n"
    "%s";

static char *DEVICE_REQUEST_POST = "POST "DEVICE_WEB_PATH" HTTP/2.0\r\n"
    "Host: "API_IP_PORT"\r\n"
    "User-Agent: "USER_AGENT"\r\n"
    "Content-Type: application/x-www-form-urlencoded\r\n"
    "Content-Length: %d\r\n"
    "\r\n"
    "%s";

static void http_get_task(void *pvParameters)
{
    const struct addrinfo hints = {
        .ai_family = AF_INET,
        .ai_socktype = SOCK_STREAM,
    };
    struct addrinfo *res;
    struct in_addr *addr;
    int s, r;
    char body[100];
    char body2[100];
    char recv_buf[64];
    char device_send_buf[256];
    char measurement_send_buf[256];
 
    bmp280_params_t params;
    bmp280_init_default_params(&params);
    bmp280_t dev;
    memset(&dev, 0, sizeof(bmp280_t));

    ESP_ERROR_CHECK(bmp280_init_desc(&dev, BMP280_I2C_ADDRESS_0, 0, SDA_GPIO, SCL_GPIO));
    ESP_ERROR_CHECK(bmp280_init(&dev, &params));

    bool bme280p = dev.id == BME280_CHIP_ID;
    ESP_LOGI(TAG, "BMP280: found %s\n", bme280p ? "BME280" : "BMP280");

    float pressure, temperature, humidity;

    uint8_t mac[MAC_ADDR_SIZE];
    

    while(1) {
        if (bmp280_read_float(&dev, &temperature, &pressure, &humidity) != ESP_OK) {
            ESP_LOGI(TAG, "Temperature/pressure reading failed\n");
        } else {
            ESP_LOGI(TAG, "Pressure: %.2f Pa, Temperature: %.2f C", pressure, temperature);
//            if (bme280p) {
            ESP_LOGI(TAG,", Humidity: %.2f\n", humidity);
              
            //Get MAC
            esp_wifi_get_mac(ESP_IF_WIFI_STA, mac); 
            ESP_LOGI("MAC address", "MAC address: %02x:%02x:%02x:%02x:%02x:%02x", mac[0], mac[1], mac[2], mac[3], mac[4], mac[5]);
    
		    snprintf(body, sizeof(body), BODY, DEVICE_ID, USER_AGENT, mac[0], mac[1], mac[2], mac[3], mac[4], mac[5], temperature, humidity, pressure/100.00);
            snprintf(body2, sizeof(body2), BODY2, DEVICE_ID, USER_AGENT, mac[0], mac[1], mac[2], mac[3], mac[4], mac[5]);
           // Send data to /measurement
           sprintf(measurement_send_buf, MEASUREMENT_REQUEST_POST, (int)strlen(body),body);  
           // Send data to /device 
           sprintf(device_send_buf, DEVICE_REQUEST_POST, (int)strlen(body2),body2);
       
//	    } else {
//                sprintf(measurement_send_buf, REQUEST_POST, temperature , 0);
//            }

        ESP_LOGI(TAG,"sending: \n%s\n",measurement_send_buf);
        ESP_LOGI(TAG,"sending: \n%s\n",device_send_buf);

                }    

        int err = getaddrinfo(API_IP, API_PORT, &hints, &res);

        if(err != 0 || res == NULL) {
            ESP_LOGE(TAG, "DNS lookup failed err=%d res=%p", err, res);
            vTaskDelay(1000 / portTICK_PERIOD_MS);
            continue;
        }

        /* Code to print the resolved IP.

           Note: inet_ntoa is non-reentrant, look at ipaddr_ntoa_r for "real" code */
        addr = &((struct sockaddr_in *)res->ai_addr)->sin_addr;
        ESP_LOGI(TAG, "DNS lookup succeeded. IP=%s", inet_ntoa(*addr));

        s = socket(res->ai_family, res->ai_socktype, 0);
        if(s < 0) {
            ESP_LOGE(TAG, "... Failed to allocate socket.");
            freeaddrinfo(res);
            vTaskDelay(1000 / portTICK_PERIOD_MS);
            continue;
        }
        ESP_LOGI(TAG, "... allocated socket");

        if(connect(s, res->ai_addr, res->ai_addrlen) != 0) {
            ESP_LOGE(TAG, "... socket connect failed errno=%d", errno);
            close(s);
            freeaddrinfo(res);
            vTaskDelay(4000 / portTICK_PERIOD_MS);
            continue;
        }

        ESP_LOGI(TAG, "... connected");
        freeaddrinfo(res);


    if (write(s, measurement_send_buf, strlen(measurement_send_buf)) < 0 || write(s, device_send_buf, strlen(device_send_buf)) < 0) {
        ESP_LOGE(TAG, "... socket send failed");
        close(s);
        vTaskDelay(4000 / portTICK_PERIOD_MS);
        continue;
    }

        ESP_LOGI(TAG, "... socket send success");


        struct timeval receiving_timeout;
        receiving_timeout.tv_sec = 5;
        receiving_timeout.tv_usec = 0;
        if (setsockopt(s, SOL_SOCKET, SO_RCVTIMEO, &receiving_timeout,
                sizeof(receiving_timeout)) < 0) {
            ESP_LOGE(TAG, "... failed to set socket receiving timeout");
            close(s);
            vTaskDelay(4000 / portTICK_PERIOD_MS);
            continue;
        }
        ESP_LOGI(TAG, "... set socket receiving timeout success");

        /* Read HTTP response */
        do {
            bzero(recv_buf, sizeof(recv_buf));
            r = read(s, recv_buf, sizeof(recv_buf)-1);
            for(int i = 0; i < r; i++) {
                putchar(recv_buf[i]);
            }
        } while(r > 0);

        ESP_LOGI(TAG, "... done reading from socket. Last read return=%d errno=%d.", r, errno);
        close(s);


        for(int countdown = 10; countdown >= 0; countdown--) {
            ESP_LOGI(TAG, "%d... ", countdown);
            vTaskDelay(1000 / portTICK_PERIOD_MS);
        }
        
        ESP_LOGI(TAG, "Starting again!");
    }
 
}

void app_main(void)
{
    ESP_ERROR_CHECK( nvs_flash_init() );
    ESP_ERROR_CHECK(esp_netif_init());
    ESP_ERROR_CHECK(esp_event_loop_create_default());
    ESP_ERROR_CHECK(i2cdev_init());

    ESP_ERROR_CHECK(example_connect());

    xTaskCreate(&http_get_task, "http_get_task", 4096, NULL, 5, NULL);
}