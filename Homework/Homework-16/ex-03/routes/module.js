
var cats = require('./cats/cats.js');
var elephants = require('./elephants/elephants.js');
var monkeys = require('./monkeys/monkeys.js');
var birds = require('./birds/birds.js');
var rabbits = require('./rabbits/rabbits.js');

var animalArray;
var animal;

var maxID = 20;


function getID (animalType, id) {

  animalArray = getAnimalType(animalType);
  var animal;

      for (var i = 0; i < animalArray.length; i++){
        if(id.toString() === animalArray[i].id.toString()){
          animal = animalArray[i];
        }
      }

      return animal;
}


function getAnimalType(animalType){
  var arr;
  
    switch (animalType) {
        case 'cats':
          arr = cats;
          break;
        case 'elephants':
          arr = elephants;
          break;
        case 'monkeys':
          arr = monkeys;
          break;
        case 'birds':
          arr = birds;
          break;
        case 'rabbits':
          arr = rabbits;
          break;
        default:
            console.log('No matching animals');
            arr = [];
            break;
    }
    return arr;
}


//check to see if the puppy already exists by checking the ID sent

function checkAnimal (id, method, animalType) {
      var update = { state : true, 'index' : -1 };

      if (typeof id !== "number") {
          update.state = false;
          return update;
      }

      if (method === 'POST') {
          if (id <= maxID) {
            update.state = false;
          }
          return update;
      }
      if (method === 'PUT' || method === 'DELETE') {
            if (id > maxID) {
                return update.state = false;

            } else {
                  var arr = getAnimalType(animalType);
                  for (var i = 0; i < arr.length; i++) {
                        if (id.toString() === arr[i].id.toString()) {
                              update.index = i;
                        }
                  }
              return update;
            }
      } else {
         return update.state = false;
      }

}

function generateID(){
    maxID += 1;
    var newID = maxID;
    return newID;
}

function getNextID() {
  return maxID + 1;
}


// ensure the URL request received for PUT matches the bodyID to update
function checkRoute (bodyID, paramsID) {
  return ( paramsID.toString() === bodyID.toString() ) ? true : false;
}


function updateAnimal (animalType, newAnimal, i) {

      animalArray = getAnimalType(animalType);
      var animal;

        for (var prop in animalArray[i]){
          if (animalArray[i][prop] !== newAnimal[prop]){
            animalArray[i][prop] = newAnimal[prop];
          }
        }

      animal = animalArray[i];

      return animal;
}


function deleteAnimal(animalType, i) {
    animalArray = getAnimalType(animalType);
    var animal = animalArray[i];
    animalArray = animalArray.splice(i, 1);
    return animal;
}

function sortByID (arr) {
    arr.sort(function (a, b){
      return a.id - b.id;
    });
    return arr;
}

function sortByName (arr) {
    arr.sort(function (a, b){
      if (a.name.toUpperCase() < b.name.toUpperCase()){
        return -1;
      }
      if (a.name.toUpperCase() > b.name.toUpperCase()){
        return 1;
      }
      return 0;
    });
    return arr;
}

module.exports = {
                   getID : getID,
                   checkAnimal : checkAnimal,
                   generateID : generateID,
                   getNextID : getNextID,
                   checkRoute : checkRoute,
                   updateAnimal : updateAnimal,
                   deleteAnimal : deleteAnimal,
                   sortByID : sortByID,
                   sortByName : sortByName
};
