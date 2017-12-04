var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
// var apiai = require('apiai');
//dependencies
// var calculator = require('./processor/calculator');

app = express();
//Create express object

var port = process.env.PORT || 3000;
//Assign port
app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//Configuring express app behaviour

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
})

app.get("/api", function (req, res) {
  res.send("App works");
})
//GET Endpoint

app.post("/api", function (req, res) {
  var body = req.body;
  console.log(JSON.stringify(body));
  // if(req.body.originalRequest.source === 'facebook') {
  if (req.body.result.action === 'input.newincident') {
    newIncidentIntent(req, res);
  }
  else if (req.body.result.action === 'input.system.incident2') {
    generateSRId(req, res);
  }
  // }
});
//POST Call Endpoint

function newIncidentIntent(req, res) {
  console.log(req.body.result.parameters["empid"] + "Mubash");
  console.log(typeof (req.body.result.parameters["empid"]));
  if (req.body.result.parameters["empid"] == '') {
    response = "Please provide your employee Id!"
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
      "speech": response, "displayText": response
    }));
  }
  else if (isNaN(req.body.result.parameters["empid"])) {
    response = "Incorrect format! Please enter employee Id as number!"
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
      "speech": response, "displayText": response
    }));
  }
  else if (req.body.result.parameters["empid"].length > 5) {
    response = "Employee Id not found in the database! Please enter the correct number!"
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
      "speech": response, "displayText": response
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

function generateSRId(req, res) {
  console.log(req.body.result + '   ' + 'from Webhook');
  console.log(req.body.result.contexts[0].parameters);


  postServiceCall(req, res, 'post');
}

function postServiceCall(req, res, type) {
  let empid = req.body.result.contexts[0].parameters.empid;
  let department = req.body.result.contexts[0].parameters.department;
  let location = req.body.result.contexts[0].parameters.location;
  let project = req.body.result.contexts[0].parameters.project;
  let category = req.body.result.contexts[0].parameters.category;
  let buidling = req.body.result.contexts[0].parameters.buidling;
  let desc = req.body.result.contexts[0].parameters.description;
  var header = {
    'Authorization': 'Basic MzMyMzg6YWJjMTIz',
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Cache-Control': 'no-cache'
  };
  var options = {
    host: 'https://dev18442.service-now.com/api/now/table/incident',
    method: 'POST',
    header: header
  };
  var data = {
    "short_description": desc,
    "urgency": "2",
    "impact": "2",
    "caller_id": empid
  };
  var objJSON = JSON.stringify(data);

  var request = http.request(options, function (result) {
    result.setEncoding('utf-8');
    var responseString = '';

    result.on('data', function (data) {
      responseString += data;
    });

    result.on('end', function () {
      console.log(responseString);
      console.log('mubash');
      var responseObject = JSON.parse(responseString);
      success(responseObject);
      response = "Hi" + empid + ", your incident has been created with the following details: Department - " + department + ", Location - " + location + ", Project - " + project + ", Category - " + category + ", Building - " + buidling + ", Description - " + desc + ". Thank you!!"
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({
        "speech": response, "displayText": response
      }));
    });
  });

  request.write(objJSON);
  request.end();
}

console.log("Server Running at Port : " + port);

app.listen(port);