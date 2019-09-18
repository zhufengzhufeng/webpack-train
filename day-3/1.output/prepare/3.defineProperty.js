let ageValue;
let obj = {};
//obj.age = ageValue;
Object.defineProperty(obj,'age',{
    //value:10,
    get(){
        return ageValue;
    },
    set(newValue){
       ageValue=newValue;
    }
});
//obj.age = 10;
obj.age = 10;
console.log(obj.age)
