function getMembers (arr) {

    var members = arr.filter(function(elem){
        return elem.isMember === true;
    });

    return members;
}

function checkRequestID (bodyID, paramsID, reqBody) {

    var valid = false;

    if ( (bodyID.toString() !== paramsID.toString()) || (typeof bodyID !== 'number')){
        return valid;
    }
    return valid = true;
}

function findPerson (arr, id) {
    var person = arr.filter(function(elem) {
        if (elem.id.toString() === id.toString()) {
            return elem;
        }
    });
    return person;
}

function compareData (user, body) {
    var canUpdate = false;
    var isEqual = true;
    var bodyKeys = [];
    var memberKeys = [];


    // create array of keys for member object and request body object and sort both
    // to make things easier to check
    bodyKeys = Object.keys(body);
    bodyKeys = bodyKeys.sort();

    memberKeys = Object.keys(user);
    memberKeys = memberKeys.sort();

    // request body is too long (contains extraneous keys, possible duplicate keys)
    if (bodyKeys.length > memberKeys.length) {
        return canUpdate;
    }
    // check for extraneous keys in the request body and get an array of keys
    // from the request body that match the member object keys (request may not
    // have all keys present)
    var keyCheck = bodyKeys.map(function(elem){
        if (memberKeys.indexOf(elem) !== -1) {
            return (elem);
        } else {
            return -1;
        }
    });



    if ( ( keyCheck.indexOf(-1) !== -1 ) || ( keyCheck.indexOf('isMember') === -1 )) {
        return canUpdate;
    } else {
        var i = 0;
        while (isEqual && i < keyCheck.length) {
            if (keyCheck[i] !== 'isMember'){
                if (user[keyCheck[i]] !== body[keyCheck[i]]){
                    isEqual = false;
                }
            }
            i++;
        }
    }

    if (isEqual) {
        canUpdate = true;
    }

    return canUpdate;
}


module.exports = {
                    getMembers : getMembers,
                    checkRequestID : checkRequestID,
                    findPerson : findPerson,
                    compareData : compareData
                };
