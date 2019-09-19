class HookCodeFactory{
    args(){
        return this.options._args.join(',')//['name','age] name,age
    }
  setup(hookInstance,options){
      this.options = options;
      //[{name,fn},{name,fn}]
      hookInstance._x = options.taps.map(item=>item.fn);
  }
  header(){
      return `
        "use strict";
        var _context;
        var _x = this._x;//fn的数组 监听 函数的数组
      `;
  }
  content(){
      let code = '';
      for(let index=0;index<this.options.taps.length;index++){
          code += `
            var _fn${index} = _x[${index}];
            _fn${index}(${this.args()});
          `;
      }
      return code;
  }
  create(options){ //options = {taps,_args}_args=['name','age]
      return new Function(this.args(),this.header()+this.content());
  }
}
module.exports = HookCodeFactory;
/**
(function anonymous(name, age
) {
"use strict";
var _context;
var _x = this._x;
var _fn0 = _x[0];
_fn0(name, age);

var _fn1 = _x[1];
_fn1(name, age);

})
 */