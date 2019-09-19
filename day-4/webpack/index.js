let NodeEnvironmentPlugin = require('./plugins/NodeEnvironmentPlugin');
let Compiler = require('./Compiler');
let WebpackOptionsApply = require('./WebpackOptionsApply');
//webpack是一个函数，第一个参数是options,第二个参数是callback
function webpack(options){
  debugger;
  //上下文地址非常重要，或者是指向参数里的上下文，默认就指向当前的工作目录
  options.context = options.context||process.cwd();
  //代表一次编译对象 一次编译只会有一个commpiler
  let compiler = new Compiler(options.context);
  compiler.options = options;
  //设置node的环境 读写用哪个模块
  new NodeEnvironmentPlugin().apply(compiler);
  //执行所有的插件
  if(options.plugins && Array.isArray(options.plugins)){
      options.plugins.forEach(plugin=>plugin.apply(compiler));
  }
  compiler.hooks.environment.call();//触发environment事件执行
  compiler.hooks.afterEnvironment.call();//触发afterEnvironment事件执行
  new WebpackOptionsApply().process(options,compiler);
  return compiler;
}
module.exports = webpack;