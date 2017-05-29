var mongodb = require('../utils/mongodb.utils');
var Driver = require('../models/driver.model');
var driverDataFromDb = [];

module.exports = {
                    driverDataFromDb : driverDataFromDb,
                    saveOneDriver : saveOneDriver,
                    saveAllDrivers : saveAllDrivers,
                    fetchAllDrivers : fetchAllDrivers,
                    fetchDriverByID : fetchDriverByID,
                    allObjectIdToString : allObjectIdToString,
                    setScheduleNoteForDisplay : setScheduleNoteForDisplay,
                    // fetchDriverByName : fetchDriverByName,
                    fetchDriverByPhoneNumber : fetchDriverByPhoneNumber,
                    // fetchDriverBySeniorityRank : fetchDriverBySeniorityRank,
                    // fetchDriverByLastName : fetchDriverByLastName,
                    fetchAllDriversByRankAvailableText : fetchAllDriversByRankAvailableText,
                    // fetchAllAvailableDrivers : fetchAllAvailableDrivers,
                    // fetchAllUnavailableDrivers : fetchAllUnavailableDrivers,
                    fetchFirstToText : fetchFirstToText,
                    setNextFirstToText : setNextFirstToText,
                    manualSetFirstToText : manualSetFirstToText,
                    fetchAllDriversWhoText : fetchAllDriversWhoText,
                    getFirstToTextIndex : getFirstToTextIndex,
                    fetchAllDriversNoText : fetchAllDriversNoText,
                    updateManyDrivers : updateManyDrivers,
                    updateOneDriverById : updateOneDriverById
                    // updateManyDriversBymobilePhone : updateManyDriversBymobilePhone
                    // deleteDriverbyId : deleteDriverbyId
                };

function saveOneDriver (newDriver) {
    var trueRank;
    return Driver.find({})
        .exec()
        .then(function (allDrivers) {
            console.log('all drivers - 1st one: ', allDrivers[0]);

            trueRank = Math.max.apply(null, allDrivers.map(function (maxRank) { return maxRank.seniorityRank; })) + 1;

            var driverSearchResult = allDrivers.filter(function (elem) {
                if (elem.mobilePhone === newDriver.mobilePhone) {
                    return newDriver;
                }
            });
            console.log('driverSearchResult: ', driverSearchResult);
            return driverSearchResult;
        }).then(function (driverSearchResult) {
                if (driverSearchResult.length !== 0) {
                    console.log('use update instead. returning driver');
                    return newDriver;
                } else {
                    console.log('driver before save: ', newDriver);
                        var driverInfo = new Driver({
                                            firstName : newDriver.firstName,
                                            lastName : newDriver.lastName,
                                            mobilePhone : newDriver.mobilePhone,
                                            available : newDriver.available,
                                            seniorityRank : trueRank,
                                            firstToText : newDriver.firstToText,
                                            text : newDriver.text,
                                            deleted : newDriver.deleted
                                        });

                    console.log('scheduleNote: ', newDriver.scheduleNote[0].note);
                    driverInfo.scheduleNote.push({ note : newDriver.scheduleNote[0].note,
                                                    createDate : new Date() });
                    console.log('driver object just before save: ', driverInfo);
                    return driverInfo.save();
                } // end else
        }); //end last then
}


function saveAllDrivers (driversToSeed) {
    return Driver.insertMany(driversToSeed);
}


function fetchAllDrivers () {
    return Driver.find({ deleted : false }).sort({ seniorityRank : 1 }).exec()
        .then(function (results) {
            driverDataFromDb = allObjectIdToString(results);
            return driverDataFromDb;
        });
}


function fetchDriverByID (driverId) {
    return Driver.findById(driverId).exec();
}


function allObjectIdToString (driversArray) {
    var DriversObjectIdAsStrings = driversArray.map(function (elem) {
        elem.stringObjectId = elem._id.toString();
        return elem;
    });

    return DriversObjectIdAsStrings;
}

function setScheduleNoteForDisplay (drivers) {
    for (var i = 0; i < drivers.length; i++) {
        if (drivers[i].scheduleNote.length > 0) {
            var latestNote = drivers[i].scheduleNote[(drivers[i].scheduleNote.length - 1)];
            drivers[i].scheduleNote = [];
            drivers[i].scheduleNote.push(latestNote);
        }
    }
    return drivers;
}

function updateManyDrivers (modifyDrivers) {
    console.log('In updateManyDrivers...these are the drivers to modify: ', modifyDrivers);
    
    if (modifyDrivers.length === 0) {
        return false;
    }

    //console.log('modifyDriversArray: ', modifyDriversArray);
    modifyDrivers.forEach(function (elem) {
        updateOneDriverById(elem);
    });
}

function updateOneDriverById (driverToUpdate) {
    var id;

    if (driverToUpdate.hasOwnProperty('_id')) {
        console.log('id is of type ObjectId');
        id = driverToUpdate._id;
        console.log('id now has objectId value: ', id);
    } else {
        console.log('id is of type string...');
        id = driverToUpdate.stringObjectId;
    }
    return Driver.findById(id)
        .exec()
        .then(function (driverFetched) {
            console.log('updating a single driver...');
            console.log('driver fetched: ', driverFetched);
            console.log('driver to update: ', driverToUpdate);


            // to reset for testing
            //driverFetched.scheduleNote = [];
            if (driverToUpdate.hasOwnProperty('scheduleNote')) {

                if (((driverToUpdate.scheduleNote[0] === undefined) && (driverFetched.scheduleNote[0] === undefined))) {
                    console.log('nothing to update on Schedule Note 1st check');

                } else if ((driverToUpdate.scheduleNote[0] !== undefined && driverFetched.scheduleNote[0] !== undefined)
                            && (driverToUpdate.scheduleNote[0].note === driverFetched.scheduleNote[(driverFetched.scheduleNote.length - 1)].note)) {
                    console.log('nothing to update on Schedule Note 2nd check');

                } else {
                    //console.log('scheduleNote property exists, and there is at least one note in the array');
                    if (driverToUpdate.scheduleNote.length === 0) {
                        console.log('in driver to update null or undefined schedule note');
                        console.log('driverToUpdate.scheduleNote.length: ', driverToUpdate.scheduleNote.length);
                        driverFetched.scheduleNote = [];
                    } else {
                        driverFetched.scheduleNote.push({ note : driverToUpdate.scheduleNote[0].note,
                                                  createDate : new Date() });
                    }
                }
            }

            if (driverToUpdate.hasOwnProperty('text')) {
                console.log('Updating driver fetched text capability to: ', driverToUpdate.text);
                driverFetched.text = driverToUpdate.text;
            }

            if (driverToUpdate.hasOwnProperty('available')) {
                console.log('Updatng driver fetched available property to: ', driverToUpdate.available);
                driverFetched.available = driverToUpdate.available;
            }

            if (driverToUpdate.hasOwnProperty('firstToText')) {
                console.log('Updating driver fetched first to text property to: ', driverToUpdate.firstToText);
                driverFetched.firstToText = driverToUpdate.firstToText;
            }

            return driverFetched.save();
        });
}

function fetchDriverByPhoneNumber (driverPhone) {
    return Driver.findOne({ 'mobilePhone' : driverPhone }).exec();
}

function fetchAllDriversWhoText () {
    var textDrivers = driverDataFromDb.filter(function (elem) {
        if (elem.text === true) {
            return elem;
        }
    });
    return textDrivers;
}

function fetchAllDriversNoText () {
    var noTextDrivers = driverDataFromDb.filter(function (elem) {
        if (elem.text === false) {
            return elem;
        }
    });
    return noTextDrivers;
}

function fetchAllDriversByRankAvailableText () {
    var tripDrivers = driverDataFromDb.filter(function (elem) {
        if (elem.text === true && elem.available === true) {
            return elem;
        }
    });
    return tripDrivers;
}

function fetchFirstToText () {
    // choose test data or database data
    var drivers;
    if (arguments.length === 0) {
        drivers = driverDataFromDb;
    } else {
        drivers = arguments[0];
    }

    var firstToTextIndex = getFirstToTextIndex(drivers);

    if (firstToTextIndex instanceof Error) {  // must have only one driver can have firstToText as true
        console.log('First to text error.' + Error);
        return firstToTextIndex;
    }

    if (drivers[firstToTextIndex].available === true && drivers[firstToTextIndex].text === true) {
        return firstToTextIndex;
    } else {
        drivers[firstToTextIndex].firstToText = false;


        var allDrivers = drivers.length;
        var originalfirstToIndex = firstToTextIndex;
        var driversToCheck = allDrivers - 1;  // we've already checked
        var done = false;

        while (!done) {
            if (drivers[firstToTextIndex].available === true || drivers[firstToTextIndex].text === true) {
                drivers[firstToTextIndex].firstToText = true;
                done = true;
            } else {
                firstToTextIndex++;
                driversToCheck--;

                if (firstToTextIndex === originalfirstToIndex || driversToCheck === 0) {
                    done = true;           // no one available to text
                } else if (firstToTextIndex === (allDrivers - 1) && driversToCheck > 0) {
                    firstToTextIndex = 0;                   // start at beginning of array
                }
            }
        }

        updateManyDrivers([drivers]);
        return firstToTextIndex;
    }
}

// called after have list of all available drivers that have texting capability
// all drivers have the following properties:
//   text : true
//  available : true
// and are sorted by seniorityRank
function setNextFirstToText (driversForTrip, numDriversToText, firstToTextIndex) {
    var results;
    if (arguments.length < 3) {
        results = getFirstToTextIndex(driversForTrip);
    } else {
        results = firstToTextIndex;
    }

    var error = new Error('Number of drivers requested exceeds number of drivers available.\n'
                        + 'Continuing process by setting drivers to text to max availabe drivers.');
    var driverCheck = (numDriversToText > driversForTrip.length || numDriversToText === 0) ? true : false;

    // error checking
    if (results instanceof Error) {
        console.log(results);
        return results;
    }
    if (driverCheck) {
        console.error(error);
        numDriversToText = driversForTrip.length;
    }


    var maxIndex = driversForTrip.length - 1;
    var curIndex = results;
    var nextToTextIndex = curIndex + numDriversToText;
    var diff = 0;

    if (curIndex === maxIndex) {
        //console.log('in if: curIndex === maxIndex');
        nextToTextIndex = numDriversToText - 1;
    } else if (nextToTextIndex > maxIndex && curIndex !== 0) {
        //console.log('in else if: nextToTextIndex > maxIndex and curIndex !== 0');
        diff = maxIndex - curIndex;
        nextToTextIndex = numDriversToText - diff - 1;
    } else if (nextToTextIndex > maxIndex && curIndex === 0) {
        //console.log('in nextToTextIndex > maxIndex && curIndex === 0');
        nextToTextIndex = curIndex;
    } else {
        //console.log('in final else statement - normal just add numDriversToText to curIndex');
        nextToTextIndex = curIndex + numDriversToText;
    }

    driversForTrip[curIndex].firstToText = false;
    driversForTrip[nextToTextIndex].firstToText = true;

    return driversForTrip;
}


function getFirstToTextIndex (drivers) {
    var index;

    var firstToTextIndexArray = drivers.map(function (elem) {
        return elem.firstToText;
    });

    var error = errorCheckFirstToTextIndex(firstToTextIndexArray);

    if (error) {
        return error;
    } else {
        index = firstToTextIndexArray.indexOf(true);
        return index;
    }
}


function errorCheckFirstToTextIndex (firstToTextValues) {
    var error;
    var count = 0;

    var test = firstToTextValues.filter(function (elem) {
        if (elem === true) {
            count += 1;
            return count;
        }
    });


    //console.log('test in driverServices.errorCheckFirstToTextIndex', test);
    // Ensures one and only one driver has firstToText set to true
    if (firstToTextValues.indexOf(true) === -1) {
        console.log('Error: There must be one driver with firstToText property set to true.');

        error = new Error('Error: There must be one driver with firstToText property set to true.');
    } else if (test.length !== 1) {
        console.log('Error: Only one driver may have firstToText property set to true.');

        error = new Error('Error: Only one driver may have firstToText value set to true.');
    } else {
        console.log('First to text error check passed with no errors.');

        error = false;
    }

    return error;
}


// for testing purposes only
function manualSetFirstToText (driversArray, indexToSet) {
    var curIndex = getFirstToTextIndex(driversArray);
    console.log('index to set to false: ', curIndex);

    driversArray[curIndex].firstToText = false;
    driversArray[indexToSet].firstToText = true;


    return driversArray;
}
