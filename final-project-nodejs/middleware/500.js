module.exports = function (err, req, res, next) {
    req.log.warn('Warning: Something is off here: ' + err + ' - ' + req.params);
    res.status(500).send('Internal server error: ' + err.message);
    
};
