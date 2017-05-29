//https with node server

var https = require('https');
var fs = require('fs');  // to read cert and key data in their respective files

var myKey = fs.readFileSync('my-key.pem');
var myCert = fs.readFileSync('my-cert.pem');

var options = {
                key: myKey,
                cert: myCert
};


https.createServer(options, function (req, res){
    res.writeHead(200);
    res.end('HTTPS REQUEST\n');
}).listen(8000, function (){
    console.log('Listenting on port 8000...');
});
