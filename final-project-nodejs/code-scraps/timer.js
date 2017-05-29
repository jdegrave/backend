var moment = require('moment');




var textTimerDeadline = moment().add(4, 'minute');
var checkTwilioTimer;

console.log('is textTimer a moment? ', moment.isMoment(textTimerDeadline));
console.log('textTimer: ', textTimerDeadline);

var count = 0;

function checkTwilio () {
    console.log('call get Twilio Response...');
    if(moment().isAfter(textTimerDeadline, 'second')){
        clearInterval(checkTwilioTimer);
        console.log('checkTwilioTimer stopped');

        textTimer.unref();

    }
    //count++;
    // if (count === 12) {
    //     clearInterval(textTimer);
    //     console.log('timer stopped');
    // }
}

function sendTexts () {

    var driverQuota = 4;
    var yesDrivers = 0
    if (moment().isSameOrBefore(textTimerDeadline, 'second') && driverQuota !== yesDrivers)  {
        console.log('call send text message function');
        checkTwilioTimer = setInterval(function(){ checkTwilio() }, 30000);
        yesDrivers++;
    } else {
        clearInterval(textTimer);
        console.log('textTimer stopped');
        textTimer.unref();
        //textTimeOutId.unref();
        //checkTwilioTimer.unref();
    }

}


sendTexts();
var textTimer = setInterval(function(){sendText()}, 120000);













//
