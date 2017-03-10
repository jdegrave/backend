//arrays

var fruits = [
                'apple',
                'banana',
                'orange'
           ];

var myArray = [1, 2, 3, 4];

//multi-dimensional array (2-D array)
var myOtherArray = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
];

console.log('SECOND ARRAY, FIRST VALUE: ', myOtherArray[1][1]);

// object
var myObject = {
  firstName: 'Jodi',
  lastName: 'De Grave'
};


// adding an array to an object
var myObjectWithArray = {
  firstName: 'Jodi',
  lastName: 'De Grave',
  favoriteFood: ['sushi', 'pizza', '3', 'chocolate', 'donuts']
};

console.log('MY FAVORITE FOODS: ', myObjectWithArray.favoriteFood);

// object inside of an object (nested objects)
var myObjectWithObject = {
  firstName: 'Jodi',
  lastName: 'De Grave',
  favoriteFood: ['sushi', 'pizza', '3', 'chocolate', 'donuts'],
  address: {
    streetName: '123 Main St',
    city: 'Springdale',
    state: 'AR',
    zip: '72701'
  }
};


console.log('MY ADDRESS: ', myObjectWithObject.address);

// If you didn't know the property name 

/*update an object's property

function adjustPropertyInObject(property,value){
 objectWithObject[property]= value
}

adjustPropertyInObject('property name', 'new value');
ex.) adjustPropertyInObject('firstname', 'bob');

*/

//array of objects
var myArrayOfObjects = [myObject, myObjectWithArray, myObjectWithObject];
console.log('AN OBJECT: ', myArrayOfObjects[1].lastName);
console.log('OBJECT NAME:', myArrayOfObjects[1]);


// array of objects - hardcoded within the array
//In real life, JSON requires quotes for property NAME
//JSON = JavaScrpt Object Notation. It's a way to send data in a human
// readable form. It's an alternative to XML
//JSON have to put quotes around property names, strings. Don't put
// quotes around numbers
/*Example:
var jsonObj {
      {
        'propery-name':  'Jodi'
        'property-num': 5    //no quotes for numbers
    }
};

    var objectFromJson = jsonObj.json();
    // JS conventions are to NOT include the quotes because .json() is a JS library that converts it for you
*/
var myOtherArrayOfObjects = [
  {
      first: 1,
      second: 2,
      third: 3
  },
  {
      first: 4,
      second: 5,
      third: 6
  },
  {
      first: 7,
      second: 8,
      third: 9
  }
];

// Creates a property called 'fourth' in the 0th element of the array (which is an object)
console.log(myOtherArrayOfObjects[0].fourth = 4);