// Example - handling async errors using event emitting
// use this for streaming -- such as reading rows from a database
// you'd have an event call end when reading from that databas table

var events = require('events');

// class checks for 'Q' or 'q' as the first character and emits events
var QCharEvent = function () {
    events.EventEmitter.call(this);
}

require('util').inherits(QCharEvent, events.EventEmitter);

// adding the isQChar function to QCharEvent prototype. Any
// new objects created from QCharEvent inherit this isQChar function
QCharEvent.prototype.isQChar = function (str){
    var firstChar = str.substr(0,1);
    var answer;

    if (firstChar == '' || firstChar.toUpperCase() !== 'Q') {
        var error = new Error ('First character isn\'t "Q" or "q".');
        this.emit('error', error);   // attach error to the event
    } else {
        // emit the isQChar event if no error, and send function
        this.emit('isQChar', answer = 17);   // isQChar is the event name; a bit
                                            // confusing because is also name of
                                            // the function 
    }

    return this;
}


var qcharEvent = new QCharEvent();

// listen for error event; if an error occurs, print error to console
qcharEvent.on('error', function (error){
    console.log('ERROR: ');
    console.log(error);
})

//listen for isQChar event (which is any event that isn't an error in this
// case). callback function takes the result of the this.emit('isQChar', answer)
// code. In this case the answer is a literal value (17). Result is 1
qcharEvent.on('isQChar', function (result){
    console.log('RESULT: ', result);
})

qcharEvent.isQChar('Quail');
qcharEvent.isQChar('conquer');
qcharEvent.isQChar('quit');
