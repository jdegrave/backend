// you can install Bunyan globally - update the package.json file to the following:
//  ... "scripts": {
//          "start": "node index.js | bunyan -o short"
//       },
// ... (if you install Bunyan globally - even if you don't have it installed this line
// will go there

// this file is Blake's way - Basic

var express = require('express');
var bunyan = require('bunyan');
var app = express();

//Bunyan is an asnyc logger
var logger = bunyan.createLogger({ name: 'countdown'});

app.get('/', function (req, res){
    res.status(200).send('Your Mama');
});

app.get('/countdown/:number', function (req, res){
    var startingNbr = req.params.number;

    var startTime = Date.now();  // gets the time when the request comes in

    var countDown = setInterval(function (){
        console.log(startingNbr);
        startingNbr--;

        if (startingNbr === 0) {
            clearInterval(countDown);

            var endTime = Date.now();  // endTime when Starting number
            var totalTime = ((endTime - startTime) / 1000).toString();

            res.status(200).send('Whatever man...');
        }
    }, 1000);


});

app.listen(3000, function (){
    logger.info('Listening on port 3000...');
});
