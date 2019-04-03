// add background scripts here
// also scripts that can be called on keystroke

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log("got message");
    if (request.greeting == "hello") {
    	inject(request.f, request.m, request.e);
    }
});
