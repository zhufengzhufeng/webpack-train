(function(modules) {
   var installedModules  = {};
   var installedChunks = {main:0}
   function webpackJsonpCallback(data){
       let chunkIds = data[0];//title
       let moreModules = data[1];
       let resolves = [];
       for(let i=0;i<chunkIds.length;i++){
           let chunkId = chunkIds[i];
           resolves.push(installedChunks[chunkId][0]);//installedChunks[chunkId]=[resovle,reject,promise]
           installedChunks[chunkId]=0;//0表示已经加载成功
       }
       for(let moduleId in moreModules){
          modules[moduleId]=moreModules[moduleId];
       }
       //[resolve1,resolve2,resolve3]
       while(resolves.length){//数组的shift方法表示取出第一个元素[1,2,3] 1 2 3
           resolves.shift()();
       }
       if(parentJsonFunction){
           //虽然我把数组的push方法重写了，但是老的数组的push方法也保留在parentJsonFunction
          parentJsonFunction(data);//[].push(data);如果不bind的话，data不会放到数组里
       }
   }
   function __webpack_require__(moduleId){
       if(installedModules[moduleId]){
           return installedModules[moduleId];
       }
       var module = installedModules[moduleId] = {
           i:moduleId,
           l:false,
           exports:{}
       }
       modules[moduleId].call(module.exports,module, module.exports, __webpack_require__);
       module.l = true;
       return module.exports;
   }
   //mode为什么要用二进制来判断,linux 权限7 111 可读可写可执行
   __webpack_require__.t = function(value,mode){//7 1+2+4 对应二进制111
     value = __webpack_require__(value);//title字符串
     let ns = Object.create(null);
     Object.defineProperty(ns, '__esModule', { value: true });//表示这是一个esmodules
     Object.defineProperty(ns, 'default', { value });
     return ns;//{__esModule:true,default:'title'}
   }
   __webpack_require__.e = function(chunkId){//title
    //let promises = [];//声明一个promise
    var installChunkData = installedChunks[chunkId];//取得老的代码块数据 undefined
    let promise = new Promise(function(resolve,reject){
        installChunkData = installedChunks[chunkId] = [resolve,reject];
    });//如果调用了resolve方法，则此promise会变成成功态
    installChunkData[2]= promise;//installChunkData=[resolve,reject,promise]
    var script = document.createElement('script');//创建一个脚本
    script.src = chunkId+'.bundle.js';//title.bundle.js
    document.head.appendChild(script);
    //return Promise.all(promises);
    return promise;
   }
   var jsonArray = (window["webpackJsonp"]=window["webpackJsonp"]||[]);
   //jsonArray=window["webpackJsonp"]=[];
   var oldJsonpFunction = jsonArray.push.bind(jsonArray);
   //重写了jsonArray的push方法，重新赋值为webpackJsonpCallback
   jsonArray.push = webpackJsonpCallback;
   jsonpArray = jsonpArray.slice();
   for(var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
   var parentJsonFunction = oldJsonpFunction;//老数组的push方法
   return __webpack_require__("./src/index.js"); 
})({
  "./src/index.js": function(module, exports, __webpack_require__) {
    let button = document.createElement("button");
    button.innerHTML = "请点我";
    button.addEventListener("click", () => {
      __webpack_require__
        .e("title")
        .then(__webpack_require__.t.bind(null,"./src/title.js",7))//t 保证result肯定是一个地象，而且 有title属性
        .then(result => {//{__esModule:true,default:'title'}
          console.log(result.default);
        });
    });
    document.body.appendChild(button);
  }
});
//为什么要保留老数组的push啊
