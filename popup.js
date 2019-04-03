/*
 * function to inject HTML to popup.html
 */
function inject(item, time, eatery) {
	html = "Food alert: " + item + " available at " + Eatery.properties[eatery].name + " for " + expandMeal(time);
	document = "popup.html";
	document.getElementById("foodInject").innerHTML += html;
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log("got message");
    if (request.greeting == "hello") {
    	inject(request.f, request.m, request.e);
    }
});

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