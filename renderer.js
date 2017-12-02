// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const webcamVideo = document.getElementById("webcamVideo")
const startBtn = document.getElementById("startBtn")
const stopBtn = document.getElementById("stopBtn")

stopBtn.style.display = "none"

startBtn.addEventListener("click", function(e) {
    console.log("starting.....")

    startBtn.style.display = "none"
    stopBtn.style.display = "block"
    if (hasGetUserMedia()) {
        console.log("has media")
        // Good to go!
      navigator.webkitGetUserMedia({
            video: true
        }, function(stream) {
            console.log("got stream")
            webcamVideo.srcObject = stream
        }, function(err) {
            console.log(err)
        })
    
      } else {
        console.log('getUserMedia() is not supported in your browser');
      }
})

stopBtn.addEventListener("click", function(e) {
    console.log("stopping.....")
    webcamVideo.srcObject.getVideoTracks().forEach(track => track.stop());
    startBtn.style.display = "block"
    stopBtn.style.display = "none"
})


function hasGetUserMedia() {
    return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
              navigator.mozGetUserMedia || navigator.msGetUserMedia);
  }
  
  