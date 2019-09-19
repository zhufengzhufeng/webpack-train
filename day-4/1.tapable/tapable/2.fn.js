function sum(a,b){
    return a+b;
}
let sum2 = (a,b)=>{
    return a+b;
}
let sum3 = new Function('a,b','return a+b');
console.log(sum3(3,4))