var PromiseTask = require('./PromiseTask.js')

/**
 * @constructor task runner
 */
function task(){}

/**
 * Run promise tasks
 * @param {PromiseTask} promiseTask tasks
 */
task.prototype.run = function(promiseTask) {
    if (promiseTask.isSerial === true) { //run in serial
        return promiseTask.tasks.reduce(this._serialTaskReducer, Promise.resolve([]))
    } else if (promiseTask.isSerial === false) { //run in parallel
        return jxLoader.prototype._parallelTaskReducer.call(this, promiseTask.tasks)
    } else {
        return Promise.reject(new Error(
            'unknown promiseTask.isSerial value - ' + promiseTask.isSerial))
    }
};

/**
 * @param {Array<function(): Promise<object>} tasks list of promises task function
 */
task.prototype._parallelTaskReducer = function(tasks) {
    var promises = []

    for (var i = 0; i < tasks.length; i++) {
        var fn = tasks[i]

        if (typeof fn === 'function') {
            promises.push(fn())
        } else if (typeof fn === 'object' && fn instanceof jxPromiseTask) {
            promises.push(this.runPromise.call(fn))
        } else {
            return Promise.reject(new Error(
                "fn is not valid task type ('function' or 'jxPromiseTask') - " + typeof fn))
        }
    }

    return Promise.all(promises)
};

/**
 * @param {Promise<object>} promiseChain latest promise ran
 * @param {function(): Promise<object>} fn function promise
 */
task.prototype._serialTaskReducer = function(promiseChain, fn) {
    if (typeof fn === 'function') {
        return promiseChain.then(function(chainResult) {
            return fn().then(function(fnResult) {
                chainResult.push(fnResult)
                return chainResult
            })
        })
    } else if (typeof fn === 'object' && fn instanceof jxPromiseTask) {
        return jxLoader.prototype.runPromise.call(this, fn)
    } else {
        return Promise.reject(new Error(
            "fn is not valid task type ('function' or 'jxPromiseTask') - " + typeof fn))
    }
};

module.exports = task