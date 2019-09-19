//compiler 代表整个编译对象 compilation代表一次编译
class SingleEntryPlugin{
  constructor(context,entry,name){
      this.context = context;//上下文目录 绝对day4
      this.entry = entry;//入口文件 相对路径
      this.name = name;//名称 main
  }
  apply(compiler){
      //make是一个异步
      compiler.hooks.make.tapAsync(
          'SingleEntryPlugin',
          (compilation,callback)=>{
              let {context,entry,name} = this;
              //开始从入口文件进行递归编译
              compilation.addEntry(context,entry,name,callback);
          }
      );
  }
}
module.exports = SingleEntryPlugin;