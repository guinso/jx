/**
 * @module jx/tagLoader
 */

var loader = require('./loader.js')
var makePromise = require('./makePromise.js')

/**
 * @constructor load tag file loader
 * @param {jx/loader} loader jx file loader
 */
function tagLoader() {
    this.loader_ = new loader()
}

/**
 * add javascript into script tag
 * @param {string} rawText javascript tag
 * @param {string} fileURL JS file URL reference
 */
tagLoader.prototype.addJSTag = function(rawText, fileURL) {
    var header = document.head // document.getElementsByTagName('head')[0]

    var found = false
    var headerChildren = header.querySelectorAll('script, link')

    var headCount = headerChildren.length
    for (var i = 0; i < headCount; i++) {
        var childHead = headerChildren[i]

        if (typeof childHead.nodeName !== 'undefined' &&
            childHead.nodeName &&
            childHead.nodeName.toLowerCase() === 'script' &&
            childHead.dataset &&
            childHead.dataset.url &&
            childHead.dataset.url === fileURL) {
            found = true
        }
    }
    if (found) {
        this._log('script URL ' + fileURL + ' already added')
        return
    }

    var newScript = document.createElement('script')
    newScript.setAttribute('type', 'text/javascript')
    newScript.innerHTML = rawText

    if (typeof fileURL === 'string' && fileURL.length > 0) {
        newScript.setAttribute('data-url', fileURL)
    }

    header.appendChild(newScript)
};

/**
 * add CSS style sheet into style tag
 * @param {string} rawText CSS content text
 * @param {string} fileURL CSS file URL reference
 */
tagLoader.prototype.addCSSTag = function(rawText, fileURL) {
    //add into header
    var header = document.head // document.getElementsByTagName('head')[0]

    var found = false
    var headCount = header.childElementCount
    for (var i = 0; i < headCount; i++) {
        if (header.children[i].nodeName.toLowerCase() === 'style' &&
            header.children[i].dataset &&
            header.children[i].dataset.url &&
            header.children[i].dataset.url === fileURL) {
            found = true
        }
    }
    if (found) {
        this._log('stylesheet URL ' + fileURL + ' already added')
        return
    }

    var newStyleSheet = document.createElement('style')
    newStyleSheet.setAttribute('rel', 'stylesheet')
    newStyleSheet.setAttribute('type', 'text/css')
    newStyleSheet.innerHTML = rawText

    if (typeof fileURL === 'string' && fileURL.length > 0) {
        newStyleSheet.setAttribute('data-url', fileURL)
    }

    header.appendChild(newStyleSheet)
};

/**
 * add text content into HTML header tag
 * @param {string} urlFile URL file path
 * @param {string} rawText file content
 */
tagLoader.prototype.addTag_ = function(urlFile, rawText) {
    if (urlFile.endsWith('.js')) {
        this.addJSTag(rawText, urlFile)
    } else if (urlFile.endsWith('.css')) {
        this.addCSSTag(rawText, urlFile)
    } else {
        throw new Error("only support .js and .css: " + urlFile)
    }
};

/**
 * load and add file into HTML header tag, current support file: JS, CSS
 * @param {string} urlFile file URL
 * @param {function(): void} successFN handler when load and tag file success
 * @param {function(Error): void} failureFN handler when failed to load and tag file
 */
tagLoader.prototype.addFile = function(urlFile, successFN, failureFN) {
    var thisInstance = this

    this.loader_.loadFile(urlFile,
        function(rawText) {
            try {
                thisInstance.addTag_(urlFile, rawText)
                successFN()
            } catch (err) {
                failureFN(err)
            }
        },
        failureFN)
};

/**
 * load and add file into HTML tag (in promise fahsion), only support JS and CSS
 * @param {string} urlFile URL file
 * @returns {Promise<void>} promise of load and tag file
 */
tagLoader.prototype.addFilePromise = function(urlFile) {
    return makePromise.call(this, this.addFile, urlFile)
};

/**
 * load and add multiple files into HTML header tag
 * @param {Array<string>} urlFiles list of file URLs (only support JS and CSS)
 * @param {function(): void} successFN handler when successfully load and add HTML tag
 * @param {function(Error): void} failureFN handler when failed to load and add HTML tag 
 */
tagLoader.prototype.addMultipleFiles = function(urlFiles, successFN, failureFN) {
    var thisInstance = this
    this.loader_.loadMultipleFiles(urlFiles,
        function() {
            try {
                for (var i = 0; i < arguments.length; i++) {
                    thisInstance.addTag_(urlFiles[i], arguments[i])
                }

                successFN()
            } catch (err) {
                failureFN(err)
            }
        },
        failureFN)
};

/**
 * load and add multiple files into HTML header tag (in Promise fahsion)
 * @param {Array<string>} urlFiles list of URL files to load into HTML tag
 * @returns {Promise<void>} promise of load and tag files
 */
tagLoader.prototype.addMultipleFilesPromise = function(urlFiles) {
    return makePromise.call(this, this.addMultipleFiles, urlFiles)
};

module.exports = tagLoader