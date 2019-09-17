import Vue from 'vue';
import App from './App.vue'
let vm = new Vue({
    el:"#root",
    render:h=>h(App)
});





// import React from 'react';
// import ReactDOM from 'react-dom';
// // ts 校验类型
// interface IProps{
//     num:number
// }
// let initState = {count:0};
// type State = Readonly<typeof initState>
// class Counter extends React.Component<IProps,State>{
//     state:State = initState;
//     handleClick = ()=>{
//         this.setState({count:this.state.count+1})
//     }
//     render(){
//         return <div>
//             {this.state.count}
//             <button onClick={this.handleClick}>点击</button>            
//         </div>
//     }
// }
// ReactDOM.render(<Counter num={1}/>,document.getElementById('root'));

// ts-loader typescript库
// babel7 @babel/preset-typescript
