console.log(Object.prototype.toString.call({name:'zhufeng'}));
console.log(Object.prototype.toString.call([]));
console.log(Object.prototype.toString.call(10));
console.log(Object.prototype.toString.call(true));
let useExports = {};
Object.defineProperty(useExports,Symbol.toStringTag,{value:'Module'});
console.log(Object.prototype.toString.call(useExports));