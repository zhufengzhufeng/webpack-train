# 从0搭建自己的webpack开发环境
## 1.什么是Webpack？
webpack 是一个现代 JavaScript 应用程序的静态模块打包器(module bundler),当 webpack 处理应用程序时，它会递归地构建一个依赖关系图(dependency graph)，其中包含应用程序需要的每个模块，然后将所有这些模块打包成一个或多个 bundle
![](http://img.zhufengpeixun.cn/webpack.jpeg)

使用Webpack作为前端构建工具：
- 代码转换：TypeScript 编译成 JavaScript、SCSS 编译成 CSS 等。
- 文件优化：压缩 JavaScript、CSS、HTML 代码，压缩合并图片等。
- 代码分割：提取多个页面的公共代码、提取首屏不需要执行部分的代码让其异步加载。
- 模块合并：在采用模块化的项目里会有很多个模块和文件，需要构建功能把模块分类合并成一个文件。
- 自动刷新：监听本地源代码的变化，自动重新构建、刷新浏览器。
- 代码校验：在代码被提交到仓库前需要校验代码是否符合规范，以及单元测试是否通过。
- 自动发布：更新完代码后，自动构建出线上发布代码并传输给发布系统。

**在`webpack`应用中有两个核心**:

- 1) 模块转换器，用于把模块原内容按照需求转换成新内容，可以加载非 JS 模块
- 2) 扩展插件，在 Webpack 构建流程中的特定时机注入扩展逻辑来改变构建结果或做你想要的事情。

## 2.初始化项目
```bash
├── src   # 源码目录
│   ├── a-module.js
│   └── index.js
```
编写 *a-module.js*
```javascript
module.exports = 'hello';
```

编写 *index.js* 
```javascript
let a = require('./a-module');
console.log(a);
```

> 这里我们使用`CommonJS`模块的方式引入，这种方式默认在浏览器上是无法运行的，我们希望通过 `webpack` 来进行打包！


## 3.webpack快速上手
### 3.1 安装
```bash
npm init -y
npm install webpack webpack-cli --save-dev 
```

`webpack`默认支持0配置,配置`scripts`脚本

```json
"scripts": {
  "build": "webpack"
}
```

执行`npm run build`,默认会调用 `node_modules/.bin`下的`webpack`命令，内部会调用`webpack-cli`解析用户参数进行打包。默认会以 `src/index.js` 作为入口文件。

> 这里也可以使用`npx webpack`,`npx` 是 5.2版本之后`npm`提供的命令可以执行`.bin`下的可执行文件


![](http://img.fullstackjavascript.cn/webpack1.png)


我们可以发现已经产生了`dist`目录，此目录为最终打包出的结果。`main.js`可以在html中直接引用,这里还提示我们默认`mode` 为`production`

### 3.2 webpack.config.js
我们打包时一般不会采用0配置，`webpack`在打包时默认会查找当前目录下的 `webpack.config.js or webpackfile.js` 文件。

通过配置文件进行打包

```javascript
const path = require('path');
module.exports = {
    entry:'./src/index.js',
    output:{
        filename:'bundle.js', // 打包出的结果文件
        path:path.resolve(__dirname,'dist') // 打包到dist目录下
    }
}
```

### 3.3 配置打包的mode
我们需要在打包时提供`mode`属性来区分是开发环境还是生产环境,来实现配置文件的拆分

```bash
├── build
│   ├── webpack.base.js
│   ├── webpack.dev.js
│   └── webpack.prod.js
```

**我们可以通过指定不同的文件来进行打包**

配置`scripts`脚本
```json
"scripts": {
  "build": "webpack --config ./build/webpack.prod",
  "dev": "webpack --config ./build/webpack.dev"
}
```

可以通过 `config` 参数指定,使用哪个配置文件来进行打包 

**通过env参数区分**

```json
"scripts": {
    "build": "webpack --env.production --config ./build/webpack.base",
    "dev": "webpack --env.development --config ./build/webpack.base"
}
```

改造`webpack.base`文件默认导出函数，会将环境变量传入到函数的参数中
```javascript
module.exports = (env)=>{
    console.log(env); // { development: true }
}
```

**合并配置文件**

我们可以判断当前环境是否是开发环境来加载不同的配置,这里我们需要做配置合并   
安装`webpack-merge`:
```bash
npm install webpack-merge --save-dev
```

`webpack.dev`配置
```javascript
module.exports = {
    mode:'development'
}
```
`webpack.prod`配置
```javascript
module.exports = {
    mode:'production'
}
```
`webpack.base`配置
```javascript
const path = require('path');
const merge = require('webpack-merge');
// 开发环境
const dev = require('./webpack.dev');
// 生产环境
const prod = require('./webpack.prod');
const base = { // 基础配置
    entry:'./src/index.js',
    output:{
        filename:'bundle.js',
        path:path.resolve(__dirname,'../dist')
    }
}
module.exports = (env) =>{
    if(env.development){
        return merge(base,dev);
    }else{
        return merge(base,prod)
    }
}
```

后续的开发中，我们会将公共的逻辑放到`base`中,开发和生产对的配置也分别进行存放！

## 4.webpack-dev-server
配置开发服务器，可以在实现在内存中打包,并且自动启动服务
```bash
npm install webpack-dev-server --save-dev
```

```json
"scripts": {
    "build": "webpack --env.production --config ./build/webpack.base",
    "dev": "webpack-dev-server --env.development --config ./build/webpack.base"
}
```

通过执行`npm run dev`来启启动开发环境

![](http://img.fullstackjavascript.cn/webpack2.png)

默认会在当前根目录下启动服务

**配置开发服务的配置**
```javascript
const path = require('path')
module.exports = {
    mode:'development',
    devServer:{
        // 更改静态文件目录位置
        contentBase:path.resolve(__dirname,'../dist'),
        compress:true, // 开启gzip
        port:3000, // 更改端口号
    }
}
```

## 5.打包Html插件

### 5.1 单入口打包
自动产生html，并引入打包后的文件

编辑`webpack.base`文件
```javascript

const HtmlWebpackPlugin = require('html-webpack-plugin');
plugins:[
    new HtmlWebpackPlugin({
        filename:'index.html', // 打包出来的文件名
        template:path.resolve(__dirname,'../public/index.html'),
        hash:true, // 在引用资源的后面增加hash戳
        minify:{
            removeAttributeQuotes:true // 删除属性双引号
        }
    })
]
```

### 5.2 多入口打包
根据不同入口 生成多个js文件，引入到不同html中
```bash
── src
    ├── entry-1.js
    └── entry-2.js
```

多入口需要配置多个entry
```javascript
entry:{
    jquery:['jquery'], // 打包jquery
    entry1:path.resolve(__dirname,'../src/entry-1.js'),
    entry2:path.resolve(__dirname,'../src/entry-2.js')
},
output:{
    filename:'[name].js',
    path:path.resolve(__dirname,'../dist')
},
```
产生多个Html文件
```javascript
new HtmlWebpackPlugin({
    filename:'index.html', 
    template:path.resolve(__dirname,'../public/template.html'),
    hash:true, 
    minify:{
        removeAttributeQuotes:true
    },
    chunks:['jquery','entry1'], // 引入的chunk 有jquery,entry
}),
new HtmlWebpackPlugin({
    filename:'login.html',
    template:path.resolve(__dirname,'../public/template.html'),
    hash:true,
    minify:{
        removeAttributeQuotes:true
    },
    inject:false, // inject 为false表示不注入js文件
    chunksSortMode:'manual', // 手动配置代码块顺序
    chunks:['entry2','jquery']
})
```

以上的方式不是很优雅，每次都需要手动添加`HtmlPlugin`应该动态产生`html`文件，像这样:
```javascript
let htmlPlugins = [
  {
    entry: "entry1",
    html: "index.html"
  },
  {
    entry: "entry2",
    html: "login.html"
  }
].map(
  item =>
    new HtmlWebpackPlugin({
      filename: item.html,
      template: path.resolve(__dirname, "../public/template.html"),
      hash: true,
      minify: {
        removeAttributeQuotes: true
      },
      chunks: ["jquery", item.entry]
    })
);
plugins: [...htmlPlugins]
```




## 6.清空打包结果
可以使用`clean-webpack-plugin`手动清除某个文件夹内容:

**安装**
```bash
npm install --save-dev clean-webpack-plugin
```

```javascript
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
new CleanWebpackPlugin({
    // 清空匹配的路径
    cleanOnceBeforeBuildPatterns: [path.resolve('xxxx/*'),'**/*'],
})
```

这样就可以清空指定的目录了,我们可以看到`webpack`插件的基本用法就是 `new Plugin`并且放到`plugins`中



