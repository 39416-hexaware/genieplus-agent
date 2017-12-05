//imports
var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
// var https = require('https');
// var apiai = require('apiai');

//dependencies
var commonfile = require('./commonfiles/commonfile');

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
  else if (req.body.result.action === 'input.incidentstatus') {
    checkIncidentStatus(req, res);
  }
  // }
});
//POST Call Endpoint

function newIncidentIntent(req, res) {
  console.log(req.body.result.parameters["empid"]);
  console.log(typeof (req.body.result.parameters["empid"]));
  if (req.body.result.parameters["empid"] == '') {
    response = "Please provide your employee Id!";
    commonfile.sendMessage(res, response);
  }
  else if (isNaN(req.body.result.parameters["empid"])) {
    response = "Incorrect format! Please enter employee Id as number!"
    commonfile.sendMessage(res, response);
  }
  else if (req.body.result.parameters["empid"].length > 5) {
    response = "Employee Id not found in the database! Please enter the correct number!"
    commonfile.sendMessage(res, response);
  }
  else {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
      "data": {
        "facebook": {
          "text": "Choose a department:",
          "quick_replies": [
            {
              "content_type": "text",
              "title": "STG",
              "payload": "STG"
            },
            {
              "content_type": "text",
              "title": "Facility/Engineering",
              "payload": "Facility/Engineering"
            },
            {
              "content_type": "text",
              "title": "Finance",
              "payload": "Finance"
            },
            {
              "content_type": "text",
              "title": "Hexavarsity",
              "payload": "Hexavarsity"
            },
            {
              "content_type": "text",
              "title": "CRM",
              "payload": "CRM"
            },
            {
              "content_type": "text",
              "title": "QMG",
              "payload": "QMG"
            }
          ]
        }
      }
    }));
  }

  console.log('event call y');

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
  commonServiceCall(req, res, 'generateSRId');
}

function checkIncidentStatus(req, res) {
  console.log(req.body.result + '   ' + 'from Webhook');
  console.log(req.body.result.contexts[0].parameters);
  if (req.body.result.parameters["incidentid"] == '') {
    response = "Please provide your incident Id!";
    commonfile.sendMessage(res, response);
  }
  else {
    commonServiceCall(req, res, 'checkIncidentStatus');
  }
}

function commonServiceCall(req, res, type) {
  var data = '', methodType = '', urlPath = '';
  var empid= '', department = '', location = '', project = '', category = '', building = '', desc = '';
  var incidentId = '';
  if (type == 'generateSRId') {
    empid = req.body.result.contexts[0].parameters.empid;
    department = req.body.result.contexts[0].parameters.department;
    location = req.body.result.contexts[0].parameters.location;
    project = req.body.result.contexts[0].parameters.project;
    category = req.body.result.contexts[0].parameters.category;
    building = req.body.result.contexts[0].parameters.building;
    desc = req.body.result.contexts[0].parameters.description;

    methodType = 'POST';    
    urlPath = 'https://dev18442.service-now.com/api/now/table/incident';
    data = {
      "short_description": desc,
      "urgency": "2",
      "impact": "2",
      "caller_id": empid
    };    
  }
  else {
    methodType = 'GET';
    incidentId = req.body.result.contexts[0].parameters.incidentid;
    urlPath = 'https://dev18442.service-now.com/api/now/table/incident?number=' + incidentId;
  }

  let username = '33238';
  let pwd = 'abc123';
  var options = {
    url: urlPath, //'https://dev18442.service-now.com/api/now/table/incident',
    method: methodType, //type == 'generateSRId' ? 'POST' : 'GET',
    header: commonfile.headerTemplate(),
    body: data,
    json: true,
    auth: {
      user: username,
      password: pwd
    }
  };
  
  request(options, function (error, response, body) {
    if (error) {
      console.dir(error);
      return
    }
    console.log('headers:' + response.headers);
    console.log('status code:' + response.statusCode);
    if (type == 'generateSRId') {
      console.log(body);
      console.log('Incident ID: ' + body.result.number);
      finalresponse = "Hi " + empid + ", your incident (Incident ID - " + body.result.number + ") has been created with the following details: Department - " + department + ", Location - " + location + ", Project - " + project + ", Category - " + category + ", Building - " + building + ", Description - " + desc + ". Thank you!!"
      commonfile.sendMessage(res, finalresponse);
    }
    else {
      if (body.result.length > 0) {
        console.log(body.result);
        let category = body.result.category;
        finalresponse = "Hi, your incidentId - " + incidentId +"  is placed as "+ category + "!";
        commonfile.sendMessage(res, finalresponse);
      }
      else {
        finalresponse = "Incident Id not found in the database! Please enter the correct number!";
        commonfile.sendMessage(res, finalresponse);
      }
    }
  });

  // var objJSON = JSON.stringify(data);

  // var reqPost = https.request(options, function(res) {
  //   console.log(`STATUS: ${res.statusCode}`);
  //   console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  //   res.setEncoding('utf8');
  //   res.on('data', (chunk) => {
  //     console.log(`BODY: ${chunk}`);
  //   });
  //   res.on('end', () => {
  //     console.log('No more data in response.');
  //   });
  // });

  // reqPost.on('error', (e) => {
  //   console.error(`problem with request: ${e.message}`);
  // });

  // // write data to request body
  // reqPost.write(objJSON);
  // reqPost.end();


  // var request = http.request(options, function (result) {
  //   result.setEncoding('utf-8');
  //   var responseString = '';

  //   result.on('data', function (data) {
  //     responseString += data;
  //   });

  //   result.on('end', function () {
  //     console.log(responseString);
  //     var responseObject = JSON.parse(responseString);
  //     success(responseObject);
  //     response = "Hi" + empid + ", your incident has been created with the following details: Department - " + department + ", Location - " + location + ", Project - " + project + ", Category - " + category + ", Building - " + buidling + ", Description - " + desc + ". Thank you!!"
  //   });
  // });

  // request.send(objJSON);
  // request.end();
}

console.log("Server Running at Port : " + port);

app.listen(port);