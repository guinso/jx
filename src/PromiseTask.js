/**
 * @module jx
 */

/**
 * Promise task 
 * 
 * @class
 * @constructor
 * @param {boolean} isSerial indicate the promise task run in serial or not
 * @param {Array<Function():Promise<object>>} tasks list of tasks 
 */
function PromiseTask(isSerial, tasks) {
    this.isSerial = isSerial
    this.tasks = tasks
}

module.exports = PromiseTask