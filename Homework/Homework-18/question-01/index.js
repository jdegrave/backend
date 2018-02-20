// This file contains two solutions. The first one uses npm module 'request'
// The second solution does not use request. Just http.get

function getData(website) {
    var http = require('http');
    var request = require('request');
    var fs = require('fs');

    var baseURL = website;
    var options = {
                              uri: baseURL,
                              path: 'index.js',
                              method: 'GET',
                              followRedirect: true,
                              maxRedirects: 20
                        };


    request(options, function (error, response, body){
        if(error) {
            console.log(error.toString());
        }
        console.log(body);
    }).pipe(fs.createWriteStream('urbandictionary.htm'));


}

console.log(getData('www.urbandictionary.com'));
console.log('\n------------Valid website data: -------------------- \n')
console.log(getData('http://www.urbandictionary.com'));


function getWebData (website){
    var http = require('http');
    var fs = require('fs');

    // sometimes people call this the host

    // most of the time need host, path, method, headers
    var baseURL = website;
    var httpOptions = {
      host: baseURL,
      method: 'GET',
    };

    // http.get uses a callback
    // this first functin returns a writeable stream
    var req = http.get(httpOptions, function(response) {

        if (response.statusCode !== 200) {
            var errorMessage = new Error ('Page not found!')
            console.log('Error occurred. ' + errorMessage );
        } else {


            response.setEncoding('utf-8');
            var body = '';

          // invoke the listener - includes a callback from the Event Emitter
            response.on('data', function(chunk){
                body += chunk;
            });

          // invoke listener for an 'end' event
            response.on('end', function(){
                console.log(body);
                fs.writeFileSync('file.html', body);
          });

      }

    });

}
console.log(getWebData('mcomm.com'));
console.log(getWebData('www.google.com'));
