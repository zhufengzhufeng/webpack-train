let Hook = require('./Hook');
let HookCodeFactory = require('./HookCodeFactory');
let factory = new HookCodeFactory();

class SyncHook extends Hook{
 compile(options){ //options = {taps,_args}
     ////this代表当前hook  options代表配置对象 {_args,taps}
     //this._x = fn的数组
     factory.setup(this,options);
     return factory.create(options); //options = {taps,_args}
 }
}
module.exports = SyncHook;