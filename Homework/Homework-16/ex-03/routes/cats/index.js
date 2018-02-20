var router = require('express').Router();
var cats = require('./cats'); // import cat data

var catInfo = require('../module');  // imports the common functions used by all animals


router.get('/', function (request, response){
  response.status(200).json(cats);
});

// for the sort to work you must formulate the GET request as follows:
// /sort?order=id  OR sort?order=name
router.get(/\/sort/, function(request, response){
    var sortType = request.query.order;
    
    if (sortType === 'id'){
      cats = catInfo.sortByID(cats);

    } else if (sortType === 'name') {
      cats = catInfo.sortByName(cats);

    } else {
      response.status(404).send('No matches on GET request');
    }

    response.status(200).json(cats);
});

router.get('/:id', function (request, response){

   var cat = catInfo.getID('cats', request.params.id);
   if (cat) {
     response.status(200).json(cat);
   } else {
     response.status(404).send('No cat has that ID. Request canceled.');
   }
});


router.post('/', function (request, response) {
    var id = request.body.id;    //get the ID from the request body
    var addCat = catInfo.checkAnimal(id, 'POST', 'cats');  // check to see if the id is already taken

    if (addCat.state) {
      request.body.id = catInfo.generateID();  // generate correct ID - overwrite the given one
      cats.push(request.body);
      response.status(200).json(request.body);

    } else {
      var nextID = catInfo.getNextID();
      response.status(404).send('Yo! This is a RESTful API! No editing on a POST request!\n'
               + 'You are trying to overwrite an existing ID or add a duplicate ID\n'
               + 'Use PUT with the correct ID to update an animal\'s info.\n'
               + 'Use POST with an ID number >= ' + nextID + '.');
    }

});

router.put('/:id', function (request, response){
    var id = request.body.id;
    var routeID = request.params.id;


    var match = catInfo.checkRoute(id, routeID);

    if (!match){
      response.status(403).send('PUT request URI does not match ID to update.\n'
                                + 'Update canceled.');

    } else {

        //check if animal id exists, if so proceed with update
        var exists = catInfo.checkAnimal(id, 'PUT', 'cats');;

        if (exists.state && exists.index !== -1) {
            var cat = catInfo.updateAnimal('cats', request.body, exists.index);
            response.status(200).json(cat);

        } else {
            response.status(404).send('Invalid animal ID. Update canceled.');
        }
    }
});


router.delete('/:id', function(request, response) {
  var id = request.body.id;
  var routeID = request.params.id;

  var match = catInfo.checkRoute(id, routeID);


  if (!match){
    response.status(403).send('DELETE request URI does not match ID to delete.\n'
                              + 'Delete canceled.');

  } else {

      //check if animal id exists, if so proceed with deletion
      var exists = catInfo.checkAnimal(id, 'DELETE', 'cats');;

      if (exists.state && exists.index !== -1) {
          var cat = catInfo.deleteAnimal('cats', exists.index);
          response.status(200).send('Successfully deleted ' + JSON.stringify(cat));

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
