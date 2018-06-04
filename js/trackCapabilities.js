var clicks = 0;
document.addEventListener('click', function(event){        
    clicks++;    
    chrome.runtime.sendMessage({
        from:    'content',
        subject: 'updateClicks',
        clicks: clicks
      });      
});