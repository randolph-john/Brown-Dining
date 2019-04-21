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
 * function to open a link based on an eatery i
 * only used in 'addLinks' below
 */
function openLink(i) {
	var URLs = ['https://dining.brown.edu/cafe/sharpe-refectory/','https://dining.brown.edu/cafe/andrews-commons/','https://dining.brown.edu/cafe/verney-woolley/','https://dining.brown.edu/cafe/blue-room/','https://dining.brown.edu/cafe/ivy-room/','https://dining.brown.edu/cafe/josiahs/'];
	chrome.tabs.create({ url: URLs[i] });
}

/*
 * function to add links to menus
 */
function addLinks() {
	var fields = ["the Ratty", "Andrews", "the V-Dub", "the Blue Room", "the Ivy Room", "Josiah's"];
	// Yes, these have to be hardcoded in because for loops are messed up in async programming :/
	if (document.getElementById(fields[0])) {
		document.getElementById(fields[0]).onclick = function() {openLink(0)};
	}
	if (document.getElementById(fields[1])) {
		document.getElementById(fields[1]).onclick = function() {openLink(1)};
	}
	if (document.getElementById(fields[2])) {
		document.getElementById(fields[2]).onclick = function() {openLink(2)};
	}
	if (document.getElementById(fields[3])) {
		document.getElementById(fields[3]).onclick = function() {openLink(3)};
	}
	if (document.getElementById(fields[4])) {
		document.getElementById(fields[4]).onclick = function() {openLink(4)};
	}
	if (document.getElementById(fields[5])) {
		document.getElementById(fields[5]).onclick = function() {openLink(5)};
	}
}

/*
 * function to inject HTML to popup.html
 */
function inject() {
	html = "";
	var today = new Date();
	weekday = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');
	dw = weekday[today.getDay()];
	dd = today.getDate();
	months = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');
	mm = months[today.getMonth()];
	var yyyy = today.getFullYear();

	today = "<span style='font-size:16px;font-weight:bold'>" + dw + ', ' + mm + ' ' + dd + ', ' + yyyy + '</span><br>';
	html += today;
	var URLs = ['https://dining.brown.edu/cafe/sharpe-refectory/','https://dining.brown.edu/cafe/andrews-commons/','https://dining.brown.edu/cafe/verney-woolley/','https://dining.brown.edu/cafe/blue-room/','https://dining.brown.edu/cafe/ivy-room/','https://dining.brown.edu/cafe/josiahs/'];
	var fields = ["the Ratty", "Andrews", "the V-Dub", "the Blue Room", "the Ivy Room", "Josiah's"];
    chrome.storage.local.get(fields, function(res) {
		// height: number of titles*20+number of eateries*12+button size + ?4?
		var height = 68;
    	// for every eatery
    	atLeastOne = false;
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
	    			height += 24;
		        	html += "<strong><span style='color:blue;font-size:20px;text-decoration:underline' id=\"" + fields[i] + "\"><a>" + capped + "</a></span></strong>";
	        		for (x in byMeal) {
	        			height += 22;
	        			html += "<br><strong>" + x + ": </strong>";
	        			html += byMeal[x] + " ";
	        		}
		    		html += "<br>";	
    				atLeastOne = true;	
    			}
    		}
    	}
    	if (!atLeastOne) {
    		html = "No foods found today.";
    		height+= 18;
    	}
		document.getElementById("foodInject").innerHTML += html;
		adjustPopupSize(height);
		addLinks();
	});
}

//inject html on load
document.addEventListener('DOMContentLoaded', inject());

 /********************************** ADDING LISTENER ******************************************/

/*
 * on load, add function on clicking the scrape button
 */
document.addEventListener('DOMContentLoaded', function()
{
	var l = document.getElementById('options-btn');
    l.addEventListener('click', function() {
      chrome.runtime.openOptionsPage();
    });
    var link = document.getElementById('scrape-btn');
    link.addEventListener('click', function() {
		document.getElementById("foodInject").innerHTML = "refreshing...";
		scrape(false);
		setTimeout(function(){
			document.getElementById("foodInject").innerHTML = "";
			setTimeout(function(){
				inject();
			}, 100);
		}, 3000);
    });
});