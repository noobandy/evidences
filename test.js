const webcamOptions = {
    video: true,
    audio: false
}
const microphoneOptions = {
    video: false,
    audio: true
}
Promise.all([navigator.mediaDevices.getUserMedia(webcamOptions), 
    navigator.mediaDevices.getUserMedia(microphoneOptions)])
    .then(function(streams) {
       // console.log("got streams")
       alert("stream", streams)
    })
    .catch(function(err) {
        //console.log(err)
        alert("err", err)
    })
alert("preload")

    const webview = document.getElementById('foo')

    webview.addEventListener('dom-ready', () => {
        alert("dom ready, checking devices")
        webview.send("fromWebView")
      })
      
      webview.addEventListener('ipc-message', (event) => {
        // console.log(event.channel)
        // Prints "pong"
        alert(event.channel, event.data)
      })