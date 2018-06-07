var clicks = 0;
document.addEventListener("click", function(event) {
  clicks++;
  chrome.runtime.sendMessage({
    from: "content",
    subject: "updateClicks",
    clicks: clicks
  });
});

window.onmousemove = logMouseMove;

function logMouseMove(event) {
  e = event || window.event;
  mousePos = { x: e.clientX, y: e.clientY };

  chrome.runtime.sendMessage({
    from: "content",
    subject: "trackMousePosition",
    position: mousePos
  });
}
