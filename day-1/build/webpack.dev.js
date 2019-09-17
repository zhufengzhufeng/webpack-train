const path = require('path');
module.exports = {
    mode:'development',
    devServer:{ // 开发服务的配置 
        port:4000,
        compress:true,// gzip 可以提升返回页面的速度
        contentBase:path.resolve(__dirname,'../dist') // webpack启动服务会在dist目录下
    }
}