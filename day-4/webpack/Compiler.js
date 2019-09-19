const {
  Tapable,
  SyncHook,
  AsyncParallelHook,
  AsyncSeriesHook
} = require("tapable");
const Stats = require('./Stats');
const Compilation = require("./Compilation");
const mkdirp = require("mkdirp");
const path = require("path");
class Compiler extends Tapable {
  constructor(context) {
    super();
    this.hooks = {
      environment: new SyncHook([]),
      afterEnvironment: new SyncHook([]),
      afterPlugins: new SyncHook([]),
      entryOption: new SyncHook(["context", "entry"]),
      make: new AsyncParallelHook(["compilation"]),
      beforeRun: new AsyncSeriesHook(["compiler"]),
      run: new AsyncSeriesHook(["compiler"]),
      beforeCompile: new AsyncSeriesHook(["params"]),
      compile: new SyncHook(["params"]),
      thisCompilation: new SyncHook(["compilation", "params"]),
      compilation: new SyncHook(["compilation", "params"]),
      afterCompile: new AsyncSeriesHook(["params"]),
      emit: new AsyncSeriesHook(["compilation"]),
      done: new AsyncSeriesHook(["stats"]) //一切完成之后会触发done这个钩子
    };
    this.options = {};
    //C:\vipdata\tempproject\webpack-train\day-4
    this.context = context; //保存当前的上下文路径
  }
  emitAssets(compilation, callback) {
    const emitFiles = err => {
      //是一个对象，对象上有属性的值 {文件名字，源码}
      let assets = compilation.assets;
      for (let file in assets) {
        let source = assets[file];
        let targetPath = path.posix.join(this.options.output.path, file);
        this.outputFileSystem.writeFileSync(targetPath, source);
      }
      callback();
    };
    this.hooks.emit.callAsync(compilation, (err) => {
      mkdirp(this.options.output.path, emitFiles);
    });
  }
  run(finallyCallback) {
    const onCompiled = (err, compilation) => {
      this.emitAssets(compilation, err => {
        const stats = new Stats(compilation);
        this.hooks.done.callAsync(stats, err => {
          return finallyCallback();
        });
      });
    };
    this.hooks.beforeRun.callAsync(this, err => {
      this.hooks.run.callAsync(this, err => {
        this.compile(onCompiled);
      });
    });
  }
  newCompilation(params) {
    let compilation = new Compilation(this);
    this.hooks.thisCompilation.call(compilation, params);
    this.hooks.compilation.call(compilation, params);
    return compilation;
  }
  compile(onCompiled) {
    //开始编译
    this.hooks.beforeCompile.callAsync({}, err => {
      this.hooks.compile.call();
      //创建一个新的compilatioin，这里面放着本次编译的结果
      const compilation = this.newCompilation();
      this.hooks.make.callAsync(compilation, err => {
        compilation.seal(err => {
          //通过模块生成代码块
          this.hooks.afterCompile.callAsync(compilation, err => {
            return onCompiled(null,compilation); //写入文件系统
          });
        });
      });
    });
  }
}
module.exports = Compiler;
