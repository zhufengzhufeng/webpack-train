let fs = require('fs');
let path = require('path');
function createLoaderObject(loader){
    let loaderObj = {data:{}};
    loaderObj.request = loader;//loader文件的绝地路径 
    loaderObj.normal = require(loader);
    loaderObj.pitch = loaderObj.normal.pitch;
    return loaderObj;
}
function runLoaders(options,callback){
    let loaderContext = {};//这个对象将会成为loader函数中的this
    let resource = options.resource;//要加载的资源 index.js 
    let loaders = options.loaders;//[loader1,loader2,loader3]
    loaders = loaders.map(createLoaderObject);//[{normal,pitch},{normal,pitch}]
    loaderContext.loaderIndex = 0;//当前的索引
    loaderContext.readResource = fs;//读文件模块
    loaderContext.resource = resource;//index.js 
    loaderContext.loaders = loaders;//[{normal,pitch},{normal,pitch}]
    iteratePitchingLoaders(loaderContext,callback);
    function processResource(loaderContext,callback){
        let buffer = loaderContext.readResource.readFileSync(loaderContext.resource,'utf8');
        loaderContext.loaderIndex--;
        iterateNormalLoaders(loaderContext,buffer,callback);
    }
    function iterateNormalLoaders(loaderContext,args,callback){
        if(loaderContext.loaderIndex<0){
            return callback(null,args);
        }
        debugger;
         let currentLoaderObject = loaderContext.loaders[loaderContext.loaderIndex];
         let normalFn = currentLoaderObject.normal;
         let result = normalFn.call(loaderContext,args);
         loaderContext.loaderIndex--;
         iterateNormalLoaders(loaderContext,result,callback);
    }
    function iteratePitchingLoaders(loaderContext,callback){
         if(loaderContext.loaderIndex>=loaderContext.loaders.length){
            return processResource(loaderContext,callback);
         }
         let currentLoaderObject = loaderContext.loaders[loaderContext.loaderIndex];
         let pitchFn = currentLoaderObject.pitch;
         if(!pitchFn){
              loaderContext.loaderIndex++;
              return iteratePitchingLoaders(loaderContext,callback);
         }
         let result = pitchFn.apply(loaderContext);
         if(result){//如果有返回值就需要反转了
               loaderContext.loaderIndex--;
               iterateNormalLoaders(loaderContext,result,callback);
         }else{
              loaderContext.loaderIndex++;
              iteratePitchingLoaders(loaderContext,callback);
         }
    }
}
let entry = './src/index.js';
let options = {
    resource:path.resolve(__dirname,entry),
    loaders:[
        path.resolve(__dirname,'loaders/loader1.js'),
        path.resolve(__dirname,'loaders/loader2.js'),
        path.resolve(__dirname,'loaders/loader3.js')
    ]
}

runLoaders(options, (err,result)=>{
    console.log('执行完毕');
    console.log(result);// loader2pitch//1
});