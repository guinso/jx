/**
 * @module jx/loader
 */

/**
 * @typedef {Object} CacheLUT
 * @property {string} fileName  name of the file
 * @property {string} text content of the file
 */

var makePromise = require('./makePromise.js')

/**
 * @constructor file loader utility
 */
function loader() {
    /**
     * @private
     * @type {Array<CacheLUT>}
     */
    this.fileLUT_ = []
}

/**
 * load file asynchornously from server
 * @param {string} urlFile  URL of the file
 * @param {function(string): void} successFN handle when fetch file success
 * @param {function(Error): void}  failureFN handle when failed to fetch file
 */
loader.prototype.loadFile = function(urlFile, successFN, failureFN) {
    var thisInstance = this

    var cacheFiles = this.fileLUT_.filter(function(x) { return x.fileName == urlFile })

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
            thisInstance.fileLUT_.push({ fileName: urlFile, text: request.responseText })

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
 * @param {string} fileURL URL of file
 * @returns {Promise<string>} promise with raw text return
 */
loader.prototype.loadFilePromise = function(fileURL) {
    return makePromise.call(this, this.loadFile, fileURL)
}

/**
 * Load multiple files at once
 * @param {string} urls URL files
 * @param {function(string...): void} successFN handler when all files successfully loaded
 * @param {function(Error): void} failedFN handler when one of the files failed to load
 */
loader.prototype.loadMultipleFiles = function(urls, successFN, failedFN) {
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
                        var cache = thisInstance.fileLUT_.filter(function(x) { return x.fileName == url})
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
 * 
 * @param {Array<string>} urls URL files
 * @return {Promise<string...>} promise with array of raw files texts
 */
loader.prototype.loadMultipleFilesPromise = function(urls) {
    return makePromise.call(this, this.loadMultipleFiles, urls)
}

/**
 * load HTML partial and wrap into DIV HTMLelement
 * @param {string} url HTML partial file url
 * @param {function(HTMLelement): void} successFN handler when success load HTML partial file
 * @param {function(Error): void} failedFN handler when failed to load HTML partial file
 */
loader.prototype.loadPartial = function(url, successFN, failedFN) {
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
 * @param {string} url HTML partial file url
 * @return {Promise<HTMLelement>} HTML element (DIV) with embeded partial content
 */
loader.prototype.loadPartialPromise = function(url) {
    return makePromise.call(this, this.loadPartial, url)
};

/**
 * load multiple HTML partials into DIV HTML tag
 * @param {Array<string>} urlFiles list of HTML url paths
 * @param {function(HTMLelement...): void} successFN handler when success load HTML partial files
 * @param {function(Error): void} failedFN handler when failed to load HTML partial file
 */
loader.prototype.loadMultiplePartials = function(urlFiles, successFN, failureFN) {
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
 * load HTML partial and wrap into DIV HTML tag
 * @param {string} url HTML partial file url
 * @return {Promise<HTMLelement...>} HTML element (DIV) with embeded partial content
 */
loader.prototype.loadMultiplePartialsPromise = function(urls) {
    return makePromise.call(this, this.loadMultiplePartials, urls)
};

module.exports = loader