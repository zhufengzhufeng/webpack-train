const babel = require('@babel/core');
//loader参数第一个要转换的内容 第二个是它的sourceMap
//this.request = laoder1!loader2!loader3!index.css
function loader(source,sourceMap){
  console.log('我要执行自己的loader')
  const options = {
      presets:["@babel/preset-env"],//babel的预设
      inputSourceMap:sourceMap,//sourcemap 输入
      sourceMaps:true,//告诉webpack我要输出sourcemap
      filename:this.request.split('!').pop()//指定文件
  }
  let {code,map,ast} = babel.transform(source,options);
  //code是转译后的代码 map是sourcemap ast抽象语法树
  return this.callback(null,code,map,ast);
}
module.exports = loader;