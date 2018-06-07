function takeShotFromWebCam(){  
var video = document.getElementById('video');

if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {    
    navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
        video.src = window.URL.createObjectURL(stream);
        video.play();
    });
}
}

function gotMedia(mediaStream) {
  const mediaStreamTrack = mediaStream.getVideoTracks()[0];
  const imageCapture = new ImageCapture(mediaStreamTrack);
  console.log(imageCapture);
};


$(function() {  
  var pluginEnabledCheckbox = $('input[type="checkbox"]');

  pluginEnabledCheckbox.change(function() {
    if (pluginEnabledCheckbox.checked) {            
      pluginEnabledCheckbox.checked = false;      
    } else {            
      pluginEnabledCheckbox.checked = true;
    }

    setLocalValueStorage("optinPluginEnabled",pluginEnabledCheckbox.checked.toString());
  });

  getLocalValueStorage("optinPluginEnabled", function(result) {
    if (result.optinPluginEnabled == "true")
      pluginEnabledCheckbox.trigger("click");
  });  

  //takeShotFromWebCam();
});
