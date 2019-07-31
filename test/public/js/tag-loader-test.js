(function(){

    jx.tagLoader.addFile('js/dummy-js-1.js', 
        logFN('sucess add single file to HTML tag'),
        logFN('failed to add single file to HTML tag'))

    jx.tagLoader.addFilePromise('css/dummy-css-1.css')
        .then(logFN('sucess add single file to HTML tag (promise)'))
        .catch(logFN('failed to add single file to HTML tag (promise)'))

    jx.tagLoader.addMultipleFiles(['js/dummy-js-2.js', 'css/dummy-css-2.css'], 
        logFN('sucess add multiple files to HTML tag'),
        logFN('failed to add multiple files to HTML tag'))

    jx.tagLoader.addMultipleFilesPromise(['js/dummy-js-3.js', 'css/dummy-css-3.css'])
        .then(logFN('sucess add multiple files to HTML tag (promise)'))
        .catch(logFN('failed to add multiple file(s) to HTML tag (promise)'))    

})()