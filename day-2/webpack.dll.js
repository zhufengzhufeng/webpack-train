const path = require('path');
const DLLPlugin = require('webpack').DllPlugin
// 需要产生一个缓存列表
module.exports = {
    mode:'development',
    entry:['react','react-dom'], // add minus
    output:{
        library:'react', // 打包后接收自执行函数的名字叫calc
        // libraryTarget:'commonjs2', // 默认用var 模式  umd this var commonjs commonjs2
        filename:'react.dll.js',
        path:path.resolve(__dirname,'dll')
    },
    plugins:[
        new DLLPlugin({
            name:'react',
            path:path.resolve(__dirname,'dll/manifest.json')
        })
    ]
}


// 目前是为了将calc 打包成node可以使用的模块
// dll 可以用作生产环境

// 我本地使用了import React 语法 需要先去 manifest.json查找，找到后会加载对应的库的名字,可能会引用某个模块,会去dll.js文件中查找