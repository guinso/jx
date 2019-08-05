/**
 * @module jx/loader
 */

var makePromise = require('./makePromise.js')

/**
 * HTTP request loader utility
 * 
 * @class
 * @constructor
 */
function Loader() {
    /**
     * @typedef {Object} CacheLUT
     * @property {String} fileName file URL name
     * @property {String} text  file contents
     */
    /**
     * @private
     * @type {Array<CacheLUT>}
     */
    this._fileLUT = []
}

/**
 * Callback to handle load file success event
 * @callback LoadSuccessCallback
 * @param {String} text file content
 * @returns {void}
 */

/**
  * Callback to handle error event
 * @callback FailCallback
 * @param {Error} err error
 * @returns {void}
 */

/**
 * load file asynchornously from server
 * 
 * @param {String} urlFile  URL of the file
 * @param {LoadSuccessCallback} successFN handle when fetch file success
 * @param {FailCallback}  failureFN handle when failed to fetch file
 * 
 * @see module:jx/loader~LoadSuccessCallback
 * @see module:jx/loader~FailCallback
 */
Loader.prototype.loadFile = function(urlFile, successFN, failureFN) {
    var thisInstance = this

    var cacheFiles = this._fileLUT.filter(function(x) { return x.fileName == urlFile })

    if (cacheFiles.length > 0) {
        //console.log("File " + urlFile + " is cached")
        successFN(cacheFiles[0].text)
        return //cached
    }

    var request = new XMLHttpRequest()
    request.onerror = function() {
        failureFN(new Error(
            "Failed to get " + urlFile +
            ", HTTP status: " + request.status + " - " + request.statusText))
    }

    request.onload = function() {
        if (request.status == 200 || request.status < 300) {
            thisInstance._fileLUT.push({ fileName: urlFile, text: request.responseText })

            successFN(request.responseText)
        } else {
            failureFN(new Error(
                "Failed to get " + urlFile +
                ", HTTP status: " + request.status + " - " + request.statusText))
        }
    }

    request.open('GET', urlFile, true)
    request.send()
}

/**
 * Make loade file promise
 * 
 * @param {String} fileURL URL of file
 * @returns {Promise<String>} promise with raw text return
 */
Loader.prototype.loadFilePromise = function(fileURL) {
    return makePromise.call(this, this.loadFile, fileURL)
}

/**
 * Load multiple files at once
 * 
 * @param {String} urls URL files
 * @param {Function(...String):void} successFN handler when all files successfully loaded
 * @param {Function(Error):void} failedFN handler when one of the files failed to load
 */
Loader.prototype.loadMultipleFiles = function(urls, successFN, failedFN) {
    var thisInstance = this
    var urlCount = urls.length

    var successCount = 0
    var triggeredFail = false

    for (var i = 0; i < urlCount; i++) {
        this.loadFile(urls[i],
            function() {
                successCount++
                if (successCount == urlCount) {
                    var responseTexts = urls.map(function(url) {
                        var cache = thisInstance._fileLUT.filter(function(x) { return x.fileName == url})
                        return cache[0].text
                    })
                    successFN.apply(this, responseTexts)
                }
            },
            function(err) {
                if (triggeredFail == false) {
                    triggeredFail = true
                    failedFN(err)
                }
            })
    }
}

/**
 * Load multiple files in once (in promise fahsion)
 * 
 * @param {Array<String>} urls URL files
 * @return {Promise<...String>} promise with array of raw files texts
 */
Loader.prototype.loadMultipleFilesPromise = function(urls) {
    return makePromise.call(this, this.loadMultipleFiles, urls)
}

/**
 * load HTML partial and wrap into DIV HTMLelement
 * 
 * @param {String} url HTML partial file url
 * @param {Function(HTMLelement):void} successFN handler when success load HTML partial file
 * @param {Function(Error):void} failedFN handler when failed to load HTML partial file
 */
Loader.prototype.loadPartial = function(url, successFN, failedFN) {
    this.loadFile(url,
        function(text) {
            var partial = document.createElement('div')
            partial.innerHTML = text

            successFN(partial)
        },
        failedFN);
};

/**
 * load HTML partial and wrap into DIV HTML tag 
 * 
 * @param {String} url HTML partial file url
 * @return {Promise<HTMLelement>} HTML element (DIV) with embeded partial content
 */
Loader.prototype.loadPartialPromise = function(url) {
    return makePromise.call(this, this.loadPartial, url)
};

/**
 * load multiple HTML partials into DIV HTML tag (in promise fahsion)
 * 
 * @param {Array<String>} urlFiles list of HTML url paths
 * @param {Function(...HTMLelement):void} successFN handler when success load HTML partial files
 * @param {FailCallback} failedFN handler when failed to load HTML partial file
 * 
 * @see module:jx/loader~FailCallback
 */
Loader.prototype.loadMultiplePartials = function(urlFiles, successFN, failureFN) {
    this.loadMultipleFiles(urlFiles,
        function() {
            try {
                var result = []

                for (var i = 0; i < arguments.length; i++) {
                    var partial = document.createElement('div')
                    partial.innerHTML = arguments[i]

                    result.push(partial)
                }

                successFN(Array.prototype.slice.call(result))
            } catch (err) {
                failureFN(err)
            }
        },
        failureFN)
};

/**
 * load multiple HTML partials and wrap into DIV HTML tag (in Promise fahsion)
 *
 * @param {String} url HTML partial file url
 * @return {Promise<...HTMLelement>} HTML element (DIV) with embeded partial content
 */
Loader.prototype.loadMultiplePartialsPromise = function(urls) {
    return makePromise.call(this, this.loadMultiplePartials, urls)
};

module.exports = Loader