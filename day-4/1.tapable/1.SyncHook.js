let {SyncHook} = require('./tapable');
//表示我这个触发的时候要传递哪些参数
debugger;
let queue = new SyncHook(['name','age']);
//tap 用来注册事件 call触发事件
queue.tap('1',(name,age)=>{
  console.log(1,name)
});
queue.tap('2',(name,age)=>{
  console.log(2,name)
});
//触发事件
debugger;
queue.call('zhufeng',10);