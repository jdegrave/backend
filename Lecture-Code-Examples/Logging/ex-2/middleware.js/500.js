module.exports = function (err, req, res, next){
    // we can use anything on the request object and the err object

    req.log.warn('Something went terribly wrong here: ' + err + ' - ' + req.params);
    res.status(500).send('Internal server error: ' + err.message);

    // if you create new Error ( )  - this is the built in error in node
    // this is middleware what we are creating here
};
