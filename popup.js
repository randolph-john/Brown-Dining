

var Eatery = {
	RATTY: 1,
	ANDREWS: 2,
	VDUB: 3,
	BLUE: 4,
	IVY: 5,
	JOS: 6,
	properties: {
		1 : {name: "the Ratty"},
		2 : {name: "Andrews"},
		3 : {name: "the V-Dub"},
		4 : {name: "the Blue Room"},
		5 : {name: "the Ivy Room"},
		6 : {name: "Josiah's"}
	}
};

/*
 * function to inject HTML to popup.html
 */
function inject(item, time, eatery) {
	//TODO: change this so that it grabs data from chrome storage, formats correctly the foods and puts them all in

	html = "";

	var fields = ["the Ratty", "Andrews", "the V-Dub", "the Blue Room", "the Ivy Room", "Josiah's"];
    chrome.storage.local.get(fields, function(res) {
    	// for every eatery
    	for (var i = 0; i < fields.length; i++) {
    		// for every saved food in every eatery
    		if (res[fields[i]] != undefined) {
        		html += "<strong>" + fields[i] + ": </strong>";
	    		html += res[fields[i]];
	    		html += "<br>";
    		}

    	}
		document.getElementById("foodInject").innerHTML += html;
	});

	//html = "Food alert: " + item + " available at " + Eatery.properties[eatery].name + " for " + time;
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

document.addEventListener('DOMContentLoaded', inject("pancakes",'L',Eatery.RATTY));