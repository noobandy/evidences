const {ipcRenderer} = require('electron')

var pendingPromise
var resolveFunc
var rejectFunc

global.hasAudioViedo = function() {
    if(pendingPromise) {
        return Promise.reject("called incorrectly")
    }

    pendingPromise = new Promise(function(resolve, reject) {
        resolveFunc = resolve
        rejectFunc = reject
        ipcRenderer.sendToHost("hasAudioVideo")
    })

    return pendingPromise
}

ipcRenderer.on("audioVideoStatusAvailable", function(event, data) {
    resolveFunc(data)
    pendingPromise = undefined
})