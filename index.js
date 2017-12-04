var express = require('express');
var bodyParser = require('body-parser');
var apiai = require('apiai');
//dependencies
// var calculator = require('./processor/calculator');

app = express();
//Create express object

var port = process.env.PORT || 3000;
//Assign port
app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
//Configuring express app behaviour

app.get("/",function(req,res){
  res.sendFile(__dirname + "/index.html");
})

app.get("/api", function(req,res){
  res.send("App works");
})
//GET Endpoint

app.post("/api",function(req,res){
  var body = req.body;
  console.log(JSON.stringify(body));
  if(req.body.originalRequest.source === 'facebook') {
    if(req.body.result.action === 'input.newincident') {
      newIncidentIntent(req,res);
    }
  }
})
//POST Call Endpoint

function newIncidentIntent(req, res) {
  var empid = req.body.result.parameters["empid"];

  if (empid === '39416') {
    response = "Employee Id available!"
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ "speech": response, "displayText": response 
    }));
  }
  else {
    response = "Employee Id does not exist!"
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ "speech": response, "displayText": response 
    }));
  }
}

console.log("Server Running at Port : "+port);

app.listen(port);