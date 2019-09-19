const {
  Tapable,
  SyncHook,
  AsyncParallelHook,
  AsyncSeriesHook
} = require("tapable");
const path = require('path');
class Compilation extends Tapable {
  constructor(compiler) {
    super();
    this.compiler = compiler;
    this.options = compiler.options;
    this.context = compiler.context;
    this.inputFileSystem = compiler.inputFileSystem;
    this.outputFileSystem = compiler.outputFileSystem;
    this.hooks = {
      addEntry:new SyncHook(['entry','name'])
    };
    //代表我们的入口，里面放着所有的入口模块
    this.entries = [];
  }
  addEntry(context,entry,name,finallyCallback){
    console.log('addEntry进来了')
  }
}
module.exports = Compilation;
