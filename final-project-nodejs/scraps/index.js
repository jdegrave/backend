var router = require('express').Router();
var driverServices = require('../services/driver.services');
var locationServices = require('../services/location.services');
var tripServices = require('../services/trip.services');
var moment = require('moment');
var trip;
var tripDrivers;


router.get('/', function (req, res) {
    req.log.info('Login /');
    res.status(200).send('Welcome to Robo-SMS! Please login!');
});

router.get('/drivers', function (req, res) {
    driverServices.fetchAllDrivers()
        .then(function (drivers) {
            drivers = driverServices.setScheduleNoteForDisplay(drivers);
            res.render('drivers-bootstrap', { drivers : drivers });
        }).catch(function (err) {
            req.log.error('GET /drivers error: ' + err.message);
            res.status(500).send('There was an error retrieving driver information.');
        });
});

// Update driver availability and Schedule Notes
router.post('/drivers/update1', function (req, res) {
    req.log.info('POST /drivers/update1 req.body sent to server:\n ' + JSON.stringify(req.body));
    var driversToUpdate = req.body;
    driverServices.updateManyDrivers(driversToUpdate).then(function (results) {
        res.status(200).send('Driver updated successfully.');
    }).catch(function (err) {
        req.log.error('POST /drivers/update1: ' + err.message);
        res.status(500).send('Failed to update the driver.');
    });
});


// Get locations and render Trips tab HTML
router.get('/trips', function (req, res) {
    return tripServices.preTrip()
        .then(function (locations) {
            //res.render('trips', { locations : locations });
            res.status(200).json(locations);
        }).catch(function (err) {
            req.log.error('GET /trips error: ' + err.message);
            res.status(500).send('Failure in retrieving trip locations.');
        });
});

// create the trip
router.post('/trips', function (req, res) {
    var newTrip = req.body;
    return tripServices.createTrip(newTrip)
        .then(function (currentTrip) {
            req.log.info('POST /trips currentTrip: ' + currentTrip);
            var redirectUrl = 'http://localhost:8080/trips/';
            res.currentTripID = currentTrip._id.toString();
            res.redirect(redirectUrl + res.currentTripID);
        }).catch(function (err) {
            var errorMessage = 'Internal sever error. Could not create trip. ';

            if (err[0].tripDateError !== undefined) {
                errorMessage += err[0].tripDateError + ' ';
            }

            if (err[0].cityCodeError !== undefined) {
                errorMessage += err[0].cityCodeError + ' ';
            }

            if (err[0].driverQuotaError !== undefined) {
                errorMessage += err[0].driverQuotaError + ' ';
            } else {
                errorMessage + err;
            }

            req.log.error(errorMessage);
            res.status(500).send(errorMessage);
        });
});


router.get('/trips/:id', function (req, res) {
    var tripInProgressId = req.params.id;
    return tripServices.fetchTripById(tripInProgressId)
        .then(function (tripInProgress) {
            trip = tripInProgress;
            return tripServices.populateDrivers(tripInProgress.availableDrivers)
                .then(function (allDriversAvailable) {
                    tripDrivers = allDriversAvailable;
                    tripServices.startTripMonitor(tripInProgress, allDriversAvailable);
                    req.log.info('GET /trips/:id Successfully redirected to trip status page. trip ID: ' + trip._id);
                    res.status(301).send('You made it!');
                });
        }).catch(function (err) {
            req.log.error(err);
            res.status(500).send('Internal server error. Trip aborted.');
        });
});


router.post('/test/sms', function (req, res) {
    var body = req.body.Body;
    var from = req.body.From;
    var driverResponse;
    var twilio = require('twilio');
    var twiml = new twilio.TwimlResponse();

    req.log.info('trip in /test/sms route: ', trip._id);
    req.log.info('trip Drivers from /test/sms route: ', tripDrivers);
    req.log.info('current time in test/sms post: ', moment());


    var checkResponse = tripServices.checkDriverResponse(from, body);
    if (checkResponse[0] === false) {
        req.log.info('Invalid phone number format: ' + from);
        res.status(500).send('Invalid phone number or phone format');
    } else if (trip === undefined) {
        req.log.info('Trip is no longer active or does not active.');
        res.status(500).send('Trip does not exist or is no longer active.');
    } else {
        from = checkResponse[0];
        req.log.info('POST /test/sms reply phone number: ' + from);
        if (checkResponse[1] === true) {
            req.log.info('POST /test/sms driver reply: ' + checkResponse[1]);
            driverResponse = tripServices.receiveText(from, body, trip, tripDrivers);
        } else {
            req.log.info('POST /test/sms driver invalid response: ' + checkResponse[1]);
            driverResponse = false;
        }

        if (moment().isSameOrBefore(moment(trip.responseDeadline)) && trip.status === 'PENDING') {
            req.log.info('POST /test/sms trip status is pending and <= response deadline:\n');

            switch (driverResponse) {
                case 'accept' :
                    twiml.message(trip.messages.confirmationAccepted.toString());
                    if (trip.responses.yesAccepted.length === trip.driverQuota) {
                        req.log.info('trip yesAccepted responses = driver quota: \n');
                        req.log.info('trip.responses.yesAccepted.length: ' + (trip.responses.yesAccepted).length);
                        req.log.info('trip.driverQuota: ' + trip.driverQuota);
                        req.log.info('trip.responses.yesAccepted array values: ' + trip.responses.yesAccepted);

                        trip.status = 'COMPLETE';
                        trip.save();
                    }

                    break;
                case 'reject':
                    twiml.message(trip.messages.confirmationRejected.toString());
                    req.log.info('Additional "yes" response after driver quota met.');
                    break;
                case 'declined':
                    req.log.info('Driver declined trip.');
                    break;
                case 'change':
                    req.log.info('Attempt to change answer');
                    twiml.message('Once a valid response is submitted, it cannot be changed. CALL (479) 795-8155.');
                    break;
                case 'duplicate' :
                    req.log.info('This is a duplicate response.');
                    twiml.message('This is a duplicate response.');
                    break;
                default:
                    req.log.info('Non-response or garbage response.');
                    break;
            }// end switch

            // If all the drivers have responded but driverQuota isn't met
            if (trip.availableDrivers.length === trip.responses.yesAccepted.length + trip.responses.declined.length && trip.responses.yesAccepted < trip.driverQuota) {
                req.log.info('All drivers contacted. All drivers replied. Not enough "yes" responses to meet quota. Setting trip status to "INCOMPLETE"');
                trip.status = 'INCOMPLETE';
            }


            //response deadline has expired ...clean up.
        } else {
            req.log.info('Response deadline passed --or-- trip request finished due to driver quota being met --or--- all availble drivers contacted and replied with insufficient affirmative responses.');
            if (trip.driverQuota !== trip.responses.yesAccepted.length) {
                req.log.info('Trip status set to "INCOMPLETE" after responsed deadline or driver quota unmet.');
                trip.status = 'INCOMPLETE';
            }

            if (trip.driverQuota === trip.responses.yesAccepted.length) {
                req.log.info('Trip status set to "COMPLETE". Driver quota met after responseDeadline expired.');
                trip.status = 'COMPLETE';
            }
            trip.save();
        
            switch (driverResponse) {

                case 'reject':
                    twiml.message(trip.messages.confirmationRejected.toString());
                    break;

                case 'declined':
                    req.log.info('Driver declined trip.');
                    break;

                case 'change':
                case 'accept':
                case 'duplicate' :
                    req.log.info('This is a duplicate response, or an attempt to change response. Trip request finished.');
                    twiml.message('This trip request finished. No more responses accepted.');
                    break;
                default:
                    req.log.info('Non response or garbage response');
                    break;
            }// end switch
            req.log.info('Trip request finished. Trip info: ' + trip);
        }

        res.writeHead(200, { 'Content-Type': 'text/xml' });
        res.end(twiml.toString());
    }
});


module.exports = router;
