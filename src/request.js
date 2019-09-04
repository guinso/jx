/**
 * @module jx/request
 */

var makePromise = require('./makePromise.js')

/**
 * Network request utility
 * 
 * @class
 * @constructor 
 */
function Request() {

}

/**
 * Get JSON data through HTTP GET method
 * @param {string} url request URL path
 * @param {function(object): void} successFN handler when successfully get data from URL path
 * @param {function(Error): void} failedFN handler when failed to get data from URL path
 */
Request.prototype.getJSON = function(url, successFN, failedFN) {
    var req = new XMLHttpRequest()
    req.onerror = function() {
        failedFN(new Error(
            "Failed to get " + url +
            ", HTTP status: " + req.status + " - " + req.statusText))
    }

    req.onload = function() {
        if (req.status == 200 || req.status < 300) {

            var jsonObj = JSON.parse(req.responseText)
            successFN(jsonObj)
        } else {
            failedFN(new Error(
                "Failed to get " + url +
                ", HTTP status: " + req.status + " - " + req.statusText))
        }
    }

    req.open('GET', url, true)
    req.send()
};

/**
 * Get JSON data through HTTP GET method, in Promise fahsion
 * @param {string} url URL path to get data
 * @returns {Promise<object>} promise instance with parameter JSON type
 */
Request.prototype.getJSONPromise = function(url) {
    return makePromise(this.getJSON, url)
};

/**
 * Send request through HTTP POST with JSON data
 * @param {string} url URL path
 * @param {object} input input data
 * @param {function(JSON): void} successFN handler when success post data to URL
 * @param {function(Error): void} failedFN handler when failed to post data to URL
 */
Request.prototype.postJSON = function(url, input, successFN, failedFN) {
    var request = new XMLHttpRequest()
    request.onerror = function() {
        failedFN(new Error(
            "Failed to post " + url +
            ", HTTP status: " + request.status + " - " + request.statusText))
    }

    request.onload = function() {
        if (request.status == 200 || request.status < 300) {

            var jsonObj = JSON.parse(request.responseText)
            successFN(jsonObj)
        } else {
            failedFN(new Error(
                "Failed to post " + url +
                ", HTTP status: " + request.status + " - " + request.statusText))
        }
    }

    var isAsynchronous = true
    var param = JSON.stringify(input)

    request.open('POST', url, isAsynchronous)
    request.setRequestHeader("Content-type", "application/json")
    request.send(param)
};

/**
 * Send request through HTTP POST with JSON data (in Pormise fahsion)
 * @param {string} url URL path to send data to server
 * @param {object} input input data
 * @returns {Promise<object>} return Promise instance
 */
Request.prototype.postJSONPromise = function(url, input) {
    return makePromise.call(this, this.postJSON, url, input)
};

/**
 * Post form data to server
 * @param {string} url form post URL
 * @param {FormData} formData request input data (support multipart)
 * @param {function(): void} successFN function delegate on success event
 * @param {function(Error): void} failedFN function delegate on failed event
 */
Request.prototype.postForm = function(url, formData, successFN, failedFN) {
    var request = new XMLHttpRequest()

    request.onerror = function() {
        failedFN(new Error(
            "Failed to post " + url +
            ", HTTP status: " + request.status + " - " + request.statusText))
    }
    request.onload = function() {
        if (request.status == 200 || request.status < 300) {
            successFN()
        } else {
            failedFN(new Error(
                "Failed to post " + url +
                ", HTTP status: " + request.status + " - " + request.statusText))
        }
    }

    request.open('POST', url)
    request.send(formData)
};

/**
 * Post form data to server (in Promise form)
 * @param {string} url form post URL
 * @param {FormData} formData request input data (support multipart)
 */
Request.prototype.postFormPromise = function(url, formData) {
    return makePromise.call(this, this.postForm, url, formData)
};

module.exports = Request