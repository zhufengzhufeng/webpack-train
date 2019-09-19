const path = require('path');
const NormalModule = require('./NormalModule');
class NormalModuleFactory{
    create(data){
        return new NormalModule(data);
    }
}

module.exports = new NormalModuleFactory();