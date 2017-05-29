var router = require('express').Router();  // import Express router object
var chocolate = require('./chocolate.js');
var vanilla = require('./vanilla.js');

//this executes middleware in the specified order, and then executes get
// in this example chocolate is executed twice

router.use(chocolate);    // router level middleware because executed everytime
                          // someone requests the /chocolate folder , but only
                          // when they choose the chocolate route
//router.use(vanilla);

router.get('/', chocolate, function (request, response){
    response.status(200).send('Give us chocolate');
});

// this will only work if in postman if you type this as the URL
//  localhost:3000/chocolate/vanilla  ... why?
// because in the root index.js on line 17 the code states:
// app.use('/chocolate', routes);
// so ... even though /chocolate is not an actually folder - remember we dictate
// the routes... so when it comes to the route folder, it thinks it's going to
// the /chocolate folder. So the path to vanilla has to start from chocolate/
router.get('/vanilla', vanilla, function(req, res){
  res.status(200).send('Vanilla with no ice');
});

router.get()

module.exports = router;
