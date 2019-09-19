const path = require('path');
const MyPlugin = require('./plugins/MyPlugin');
module.exports = {
    context:process.cwd(),//默认是我们的工作目录
    mode:'development',
    devtool:'none',
    entry:'./src/index.js',
    entry:{
        main:'./src/index.js'
    },
    output:{
        path:path.resolve(__dirname,'dist'),
        filename:'bundle.js'
    },
    module:{
        rules:[]
    },
    plugins:[
        new MyPlugin()
    ]   
}