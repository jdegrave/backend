module.exports = function (req, res, next) {
    if(req.isAuthenticated()){
        return next();  // send them to secrets page - they are authenticated
    }
    res.redirect('/');
};
