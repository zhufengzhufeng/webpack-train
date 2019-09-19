const SingleEntryPlugin = require('./SingleEntryPlugin');
class EntryOptionPlugin{
 apply(compiler){
     compiler.hooks.entryOption.tap('EntryOptionPlugin',(context,entry)=>{
         //开始监听单个入口
         //context上下文绝对路径 entry入口文件 main是这个入口文件代码块的默认名称
         new SingleEntryPlugin(context,entry,'main').apply(compiler);
     });
 }
}
module.exports = EntryOptionPlugin;