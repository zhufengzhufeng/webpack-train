const {
  Tapable,
  SyncHook,
  AsyncParallelHook,
  AsyncSeriesHook
} = require("tapable");
const path = require('path');
const Chunk = require('./Chunk');
let normalModuleFactory = require('./NormalModuleFactory');
let ejs = require('ejs');
const fs = require('fs');
const mainTemplate =  fs.readFileSync(path.posix.join(__dirname,'main.ejs'),'utf8');
let mainRender = ejs.compile(mainTemplate);
class Compilation extends Tapable {
  constructor(compiler) {
    super();
    this.compiler = compiler;
    this.options = compiler.options;
    this.context = compiler.context;
    this.inputFileSystem = compiler.inputFileSystem;
    this.outputFileSystem = compiler.outputFileSystem;
    this.hooks = {
      addEntry:new SyncHook(['entry','name']),
      seal:new SyncHook([]),
      beforeChunks:new SyncHook([]),
      afterChunks:new SyncHook([])
    };
    //代表我们的入口，里面放着所有的入口模块
    this.entries = [];
    this.modules = [];//这是一个模块的数组 里面模块实例
    this._modules={};//这是一个对象 key是模块的绝对路径  值是模块实例 
    this.chunks = [];//代码块
    this.files = [];//文件数组
    this.assets = {};//资源对象
  }
  addEntry(context,entry,name,finallyCallback){
    this.hooks.addEntry.call(entry,name);//./src/index.js main
    this._addModuleChain(context,entry,name);
    finallyCallback();
  }
  _addModuleChain(context,entry,name){
    let module = normalModuleFactory.create({
      name,//所属的代码块的名字 main
      context:this.context,
      request:path.posix.join(context,entry) //此模块的绝对路径
    });
    module.build(this);
    //把编译后的入口模块添加到入口数组
    this.entries.push(module);
  }
  buildDependencies(module,dependencies){
    module.dependencies = dependencies.map(data=>{
      let childModule = normalModuleFactory.create(data);
      return childModule.build(this);
    });
  }
  seal(callback){
    this.hooks.seal.call();
    this.hooks.beforeChunks.call();
    for(let entryModule of this.entries){
      let chunk = new Chunk(entryModule);
      this.chunks.push(chunk);
      //只要说模块的名字和代码的名字一样，就说明这个模块属于这个代码
      chunk.modules = this.modules.filter(module=>module.name == chunk.name);
    }
    this.hooks.afterChunks.call();
    this.createChunkAssets();
    callback();
  }
  createChunkAssets(){
    for(let i=0;i<this.chunks.length;i++){
      const chunk = this.chunks[i];
      chunk.files = [];
      const file = chunk.name+'.js';//main.js
      let source = mainRender({
        entryId:chunk.entryModule.moduleId,//此代码块的入口模块ID 
        modules:chunk.modules
      });
      chunk.files.push(file);
      this.emitAsset(file,source);
    }
  }
  emitAsset(file,source){
    this.assets[file] = source;
    this.files.push(file);
  }
}
module.exports = Compilation;
