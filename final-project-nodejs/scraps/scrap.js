// cleanup code - try to fix it later

//https://robo-sms-166105.appspot.com

if ((trip.status === 'COMPLETE') && (moment().isSameOrBefore(moment(trip.responseDeadline))) && if (moment().isSameOrBefore(moment(tripCleanupDeadline)))) {

    console.log('in cleanup after trip quota met; lasts 5 minutes...');
    console.log('trip.status in cleanup ', trip.status);
    console.log('in cleanup before switch. trip responseDeadline: ', moment(trip.responseDeadline));
    console.log('in cleanup before switch. trip cleanup tripCompleteMoment: ', moment(tripCompleteMoment));
    console.log('in cleanup before switch. trip cleanup deadline (not using moment): ', tripCleanupDeadline);
    //console.log('in cleanup before switch. trip cleanup deadline not using moment and format: ', moment(tripCleanupDeadline).format('YYYY-MM-DD HH:mm:ss'));
    console.log('is tripCompleteMoment a moment? ', moment.isMoment(tripCompleteMoment));
    console.log('is tripCompleteMoment a moment when i put in moment function? ', moment.isMoment(moment(tripCompleteMoment)));
    console.log('check on tripCleanupDeadline in clean up without moment: ', tripCleanupDeadline);
    console.log('check on tripCleanupDeadline in clean up with moment: ', moment(tripCleanupDeadline));

    switch(driverResponse) {

        case 'duplicate':
            twiml.message('This is a duplicate response. In cleanup');
            break;
        case 'reject':
            console.log('in reject for cleanup');
            twiml.message(trip.messages.confirmationRejected.toString());
            break;
        case 'decline':
            console.log('first time No response in cleanup');
            break;
        case 'change':
            console.log('Duplicate yesAccepted, duplicate Declined');
            twiml.message('All drivers are confirmed for this trip. No changes to responses permitted. '
                        + 'If you accepted a trip and need to decline it CALL (479) 795-8155.');
            break;
        default:
            console.log('garbage response in cleanup...');
            break;
    } // end switch


    function updateDrivers(drivers) {
        var updatedDrivers = [];
        modifyDrivers.forEach(function (elem) {
            updatedDrivers.push(updateOneDriverById(elem));
        });

        Promise.all([updatedDrivers])
            .then(function (results){
                return results;
            });
    }
    return updateDrivers(modifyDrivers);    
