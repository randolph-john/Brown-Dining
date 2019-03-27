NUM_LOOPS = 0;
LOOP_NAMES = [];

function getLoopNames() {
  var fields = ['num_loops','loop_name'];
    chrome.storage.local.get(fields, function(res) {
        NUM_LOOPS = res.num_pages;
        LOOP_NAMES = [res.loop_name];
  });
}


document.addEventListener('DOMContentLoaded', function()
{
    var link = document.getElementById('options-btn');
    link.addEventListener('click', function() {
        //chrome.extension.sendMessage({action: "start", url: json.url});
      chrome.runtime.openOptionsPage();
    });
});