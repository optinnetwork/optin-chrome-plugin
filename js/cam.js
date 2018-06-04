var video = document.querySelector("#videoElement");

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;

var createObjectURL = (window.webkitURL || {}).createObjectURL || function(){};

if (navigator.getUserMedia) {       
   navigator.getUserMedia({video: true}, handleVideo, videoError);
}

function handleVideo(stream) {
   video.src = createObjectURL(stream);
}

function videoError(e) {
   // do something
   console.error(e);
}