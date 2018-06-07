function onLoading(tabId, details) {
  browser.storage.local.get("optinPluginEnabled").then(result => {
    if (result.optinPluginEnabled == "true") {
      updateTimeTrackingdata(tabId);

      var trackinfo = getTabContainerById(tabId).trackInfo;
      addTrackInfo(trackinfo);
      manageTrackingDataUpload();
    }
  });
}

var updateTimeTrackingdata = function(tabId) {
  var tabContext = getTabContainerById(tabId);

  var endPageTime = new Date();
  totalPageTime = (endPageTime - tabContext.trackInfo.loadTime) / 1000;

  tabContext.trackInfo.endPageTime = endPageTime;
  tabContext.trackInfo.totalPageTime = totalPageTime;

  updateTabContainer(tabContext);
};
