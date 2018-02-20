var router = require('express').Router();
var monkeys = require('./monkeys'); // import monkey data

var monkeyInfo = require('../module');  // imports the common functions used by all animals


router.get('/', function (request, response){
  response.status(200).json(monkeys);
});

// for the sort to work you must formulate the GET request as follows:
// /sort?order=id  OR sort?order=name
router.get(/\/sort/, function(request, response){
    var sortType = request.query.order;
    console.log('in the get with sort pick ', sortType);

    if (sortType === 'id'){
      monkeys = monkeyInfo.sortByID(monkeys);

    } else if (sortType === 'name') {
      monkeys = monkeyInfo.sortByName(monkeys);

    } else {
      response.status(404).send('No matches on GET request');
    }

    response.status(200).json(monkeys);
});

router.get('/:id', function (request, response){
   var monkey = monkeyInfo.getID('monkeys', request.params.id);

   if (monkey) {
     response.status(200).json(monkey);
   } else {
     response.status(404).send('No monkey has that ID. Request canceled.');
   }

});


router.post('/', function (request, response) {
    var id = request.body.id;    //get the ID from the request body
    var addmonkey = monkeyInfo.checkAnimal(id, 'POST', 'monkeys');  // check to see if the id is already taken

    if (addmonkey.state) {
      request.body.id = monkeyInfo.generateID();  // generate correct ID - overwrite the given one
      monkeys.push(request.body);
      response.status(200).json(request.body);

    } else {
      var nextID = monkeyInfo.getNextID();
      response.status(404).send('Yo! This is a RESTful API! No editing on a POST request!\n'
               + 'You are trying to overwrite an existing ID or add a duplicate ID\n'
               + 'Use PUT with the correct ID to update an animal\'s info.\n'
               + 'Use POST with an ID number >= ' + nextID + '.');
    }

});

router.put('/:id', function (request, response){
    var id = request.body.id;
    var routeID = request.params.id;

    var match = monkeyInfo.checkRoute(id, routeID);
    console.log(match);

    if (!match){
      response.status(403).send('PUT request URI does not match ID to update.\n'
                                + 'Update canceled.');

    } else {

        //check if animal id exists, if so proceed with update
        var exists = monkeyInfo.checkAnimal(id, 'PUT', 'monkeys');;

        if (exists.state && exists.index !== -1) {
            var monkey = monkeyInfo.updateAnimal('monkeys', request.body, exists.index);
            response.status(200).json(monkey);

        } else {
            response.status(404).send('Invalid animal ID. Update canceled.');
        }
    }
});


router.delete('/:id', function(request, response){
  var id = request.body.id;
  var routeID = request.params.id;

  var match = monkeyInfo.checkRoute(id, routeID);
  console.log(match);

  if (!match){
    response.status(403).send('DELETE request URI does not match ID to delete.\n'
                              + 'Delete canceled.');

  } else {

      //check if animal id exists, if so proceed with update
      var exists = monkeyInfo.checkAnimal(id, 'DELETE', 'monkeys');;

      if (exists.state && exists.index !== -1) {
          var monkey = monkeyInfo.deleteAnimal('monkeys', exists.index);
          response.status(200).send('Successfully deleted ' + JSON.stringify(monkey));

      } else {
          response.status(404).send('Invalid animal ID. Delete canceled.');
      }
  }
});


// general error handling
router.get('*', function(request, response) {
    response.status(404).send('Sorry - we don\'t have any of those!');
});

router.post('*', function (request, response){
    response.status(403).send('No updates to existing animals permitted. Request canceled.');
});

router.put('*', function (request, response) {
    response.status(403).send('No edits to existing animals via this critiera. Request canceled.');
});

router.delete('*', function(request, response){
    response.status(403).send('Request to delete denied.');
});
module.exports = router;
