/**
 * 
 * @param {function(Object, function(Object): void, function(Error): void): void} fn function caller
 * @param {Object...} arg arguments pass to function
 */
function makePromise(fn) {
    var thisInstance = this

    var fnArgs = []
    for(var i=1; i < arguments.length; i++) {
        fnArgs.push(arguments[i])
    }

    return new Promise(function(resolve, reject){
        fnArgs.push(function(output){ resolve(output) })
        fnArgs.push(function(err){ reject(err) })

        fn.apply(thisInstance, fnArgs)
    })
}

module.exports = makePromise