module.exports = function (req, res, next){
  console.log('Hello from vanilla middleware!');
  next();
};
