let fs = require('fs');
let path = require('path');
let ejs = require('ejs');
const babylon = require('babylon');
let types = require('babel-types');
let generate = require('babel-generator').default;
let traverse = require('babel-traverse').default;
class NormalModule{
    constructor({name,context,request}){
        this.name = name;
        this.context = context;
        this.request = request;//request就是模块的绝对路径
        this.dependencies = [];//这里放的是依赖的模块数组
        this.moduleId;//模块ID
        this._ast;//本模块的抽象语法树AST
        this._source;//源码
    }
    build(compilation){
       //读取模块的内容
       let originalSource = compilation.inputFileSystem.readFileSync(this.request,'utf8');
       const ast = babylon.parse(originalSource);
       let dependencies = [];
       traverse(ast,{
           CallExpression:(nodePath)=>{
               if(nodePath.node.callee.name == 'require'){
                   //获取当前的节点对象
                   let node = nodePath.node;
                   node.callee.name = '__webpack_require__'; 
                   let moduleName = node.arguments[0].value;//"./title"
                  
                   let extname = moduleName.split(path.posix.sep).pop().indexOf('.')==-1?".js":"";//.js
                   console.log(moduleName,extname,path.posix.sep);
                   //获取依赖模块.title.js的绝对路径
                   let dependencyRequest = path.posix.join(path.posix.dirname(this.request),moduleName+extname);
                   //获取依赖模块的模块ID ./src/title.js
                   let dependencyModuleId = './'+path.posix.relative(this.context,dependencyRequest);
                   dependencies.push({
                       name:this.name,//此模块所属的代码块的名字
                       context:this.context,
                       request:dependencyRequest
                   }); 
                   //把参数从./title.js 改为./src/title.js
                   node.arguments = [types.stringLiteral(dependencyModuleId)];
               }
           }
       });
       let {code} = generate(ast);// 把转换后的抽象语法树重新生成代码
       console.log('code',code);
       this._ast = ast;
       this.moduleId = './'+path.posix.relative(this.context,this.request);
       this._source = code;//当前模块对应的源码
       compilation.modules.push(this);//添加本模块
       compilation._modules[this.request] = this;
       compilation.buildDependencies(this,dependencies);
       return this;
    }
}
module.exports = NormalModule;