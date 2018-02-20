var router = require('express').Router();
var cities = require('./cities');



router.use('/cities', cities);
router.get('/', function (req, res){
     res.status(200).send('Welcome to City List');
});











module.exports = router;
