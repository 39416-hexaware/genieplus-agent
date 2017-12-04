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
  // if(req.body.originalRequest.source === 'facebook') {
    if(req.body.result.action === 'input.newincident') {
      newIncidentIntent(req,res);
    }
    else if (req.body.result.action === 'input.system.incident2') {
      generateSRId(req,res);
    }
  // }
});
//POST Call Endpoint

function newIncidentIntent(req, res) {
console.log(req.body.result.parameters["empid"] + "Mubash");
console.log(typeof(req.body.result.parameters["empid"]));
if(req.body.result.parameters["empid"] == '') {
  response = "Please provide your employee Id!"
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ "speech": response, "displayText": response 
  }));
}
else if(isNaN(req.body.result.parameters["empid"])) {
  response = "Incorrect format! Please enter employee Id as number!"
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ "speech": response, "displayText": response 
  }));
}
else if(req.body.result.parameters["empid"].length > 5) {
  response = "Employee Id not found in the database! Please enter the correct number!"
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ "speech": response, "displayText": response 
  }));
}
else {
  // response = {messages: {"type":2,"platform":"facebook"}};
}

  // var empid = req.body.result.parameters["empid"];

  // if (empid === '39416') {    
  //   response = {messages: {"type":2,"platform":"facebook","title":"Choose a department Webhook.","replies":["STG","Facility/Engineering","Finance","Hexavarsity","CRM","QMG"]}}
  //   res.setHeader('Content-Type', 'application/json');
  //   res.send(JSON.stringify({ "speech": response, "displayText": response
  //   }));
  // }
  // else {
  //   response = "Employee Id does not exist!"
  //   res.setHeader('Content-Type', 'application/json');
  //   res.send(JSON.stringify({ "speech": response, "displayText": response 
  //   }));
  // }
}

function generateSRId(req,res) {
  // console.log(req.body.result);
  console.log(req.body.result.parameters);

  response = "Hi #new-incident.empid, your incident has been created with the following details: Department - #new-incident.department, Location - #new-incident.location, Project - #new-incident.project, Category - $category, Building - $building, Description - $description. Thank you!!"
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ "speech": response, "displayText": response 
  }));
}

console.log("Server Running at Port : "+port);

app.listen(port);