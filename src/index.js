/**
 * @module jx
 */

var loaderX = require("./Loader.js");
var tag = require('./TagLoader.js');
var uuid = require('./makeUUID.js');
var taskX = require('./Task');
var promiseTask = require('./PromiseTask.js')
var req = require('./Request');

exports.jx = { 
    loader: new loaderX(),
    tagLoader: new tag(),
    makeUUID: uuid,
    PomiseTask: promiseTask,
    task: new taskX(),
    request: new req()
}