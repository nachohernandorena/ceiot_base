const express = require("express");
const bodyParser = require("body-parser");
const {MongoClient} = require("mongodb");
const PgMem = require("pg-mem");

const db = PgMem.newDb();

const fs = require('fs');

const https = require('https');
const city = 'Floresta,AR';
const apiKey = '2189eb7ef1809e292cd9e43813532312'; 

// Measurements database setup and access

let database = null;
const collectionName = "measurements";

async function startDatabase() {
    const uri = "mongodb://localhost:27017/?maxPoolSize=20&w=majority";	
    const connection = await MongoClient.connect(uri, {useNewUrlParser: true});
    database = connection.db();
}

async function getDatabase() {
    if (!database) await startDatabase();
    return database;
}

async function insertMeasurement(message) {
    const {insertedId} = await database.collection(collectionName).insertOne(message);
    return insertedId;
}

async function getMeasurements() {
    return await database.collection(collectionName).find({}).toArray();	
}


// GET weather through API from OpenWeatherMap
function getWeather(city, apiKey) {
    return new Promise((resolve, reject) => {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
      https.get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          const weather = JSON.parse(data);
          if (weather.cod === '404') {
            reject(new Error('City not found'));
          } else {
            resolve({ temperature: weather.main.temp, humidity: weather.main.humidity, pressure: weather.main.pressure });
            }
        });
      }).on('error', (err) => {
        reject(err);
      });
    });
  }

// API Server

const app = express();
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static('spa/static'));
const PORT = 8080;



app.post('/measurement', function (req, res) {

   const datenow= new Date().toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires', hour12: false }).replace(',', '');
    
   console.log("\nAcquiring data from device ID: " + req.body.id+ "   Key: " + req.body.key + "   Date: " +datenow ); 
   console.log("\t\tTemperature: " + req.body.t+ " °C" + "   Humidity: " + req.body.h + " %" + "   Pressure: " + req.body.p + " hPa");
   
    getWeather(city, apiKey)
    .then(({temperature, humidity, pressure }) => {
        console.log(`In: ${city} Temperature: ${temperature} °C   Humidity: ${humidity} %   Pressure: ${pressure} hPa`);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error getting the temperature');
    });

  
   const {insertedId} = insertMeasurement({id:req.body.id, name:req.body.name, key:req.body.key, t:req.body.t, h:req.body.h, p:req.body.p, d:datenow});
   res.send("received measurement into " + insertedId);
   
   db.public.none("INSERT INTO devices VALUES ('"+req.body.id+ "', '"+req.body.name+"', '"+req.body.key+"')");
});

app.post('/device', function (req, res) {
	console.log("Device ID: " + req.body.id + " Name: " + req.body.name + "Key: " + req.body.key );
    db.public.none("INSERT INTO devices VALUES ('"+req.body.id+ "', '"+req.body.name+"', '"+req.body.key+"')");
	res.send("received new device");
});


app.get('/web/device', function (req, res) {
	var devices = db.public.many("SELECT * FROM devices").map( function(device) {
		console.log(device);
		return '<tr><td><a href=/web/device/'+ device.device_id +'>' + device.device_id + "</a>" +
			       "</td><td>"+ device.name+"</td><td>"+ device.key+"</td></tr>";
	   }
	);
	res.send("<html>"+
		     "<head><title>Sensores</title></head>" +
		     "<body>" +
		        "<table border=\"1\">" +
		           "<tr><th>id</th><th>name</th><th>key</th></tr>" +
		           devices +
		        "</table>" +
		     "</body>" +
		"</html>");
});

/*
 * Canibalized from
 *    https://www.npmjs.com/package/sprightly
 *    https://github.com/obadakhalili/Sprightly/blob/main/index.js
 */
function render(template, vars) {
   const regexp = /<<(.*?)>>|\{\{(.*?)\}\}/;
   return template.split('\n').map( function(line) {
       for (let match = line.match(regexp), result; match;) {
	   if (match[0][0] === '<') {
		   console.log("match <");
	   } else {
	      result = vars[match[2].trim()];

	   }
           line = line.replace(match[0], result ? result : '');
	   match = line.match(regexp);
       }	       
       return line;
   }).join('\n');	
}

app.get('/web/device/:id', function (req,res) {
    var template = "<html>"+
                     "<head><title>Sensor {{name}}</title></head>" +
                     "<body>" +
		        "<h1>{{ name }}</h1>"+
		        "id  : {{ id }}<br/>" +
		        "Key : {{ key }}" +
                     "</body>" +
                "</html>";


    var device = db.public.many("SELECT * FROM devices WHERE device_id = '"+req.params.id+"'");
    console.log(device);
    res.send(render(template,{id:device[0].device_id, key: device[0].key, name:device[0].name}));
});	


app.get('/term/device/:id', function (req, res) {
    var red = "\33[31m";
    var green = "\33[32m";
    var blue = "\33[33m";
    var reset = "\33[0m";
    var template = "Device name " + red   + "   {{name}}" + reset + "\n" +
		   "       id   " + green + "       {{ id }} " + reset +"\n" +
	           "       key  " + blue  + "  {{ key }}" + reset +"\n";
    var device = db.public.many("SELECT * FROM devices WHERE device_id = '"+req.params.id+"'");
    console.log(device);
    res.send(render(template,{id:device[0].device_id, key: device[0].key, name:device[0].name}));
});

app.get('/measurement', async (req,res) => {
    res.send(await getMeasurements());
});

app.get('/device', function(req,res) {
    res.send( db.public.many("SELECT * FROM devices") );
});

app.get('/admin/:command', function(req,res) {
    var msg="done";
    switch (req.params.command) {
       case "clear":
         if (req.query.db == "mongo") {
           msg = "clearing mongo";
           /* UNIMPLEMENTED */
	 } else if (req.query.db == "psql") {
           msg = "clearing psql";
           /* UNIMPLEMENTED */
	 } else {
           msg = "unknown db " + req.query.db;
         }
       break;
       case "save":
         if (req.query.db == "mongo") {
           msg = "saving mongo to " + req.query.file;
           /* UNIMPLEMENTED */
	 } else if (req.query.db == "psql") {
           msg = "saving psql " + req.query.file;
           /* UNIMPLEMENTED */
	 } else {
           msg = "unknown db " + req.query.db;
         }
       break;
       case "show":
         msg = fs.readFileSync("../fixtures/" + req.query.file);
       break;
 
       break;
       default:
         msg="Command: " + req.params.command + " not implemented"
    }
    var template = "<html>"+
                     "<head><title>Admin</title></head>" +
                     "<body>" +
                        "{{ msg }}"+
                     "</body>" +
                "</html>";
    res.send(render(template,{msg:msg}));
});	


startDatabase().then(async() => {
//    await insertMeasurement({id:'00', t:'18', h:'78'});
//     await insertMeasurement({id:'00', t:'19', h:'77'});
//     await insertMeasurement({id:'00', t:'17', h:'77'});
//     await insertMeasurement({id:'01', t:'17', h:'77'});
    console.log("Mongo measurement database Up");

     db.public.none("CREATE TABLE devices (device_id VARCHAR, name VARCHAR, key VARCHAR)");
 //  db.public.none("CREATE TABLE devices (device_id VARCHAR, name VARCHAR, key VARCHAR PRIMARY KEY)");
//    db.public.none("INSERT INTO devices VALUES ('00', 'Fake Device 00', '123456')");
//    db.public.none("INSERT INTO devices VALUES ('01', 'Fake Device 01', '234567')");
//    db.public.none("CREATE TABLE users (user_id VARCHAR, name VARCHAR, key VARCHAR)");
//    db.public.none("INSERT INTO users VALUES ('1','Ana','admin123')");
//    db.public.none("INSERT INTO users VALUES ('2','Beto','user123')");

    console.log("SQL device database up");

    app.listen(PORT, () => {
        console.log(`Listening at ${PORT}`);
    });
});
