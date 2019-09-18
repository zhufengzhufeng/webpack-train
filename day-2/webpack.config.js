const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const glob = require("glob"); // 主要功能就是查找匹配的文件
// 主要的作用删除无意义的css，只能配合 mini-css-extract-plugin
const PurgeCssWebpackPlugin = require("purgecss-webpack-plugin");
const AddCdnPlguin = require("add-asset-html-cdn-webpack-plugin");
const DLLReferencePlugin = require("webpack").DllReferencePlugin;
const AddAssetHtmlPlugin = require("add-asset-html-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const SpeedMeasureWebpackPlugin = require('speed-measure-webpack-plugin');
// 写个循环
const smw = new SpeedMeasureWebpackPlugin();

// ts-loader @babel/preset-react
module.exports = env => {
  return smw.wrap({
    mode: env,
    // entry 有三种写法 字符串  数组  对象
    entry: {
      a: "./src/a.js",
      b: "./src/b.js"
    },
    // 在生产环境下 将第三方模块进行抽离

    optimization: {
      splitChunks: {
          // inital 只操作同步的 all 所有的 async 异步的
        chunks: "all", // 默认支持异步的代码分割 import()
        minSize: 30000, // 文件超过30k 我就会抽离他
        maxSize: 0,
        minChunks: 1, // 最少模块引用一次才抽离
        maxAsyncRequests: 5, // 最多5个请求
        maxInitialRequests: 3, // 最多首屏加载3个请求
        automaticNameDelimiter: "~", // xxx~a~b
        automaticNameMaxLength: 30, // 最长名字打大小
        name: true,
        cacheGroups: { // 缓存组
        react: {
            test: /[\\/]node_modules[\\/](jquery)|(lodash)/,
            priority: -2
        },
          react: {
            test: /[\\/]node_modules[\\/](react)|(react-dom)/,
            priority: -2
          },
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10
          },
          commons: { // common~a~b
            minChunks: 2,
            minSize:1, // 如果公共代码 多一个字节就抽离
            priority: -20,
            reuseExistingChunk: true
          }
        }
      }
    },

    // entry:'./src/index.js', // 入口
    output: {
      // 出口
      filename: "[name].js", // 同步打包的名字
    //   chunkFilename: "[name].min.js",
      path: path.resolve(__dirname, "dist") // 出口必须是绝对路径 都用绝对
    },
    // externals:{
    //     'jquery':'$' // 不去打包代码中的jquery
    // },
    module: {
      rules: [
        {
          test: /\.js/,
          use: {
            loader: "babel-loader",
            options: {
              // .babelrc
              presets: ["@babel/preset-env", "@babel/preset-react"]
            }
          }
        },
        {
          // 降低分辨率 清晰度
          test: /\.(jpe?g|png|gif)/,
          use: [
            {
              loader: "file-loader"
            },
            env !== "development" && {
              // 可以在使用file-loader之前 对图片进行压缩
              loader: "image-webpack-loader",
              options: {
                mozjpeg: {
                  progressive: true,
                  quality: 65
                },
                // optipng.enabled: false will disable optipng
                optipng: {
                  enabled: false
                },
                pngquant: {
                  quality: [0.65, 0.9],
                  speed: 4
                },
                gifsicle: {
                  interlaced: false
                },
                // the webp option will enable WEBP
                webp: {
                  quality: 75
                }
              }
            }
          ].filter(Boolean)
        },
        {
          test: /\.css$/,
          use: [
            // link
            env !== "development"
              ? MiniCssExtractPlugin.loader
              : "style-loader",
            "css-loader"
          ]
        }
      ]
    },
    // optimization:{
    //     usedExports:true // 使用了哪个模块你和我说一下
    // },
    plugins: [
      env !== "development" && new MiniCssExtractPlugin(),
      new HtmlWebpackPlugin({
        template: "./src/index.html",
        filename: "index.html"
        // chunks:['a']
      }),
      // vue-cli 怎么配置 mpa  cli官方 pages
      // new HtmlWebpackPlugin({
      //     template:'./src/index.html',
      //     filename:'login.html',
      //     chunksSortMode:'manual', // 手动按照我的顺序来执行
      //     chunks:['b','a'] // 打包的顺序 按照我自己排列的
      // }),
      new PurgeCssWebpackPlugin({
        paths: glob.sync("./src/**/*", { nodir: true })
      }),
      // 打包的时候 会配置 cleanwebpackplugin
    //   new DLLReferencePlugin({
    //     manifest: path.resolve(__dirname, "dll/manifest.json")
    //   }),
    //   new AddAssetHtmlPlugin({
    //     filepath: path.resolve(__dirname, "./dll/react.dll.js")
    //   }),
      env !== "development" && new BundleAnalyzerPlugin()
      // 当前这个dll.js没有在页面中引用
      // 添加cdn的插件
      // 分割代码
      // new AddCdnPlguin(true,{
      //     'jquery':'https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js'
      // })
    ].filter(Boolean)
  });
};

// 一般我们会用到开发 环境上  dll插件

// 9月22日开课了
// 周三 周五 晚上 8-10  周日全天

// 周二 周四 周六


// 如果本期 想参加 架构课同学 可以找客服老师报名 
// 开班时间 9.22日 周三周五晚上 8 - 10 周日 全天

// 新增了很多内容  团购有优惠