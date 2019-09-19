let EntryOptionPlugin = require('./plugins/EntryOptionPlugin');
class WebpackOptionsApply {
  process(options,compiler){
      compiler.hooks.afterPlugins.call(compiler);
      //挂载入口点，它会监听 make事件
      new EntryOptionPlugin().apply(compiler);
      //触发compiler.hooks.entryOption
      compiler.hooks.entryOption.call(options.context,options.entry);
  }
}

module.exports = WebpackOptionsApply;