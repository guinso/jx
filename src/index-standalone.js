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
        global.jx = require('./index.js').jx
    }
 })(window);