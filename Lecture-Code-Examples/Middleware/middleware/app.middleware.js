module.exports = function(req, res, next){
  console.log('Hello from my first middlware!');
  next();
};
