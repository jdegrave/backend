var mongodb = require('../utils/mongodb.utils');
var driverServices = require('./driver.services');
var locationServices = require('./location.services');
var moment = require('moment');
var twilioClient = require('../utils/twilioClient');
var Trip = require('../models/trip.model');
var currentTrip;
var currentTripId;
var tripLocations;
var totalAvailableDrivers = 0;


module.exports = {
                    tripLocations : tripLocations,
                    totalAvailableDrivers : totalAvailableDrivers,
                    createTrip : createTrip,
                    currentTrip : currentTrip,
                    currentTripId: currentTripId,
                    fetchTripById : fetchTripById,
                    preTrip : preTrip,
                    getLocations : getLocations,
                    fetchLocationID : fetchLocationID,
                    createTripDateTime : createTripDateTime,
                    validateTripParams : validateTripParams,
                    getAvailableDrivers : getAvailableDrivers,
                    createResponseDeadline : createResponseDeadline,
                    buildDriverRequestMessage : buildDriverRequestMessage,
                    buildAcceptedConfirmationMessage : buildAcceptedConfirmationMessage,
                    buildRejectedConfirmationMessage : buildRejectedConfirmationMessage,
                    buildLocationMessage : buildLocationMessage,
                    startTripMonitor : startTripMonitor,
                    populateDrivers : populateDrivers,
                    populateMessageGroup : populateMessageGroup,
                    buildTripStatsObject : buildTripStatsObject,
                    getReminingTime : getReminingTime,
                    getDriverResponseDetails : getDriverResponseDetails,
                    fetchDriverIdByPhone : fetchDriverIdByPhone,
                    fetchLastDriverResponse : fetchLastDriverResponse,
                    fetchTripLocationById : fetchTripLocationById,
                    checkDriverResponse : checkDriverResponse,
                    updateResponseArrays : updateResponseArrays,
                    checkDriverQuota : checkDriverQuota,
                    driverQuotaAndAvailDrivers : driverQuotaAndAvailDrivers,
                    sendText : sendText,
                    receiveText : receiveText,
                    configure : function (log) {
                        this.log = log;
                    },
                    log : console
                };


function preTrip () {
    return getLocations();
}

function getLocations () {
    return locationServices.fetchAllLocations();
}

function fetchLocationID (tripCityCode) {
    return locationServices.fetchLocationIdByCityCode(tripCityCode)
        .then(function (location) {
            return location;
        });
}


function createTrip (curTrip) {
    currentTrip = new Trip();

    return Promise.all([
                    fetchLocationID(curTrip.cityCode),
                    createTripDateTime(curTrip.startDate, curTrip.startTime)
                    ])
        .then(function (results) {
            var cityCodeObjectId = results[0];
            var testTime = results[1];

            console.log('testTime: ', testTime);

            var driverQuota = curTrip.driverQuota;
            var validationResults = validateTripParams(cityCodeObjectId, driverQuota, testTime);

            console.log('validationResults before conditional check: ', validationResults);

            if (validationResults.length !== 0) {
                //return validationResults;
                console.log('validation error on trip date/time and/or drivers requested', validationResults.length);
                throw validationResults;
            } else {
                var responseDeadline = createResponseDeadline(testTime);
                return Promise.all([
                    buildDriverRequestMessage(testTime, responseDeadline, curTrip.cityCode),
                    getAvailableDrivers()
                    ])
                        .then(function (results) {
                            currentTrip.messages.driverRequest = results[0];
                            currentTrip.availableDrivers = results[1];
                            currentTrip.driverQuota = driverQuotaAndAvailDrivers(driverQuota);
                            currentTrip.cityCode = cityCodeObjectId;
                            currentTrip.tripStart = testTime;
                            currentTrip.responseDeadline = responseDeadline;
                            currentTrip.responses.yesAccepted = [];
                            currentTrip.responses.yesRejected = [];
                            currentTrip.responses.declined = [];
                            currentTrip.responses.noResponse = [];
                            currentTrip.messages.confirmationAccepted = buildAcceptedConfirmationMessage(testTime, curTrip.cityCode);
                            currentTrip.messages.confirmationRejected = buildRejectedConfirmationMessage(testTime, curTrip.cityCode);
                            currentTrip.status = 'BLANK';
                            currentTripId = currentTrip._id;
                            console.log('trip created before save. Trip id: ', currentTripId);
                            return currentTrip.save();
                        });
            }
        });
}

function fetchTripById (tripId) {
    return Trip.findById(tripId).exec();
}


function createTripDateTime (tripDate, tripTime) {
    var rawDate = moment(tripDate + ' ' + tripTime, 'YYYY-MM-DD HH:mm');
    if (moment(rawDate).isValid()) {
        return rawDate;
    } else {
        console.log('rawDate is invalid: ', rawDate);
        return false;
    }
}

// note: schema validates driverQuota
function validateTripParams (cityObjectId, driverQuota, tripStart) {
    var results = [];
    var tripErrors = new Error;
    var tripDateTime = tripStart;
    var now = moment();


    if (cityObjectId === null || cityObjectId === undefined || cityObjectId === '') {
        var cityCodeError = new Error('Invalid city code.');
        tripErrors.cityCodeError = cityCodeError;
        console.log(tripErrors.cityCodeError);
    }


    if (!(Number.isNaN(driverQuota))) {
        var driverQuotaError = checkDriverQuota(driverQuota);

        console.log('driverQuotaError value before if evaluation: ', driverQuotaError);

        if (driverQuotaError instanceof Error) {
            tripErrors.driverQuotaError = driverQuotaError;
            console.log('tripErrors.driverQuotaError: ', tripErrors.driverQuotaError);
        }
    }


    if ( (moment(tripDateTime).isSameOrBefore(moment())) || tripDateTime === false || (moment(tripDateTime).isSameOrBefore(moment().add(40, 'minutes')))) {
        var tripDateError = new Error('Invalid date and/or time. Or trip start is less than current date/time. Or trip start is less than 40 mintues from now.');
        tripErrors.tripDateError = tripDateError;
        console.log('tripErrors.tripDateError: ', tripErrors.tripDateError);
    }

    if (tripErrors.cityCodeError === undefined && tripErrors.tripDateError === undefined && (!(tripErrors.driverQuotaError instanceof Error))) {
        return results;
    } else {
        results.push(tripErrors);
        console.log('Validation results ', results);
        return results;
    }
}

function getAvailableDrivers () {
    var finalList;
    return driverServices.fetchAllDrivers()
        .then(function (results) {
            return driverServices.fetchAllDriversByRankAvailableText();
        }).then(function (trueList) {
            finalList = trueList.map(function (elem) {
                return elem._id;
            });
            totalAvailableDrivers = finalList.length;
            return finalList;
        });
}

function createResponseDeadline (tripTime) {
    var checkTime = moment(tripTime, 'HH:mm');
    var responseDeadline;
    var endTime;

    if (moment().isSame(checkTime, 'day')) {
        responseDeadline = moment(checkTime).subtract(30, 'minutes');
    } else {
        // in test scenario totalAvailableDrivers is 0 - in prod it won't
        if (totalAvailableDrivers) {
            endTime = totalAvailableDrivers * 4;
        } else {
            endTime = 20 * 4;
        }
        responseDeadline = moment().add(endTime, 'minutes');
    }

    return responseDeadline;
}


function driverQuotaAndAvailDrivers (driverQuota) {
// if more drivers are requested than there are drivers available, driver quota is set to
// the number of available drivers

    if ((!Number.isNaN(driverQuota)) && driverQuota > totalAvailableDrivers) {
        console.log('check against vailable drivers: ');
        driverQuota = totalAvailableDrivers;
    }
    return driverQuota;
}


function checkDriverQuota (driverQuota) {
    var driverQuotaError = new Error('You must request at least 1 driver and have at least 1 driver available.');
    var myError = false;
    var results = true;

    console.log('driverQuota before check: ', driverQuota);
    console.log('totalAvailableDrivers: ', totalAvailableDrivers);


    if (driverQuota < 1) {
        myError = true;
    }

    if (myError) {
        console.log('Driver request error: ', myError);
        return driverQuotaError;
    } else {
        console.log('No errors in checkDriverQuota. Requested driver quantity meets minimum.');
        results = driverQuota;
        return results;
    }
}


function fetchTripLocationById (tripId) {
    return Trip.findById({ _id : tripId })
        .populate({ path: 'cityCode', select: 'cityCode -_id' })
        .exec();
}


function buildDriverRequestMessage (startTrip, responseDeadline, tripLocation) {
    var tripDetails = buildMessageDayTime(startTrip);
    var tripDay = tripDetails[0];
    var tripDate = tripDetails[1];
    var tripTime = tripDetails[2];
    var driverTripMessage;

    var responseTime = moment(responseDeadline).format('HH:mm');

    if (tripLocation === 'JP6' || tripLocation === 'JLN' || tripLocation === 'PLK' || tripLocation === 'LCL') {
        return buildLocationMessage(tripLocation)
            .then(function (result) {
                driverTripMessage = 'Will you accept a trip to ' + tripLocation + ' ' + result + ' '
                                        + tripDay + ', ' + tripDate + ', ' + 'at '
                                        + tripTime + '? '
                                        + 'Reply: 1=YES, 2=NO. '
                                        + 'Please respond by ' + responseTime + ' TODAY' + ' .';
                return driverTripMessage;
            });
    } else {
        driverTripMessage = 'Will you accept a trip to ' + tripLocation + ' '
                            + tripDay + ', ' + tripDate + ', ' + 'at '
                            + tripTime + '? '
                            + 'Reply: 1=YES, 2=NO. '
                            + 'Please respond by ' + responseTime + ' TODAY' + '.';
    }
    return driverTripMessage;
}


function buildLocationMessage (tripLocation) {
    return locationServices.fetchCityByCityCode(tripLocation)
        .then(function (cityDescription) {
            return '(' + cityDescription + ')';
        });
}


function buildMessageDayTime (startTrip) {
    var tripDay;
    var tripDate = moment(startTrip).format('MM-DD-YYYY');
    var tripTime = moment(startTrip).format('HH:mm');
    var dateTimeArray = [];

    if (moment(startTrip, 'day').isSame(moment(), 'day')) {
        tripDay = 'TODAY';
    } else if (moment(startTrip, 'day').isSame(moment().add(1, 'day'))) {
        tripDay = 'TOMORROW';
    } else {
        tripDay = (moment(startTrip).format('dddd')).toUpperCase();
    }

    dateTimeArray.push(tripDay, tripDate, tripTime);
    return dateTimeArray;
}


function buildAcceptedConfirmationMessage (startTrip, tripLocation) {
    var tripDetails = buildMessageDayTime(startTrip);
    var tripDay = tripDetails[0];
    var tripDate = tripDetails[1];
    var tripTime = tripDetails[2];

    var acceptedConfirmedMessage = 'You are CONFIRMED for trip to ' + tripLocation + ' '
                            + tripDay + ', ' + tripDate + ', ' + 'at '
                            + tripTime + '. '
                            + 'If an issue arises, CALL (479) 795-8155'
                            + '.';

    return acceptedConfirmedMessage;
}


function buildRejectedConfirmationMessage (startTrip, tripLocation) {
    var tripDetails = buildMessageDayTime(startTrip);
    var tripDay = tripDetails[0];
    var tripDate = tripDetails[1];
    var tripTime = tripDetails[2];

    var rejectedConfirmedMessage = 'DECLINED/REJECTED: ' + tripLocation + ' '
                            + tripDay + ', ' + tripDate + ', ' + 'at '
                            + tripTime + ' trip. You are NOT ASSIGNED TO THIS TRIP.'
                            + ' Driver quota met/response window has closed.'
                            + ' Thank you.';

    return rejectedConfirmedMessage;
}


function startTripMonitor (trip, allDriversAvailable) {
    trip.status = 'PENDING';
    var tripDeadline = moment(trip.responseDeadline);
    var driversRemainingToText = trip.totalAvailableDrivers = trip.availableDrivers.length;
    var driversToMessageGroup = [];
    var driversForMessageGroup = trip.driverQuota;
    var firstToTextIndex;
    var tripStats = {};
    var initialize = 0;

    console.log('Starting Trip Monitor ...');
    console.log('tripDeadline: ', moment(tripDeadline));
    console.log('Available drivers for current trip: ', trip.availableDrivers);
    console.log('Length of trip available drivers array: ', trip.availableDrivers.length);
    console.log('Length of no response array: ', trip.responses.noResponse.length);

    function setResponseWindow (trip, allDriversAvailable) {
        console.log('in setResponseWindow...');

        if ((moment().isSameOrBefore(tripDeadline)) && ((trip.responses.yesAccepted).length < trip.driverQuota) && (driversRemainingToText > 0)) {
                firstToTextIndex = driverServices.fetchFirstToText(allDriversAvailable);

                var index = firstToTextIndex;
                console.log('first to text index: ', allDriversAvailable[index]);
                var messagingInfo = populateMessageGroup(trip, allDriversAvailable, driversRemainingToText, driversForMessageGroup, index);
                driversRemainingToText = messagingInfo[0];
                driversToMessageGroup = messagingInfo[1];


                console.log('driversRemainingToText: ', driversRemainingToText);
                console.log('driversToMessageGroup: ', driversToMessageGroup);
                console.log('no response array in trip: ', trip.responses.noResponse);


                var drivers = driversToMessageGroup;
                var message = trip.messages.driverRequest;

                console.log('Driver request message: ', trip.messages.driverRequest);
                Promise.all([sendText(drivers, message)])
                    .then(function (result) {
                        console.log('Text sent to all drivers in driversToMessageGroup...');
                        console.log('Awesome!');
                });

                //load html once - the rest will be pushed by socket.io
                if (initialize === 0) {
                    tripStats = buildTripStatsObject(driversRemainingToText, driversToMessageGroup, trip, allDriversAvailable, firstToTextIndex);
                    initialize++;
                    console.log('Initialized html trip status page and saving trip - 1st round of driver request messages');
                    trip.save();
                    return tripStats;
                } else {
                    if (trip.driverQuota - trip.responses.yesAccepted <= driversRemainingToText) {
                        driversForMessageGroup = trip.driverQuota - trip.responses.yesAccepted;
                    } else {
                        driversForMessageGroup = driversRemainingToText;
                    }
                    console.log('message group length before setNextFirstToText to call in setResponseWindow: ', driversToMessageGroup.length);
                    console.log('driversRemainingToTextbefore setNextFirstToText: ', driversRemainingToText);

                    allDriversAvailable = driverServices.setNextFirstToText(allDriversAvailable, driversToMessageGroup.length, firstToTextIndex);
                    console.log('Saving trip after sending next round of driver request messages... ');
                    trip.save();
                }
        } else {
            clearInterval(tripTimer);
            console.log('tripTimer stopped!');
        }
    }

    if (initialize === 0) {
        console.log('Calling setResponseWindow to begin trip request messaging...');
        setResponseWindow(trip, allDriversAvailable);
    }
    var tripTimer = setInterval(function () { setResponseWindow(trip, allDriversAvailable); }, 120000);
}

function populateDrivers (tripDriversIds) {
    var availableTripDrivers = [];

    for (var i = 0; i < tripDriversIds.length; i++) {
        availableTripDrivers.push(driverServices.fetchDriverByID(tripDriversIds[i]));
    }

    return Promise.all(availableTripDrivers)
        .then(function (results) {
            return results;
        });
}

function populateMessageGroup (trip, allDriversAvailable, driversRemainingToText, driversForMessageGroup, index) {
    var driversToMessageGroup = [];
    var availableDriversMaxIndex = trip.availableDrivers.length - 1;
    var driversAddedToMessageGroup = 0;

    console.log('populateMessageGroup before adding to drivers to Message Group...');
    console.log('allDriversAvailable: ', allDriversAvailable);
    console.log('driversRemainingToText: ', driversRemainingToText);
    console.log('driversForMessageGroup: ', driversForMessageGroup);
    console.log('index: ', index);

    while (driversRemainingToText > 0 && driversAddedToMessageGroup < driversForMessageGroup) {
        driversToMessageGroup.push(allDriversAvailable[index]);
        trip.responses.noResponse.push(allDriversAvailable[index]);

        driversRemainingToText--;
        driversAddedToMessageGroup++;

        if (index === availableDriversMaxIndex) {
            index = 0;
        } else {
            index++;
        }
    }
    console.log('populateMessageGroup results array right before return: ');
    return [driversRemainingToText, driversToMessageGroup];
}

function buildTripStatsObject (driversRemainingToText, driversToMessageGroup, trip, allDriversAvailable, firstToTextIndex) {
    console.log('Building trip stats object for initial push to trips.html page...');
    var tripStats = {};
    var nextToTextIndex;
    var deadline = moment(trip.responseDeadline, 'HH:mm');
    var timeRemaining;


    tripStats.driversRemainingToText = driversRemainingToText;
    tripStats.driversToMessageGroup = driversToMessageGroup;
    tripStats.driversNoResponse = getDriverResponseDetails(trip.responses.noResponse, allDriversAvailable);
    tripStats.driverYesAccepted = getDriverResponseDetails(trip.responses.yesAccepted, allDriversAvailable);
    tripStats.driverYesRejected = getDriverResponseDetails(trip.responses.yesRejected, allDriversAvailable);
    tripStats.driverDeclined = getDriverResponseDetails(trip.responses.declined, allDriversAvailable);
    tripStats.driversNeeded = trip.driverQuota - trip.responses.yesAccepted.length;
    console.log('drivers to message group in buildTripStatsObject: ', driversToMessageGroup);
    tripStats.LastDriverMessaged = driversToMessageGroup[driversToMessageGroup.length - 1].firstName + ' '
                            + driversToMessageGroup[driversToMessageGroup.length - 1].lastName;

    //update allDriversAvailable with new firstToText value
    allDriversAvailable = driverServices.setNextFirstToText(allDriversAvailable, driversToMessageGroup.length, firstToTextIndex);
    nextToTextIndex = driverServices.getFirstToTextIndex(allDriversAvailable);
    tripStats.nextToText = allDriversAvailable[nextToTextIndex].firstName + ' '
                    + allDriversAvailable[nextToTextIndex].lastName;

    if (timeRemaining === undefined) {
        tripStats.timeRemaining = getReminingTime(deadline);
    }

    return tripStats;
}


function getDriverResponseDetails (driverResponse, allDriversAvailable) {
    var driverDetails;

    if (driverResponse.length !== 0) {
        driverDetails = allDriversAvailable.filter(function (driver) {
            var index = driverResponse.indexOf(driver._id.toString());
            if (index !== -1) {
                return allDriversAvailable[index];
            }
        });
    } else {
        driverDetails = 0;
    }
    return driverDetails;
}


function fetchDriverIdByPhone (phone, allDriversAvailable) {
    var driverID = allDriversAvailable.filter(function (elem) {
        if (elem.mobilePhone === phone) {
            return elem._id;
        }
    });
    return driverID[0]._id;
}

function fetchLastDriverResponse (trip, driverID) {
    var responseArrayFoundIn = [];
    var noResponseArrayIndex = (trip.responses.noResponse).indexOf(driverID);

    if (noResponseArrayIndex !== -1) {
        responseArrayFoundIn.push('noResponse');
        responseArrayFoundIn.push(noResponseArrayIndex);
        return responseArrayFoundIn;
    }

    var yesAcceptedArrayIndex = (trip.responses.yesAccepted).indexOf(driverID);
    if (yesAcceptedArrayIndex !== -1) {
        responseArrayFoundIn.push('yesAccepted');
        responseArrayFoundIn.push('yesAcceptedArrayIndex');
        return responseArrayFoundIn;
    }

    var declinedArrayIndex = (trip.responses.declined).indexOf(driverID);
    if (declinedArrayIndex !== -1) {
        responseArrayFoundIn.push('declined');
        responseArrayFoundIn.push(declinedArrayIndex);
        return responseArrayFoundIn;
    }

    var yesRejectedArrayIndex = (trip.responses.yesRejected).indexOf(driverID);
    if (yesRejectedArrayIndex !== -1) {
        responseArrayFoundIn.push('yesRejected');
        responseArrayFoundIn.push('yesRejectedArrayIndex');
        return responseArrayFoundIn;
    }
}

function sendText (drivers, tripMessage) {
    if (drivers.length === 0) {
        return false;
    } else {
        drivers.forEach(function (driver) {
            var phone = driver.mobilePhone;
            var phoneFormat = '+1' + phone.split('-').join('');
            var message = tripMessage;
            twilioClient.sendSms(phoneFormat, message);
        });
    }
}

function checkDriverResponse (number, textValue) {
    var results = [];
    var numberCheck = number;

    if (numberCheck.length !== 12 || numberCheck == null || numberCheck == undefined) {
        results.push(false);
    } else {
        var phoneNumber = numberCheck.slice(2, 5) + '-' + numberCheck.slice(5, 8) + '-' + numberCheck.slice(8);
        results.push(phoneNumber);
    }

    if (textValue == undefined || textValue == null || textValue.length !== 1) {
        results.push(false);
    } else {
        results.push(true);
    }

    return results;
}

function updateResponseArrays (oldResponseArrayName, newResponseArrayName, driverId, index, trip) {
    console.log('newResponseArrayName: ', newResponseArrayName);
    var originalResponseArray = trip.responses[oldResponseArrayName].concat();

    console.log('trip responses driver array before splice: ', originalResponseArray);

    originalResponseArray.splice(index, 1);
    console.log('trip responses driver array after splice: ', originalResponseArray);

    trip.responses[newResponseArrayName].push(driverId);
    trip.responses[oldResponseArrayName] = originalResponseArray;

    console.log('value of original trip.responses[' + oldResponseArrayName + '] after assigning original response array: ', trip.responses[oldResponseArrayName]);
    console.log('trip.responses[' + newResponseArrayName + '] array: ', trip.responses[newResponseArrayName]);
}

function receiveText (number, textValue, trip, allDriversAvailable) {
    var result = false;
    var response = textValue;
    var driverIdOfResponder = fetchDriverIdByPhone(number, allDriversAvailable);
    var driverLastResponse = fetchLastDriverResponse(trip, driverIdOfResponder);
    var driverResponseArrayName = driverLastResponse[0];
    var index = driverLastResponse[1];
    var originalResponseArray = trip.responses[driverResponseArrayName].concat();


    console.log('driverIdOfResponder: ', driverIdOfResponder);
    console.log('driverLastResponse: ', driverLastResponse);
    console.log('driverResponseArrayName: ', driverResponseArrayName);
    console.log('index: ', index);
    console.log('originalResponseArray: ', originalResponseArray);


    switch (driverResponseArrayName) {
        case 'noResponse' :
            console.log('Driver submitting first response...');
            if ((response == 1 || response == 'y' || response == 'Y')
                && (trip.responses.yesAccepted.length < trip.driverQuota)) {
                        console.log('Driver answer: "yesAccepted" ...ready to call updateResponseArrays..');
                        updateResponseArrays(driverResponseArrayName, 'yesAccepted', driverIdOfResponder, index, trip);
                        result = 'accept';
            } else if ((response == 1 || response == 'y' || response == 'Y')
                      && (trip.responses.yesAccepted.length === trip.driverQuota)) {
                            console.log('Driver answer: "yesRejected" ...ready to call updateResponseArrays ');
                            updateResponseArrays(driverResponseArrayName, 'yesRejected', driverIdOfResponder, index, trip);
                            result = 'reject';
            } else if (response == 2 || response == 'n' || response == 'N') {
                console.log('Driver answer: "Declined" ...ready to call updateResponseArrays');
                updateResponseArrays(driverResponseArrayName, 'declined', driverIdOfResponder, index, trip);
                result = 'decline';
            } else {
                console.log('garbage response');
            }
            break;

        case 'yesAccepted' :
            console.log('Driver submitting another response...response is: "Yes"...');
            if (response == 1 || response == 'y' || response == 'Y') {
                console.log('Duplicate yes response');
                result = 'duplicate';
            } else if (response == 2 || response == 'n' || response == 'N') {
                console.log('changing from yes to no - not allowed');
                result = 'change';
            } else {
                console.log('garbage response');
            }
            break;

        case 'yesRejected' :
            console.log('Driver submitting another response...response is: "Yes" after being rejected...');

            if (response == 1 || response == 'y' || response == 'Y') {
                console.log('duplicate yes response except in yesRejected');
                result = 'duplicate';
            } else if (response == 2 || response == 'n' || response == 'N') {
                console.log('changing from yesRejected to no - not allowed');
                result = 'change';
            } else {
                console.log('garbage response');
            }
            break;

        case 'declined' :
            console.log('Driver submitting another response...response is: "No" ...');

            if (response == 1 || response == 'y' || response == 'Y') {
                console.log('change from no to yes - not allowed');
                result = 'change';
            } else if (response == 2 || response == 'n' || response == 'N') {
                console.log('changing from yesRejected to no - not allowed');
                result = 'duplicate';
            } else {
                console.log('garbage response');
            }
            break;
        default :
            console.log('Garbage response on all responses');
            break;
    }
    return result;
}

function getReminingTime (responseDeadline) {
    var deadline = moment(responseDeadline);
    var now = moment();
    var endTime = moment(deadline.diff(now)).utcOffset(0).format('HH:mm:ss');

    return endTime;
}
