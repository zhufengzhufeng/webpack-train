const path = require('path');
const MyPlugin = require('./plugins/MyPlugin');
module.exports = {
    context:process.cwd(),//默认是我们的工作目录
    mode:'development',
    devtool:'none',
    entry:{
        entry1:'./src/entry1.js',
        entry2:'./src/entry2.js'
    },
    output:{
        path:path.resolve(__dirname,'dist'),
        filename:'[name].js'
    },
    module:{
        rules:[]
    },
    plugins:[
        new MyPlugin()
    ]   
}