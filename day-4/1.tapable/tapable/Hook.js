class Hook {
  constructor(args) {
    this._args = args; //保存参数数组
    this.taps = []; //保存所有的监听函数
  }
  tap(options, fn) {
    options = { name: options };
    options.fn = fn;
    this._insert(options);
  }
  _insert(item) {
    this.taps.push(item);
  }
  call(...args){//args=['zhufeng',10]
      //要执行的函数不是写死的，而是动态生成的
      let callMethod = this._createCall();
      return callMethod.apply(this,args);
  }
  _createCall(){
      //options = {taps,_args}
      return this.compile({
          taps:this.taps,
          _args:this._args
      });
  }
}
module.exports = Hook;