var router = require('express').Router();
var users = require('./users');
var utils = require('../../utils');

router.get('/', function (req, res){
    res.status(200).json(users);
});


router.post('/', function(req,res) {
    var index = [];
    console.log(req.params.id);
    var id = req.body.id;
    index = users.filter(function(user){
        if (id.toString() === user.id.toString()) {
            return user.id;
        }
    });

    if (index.length !== 0) {
        res.status(403).send('User with that id already exists. POST request denied.');
    } else {
        // use reduce with Math.max function to get the highest ID number of all users

        // NOTE: always provide an initial value with reduce; if you don't it skips
        // the first element in the array (index 0) and starts with index = 1. In this
        // case, I used an object (since all items in the array are objects) with an
        // id property equal to 0 {id : 0}, since this matches the essential object
        // properties 'reduce' is being used on.

        // NOTE: To get this to work on an array of objects, provide a return value
        // also an  object with the same property name that you're trying to access in the
        // array of objects. If you don't, the first iteration returns a numeric literal
        // in the 2nd iteration, reduce is looking for an 'id' property on the result
        // of the 1st iteration, and of course it can find one (numeric literals don't)
        // have 'id' properties in this sense. Therefore, since no 'id' property exists
        // the result is 'undefined' when comparing undefined to b.id, it results in NaN.



        var currMaxID = users.reduce(function(a,b){
            return { id: Math.max(a.id, b.id)};
        }, { id:0 });

        req.body.id = currMaxID.id + 1; // assign the next highets number
        users.push(req.body);
        res.status(200).json(req.body);
    }

});



router.post('*', function (req, res){
    res.status(403).send('POST requests must include all information in the request body.\n'
                        +'Do not send request body parameters in the URI');
});

module.exports = router;
