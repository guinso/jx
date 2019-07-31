/**
 * @module jx
 */

(function(global){
    var stringPolyfill = require('./stringPolyfill.js')
    stringPolyfill()

    if (typeof global.Promise === 'undefined') {
        global.Promise = require('promise-polyfill')
    }

    if (typeof global.jx === 'undefined') {
        var loaderX = require("./loader.js");
        var tag = require('./tagLoader.js');
        var uuid = require('./makeUUID.js');
        var taskX = require('./task');
        var promiseTask = require('./PromiseTask.js')
        
        global.jx = { 
            loader: new loaderX(),
            tagLoader: new tag(),
            makeUUID: uuid,
            PomiseTask: promiseTask,
            task: new taskX()
        }
    }
 })(window);