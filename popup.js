function getLoopNames() {
  var fields = ['ratty'];
    chrome.storage.local.get(fields, function(res) {
  });
}


document.addEventListener('DOMContentLoaded', function()
{

    var link = document.getElementById('options-btn');
    link.addEventListener('click', function() {
      chrome.runtime.openOptionsPage();
    });
});


function notify(item, time, place) {
	if (!Notification) {
		alert('Desktop notifications not available in your browser. Try Chromium.'); 
		return;
	}

	if (Notification.permission !== "granted")
		Notification.requestPermission();
	else {
		var notification = new Notification('Brown Dining Alert', {
			// TODO: update this icon
			icon: "icon.png",
			body: ("Food alert: " + " available at " + place + " for " + time),
		});
		notification.onclick = function () {
			//TODO: change this to the appropriate menu
			window.open("https://dining.brown.edu/cafe/sharpe-refectory/");
		};
	}
}