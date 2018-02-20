var router = require('express').Router();
var users = require('./users/users.js')
var utils = require('../utils');

var members = utils.getMembers(users);


router.get('/', function (req, res){
    res.status(200).json(members);
});

router.get('/:id', function (req, res){

    var id = req.params.id;

    var member = utils.findMember(members,id);

    if (member.length === 0){
        res.status(404).send('Member not found.');
    } else {
        res.status(200).json(member);
    }
});

router.put('/:id', function (req, res){
    var bodyID = req.body.id;
    var paramsID = req.params.id;
    var reqBody = Object.assign(req.body);
    var usersList = users;



    var check = utils.checkRequestID(bodyID, paramsID, reqBody);
    if (!check){
        res.status(403).send('Request parameter ID and request body id did not match'
                             + ' or invalid value for request parameter ID and/or'
                             + ' body ID. PUT request denied.');

    } else {
            //check if the id exists
            var exists = utils.findPerson(usersList, bodyID);
            if ( exists.length === 0) {
                res.status(404).send('User with requested ID does not exist. PUT request denied');

        } else {
            // check if request only updates isMember
            var update = utils.compareData(exists[0], reqBody);

            if(!update) {
                res.status(403).send('Request body contains data changes other than '
                                     + 'isMember field or incorrect properties. PUT request denied.');
            } else {

                var userID = usersList.findIndex(function(elem){
                    return elem.id === bodyID;
                });

                users[userID].isMember = req.body.isMember;
                res.status(200).json(users[userID]);
            }
        }
    }
});

module.exports = router;
