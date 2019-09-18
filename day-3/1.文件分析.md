## 1. webpack介绍
- `Webpack`是一个前端资源加载/打包工具。它将根据模块的依赖关系进行静态分析，然后将这些模块按照指定的规则生成对应的静态资源。

![webpack_intro](http://img.zhufengpeixun.cn/webpack_intro.gif)

## 2. 预备知识
### 2.1 toStringTag
- `Symbol.toStringTag` 是一个内置 symbol，它通常作为对象的属性键使用，对应的属性值应该为字符串类型，这个字符串用来表示该对象的自定义类型标签，通常只有内置的 `Object.prototype.toString()` 方法会去读取这个标签并把它包含在自己的返回值里。

```js
console.log(Object.prototype.toString.call('foo'));     // "[object String]"
console.log(Object.prototype.toString.call([1, 2]));    // "[object Array]"
console.log(Object.prototype.toString.call(3));         // "[object Number]"
console.log(Object.prototype.toString.call(true));      // "[object Boolean]"
console.log(Object.prototype.toString.call(undefined)); // "[object Undefined]"
console.log(Object.prototype.toString.call(null));      // "[object Null]"
let myExports={};
Object.defineProperty(myExports, Symbol.toStringTag, { value: 'Module' });
console.log(Object.prototype.toString.call(myExports));
```

### 2.2 Object.create(null)
- 使用`create`创建的对象，没有任何属性,把它当作一个非常纯净的map来使用，我们可以自己定义`hasOwnProperty`、`toString`方法,完全不必担心会将原型链上的同名方法覆盖掉
- 在我们使用`for..in`循环的时候会遍历对象原型链上的属性，使用`create(null)`就不必再对属性进行检查了

```js
var ns = Object.create(null);
if (typeof Object.create !== "function") {
    Object.create = function (proto) {
        function F() {}
        F.prototype = proto;
        return new F();
    };
}
console.log(ns)
console.log(Object.getPrototypeOf(ns));
```

### 2.3 getter
- [defineProperty](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty) 方法会直接在一个对象上定义一个新属性，或者修改一个对象的现有属性， 并返回这个对象。
  - obj 要在其上定义属性的对象。
  - prop 要定义或修改的属性的名称。
  - descriptor 将被定义或修改的属性描述符。

### 2.3.1 描述符可同时具有的键值
| |configurable|enumerable|value|writable|get|set|
|:----|:----|:----|:----|:----|:----|:----|
|数据描述符|Yes|Yes|Yes|Yes|No|No|
|存取描述符|Yes|Yes	No|No|Yes|Yes|

### 2.3.2 示例
```js
var ageValue;
Object.defineProperty(obj, "age", {
  value : 10,//数据描述符和存取描述符不能混合使用
  get(){
    return ageValue;
  },
  set(newValue){
    ageValue = newValue;
  }
  writable : true,//是否可修改
  enumerable : true,//是否可枚举
  configurable : true//是否可配置可删除
});
```

## 2. 同步加载
### 2.1 webpack.config.js
```js
const path = require('path');
const HtmlWebpackPlugin=require('html-webpack-plugin');
module.exports = {
  mode:'development',
  devtool:"none",
  context: process.cwd(),
  entry: './src/index.js',
  output: {
    filename: 'bundle.js'
  },
  devServer:{
    contentBase:path.resolve(__dirname,'./dist')
  },
  module: {
    rules: [
      
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets:["@babel/preset-env"]
          }
        },
        include: path.join(__dirname, "src"),
        exclude: /node_modules/
      }
    ]
  },
  plugins: []
};
```

### 2.2 index.js
src\index.js
```js
let title = require('./title.js');
console.log(title);
```

### 2.3 title.js
src\title.js
```js
module.exports = "title";
```

### 2.4 打包文件分析 
```js
(function(modules) {
  // webpack的启动函数
  //模块的缓存
  var installedModules = {};

  //定义在浏览器中使用的require方法
  function __webpack_require__(moduleId) {
    //检查模块是否在缓存中
    if (installedModules[moduleId]) {
      return installedModules[moduleId].exports;
    }
    //创建一个新的模块并且放到模块的缓存中
    var module = (installedModules[moduleId] = {
      i: moduleId,
      l: false,
      exports: {}
    });

    //执行模块函数
    modules[moduleId].call(
      module.exports,
      module,
      module.exports,
      __webpack_require__
    );

    //把模块设置为已经加载
    module.l = true;

    //返回模块的导出对象
    return module.exports;
  }

  //暴露出模块对象
  __webpack_require__.m = modules;

  //暴露出模块缓存
  __webpack_require__.c = installedModules;

  //为harmony导出定义getter函数
  __webpack_require__.d = function(exports, name, getter) {
    if (!__webpack_require__.o(exports, name)) {
      Object.defineProperty(exports, name, { enumerable: true, get: getter });
    }
  };

  //在导出对象上定义__esModule属性
  __webpack_require__.r = function(exports) {
    if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
      Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
    }
    Object.defineProperty(exports, "__esModule", { value: true });
  };

  /**
   * 创建一个模拟的命名空间对象
   * mode & 1 value是模块ID直接用__webpack_require__加载
   * mode & 2 把所有的属性合并到命名空间ns上
   * mode & 4 当已经是命名空间的时候(__esModule=true)可以直接返回值
   * mode & 8|1 行为类似于require
   */
  __webpack_require__.t = function(value, mode) {
    if (mode & 1) value = __webpack_require__(value);
    if (mode & 8) return value;
    if (mode & 4 && typeof value === "object" && value && value.__esModule)
      return value;
    var ns = Object.create(null); //定义一个空对象
    __webpack_require__.r(ns);
    Object.defineProperty(ns, "default", { enumerable: true, value: value });
    if (mode & 2 && typeof value != "string")
      for (var key in value)
        __webpack_require__.d(
          ns,
          key,
          function(key) {
            return value[key];
          }.bind(null, key)
        );
    return ns;
  };

  // getDefaultExport函数为了兼容那些非non-harmony模块
  __webpack_require__.n = function(module) {
    var getter =
      module && module.__esModule
        ? function getDefault() {
            return module["default"];
          }
        : function getModuleExports() {
            return module;
          };
    __webpack_require__.d(getter, "a", getter);
    return getter;
  };

  //判断对象身上是否拥有此属性
  __webpack_require__.o = function(object, property) {
    return Object.prototype.hasOwnProperty.call(object, property);
  };

  //公共路径
  __webpack_require__.p = "";

  //加载入口模块并且返回导出对象
  return __webpack_require__((__webpack_require__.s = "./src/index.js"));
})({
  "./src/index.js": function(module, exports, __webpack_require__) {
    var title = __webpack_require__("./src/title.js");
    console.log(title);
  },
  "./src/title.js": function(module, exports) {
    module.exports = "title";
  }
});
```

### 2.5 实现
```js
(function(modules){
    var installedModules = {};
    function __webpack_require__(moduleId){
        if(installedModules[moduleId]){
            return installedModules[moduleId];
        }
        var module = installedModules[moduleId] = {
            i:moduleId,
            l:false,
            exports:{}
        }
        modules[moduleId].call(modules.exports,module,module.exports,__webpack_require__);
        module.l = true;
        return module.exports;
    }
    return __webpack_require__((__webpack_require__.s = "./src/index.js"));
})({
    "./src/index.js":function(module,exports,__webpack_require__){
        var title = __webpack_require__('./src/title.js');
        console.log(title);
    },
    "./src/title.js":function(module,exports){
       module.exports = "title";
    }
})
```

## 3. harmony
### 3.1 common.js加载 common.js
#### 3.1.1 index.js
```js
let title = require('./title');
console.log(title.name);
console.log(title.age);
```

#### 3.1.2 title.js
```js
exports.name = 'title_name';
exports.age = 'title_age';
```

#### 3.1.3 bundle.js
```js
{
"./src/index.js":
  (function(module, exports, __webpack_require__) {
    var title = __webpack_require__("./src/title.js");
    console.log(title.name);
    console.log(title.age);
  }),
"./src/title.js":
  (function(module, exports) {
    exports.name = 'title_name';
    exports.age = 'title_age';
  })
}
```

### 3.2 common.js加载 ES6 modules
#### 3.2.1 index.js
```js
let title = require('./title');
console.log(title.name);
console.log(title.age);
```

#### 3.2.2 title.js
```js
exports.name = 'title_name';
exports.age = 'title_age';
```

#### 3.2.3 bundle.js
```js
{
 "./src/index.js":
 (function(module, exports, __webpack_require__) {
    var title = __webpack_require__("./src/title.js");
    console.log(title["default"]);
    console.log(title.age);
 }),
 "./src/title.js":
 (function(module, __webpack_exports__, __webpack_require__) {
    __webpack_require__.r(__webpack_exports__);//__esModule=true
    __webpack_require__.d(__webpack_exports__, "age", function() { return age; });
    __webpack_exports__["default"] = 'title_name';
    var age = 'title_age';
 })
}
```

### 3.3 ES6 modules 加载 ES6 modules
#### 3.3.1 index.js
```js
import name,{age} from './title';
console.log(name);
console.log(age);
```

#### 3.3.2 title.js
```js
export default name  = 'title_name';
export const age = 'title_age';
```

#### 3.3.3 bundle.js
```js
{
 "./src/index.js":
 (function(module, __webpack_exports__, __webpack_require__) {
    __webpack_require__.r(__webpack_exports__);//__esModule=true
    var _title__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/title.js");
    console.log(_title__WEBPACK_IMPORTED_MODULE_0__["default"]);
    console.log(_title__WEBPACK_IMPORTED_MODULE_0__["age"]);
 }),
 "./src/title.js":
 (function(module, __webpack_exports__, __webpack_require__) {
    __webpack_require__.r(__webpack_exports__);//__esModule=true
    __webpack_require__.d(__webpack_exports__, "age", function() { return age; });
    __webpack_exports__["default"] = 'title_name';
    var age = 'title_age';
 })
}
```

### 3.4 ES6 modules 加载 common.js
#### 3.4.1 index.js
```js
import name,{age} from './title';
console.log(name);
console.log(age);
```

#### 3.4.2 title.js
```js
export default name  = 'title_name';
export const age = 'title_age';
```

#### 3.4.3 bundle.js
```js
{
"./src/index.js":
(function(module, __webpack_exports__, __webpack_require__) {
  __webpack_require__.r(__webpack_exports__);//__esModule=true
  /* 兼容common.js导出 */ var _title__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./src/title.js");
  /* 兼容common.js导出 */ var _title__WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(_title__WEBPACK_IMPORTED_MODULE_0__);
  console.log(_title__WEBPACK_IMPORTED_MODULE_0___default.a.name);
  console.log(_title__WEBPACK_IMPORTED_MODULE_0___default.a.age);
}),
"./src/title.js":
(function(module, __webpack_exports__,__webpack_require__) {
  __webpack_exports__.name = 'title_name';
  __webpack_exports__.age = 'title_age';
}),
"./src/title_esm.js":
(function(module, __webpack_exports__,__webpack_require__) {
  __webpack_require__.r(__webpack_exports__);//__esModule=true
  __webpack_exports__.name = 'title_name';
  __webpack_exports__.age = 'title_age';
  __webpack_exports__.default = {name:'default_name',age:'default_age'};
})
}
```

## 4. 异步加载
### 4.1 index.html
```js
<body>
    <script src="entry1.js"></script>
<script>
   setTimeout(function(){
    let script = document.createElement('script');
    script.src = 'entry2.js';
    document.body.appendChild(script);
   },3000);
</script>   
</body>
```
### 4.2 entry1.js
src\index.js
```js
let button = document.createElement("button");
button.innerHTML = "点我1";
button.onclick = function() {
    import(/*webpackChunkName: 'title'*/'./title.js').then(function(result){
        console.log(result.default);
    });
};
document.body.appendChild(button);
```

### 4.3 entry2.js
src\index.js
```js
let button = document.createElement("button");
button.innerHTML = "点我2";
button.onclick = function() {
    import(/*webpackChunkName: 'title'*/'./title.js').then(function(result){
        console.log(result.default);
    });
};
document.body.appendChild(button);

```

### 4.4 title.js
src\title.js
```js
module.exports = 'title';
```

### 4.5 bundle.js
```js
(function(modules) {
 //通过JSONP加载额外的模块
 function webpackJsonpCallback(data) {
	var chunkIds = data[0];//代码块的IDS
	var moreModules = data[1];//额外的模块
  //把moreModules添加到modules对象中，然后把所有的chunkIds设置为已加载并触发callback函数
	var moduleId, chunkId, i = 0, resolves = [];
	for(;i < chunkIds.length; i++) {
		chunkId = chunkIds[i];
		if(Object.prototype.hasOwnProperty.call(installedChunks, chunkId) && installedChunks[chunkId]) {
			resolves.push(installedChunks[chunkId][0]);
		}
		installedChunks[chunkId] = 0;
	}
	for(moduleId in moreModules) {
		if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
			modules[moduleId] = moreModules[moduleId];
		}
	}
	if(parentJsonpFunction) parentJsonpFunction(data);
	while(resolves.length) {
		resolves.shift()();
	}
};

//模块缓存
var installedModules = {};
// 存储加载中和加载过的chunks对象
// 存储加载中和加载过的chunks对象
// chunk undefined(未加载)  null (预加载/预获取) Promise (加载中)  0 加载完成
var installedChunks = {
	"main": 0 //刚开始只加载main
};


//返回要加载的代码块的路径
function jsonpScriptSrc(chunkId) {
	return __webpack_require__.p + "" + chunkId + ".bundle.js"
}

// webpack自已实现的 require方法
function __webpack_require__(moduleId) {
	if(installedModules[moduleId]) {
		return installedModules[moduleId].exports;
	}
	var module = installedModules[moduleId] = {
		i: moduleId,
		l: false,
		exports: {}
	};

	modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

	module.l = true;

	return module.exports;
}

//异步模块加载函数，如果没有再缓存模块中 则用jsonscriptsrc 加载
//此主文件中只包含入口代码块，此函数用来加载额外的代码块
__webpack_require__.e = function requireEnsure(chunkId) {
	var promises = [];
  //JSONP代码块加载
	var installedChunkData = installedChunks[chunkId];
	if(installedChunkData !== 0) { //0表示已经安装
		//如果是一个Promise表示正在安装或加载,添加到promises数组中
		if(installedChunkData) {
			promises.push(installedChunkData[2]);
		} else {//否则就是未加载
			//在chunk缓存中设置Promise
			var promise = new Promise(function(resolve, reject) {
				installedChunkData = installedChunks[chunkId] = [resolve, reject];
			});
			promises.push(installedChunkData[2] = promise);

			//开始加载代码块
			var script = document.createElement('script');
			var onScriptComplete;

			script.charset = 'utf-8';
			script.timeout = 120;
      //表明脚本需要安全加载 CSP 策略
			if (__webpack_require__.nc) {
				script.setAttribute("nonce", __webpack_require__.nc);
			}
			script.src = jsonpScriptSrc(chunkId);

			// create error before stack unwound to get useful stacktrace later
			var error = new Error();
			onScriptComplete = function (event) {
				// avoid mem leaks in IE.
				script.onerror = script.onload = null;
				clearTimeout(timeout);
				var chunk = installedChunks[chunkId];
				if(chunk !== 0) {
					if(chunk) {
						var errorType = event && (event.type === 'load' ? 'missing' : event.type);
						var realSrc = event && event.target && event.target.src;
						error.message = 'Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
						error.name = 'ChunkLoadError';
						error.type = errorType;
						error.request = realSrc;
						chunk[1](error);
					}
					installedChunks[chunkId] = undefined;
				}
			};
			var timeout = setTimeout(function(){
				onScriptComplete({ type: 'timeout', target: script });
			}, 120000);
			script.onerror = script.onload = onScriptComplete;
			document.head.appendChild(script);
		}
	}
	return Promise.all(promises);
};

// 所有构建生成的模块
__webpack_require__.m = modules;

// expose the module cache
__webpack_require__.c = installedModules;

// 设定getter 辅助函数
__webpack_require__.d = function(exports, name, getter) {
	if(!__webpack_require__.o(exports, name)) {
		Object.defineProperty(exports, name, { enumerable: true, get: getter });
	}
};

// 给exports设定__esModule属性
__webpack_require__.r = function(exports) {
	if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
		Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
	}
	Object.defineProperty(exports, '__esModule', { value: true });
};

// 用于取值，伪造namespace
// mode & 1: 值是一个模块ID，加载它
// mode & 2: 把value所有的属性合并到ns上
// mode & 4: 如果ns对象已经是一个对象了，则返回值
// mode & 8|1: 类似于require
__webpack_require__.t = function(value, mode) {
	if(mode & 1) value = __webpack_require__(value);
	if(mode & 8) return value;
	if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
	var ns = Object.create(null);
	__webpack_require__.r(ns);
	Object.defineProperty(ns, 'default', { enumerable: true, value: value });
	if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
	return ns;
};

//用于兼容性取值（es module 取default， 非es module 直接返回module)
__webpack_require__.n = function(module) {
	var getter = module && module.__esModule ?
		function getDefault() { return module['default']; } :
		function getModuleExports() { return module; };
	__webpack_require__.d(getter, 'a', getter);
	return getter;
};

// 辅助函数 Object.prototype.hasOwnProperty.call
__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

//公共路径，为所有资源指定一个基础路径
__webpack_require__.p = "";

// 异步加载失败处理函数 辅助函数
__webpack_require__.oe = function(err) { console.error(err); throw err; };
//获取全局的webpackJsonp函数,第一次执行此函数就是一个空的数组
var jsonpArray = window["webpackJsonp"] = window["webpackJsonp"] || [];
//在替换其push函数之前会将原有的push方法保存为oldJsonpFunction,同时
var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
//把jsonpArray的push等于当前的webpackJsonpCallback
jsonpArray.push = webpackJsonpCallback;
//把数组克隆一份
jsonpArray = jsonpArray.slice();
//循环这个数组，把数组中的所有的元素传给webpackJsonpCallback
//如果把以前懒加载过的模块在自己身上安装一下，就不用再异步加载了
for(var i = 0; i < jsonpArray.length; i++) 
   webpackJsonpCallback(jsonpArray[i]);
//把上一个oldJsonpFunction赋给parentJsonpFunction,第一次的时候就是push方法
var parentJsonpFunction = oldJsonpFunction;
//加载入口模块并返回exports导出对象
return __webpack_require__(__webpack_require__.s = "./src/index.js");
})
({
"./src/index.js":
(function(module, exports, __webpack_require__) {

var button = document.createElement("button");
button.innerHTML = "点我";

button.onclick = function () {
  __webpack_require__.e(/*! import() | title */ "title").then(__webpack_require__.t.bind(null, /*! ./title.js */ "./src/title.js", 7)).then(function (result) {
    console.log(result["default"]);
  });
};
document.body.appendChild(button);
})
});
```

### 4.6 title.bundle.js
```js
(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["title"],{
"./src/title.js":
  (function(module, exports) {
    module.exports = 'title';
  })
}]);
```

### 4.7 实现bundle.js
```js
(function(modules) {
   function webpackJsonpCallback(data) {
    var chunkIds = data[0];
    var moreModules = data[1];
    var moduleId,chunkId,i = 0,resolves = [];
    for (; i < chunkIds.length; i++) {
        chunkId = chunkIds[i];
        if (installedChunks[chunkId]) {
          resolves.push(installedChunks[chunkId][0]);
        }
        installedChunks[chunkId] = 0;
    }
    for (moduleId in moreModules) {
      modules[moduleId] = moreModules[moduleId];
    }
    if (parentJsonpFunction) parentJsonpFunction(data);
    while (resolves.length) {
      resolves.shift()();
    }
   }
   var installedModules = {};
   var installedChunks = {main: 0};
   __webpack_require__.p="";
   function jsonpScriptSrc(chunkId) {
     return __webpack_require__.p + "" + chunkId + ".bundle.js";
   }
   function __webpack_require__(moduleId) {
    if (installedModules[moduleId]) {
      return installedModules[moduleId].exports;
    }
    var module = (installedModules[moduleId] = {i: moduleId,l: false,exports: {}});
    modules[moduleId].call(module.exports,module,module.exports,__webpack_require__);
    module.l = true;
    return module.exports;
  }
  __webpack_require__.t = function(value, mode) {
      value = __webpack_require__(value);
      var ns = Object.create(null);
      Object.defineProperty(ns, "__esModule", { value: true });
      Object.defineProperty(ns, "default", { enumerable: true, value: value });
      return ns;
  };

  __webpack_require__.e = function requireEnsure(chunkId) {
      var promises = [];
      var installedChunkData = installedChunks[chunkId];
      var promise = new Promise(function(resolve, reject) {
          installedChunkData = installedChunks[chunkId] = [resolve, reject];
      });
      promises.push((installedChunkData[2] = promise));
      var script = document.createElement("script");
      script.src = jsonpScriptSrc(chunkId);
      document.head.appendChild(script);
      return Promise.all(promises);
  }
  var jsonpArray = (window["webpackJsonp"] = window["webpackJsonp"] || []);
  var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
  jsonpArray.push = webpackJsonpCallback;
  var parentJsonpFunction = oldJsonpFunction;
  return __webpack_require__((__webpack_require__.s = "./src/index.js"));
})({
  "./src/index.js": function(module, exports, __webpack_require__) {
    let button = document.createElement("button");
    button.innerHTML = "点我1";
    button.onclick = function() {
        __webpack_require__.e("title").then(
        __webpack_require__.t.bind(null,"./src/title.js",7)
        ).then(function(result) {
          console.log(result.default);
        });
    };
    document.body.appendChild(button);
  }
});
```