const express = require('express');
const app = express();
const rp = require('request-promise');
const $ = require('cheerio');
var datumi = [];
const getpenzija = "http://www.pio.rs/lat/";

rp(getpenzija)
  .then(function(html){
    var penzijehtml = $('td > div', html).text();
    var res = penzijehtml.split(" ");
    var tekuci = res[5].split("računa");
    var datumformat = tekuci[1].split(".");
    var datumtrim = datumformat[0].trim(); 
    datumi.push(datumtrim);
    if(datumi[0]) {
      send();
    }
  })
  .catch(function(err){
  });

app.use(express.static('public'));

var danas = new Date().getDate();

function send() {
var penzijatekuciracuni1 = new Number(datumi[0])+1;
var nakucnuadresu1 = new Number(datumi[0]);
var nasalteru1 = new Number(datumi[0]);

app.get('/api/tekuciracuni', function (req, res) {
var razlika = penzijatekuciracuni1 - danas;

if(razlika>0){
var penzijajson = {
  "pencijacebitiza": razlika,
  "poruka": "Vaša penzija biće isplaćena na tekućem računu za " + razlika + " dana",
  "statuspenzija": "cekanje" 
};
} else if (razlika==0) {
 var penzijajson = {
  "poruka": "Vaša penzija je uplaćena na tekućem računu i možete je dignuti",
  "statuspenzija": "isplaceno" 
};
} else {
  var penzijajson = {
  "pencijacebitiza": razlika,
  "poruka": "Već ste digli vašu penziju sačekajte sledeći mesec",
  "statuspenzija": "cekanje" 
};
}

res.header("Content-Type",'application/json');
res.send(JSON.stringify(penzijajson, null, 4));
})


app.get('/api/nakucnuadresu', function (req, res) {
var razlika = nakucnuadresu1 - danas;

if(razlika>0){
var penzijajson = {
  "pencijacebitiza": razlika,
  "poruka": "Vaša penzija biće isplaćena na kućnu adresu za " + razlika + " dana",
  "statuspenzija": "cekanje" 
};
} else if (razlika==0) {
 var penzijajson = {
  "poruka": "Vaša penzija bi trebalo da stigne na kućnu adresu",
  "statuspenzija": "isplaceno" 
};
} else {
  var penzijajson = {
  "pencijacebitiza": razlika,
  "poruka": "Već ste dobili vašu penziju sačekajte sledeći mesec",
  "statuspenzija": "cekanje" 
};
}

res.header("Content-Type",'application/json');
res.send(JSON.stringify(penzijajson, null, 4));
})

app.get('/api/nasalteru', function (req, res) {
var razlika = nasalteru1 - danas;

if(razlika>0){
var penzijajson = {
  "pencijacebitiza": razlika,
  "poruka": "Vaša penzija biće isplaćena na šalteru za " + razlika + " dana",
  "statuspenzija": "cekanje" 
};
} else if (razlika==0) {
 var penzijajson = {
  "poruka": "Vaša penzija je uplaćena i možete je dignuti",
  "statuspenzija": "isplaceno" 
};
} else {
  var penzijajson = {
  "pencijacebitiza": razlika,
  "poruka": "Već ste digli vašu penziju sačekajte sledeći mesec",
  "statuspenzija": "cekanje" 
};
}

res.header("Content-Type",'application/json');
res.send(JSON.stringify(penzijajson, null, 4));
})

const listener = app.listen(process.env.PORT || 3000, function() {
  console.log('Kad ce penzija API je online na portu ' + listener.address().port);
})};
