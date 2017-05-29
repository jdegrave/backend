module.exports = function (err, res, req, next) {
    console.error(err.message);
    console.error(err.stack);
    res.status(500);
    res.render('/error_template_drivers', { error : err });
    next();  // not sure if this is necessary...
};
