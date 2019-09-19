class MyPlugin{
    apply(compiler){
        compiler.hooks.environment.tap('MyPlugin',()=>{
            console.log('MyPlugin environment')
        });
    }
}
module.exports = MyPlugin;