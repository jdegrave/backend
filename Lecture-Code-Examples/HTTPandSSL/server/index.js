//https server with Express

var https = require('https');
var fs = require('fs');  // to read cert and key data in their respective files
var express = require('express');

var myKey = fs.readFileSync('my-key.pem');
var myCert = fs.readFileSync('my-cert.pem');

var options = {
                key: myKey,
                cert: myCert
};

var app = express();

app.get('/', function (req, res){
    res.end('HTTPS REQUEST WITH EXPRESS\n');
});

https.createServer(options, app).listen(8000, function (req, res){
    console.log('Now Listening on port 8000...');
});
