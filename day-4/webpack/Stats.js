
class Stats{
    constructor(compilation){
        this.files = compilation.files;
        this.modules = compilation.modules;
        this.chunks = compilation.chunks;
    }
}
module.exports = Stats;