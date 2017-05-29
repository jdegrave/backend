module.exports = function(req, res, next) {
   console.log('This is my basic middleware...');
   next();
};
