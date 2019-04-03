function getLoopNames() {
  var fields = ['ratty'];
    chrome.storage.local.get(fields, function(res) {
  });
}

/*
 * opens the options page onclick
 */
document.addEventListener('DOMContentLoaded', function()
{
    var link = document.getElementById('options-btn');
    link.addEventListener('click', function() {
      chrome.runtime.openOptionsPage();
    });
});
