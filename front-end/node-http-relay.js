var express = require('express');
var request = require('request');
var app = express();

var API_HOST = "http://api.tumblr.com";

app.use('/', function (req, res) {
    var url = API_HOST + req.url;

    console.log("Connecting to service:", url);
    console.log("Using parameters:", req.query);

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");
    req.pipe(request(url)).pipe(res);
});

console.log("Starting super-simple HTTP relay server...");
app.listen(process.env.PORT || 3000);