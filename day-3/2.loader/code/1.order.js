/**
 inline normal pre post
 eslint 代码风格检查 一般用于前置
 */
let path = require("path");
//正常情况下module的查找路径
let nodeModules = path.resolve(__dirname, "node_modules");
//require('-!inline-loader1!inline-loader2!./style.css');
let request = "-!inline-loader1!inline-loader2!./style.css";
let rules = [
  { test: /\.css$/, enforce: "pre", use: ["pre-loader1", "pre-loader2"] },
  { test: /\.css$/, use: ["normal-loader1", "normal-loader2"] },
  { test: /\.css$/, enforce: "post", use: ["post-loader1", "post-loader2"] }
];
let resolveLoader = loader => path.resolve(nodeModules, loader + ".js");
//不要pre和普通 loader 只剩下 inline+post
const noPreAutoLoaders = request.startsWith("-!");
//不要普通loaders
const noAutoLoaders = noPreAutoLoaders || request.startsWith("!");
//不要pre post 普通 ，只剩下inline
const noPrePostAutoLoaders = request.startsWith("!!");
let inlineLoaders = request
  .replace(/^-?!+/, "")
  .replace(/!!+/g, "!")
  .split("!"); //[inline-loader1,inline-loader2,./style.css]
let resource = inlineLoaders.pop(); //./style.css
//经过这个映射，是把一个loader模块名变成一个绝对路径数组
//inlineLoaders = inlineLoaders.map(resolveLoader);
let preLoaders = [];
let postLoaders = [];
let normalLoaders = [];
for (let i = 0; i < rules.length; i++) {
  let rule = rules[i];
  if (rule.test.test(resource)) {
    if (rule.enforce == "pre") {
      preLoaders.push(...rule.use);
    } else if (rule.enforce == "post") {
      postLoaders.push(...rule.use);
    } else {
      normalLoaders.push(...rule.use);
    }
  }
}
let loaders;

if (noPrePostAutoLoaders) {
  loaders = [...inlineLoaders];
} else if (noPreAutoLoaders) {
  loaders = [...postLoaders, ...inlineLoaders];
} else if (noAutoLoaders) {
  loaders = [...postLoaders, ...inlineLoaders, ...preLoaders];
} else {
  loaders = [...postLoaders, ...inlineLoaders, ...normalLoaders, ...preLoaders];
}
loaders = loaders.map(resolveLoader);
console.log(loaders);
