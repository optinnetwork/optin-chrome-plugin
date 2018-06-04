var storageTrackLimit = 3000;
var current_url = null;
var loadTime = new Date();
var endPageTime = new Date();
var totalPageTime = 0;
var pageClicks = 0;
var firstClickTime = 0;

function urlIsTracked(details) {
  if (details.type === "main_frame") return true;

  return false;
}

function findMetaTags(requestDetais, onMetaTagsFound) {
  var code =
    "var meta = document.querySelector(\"meta[name='description']\");" +
    'if (meta) meta = meta.getAttribute("content");' +
    "({" +
    "    title: document.title," +
    '    description: meta || ""' +
    "});";
  chrome.tabs.executeScript(
    {
      code: code
    },
    function(results) {
      if (!results) return;
      var metatags = results[0];
      if (onMetaTagsFound) {
        onMetaTagsFound(requestDetais, metatags);
      }
    }
  );
}

function injectTrackCapabilities() {
  chrome.tabs.executeScript({
    file: "js/trackCapabilities.js"
  });
}

function onCompleted(details) {
  chrome.storage.sync.get("optinPluginEnabled", function(result) {
    if (result.optinPluginEnabled == "true" && urlIsTracked(details)) {
      loadTime = new Date();
      current_url = details.url;
      injectTrackCapabilities();

      // if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      //   navigator.mediaDevices
      //     .getUserMedia({ video: true })
      //     .then(function(stream) {
      //       console.log(window.URL.createObjectURL(stream));
      //     });
      // }
    }
  });
}

function onBeforeRequest(details) {
  chrome.storage.sync.get("optinPluginEnabled", function(result) {
    if (result.optinPluginEnabled == "true" && urlIsTracked(details)) {
      var endPageTime = new Date();
      totalPageTime = (endPageTime - loadTime) / 1000;
      findMetaTags(details, onMetaTagsFound);
      manageTrackingDataUpload();
    }
  });
}

function onMetaTagsFound(requestDetails, metatags) {
  requestDetails.metatags = metatags;

  var trackInfo = {};

  trackInfo.ip = requestDetails.ip;
  trackInfo.url = current_url;
  trackInfo.timeStamp = requestDetails.timeStamp;
  trackInfo.metatags = requestDetails.metatags;
  trackInfo.totalPageTime = totalPageTime;
  trackInfo.pageClicks = pageClicks;
  trackInfo.firstClickTime = firstClickTime;

  console.log(trackInfo);

  addTrackInfo(trackInfo);
}

function localDataLimitHasReached(onLimitReached, onLimitHasNotReached) {
  getTrackDataBytesInUse(function(bytes) {
    if (bytes >= storageTrackLimit) {
      onLimitReached();
    } else {
      console.log(bytes);
      onLimitHasNotReached();
    }
  });
}

function yesterdayDataDidNotSend(onLastIsBeforeToday) {
  getLastDateTrackDataUpload(function(lastDate) {
    var last = Date.parse(lastDate);
    var today = Date.parse(new Date().toISOString().slice(0, 10));

    if (last < today) onLastIsBeforeToday();
  });
}

function uploadAndCatalogTrackData(onAfterUploadAndCatalog) {
  getTrackInfo(function(trackData) {
    onAfterUploadAndCatalog();
    // uploadToIPFS(JSON.stringify(trackData), function(hash) {
    //   console.log(hash);
    //   onAfterUploadAndCatalog();
    // });
  });
}

function manageTrackingDataUpload() {
  localDataLimitHasReached(
    function() {
      uploadAndCatalogTrackData(clearTrackInfo);
    },
    function() {
      yesterdayDataDidNotSend(function() {
        uploadAndCatalogTrackData(clearTrackInfo);
      });
    }
  );
}

chrome.webRequest.onCompleted.addListener(onCompleted, {
  urls: ["<all_urls>"]
});

chrome.webRequest.onBeforeRequest.addListener(onBeforeRequest, {
  urls: ["<all_urls>"]
});

chrome.runtime.onMessage.addListener(function(msg, sender) {
  if (msg.from === "content" && msg.subject === "updateClicks") {
    pageClicks = msg.clicks;

    if (pageClicks == 1) {
      firstClickTime = (new Date() - loadTime) / 1000;
    }
  }
});
