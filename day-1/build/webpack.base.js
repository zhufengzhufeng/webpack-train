const dev = require("./webpack.dev");
const prod = require("./webpack.prod");
const path = require("path");
const merge = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin')
module.exports = env => {
  // env 是环境变量
  let isDev = env.development;
  const base = {
    entry: path.resolve(__dirname, "../src/index.ts"),
    module: {
      // 转化什么文件 用什么去转，使用哪些loader
      // loader 写法 [] / {} ''
      // 打包css 还需要处理一下 样式前缀

      // 解析的css的时候 就不能渲染dom
      // css 可以并行和js 一同加载 mini-css-extract-plugin
      rules: [
        {
          test:/\.vue$/,
          use:'vue-loader'
        },
        { // 解析js文件 默认会调用@babel/core 
          test:/\.tsx?$/,
          use:'babel-loader'
        },
          { // 解析js文件 默认会调用@babel/core 
            test:/\.js$/,
            use:'babel-loader'
          },
        {
          test: /\.css$/,
          use: [ // 是不是开发环境 如果是就用style-loader
            isDev?"style-loader":MiniCssExtractPlugin.loader,
            {
              loader: "css-loader",
              options: {
                // 给loader传递参数
                // 如果css文件引入其他文件@import
                importLoaders: 2
              }
            },
            "postcss-loader",
            "sass-loader"
          ]
        },

        {
          // 匹配到scss结尾的使用sass-loader 来调用node-sass处理sass文件
          test: /\.scss$/,
          use: ["style-loader", "css-loader", "sass-loader"]
        },
        { // 图标的转化
            test:/\.(woff|ttf|eot)$/,
            use:'file-loader'
        },
        { // 图片的转化
            test:/\.(jpe?g|png|gif|svg)$/,
            use:{
                loader:'url-loader',
                // 如果大于100k的图片 会使用file-loader
                options:{
                    name:"image/[contentHash].[ext]",
                    limit:1024
                }
            } // file-loader 默认的功能是拷贝的作用
            // 我希望当前比较小的图片可以转化成 base64 比以前大，好处就是不用发送http请求
        }
      ]
    },
    output: {
      filename: "bundle.js",
      path: path.resolve(__dirname, "../dist")
    },
    plugins: [
      // 在每次打包之前 先清除dist目录下的文件
      !isDev && new MiniCssExtractPlugin({ // 如果是开发模式就不要使用抽离样式的插件
        filename:'css/main.css'
      }),
      new VueLoaderPlugin(),
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, "../public/index.html"),
        filename: "index.html",
        minify: !isDev && {
          removeAttributeQuotes: true,
          collapseWhitespace: true
        }
      })
    ].filter(Boolean)
  };
  // 函数要返回配置文件，没返回会采用默认配置
  if (isDev) {
    return merge(base, dev); // 循环后面的配置 定义到前面去
  } else {
    return merge(base, prod);
  }
};
