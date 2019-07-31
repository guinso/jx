(function(){

try {
    jx.loader.loadFile('jx.js', 
        logFN('sucess load single file'),
        logFN('failed to load single file'))

    jx.loader.loadMultipleFiles(['jx.js', 'jx.min.js'], 
        logFN('sucess load multiple file'),
        logFN('failed to load multiple file'))

    jx.loader.loadFilePromise('jx.js')
        .then(logFN('success load single file (promise)'))
        .catch(logFN('failed to load single file (promise)'))

    jx.loader.loadMultipleFilesPromise(['jx.js', 'jx.min.js'])
        .then(logFN('success load multiple file (promise)'))
        .catch(logFN('failed to load multiple file (promise)'))
        
} catch(err) {
    logFN('failed to run loader test:' + err.message)
}

})()