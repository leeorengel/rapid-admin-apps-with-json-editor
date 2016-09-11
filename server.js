var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get("/categories", function (request, response) {
  response.send(categories);
});

app.get("/clients", function (request, response) {
  response.send(clients);
});

app.get("/settings", function (request, response) {
  var client = request.query.client;
  response.send(clientSettings[client]);
});

app.post("/settings", function (request, response) {
  var client = request.body.client;
  clientSettings[client] = JSON.parse(request.body.settings);
  response.send("Settings updated successfully.");
});


var categories = ["Work", "Home", "Vacation"];

var clients = [
  {"id" : "1", "name": "ABC Corp."},
  {"id" : "2", "name": "John Doe"},
  {"id" : "3", "name": "Jane Doe"}
];

// Simple in-memory store for now. In a real-world case this would come from a database.
var clientSettings = {
  "1": {
    "syncEnabled": true,
    "categories": "Work,Vacation",
    "defaultViewType": "brief",
    "voiceEnabled": false
  },
  "2": {
    "categories": "Home, Work, Personal",
    "defaultViewType": "detail",
    "syncEnabled": true,
    "voiceEnabled": true,
  },
  "3": {
    "defaultViewType": "brief",
    "syncEnabled": true,
    "voiceEnabled": false,
    "categories": "Work,Home,Travel"
  }
}

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

