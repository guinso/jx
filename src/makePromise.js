/**
 * @module jx
 */

/**
 * Create promise instance
 * 
 * @param {Function(Object, Function(Object):void, Function(Error):void):void} fn function caller
 * @param {...Object} arg arguments pass to function
 */
function makePromise(fn, ...arg) {
    var thisInstance = this

    var fnArgs = []
    for(var i=0; i < arg.length; i++) {
        fnArgs.push(arg[i])
    }

    return new Promise(function(resolve, reject){
        fnArgs.push(function(output){ resolve(output) })
        fnArgs.push(function(err){ reject(err) })

        fn.apply(thisInstance, fnArgs)
    })
}

module.exports = makePromise