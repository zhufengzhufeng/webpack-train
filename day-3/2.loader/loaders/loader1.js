function loader(source){
  console.log('loader1')
  return source+'//1'
}
loader.pitch = function(){
  console.log('pitch1');
  return 'pitch1result';
}
module.exports = loader;