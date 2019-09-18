// 需要实现多入口
// 抽离第三方模块 1）不要和业务逻辑放在一起  2) 增加缓存 304
// jq
// index.html a.js 
// login.html b.js 







// 动态加载文件
// import {add} from './calc';
// let button = document.createElement('button');

// button.addEventListener('click',()=>{
//     // 动态导入 类比 路由的懒加载 import语法

//     // 会使用jsonp动态加载calc的文件
//     // import 可以实现代码分割
//     // 原理就是jsonp动态导入
//     import(/* webpackChunkName:'video' */'./calc').then(data=>{
//         console.log(data.add(1,2));
//     })
// })
// button.innerHTML = '点我'

// document.body.appendChild(button);







// import React from 'react';
// import {render} from 'react-dom';


// 面试中最长问的就是优化

// render(<h1>hello1</h1>,document.getElementById('root'))

// import $ from 'jquery'; // 这个文件应该是cdn加载进来的
// console.log($); 
// tree-shaking 默认只支持 es6语法的 d 静态导入
// 只在生产环境下使用 
// import {minus} from './calc';
// // 如果引入的变量没有使用就删除
// import test from './test';// 副作用的代码 可能开发时 是无意义的

// import  './style.css'; // 如果引入css 文件需要增加他不是副作用 否则会被tree-shaking掉
// console.log(minus(1,2))


// webpack配置 1） 打包大小  2） 打包速度 3） 模块拆分

// import d from './d';
// console.log(d);
// 每个模块都是个函数 会导致内存过大

// scope hoisting

// export export default ?



// dllPlugin动态链接库
// react + react-dom 先打包好 放在那


// 怎么打包第三库
// dll功能在开发之前 就先抽离好 打好包 ，以后不用打包了