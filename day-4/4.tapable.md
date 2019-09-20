## 1. webpack的插件机制
- 在具体介绍webpack内置插件与钩子可视化工具之前，我们先来了解一下webpack中的插件机制。 webpack实现插件机制的大体方式是：
  - 创建 - webpack在其内部对象上创建各种钩子；
  - 注册 - 插件将自己的方法注册到对应钩子上，交给webpack；
  - 调用 - webpack编译过程中，会适时地触发相应钩子，因此也就触发了插件的方法。
- Webpack本质上是一种事件流的机制，它的工作流程就是将各个插件串联起来，而实现这一切的核心就是Tapable，webpack中最核心的负责编译的Compiler和负责创建bundle的Compilation都是Tapable的实例
- 通过事件和注册和监听，触发webpack生命周期中的函数方法

```js
const {
    SyncHook,
    SyncBailHook,
    SyncWaterfallHook,
    SyncLoopHook,
    AsyncParallelHook,
    AsyncParallelBailHook,
    AsyncSeriesHook,
    AsyncSeriesBailHook,
    AsyncSeriesWaterfallHook
} = require('tapable');
```

## 2. tapable分类
- Hook 类型可以分为`同步Sync`和`异步Async`，异步又分为`并行`和`串行`

[tapable](http://img.zhufengpeixun.cn/tapable.png)


|类型|使用要点|
|:----|:----|
|Basic|不关心监听函数的返回值|
|Bail|保险式: 只要监听函数中有返回值(不为undefined)，则跳过之后的监听函数|
|Waterfall|瀑布式: 上一步的返回值交给下一步使用|
|Loop|循环类型: 如果该监听函数返回true,则这个监听函数会反复执行，如果返回undefined则退出循环|

## 3.SyncHook
1. 所有的构造函数都接收一个可选参数，参数是一个参数名的字符串数组
2. 参数的名字可以任意填写，但是参数数组的长数必须要根实际接受的参数个数一致
3. 如果回调函数不接受参数，可以传入空数组
4. 在实例化的时候传入的数组长度长度有用，值没有用途
5. 执行call时，参数个数和实例化时的数组长度有关
6. 回调的时候是按先入先出的顺序执行的，先放的先执行

### 3.1 使用
```js
const {SyncHook} = require("./tapable");
//const {SyncHook} = require('tapable');
let syncHook = new SyncHook(["name"]);
syncHook.tap("1", name => {
  console.log(name, 1);
});
syncHook.tap("2", name => {
  console.log(name, 2);
});
syncHook.call("zhufeng");
/* 
(function anonymous(name) {
  var _context;
  var _x = this._x;
  var _fn0 = _x[0];
  _fn0(name);
  var _fn1 = _x[1];
  _fn1(name);
}) 
*/
```

### 3.2 实现
#### 3.2.1 index.js
tapable\index.js

```js
let SyncHook = require('./SyncHook');
module.exports = {
    SyncHook
}
```

#### 3.2.2 Hook.js
tapable\Hook.js
```js
class Hook {
  constructor(args) {
    if (!Array.isArray(args)) args = []; //参数
    this._args = args; // 这里存入初始化的参数
    this.taps = []; //这里就是回调栈用到的数组
    this._x = undefined; //这个比较重要，后面拼代码会用
  }
  tap(options, fn) {
    if (typeof options === "string") options = { name: options };
    options.fn = fn;
    this._insert(options); //参数处理完之后，调用_insert，这是关键代码
  }
  _insert(item) {
    this.taps[this.taps.length] = item;
  }
  call(...args) {
    let callMethod = this._createCall();
    return callMethod.apply(this, args);
  }
  _createCall(type) {
    return this.compile({
      taps: this.taps,
      _args: this._args
    });
  }
}

module.exports = Hook;
```

#### 3.2.3 SyncHook
tapable\SyncHook.js
```js
const Hook = require("./Hook");
const HookCodeFactory = require("./HookCodeFactory");
const factory = new HookCodeFactory();
class SyncHook extends Hook {
  constructor() {
    super();
  }
  compile(options) {
    factory.setup(this, options);
    return factory.create(options);
  }
}
module.exports = SyncHook;

```

#### 3.2.4 HookCodeFactory.js
tapable\HookCodeFactory.js
```js
class HookCodeFactory {
  args() {
    return this.options.args.join(",");
  }
  setup(instance, options) {
    this.options = options;
    instance._x = options.taps.map(t => t.fn);
  }
  header() {
    return "var _x = this._x;\n";
  }
  content() {
    let code = "";
    for (let idx = 0; idx < this.options.taps.length; idx++) {
      code += `var _fn${idx} = _x[${idx}];\n
               _fn${idx}(${this.args()});\n`;
    }
    return code;
  }
  create(options) {
    return new Function(this.args(), this.header() + this.content());
  }
}
module.exports = HookCodeFactory;

```

## 4.3. AsyncParallelHook_callback
### 4.3.1 AsyncParallelHook_callback.js
5.AsyncParallelHook_callback.js
```js
let {AsyncParallelHook}=require('tapable');
let queue = new AsyncParallelHook(['name']);
console.time('cost');
debugger;
queue.tapAsync('1',function(name,callback){
    setTimeout(function(){
        console.log(1);
        callback();
    },1000)
});
queue.tapAsync('2',function(name,callback){
    setTimeout(function(){
        console.log(2);
        callback();
    },2000)
});
queue.tapAsync('3',function(name,callback){
    setTimeout(function(){
        console.log(3);
        callback();
    },3000)
});
queue.callAsync('zfpx',err=>{
    console.timeEnd('cost');
});

/**
var _context;
var _x = [(name,callback)=>{console.log(1);callback()},(name,callback)=>{console.log(2);callback()},(name,callback)=>{console.log(3);callback()}];
var _counter = 3;
var _callback = ()=>{console.log('执行最终的回调!')}
var name = 'zhufeng';
var _done = () =>{
    _callback();
};
var _fn0 = _x[0];
_fn0(name, _err0 =>{
    if (--_counter === 0) _done();
});
var _fn1 = _x[1];
_fn1(name, _err1 =>{
    if (--_counter === 0) _done();
});
var _fn2 = _x[2];
_fn2(name, _err2 =>{
    if (--_counter === 0) _done();
});

(function anonymous(name, _callback) {
    var _context;
    var _x = this._x;
    var _counter = 3;
    var _done = () = >{
        _callback();
    };
    var _fn0 = _x[0];
     _fn0(name, _err0 = >{
         if (--_counter === 0) _done();
    });
    var _fn1 = _x[1];
    _fn1(name, _err1 = >{
        if (--_counter === 0) _done();
    });
    var _fn2 = _x[2];
    _fn2(name, _err2 = >{
         if (--_counter === 0) _done();
    });
})
 */
```

### 4.3.2 AsyncParallelHookAsync.js
tapable\AsyncParallelHookAsync.js
```js
const Hook = require("./Hook");
const HookCodeFactory = require("./HookCodeFactory");
class AsyncParallelHookCodeFactory extends HookCodeFactory {
  args({ before, after } = {}) {
    let allArgs = this.options._args;
    if (before) allArgs = [before].concat(allArgs);
    if (after) allArgs = allArgs.concat(after);
    if (allArgs.length === 0) {
      return "";
    } else {
      return allArgs.join(", ");
    }
  }
  create(options) {
    return new Function(
      this.args({ after: "_callback" }),
      this.header() + this.content()
    );
  }
  content() {
    let code = ``;
    code += `
      var _counter = ${this.options.taps.length};
      var _done = () =>{
        _callback();
      };
    `;
    for (let idx = 0; idx < this.options.taps.length; idx++) {
      code += `
          var _fn${idx} = _x[${idx}];
          _fn${idx}(name, _err${idx} =>{
              if (--_counter === 0) _done();
          });
      `;
    }
    return code;
  }
}
const factory = new AsyncParallelHookCodeFactory();
class AsyncParallelHook extends Hook {
  constructor(args) {
    super(args);
  }
  tapAsync(options, fn) {
    if (typeof options === "string") options = { name: options };
    options.fn = fn;
    this._insert(options); //参数处理完之后，调用_insert，这是关键代码
  }
  callAsync(...args) {
    let callMethod = this._createCall();
    return callMethod.apply(this, args);
  }
  compile(options) {
    factory.setup(this, options);
    return factory.create(options);
  }
}
module.exports = AsyncParallelHook;

```


## 4.4 AsyncParallelHook_promise.js
### 4.4.1 AsyncParallelHook_promise.js
```js
let {AsyncParallelHook}=require('./tapable');
let queue = new AsyncParallelHook(['name']);
console.time('cost');
queue.tapPromise('1',function(name){
  return new Promise(function(resolve){
    setTimeout(function(){
        console.log(1);
        resolve();
    },1000)
  });
});
queue.tapPromise('2',function(name){
   return new Promise(function(resolve){
    setTimeout(function(){
        console.log(2);
       resolve();
    },2000)
  });
});
queue.tapPromise('3',function(name){
  return new Promise(function(resolve){
    setTimeout(function(){
        console.log(3);
        resolve();
    },3000)
  });
});
queue.promise('zfpx').then(result=>{
    console.timeEnd('cost');
},error=>{
    console.log(error);
    console.timeEnd('cost');
});


/**
(function anonymous(name) {
    return new Promise((_resolve) = >{
        var _x = this._x;
        var _counter = 3;
        var _done = () = >{
            _resolve();
        };
        
        var _fn0 = _x[0];
        var _promise0 = _fn0(name);
        _promise0.then(_result0 = >{
            if (--_counter === 0) _done();
        });
        
        var _fn1 = _x[1];
        var _promise1 = _fn1(name);
        _promise1.then(_result1 = >{
            if (--_counter === 0) _done();
        });
        
        var _fn2 = _x[2];
        var _promise2 = _fn2(name);
        _promise2.then(_result2 = >{
            if (--_counter === 0) _done();
        });
    });
})


 */
```

### 4.4.2 AsyncParallelHookPromise.js
tapable\AsyncParallelHookPromise.js
```js
const Hook = require("./Hook");
const HookCodeFactory = require("./HookCodeFactory");
class AsyncParallelHookCodeFactory extends HookCodeFactory {
  args({ before, after } = {}) {
    let allArgs = this.options._args;
    if (before) allArgs = [before].concat(allArgs);
    if (after) allArgs = allArgs.concat(after);
    if (allArgs.length === 0) {
      return "";
    } else {
      return allArgs.join(", ");
    }
  }
  create(options) {
    return new Function(this.args(), this.header() + this.content());
  }
  content() {
    let code = ``;
    code += `
      return new Promise((_resolve)=>{
        var _counter = ${this.options.taps.length};
        var _done = ()=>{
            _resolve();
        };
    `;

    for (let idx = 0; idx < this.options.taps.length; idx++) {
      code += `
        var _fn${idx} = _x[${idx}];
        var _promise${idx} = _fn${idx}(name);
        _promise${idx}.then(_result${idx} =>{
            if (--_counter === 0) _done();
        });
      `;
    }
    code += `
    });
    `;
    return code;
  }
}
const factory = new AsyncParallelHookCodeFactory();
class AsyncParallelHook extends Hook {
  constructor(args) {
    super(args);
  }
  tapPromise(options, fn) {
    if (typeof options === "string") options = { name: options };
    options.fn = fn;
    this._insert(options); //参数处理完之后，调用_insert，这是关键代码
  }
  promise(...args) {
    let callMethod = this._createCall();
    return callMethod.apply(this, args);
  }
  compile(options) {
    factory.setup(this, options);
    return factory.create(options);
  }
}
module.exports = AsyncParallelHook;

```