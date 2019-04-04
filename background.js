// add background scripts here
// also scripts that can be called on keystroke

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log("got message");
    if (request.greeting == "hello") {
    	inject(request.f, request.m, request.e);
    }
});


/*
 * this *should* make the script run once a day, at 7AM
 */
/*function createAlarm() {
    var now = new Date();
    var day = now.getDate();
    if (now.getHours() >= 7) {
        // 7 AM already passed
        day += 1;
    }
    // '+' casts the date to a number, like [object Date].getTime();
    var timestamp = +new Date(now.getFullYear(), now.getMonth(), day, 7, 0, 0, 0);
    //                        YYYY               MM              DD  HH MM SS MS

    // Create
    chrome.alarms.create('7AMyet', {
        when: timestamp
    });
}

// Listen -- ADD THIS BACK IN
chrome.alarms.onAlarm.addListener(function(alarm) {
    if (alarm.name === '7AMyet') {
        // Whatever you want
    }
});
createAlarm();*/