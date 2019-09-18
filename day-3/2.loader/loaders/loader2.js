function loader(source){
  console.log('loader2')
  return source+'//2';
}
loader.pitch = function(){
  console.log('pitch2');
  return 'loader2pitch'
}
module.exports = loader;