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
 * function to dynamically adjust the size of the popup 
 */
function adjustPopupSize(size) {
	document.getElementById("popup").style.minHeight = "" + size + "px";
}

/*
 * function to add links to menus
 */
function addLinks() {
	var URLs = ['https://dining.brown.edu/cafe/sharpe-refectory/','https://dining.brown.edu/cafe/andrews-commons/','https://dining.brown.edu/cafe/verney-woolley/','https://dining.brown.edu/cafe/blue-room/','https://dining.brown.edu/cafe/ivy-room/','https://dining.brown.edu/cafe/josiahs/'];
	var fields = ["the Ratty", "Andrews", "the V-Dub", "the Blue Room", "the Ivy Room", "Josiah's"];
	for (var i = 0; i < fields.length; i++) {
		if (document.getElementById(fields[i])) {
			theURL = URLs[i];
		    document.getElementById(fields[i]).addEventListener('click', function() {
		    	chrome.tabs.create({ url: theURL });
		    });
		}
	}
}

/*
 * function to inject HTML to popup.html
 */
function inject() {
	//TODO: change this so that it grabs data from chrome storage, formats correctly the foods and puts them all in

	html = "";
	var URLs = ['https://dining.brown.edu/cafe/sharpe-refectory/','https://dining.brown.edu/cafe/andrews-commons/','https://dining.brown.edu/cafe/verney-woolley/','https://dining.brown.edu/cafe/blue-room/','https://dining.brown.edu/cafe/ivy-room/','https://dining.brown.edu/cafe/josiahs/'];
	var fields = ["the Ratty", "Andrews", "the V-Dub", "the Blue Room", "the Ivy Room", "Josiah's"];
    chrome.storage.local.get(fields, function(res) {
		// height: number of titles*20+number of eateries*12+button size + ?4?
		var height = 42;
    	// for every eatery
    	for (var i = 0; i < fields.length; i++) {
    		// for every saved food in every eatery
    		if (res[fields[i]] != undefined) {
    			//fields[i] is the name of the eatery
    			//res[fields[i]] is the data, separated by periods, with dining time separated by comma
    			//approach: split by period. Make 
    			foodSplit = res[fields[i]].split(".");
    			byMeal = [];
    			if (foodSplit.length > 1) {
	    			for (var j = 0; j < foodSplit.length-1; j++) {
	    				foodTime = foodSplit[j].split(",");
	    				if (byMeal[foodTime[1]] == null) {
	    					byMeal[foodTime[1]] = foodTime[0];
	    				} else {
	    					height += 22;
	    					byMeal[foodTime[1]] = byMeal[foodTime[1]] + ", <br>" + foodTime[0];
	    				}
	    			}
	    			capped = fields[i].charAt(0).toUpperCase() + fields[i].slice(1)
	    			height += 29;
		        	html += "<strong><span style='color:blue;font-size:20px' id=\"" + fields[i] + "\"><a>" + capped + "</a></span></strong>";
	        		for (x in byMeal) {
	        			height += 22;
	        			html += "<br><strong>" + x + ": </strong>";
	        			html += byMeal[x] + " ";
	        		}
		    		html += "<br>";		
    			}
    		}
    	}
    	if (fields.length == 0) {
    		html = "No foods found today.";
    	}
		document.getElementById("foodInject").innerHTML += html;
		adjustPopupSize(height);
		addLinks();
	});
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

document.addEventListener('DOMContentLoaded', inject());