// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const {
    ipcRenderer,
    desktopCapturer
} = require("electron")

const fs = require('fs')

const webcamVideo = document.getElementById("webcamVideo")
const startBtn = document.getElementById("startBtn")
const stopBtn = document.getElementById("stopBtn")
const webcamOptions = {
    video: true,
    audio: false
}
const microphoneOptions = {
    video: false,
    audio: true
}
const mimeType = "video/webm\;codecs=h264"
var webcamStream
var microphoneAudioStream
var desktopStream
var mediaRecorder
var recordingData = []

stopBtn.style.display = "none"

startBtn.addEventListener("click", function(e) {
    console.log("starting.....")
    startBtn.style.display = "none"
    stopBtn.style.display = "block"
    
    Promise.all([navigator.mediaDevices.getUserMedia(webcamOptions), 
        navigator.mediaDevices.getUserMedia(microphoneOptions)])
        .then(function(streams) {
            console.log("got streams")
            webcamStream = streams[0]
            microphoneAudioStream = streams[1]
            webcamVideo.srcObject = webcamStream
            
            ipcRenderer.send("positionWindow")
        })
        .catch(function(err) {
            console.log(err)
        })
})

stopBtn.addEventListener("click", function(e) {
    console.log("stopping.....")
    mediaRecorder.stop()
    webcamStream.getVideoTracks().forEach(track => track.stop());
    microphoneAudioStream.getAudioTracks().forEach(track => track.stop());
    desktopStream.getAudioTracks().forEach(track => track.stop());
    startBtn.style.display = "block"
    stopBtn.style.display = "none"
    ipcRenderer.send("restoreWindow")
})


function onMediaRecorderDataAvailable(event) {
    console.log("received data")
    recordingData.push(event.data)
}

function onMediaRecorderStop(event) {
    console.log("stopping stopped writing file")
    console.log(recordingData.length)
    var blob = new Blob(recordingData, { 'type' : mimeType });
    let reader = new FileReader()
    reader.onload = function() {
        if (reader.readyState == 2) {
            var buffer = new Buffer(reader.result)
            fs.writeFileSync("./recording.webm", buffer)
        }
    }
    reader.readAsArrayBuffer(blob)
}

ipcRenderer.on("windowPositioned", function() {
    console.log("window positioned")

    desktopCapturer.getSources({types: ['screen']}, function(err, sources) {
        if(err) {
            console.log(err)
            return
        }

        for(var i = 0; i < sources.length; i++) {
            if(sources[i].name == "Entire screen") {
                navigator.mediaDevices.getUserMedia({
                    audio: false,
                    video: {
                      mandatory: {
                          chromeMediaSource: 'desktop',
                        }
                    }
                  })
                  .then(function(stream) {
                      desktopStream = stream
                      stream.addTrack(microphoneAudioStream.getAudioTracks()[0])
                      recordingData = []
                      mediaRecorder = new MediaRecorder(stream, {mimeType: mimeType});
                        mediaRecorder.ondataavailable = onMediaRecorderDataAvailable
                        mediaRecorder.onstop = onMediaRecorderStop
                        mediaRecorder.start()
                  })
                  .catch((err) => console.log(err)) 
                break;
            }
            console.log(sources[i])
        }
    })
})

ipcRenderer.on("windowRestored", function() {
    console.log("window restored")
})