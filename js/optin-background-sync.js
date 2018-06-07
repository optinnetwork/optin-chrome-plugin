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
