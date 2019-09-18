function loader(source){
  console.log('loader3')
  return source+'//3'
}
loader.pitch = function(){
  console.log('pitch3');
}
module.exports = loader;