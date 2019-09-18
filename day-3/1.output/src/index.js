let button = document.createElement('button');
button.innerHTML = '请点我';
button.addEventListener('click',()=>{
    import(/*webpackChunkName: 'title'*/'./title.js').then(result=>{
        console.log(result.default);
    });
});
document.body.appendChild(button);