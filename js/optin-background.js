var storageTrackLimit = 3000;

chrome.tabs.onUpdated.addListener(function(tabId, info) {
  if (info.status === "complete") {
    onPageCompleted(tabId, info);
  } else if (info.status === "loading") {
    onLoading(tabId, info);
  }
});

chrome.runtime.onMessage.addListener(function(msg, sender) {
  if (msg.from === "content") {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      var activeTab = tabs[0];
      var activeTabId = activeTab.id;

      var tabContext = getTabContainerById(activeTabId);

      if (msg.subject === "updateClicks") {
        tabContext.trackInfo.pageClicks = msg.clicks;

        if (msg.clicks == 1) {
          tabContext.trackInfo.firstClickTime =
            (new Date() - tabContext.trackInfo.loadTime) / 1000;
        }
      } else if (msg.subject === "trackMousePosition") {
        tabContext.trackInfo.mouseTrack.push(msg.position);
      }

      updateTabContainer(tabContext);
    });
  }
});
