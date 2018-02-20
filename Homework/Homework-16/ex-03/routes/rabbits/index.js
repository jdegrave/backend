var router = require('express').Router();
var rabbits = require('./rabbits'); // import rabbit data

var rabbitInfo = require('../module');  // imports the common functions used by all animals


router.get('/', function (request, response){
  response.status(200).json(rabbits);
});

// for the sort to work you must formulate the GET request as follows:
// /sort?order=id  OR sort?order=name
router.get(/\/sort/, function(request, response){
    var sortType = request.query.order;
  

    if (sortType === 'id'){
      rabbits = rabbitInfo.sortByID(rabbits);

    } else if (sortType === 'name') {
      rabbits = rabbitInfo.sortByName(rabbits);

    } else {
      response.status(404).send('No matches on GET request');
    }

    response.status(200).json(rabbits);
});

router.get('/:id', function (request, response){
   var rabbit = rabbitInfo.getID('rabbits', request.params.id);

   if (rabbit) {
     response.status(200).json(rabbit);
   } else {
     response.status(404).send('No rabbit has that ID. Request canceled.');
   }

});


router.post('/', function (request, response) {
    var id = request.body.id;    //get the ID from the request body
    var addrabbit = rabbitInfo.checkAnimal(id, 'POST', 'rabbits');  // check to see if the id is already taken

    if (addrabbit.state) {
      request.body.id = rabbitInfo.generateID();  // generate correct ID - overwrite the given one
      rabbits.push(request.body);
      response.status(200).json(request.body);

    } else {
      var nextID = rabbitInfo.getNextID();
      response.status(404).send('Yo! This is a RESTful API! No editing on a POST request!\n'
               + 'You are trying to overwrite an existing ID or add a duplicate ID\n'
               + 'Use PUT with the correct ID to update an animal\'s info.\n'
               + 'Use POST with an ID number >= ' + nextID + '.');
    }

});

router.put('/:id', function (request, response){
    var id = request.body.id;
    var routeID = request.params.id;

    var match = rabbitInfo.checkRoute(id, routeID);


    if (!match){
      response.status(403).send('PUT request URI does not match ID to update.\n'
                                + 'Update canceled.');

    } else {

        //check if animal id exists, if so proceed with update
        var exists = rabbitInfo.checkAnimal(id, 'PUT', 'rabbits');;

        if (exists.state && exists.index !== -1) {
            var rabbit = rabbitInfo.updateAnimal('rabbits', request.body, exists.index);
            response.status(200).json(rabbit);

        } else {
            response.status(404).send('Invalid animal ID. Update canceled.');
        }
    }
});


router.delete('/:id', function(request, response){
  var id = request.body.id;
  var routeID = request.params.id;

  var match = rabbitInfo.checkRoute(id, routeID);


  if (!match){
    response.status(403).send('DELETE request URI does not match ID to delete.\n'
                              + 'Delete canceled.');

  } else {

      //check if animal id exists, if so proceed with update
      var exists = rabbitInfo.checkAnimal(id, 'DELETE', 'rabbits');;

      if (exists.state && exists.index !== -1) {
          var rabbit = rabbitInfo.deleteAnimal('rabbits', exists.index);
          response.status(200).send('Successfully deleted ' + JSON.stringify(rabbit));

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
