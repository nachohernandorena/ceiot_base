# Ejercicio CiberKillChain - Ataque

Se realizó una copia del documento original utilizándolo como plantilla para la realización del ejercicio.

## Alumno

Ignacio Pablo Hernandorena

## Enunciado
Armar una cyberkillchain usando técnicas de la matriz de Att&ck para un escenario relacionado al trabajo práctico de la carrera.

## Datos del proyecto a evaluar

El proyecto propone el desarrollo de un sistema de gestión de ganado basado en IoT para abordar desafíos en la agricultura y la ganadería en Argentina. Utiliza etiquetas electrónicas (TAGs) con tecnología LoRaWAN para rastrear y controlar el ganado. Estos TAGs están compuestos por paneles solares, GPS y dispositivos LoRaWAN. Los datos de los TAGs se recopilan mediante un gateway y se envían a una plataforma en la nube llamada The Things Stack, que ofrece servicios de gestión segura de dispositivos IoT. También se integra con AllThingsTalk, una plataforma de IoT basada en la nube, que permite a los usuarios delimitar áreas para el ganado, establecer alarmas y monitorear en tiempo real. El proyecto contará con una base de datos donde se guardará el registro médico de cada animal.

[Link a la planificacion del proyecto](https://github.com/nachohernandorena/Plantilla-planificacion/blob/master/charter.pdf) 

### Resolución:

Objetivo del ataque: Realizar un ataque de ransomware contra la base de datos del sistema de gestión de ganado IoT para cifrar los datos y exigir un rescate a cambio de su liberación, causando interrupción del funcionamiento de la plataforma.

* Reconnaissance
  - Identifico el proyecto de gestión de ganado IoT y las tecnologías utilizadas.
  - Investigación adicional sobre posibles vulnerabilidades conocidas en las tecnologías y plataformas utilizadas.
  - Técnica: Gather Victim Host Information [T1592](https://attack.mitre.org/techniques/T1592/)

* Weaponization
  - Desarrollo o adquiero un malware de ransomware diseñado para cifrar datos de manera eficiente y efectiva.
  - Técnica: Supply Chain Compromise [T1195](https://attack.mitre.org/techniques/T1195/)
  
* Delivery
  - Utilizo correos electrónicos de phishing altamente personalizados para entregar el malware a través de un enlace o archivo malicioso.
  - Técnica: Phishing for Information [T1198](https://attack.mitre.org/techniques/T1598/)
  
* Exploit
  - Si un empleado cae en la trampa y abre el archivo adjunto o hace clic en el enlace, el ransomware se activa y comienza a cifrar los datos en el sistema.
  - Técnica: User Execution [T1204](https://attack.mitre.org/techniques/T1204/)
  
* Installation  
  - El ransomware se propaga cifrando archivos en los dispositivos IoT y en los servidores de la plataforma en la nube.
  - Técnica: Ingress Tool Transfer [T1105](https://attack.mitre.org/techniques/T1105/) / Data Encrypted for Impact [T1486](https://attack.mitre.org/techniques/T1486/)

* Command & Control
  - Establezco una conexión segura a través de una red privada virtual (VPN) para controlar el ransomware de manera anónima.
  - Técnica: Remote Access Tools [T1219](https://attack.mitre.org/techniques/T1219/)
  
* Actions on Objectives
  - Una vez que los datos están cifrados, muestro un mensaje de rescate en las pantallas de la plataforma, exigiendo un pago en criptomonedas a cambio de la clave de descifrado.
  - Técnica: Endpoint Denial of Service [T1499](https://attack.mitre.org/techniques/T1499/) / Data Encrypted for Impact [T1486](https://attack.mitre.org/techniques/T1486/)

  
### Links
https://attack.mitre.org/


  

