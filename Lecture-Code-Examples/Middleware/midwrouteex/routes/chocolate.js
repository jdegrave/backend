module.exports = function (req, res, next){
  console.log('This is chocolate router middleware ...');
  next();
}
