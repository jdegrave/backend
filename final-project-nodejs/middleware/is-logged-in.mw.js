module.exports = function (req, res, next) {
    if(req.isAuthenticated()){
        return next();  // send to drivers, trips, or trips/:id page
    }
    res.redirect('/');
    
};
