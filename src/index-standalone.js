/**
 * @module jx
 */

(function(global){

    if (typeof global.jx === 'undefined') {
        var jx = require('./index.js')

        global.jx = jx
    }
 })(window);