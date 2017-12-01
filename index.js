var express = require('express');
var bodyParser = require('body-parser');
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
  console.log(body);
res.send('Yay!');
//   calculator.Concat(body,function(result){
//     res.send(result);
//   })//Callback Feature for Synced Calls
})
//POST Call Endpoint

console.log("Server Running at Port : "+port);

app.listen(port);