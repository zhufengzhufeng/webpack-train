// webpack 默认支持 模块的写法 commonjs 规范 node  
// webpack-cli 解析用户传递的参数
// es6 规范 esmodule
// 把这个模块打包 解析出浏览器可以识别的代码



// webpack webpack-cli 0配置的方式来打包
// --save-dev

// npx npm 5.2之后出来的 npx webpack
// 两个模式 开发模式 生产环境
// --mode 传入

// npm run scripts 里面可以配置对应的命令


// webpack配置文件默认叫 webpack.config.js webpack.file.js

// 通过--config 指定执行的文件是哪一个
    // 1) 就是默认引用base 传入模式
    // 2) 分别引入 dev,prod,在特定地方引入base



// webpack-merge 主要用来合并配置文件的

// 如果是开发环境 要使用webpack-dev-server 
// webpack-dev-server 是在内存中打包的 不会产生实体文件

// 自动生成html文件并且引入打包后的js内容


// loader 的执行顺序 默认是从下往上执行 从右边向左边

// 先解析css
// css-loader 会解析css语法  style-loader 会将解析的css 变成style标签插入到页面中
// 解析css 需要两个loader css-loader style-loader

// 预处理器 .scss node-sass sass-loader
//         .less less     less-loader 
//         .stylus stylus stylus-loader

// 图片 + icon

// js
es6-es5 有些api 不是es6语法  装饰器 类的属性

babel 转化功能 vue-cli 基于babel6来实现的
babel7

默认会调用 @babel/core会转化代码，转化的时候需要用 @babel/presets-env 转化成es5
@babel/core @babel/preset-env  babel-loader



// react + vue