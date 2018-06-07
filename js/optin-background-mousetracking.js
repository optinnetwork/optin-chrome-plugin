var updateClick = function(tabContext, msg) {
  tabContext.trackInfo.pageClicks = msg.clicks;

  if (msg.clicks == 1) {
    tabContext.trackInfo.firstClickTime =
      (new Date() - tabContext.trackInfo.loadTime) / 1000;
  }
};

var updateMouseMove = function(tabContext, msg){
    tabContext.trackInfo.mouseTrack.push(msg.position);
}