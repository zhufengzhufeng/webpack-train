const {Tapable,SyncHook,AsyncParallelHook,AsyncSeriesHook} = require('tapable');
const Compilation = require('./Compilation');
class Compiler extends Tapable{
    constructor(context){
        super();
        this.hooks = {
            environment:new SyncHook([]),
            afterEnvironment:new SyncHook([]),
            afterPlugins:new SyncHook([]),
            entryOption:new SyncHook([]),
            make:new AsyncParallelHook(['compilation']),
            beforeRun:new AsyncSeriesHook(['compiler']),
            run:new AsyncSeriesHook(['compiler']),
            beforeCompile:new AsyncSeriesHook(['params']),
            compile:new SyncHook(['params']),
            thisCompilation:new SyncHook(["compilation", "params"]),
			compilation:new SyncHook(["compilation", "params"]),
            afterCompile:new AsyncSeriesHook(['params']),
            done: new AsyncSeriesHook(["stats"]),//一切完成之后会触发done这个钩子
        }
        this.options = {};
        //C:\vipdata\tempproject\webpack-train\day-4
        this.context = context;//保存当前的上下文路径
    }
    run(callback){
        const onCompiled = (err, compilation) => {
            //编译完成后的回调
        }
        this.hooks.beforeRun.callAsync(this,err=>{
            this.hooks.run.callAsync(this,err=>{
                this.compile(onCompiled);
            });
        });
    }
    newCompilation(params){
        let compilation = new Compilation(this);
        this.hooks.thisCompilation.call(compilation,params);
        this.hooks.compilation.call(compilation,params);
        return compilation;
    }
    compile(onCompiled){//开始编译
       this.hooks.beforeCompile.callAsync({},err=>{
           this.hooks.compile.call();
           //创建一个新的compilatioin，这里面放着本次编译的结果
           const compilation = this.newCompilation();
           this.hooks.make.callAsync(compilation,err=>{
               console.log('make完成');
           });
       });
    }
}
module.exports = Compiler;