// this has to be a higher order function. Because we need to pass it the logger
// and return a function - because middleware has to have a function. We need to add
// the logger to the request object so we can log all of our routes

// this is an app level middleware
module.exports = function (logger){   // the outer function only happens once when we start up
    return function (req, res, next){
        req.log = logger;           // this attaches the logger to all route requests
        next();                     // all routes have access to the routes we created
    };
};
