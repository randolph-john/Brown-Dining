/**
 * Brown Dining Alert, version 1.0
 * 2019
 * project of John Randolph
 *
 * TODO:
 * - QA
 * - detailed description for chome store
 * - screenshots for chrome store
 *** RELEASE VERSION 1
 * - fix bugs
 *    - put meals in order
 *    - when meal is found twice it is put in twice
 *    - if line is too long overflow is not accounted for
 * - make daily scrape work
 * - obtain list of all foods at all dining halls
 * - upgrade UI of putting in food preferences
 */

// class constant for the Eateries
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


 /********************************** HELPER FUNCTIONS ******************************************/

/**
 * function to send a desktop notification to the user
 * item: the food item
 * eatery: the eatery where it is - must be Eatery Enum
 * time: breakfast, lunch, dinner
 */
function notify(item, time, eatery) {
	if (!Notification) {
		alert('Desktop notifications not available in your browser.'); 
		return;
	}

	if (Notification.permission !== "granted")
		Notification.requestPermission();
	else {
		var notification = new Notification('Brown Dining Alert', {
			icon: "icon.png",
			body: ("Food alert: " + item + " available at " + Eatery.properties[eatery].name + " for " + expandMeal(time)),
		});
		notification.onclick = function () {
			window.open(getURL(eatery));
		};
	}
}

/* 
 * function that converts characters to full strings
 * short: the short key to be converted
 * return: the longer version of the name of the meal
 */
function expandMeal(short) {
	if (short.includes(",")) {
		long = "";
		for (i = 0; i < short.split(",").length-1; i++) {
			long += expandMeal(short.split(",")[i].trim()) + " & ";
		}
		long += expandMeal(short.split(",")[short.split(",").length-1].trim());
		return long;
	}
	if (short == 'B') {
		return "Breakfast";
	} else if (short == 'L') {
		return "Lunch";
	} else if (short == 'D') {
		return "Dinner";
	} else if (short == 'Br') {
		return "Brunch";
	} else if (short == 'Ln') {
		return "Late night";
	} else if (short == 'CB') {
		return "Continental Breakfast";
	} else {
		console.log("error expanding meal. Could not expand " + short);
		return "Unknown time";
	}
}

/*
 * function to get URL based on eatery
 * eatery: the eatery
 * return: the url, as a string
 */
function getURL(eatery) {
	if (eatery == Eatery.RATTY) {
		return 'https://dining.brown.edu/cafe/sharpe-refectory/';
	} else if (eatery == Eatery.ANDREWS) {
		return 'https://dining.brown.edu/cafe/andrews-commons/';
	} else if (eatery == Eatery.VDUB) {
		return 'https://dining.brown.edu/cafe/verney-woolley/';
	} else if (eatery == Eatery.BLUE) {
		return 'https://dining.brown.edu/cafe/blue-room/';
	} else if (eatery == Eatery.IVY) {
		return 'https://dining.brown.edu/cafe/ivy-room/';
	} else if (eatery == Eatery.JOS) {
		return 'https://dining.brown.edu/cafe/josiahs/';
	} else {
		throw "getURL of eatery is broken. Eatery passed in is likely not an Eatery Enum";
	}
}



 /********************************** SCRAPING FUNCTIONS ******************************************/

/*
 * function to scrape
 * invoked as start of program. Calls getMenuURL
 * notifs: true if it is an automatic scrape (vs a manual scrape)
 */
function scrape(notifs) {
	var Eateries = [Eatery.RATTY, Eatery.ANDREWS, Eatery.VDUB, Eatery.BLUE, Eatery.IVY, Eatery.JOS]
	for (eatery in Eateries) {
		//scrape for each eatery
		getMenuURL(Eateries[eatery], notifs);
	}
}

/*
 * function to get url of menu page. Calls scrapePage
 * eatery: the eatery, as an Enum
 * notifs: true if it is an automatic scrape (vs a manual scrape)
 */
function getMenuURL(eatery, notifs) {
	url = getURL(eatery);
	$.get(url, function(response) {
	    var binStr = response;
    	var arr = binStr.split("\n");

    	var items = arr.filter(function(line) {
    		return line.includes("hidden-small");
    	});
    	//items is array with only one element - line with url
    	menuURL = items[0].slice(items[0].indexOf("href")+6, items[0].indexOf("target")-2);
		scrapePage(menuURL, eatery, notifs);
   });

}

/*
 * scrapes the raw html from the page whose URL is passed in.
 * Then parses the data and passes to getItems.
 * url: the url to grab, as a string
 * eatery: the eatery to check
 * notifs: true if it is an automatic scrape (vs a manual scrape)
 */
 function scrapePage(url, eatery, notifs) {
	$.get(url, function(response) {
	    var binStr = response;
    	var arr = binStr.split("\n");
    	var dayNum = 1;
    	for (var i = 0; i < arr.length; i++) {
    		if (arr[i].includes("class=\"day cell_menu_item")) {
    			dayNum++;
    		}
    		if (arr[i].includes("spacer day")) {
    			dayNum = 0;
    		}
    		arr[i] = arr[i].replace("<strong>","<strong>"+dayNum);
    	}
    	var items = arr.filter(function(line) {
    		return (line.includes("<strong>") && !line.includes("<span class=\"collapsed\">")) || line.includes("daypart-abbr");
    	});
    	for (var i = 0; i < items.length; i++) {
    		items[i] = items[i].replace("<strong>","");
    		items[i] = items[i].replace("</strong>","");
    		items[i] = items[i].replace("<span class=\"daypart-abbr\">","");
    		items[i] = items[i].replace("</span>","");
    		items[i] = items[i].replace("</span>","");
    		items[i] = items[i].replace("<span='white-space: nowrap;'>","");
    		items[i] = items[i].replace("<span class=\"weelydesc\">","");
    		items[i] = items[i].replace("</div>","");
    		items[i] = items[i].trim();
    	}
    	getItems(items, eatery, notifs);
   });
};

/*
 * function to get the list of foods we want to check and pass on to checkItem
 * page: the (cleaned) HTML page, as an array of strings
 * eatery: the eatery to check
 * notifs: true if it is an automatic scrape (vs a manual scrape)
 */
function getItems(page, eatery, notifs) {
	var fields = ['food','notifs'];
    chrome.storage.local.get(fields, function(res) {
    	if (res.food) {
    		foods = res.food.split(",");
    	} else {
    		foods = ["chicken","pancakes"];
    	}
    	for (var i = 0; i < foods.length; i++) {
    		foods[i] = foods[i].trim();
    	}
    	if (res.notifs == "off") {
    		notifs = false;
    	}
    	checkItem(page, foods, eatery, notifs);
	});
}

/*
 * function to check whether a specific item is available at an eatery at a certain day
 * alerts and stores any found foods.
 * page: the HTML of a page, as an array of strings
 * foods: array of foods to check for
 * eatery: the eatery we are checking
 * notifs: true if the user desires notifs
 */
function checkItem(page, foods, eatery, notifs) {
	var d = new Date();
	var day = d.getDay();
	if (day == 0) {
		day = 7;
	}
	var data = {};//field input will go in here
	data[Eatery.properties[eatery].name] = "";
	//first clear the stored data
	chrome.storage.local.set(data, function () {
		var toStore = "";
		for (index in foods) {
			var item = foods[index];
			if (item != "") {
				for (var i = 0; i < page.length; i++) {
					if (page[i].includes(item) && page[i].startsWith(day.toString())) {
						meal = page[i+1];
						meal = meal.slice(meal.indexOf("[")+1,meal.indexOf("]"));
						food = page[i].substring(1,page[i].length);
						food = food.replace(".","");
						if (notifs) {
							notify(food, meal, eatery);
						}
						var addString = "" + food + "," + expandMeal(meal) + ".";
						toStore += addString;
					}
				}
			}
		}
		var fields = [Eatery.properties[eatery].name];
	    chrome.storage.local.get(fields, function(res) {
			var data = {};//field input will go in here
			data[Eatery.properties[eatery].name] = toStore;
			chrome.storage.local.set(data, function () {
				//once storage has been saved
			});
		});
	});
}

 /********************************** SCRAPE ONCE A DAY ******************************************/

// event: called when extension is installed or updated or Chrome is updated
function onInstalled() {
	var nd = new Date();
	nd.setHours(4);
	nd.setMinutes(0);
	nd.setDate(nd.getDate()+1);
    chrome.alarms.create('scrapeIt', {
        when: nd.getTime(), //this value should be the next day at 4 AM
        periodInMinutes: 1440
    });
}

// event: alarm raised
function onAlarm(alarm) {
	//include jquery
	var script = document.createElement('script');
	script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js';
	script.type = 'text/javascript';
	document.getElementsByTagName('head')[0].appendChild(script);

	//alert & scrape
    //alert("scraping from alarm");
    scrape(true);
}

// listen for extension install or update
chrome.runtime.onInstalled.addListener(onInstalled);

// listen for alarms
chrome.alarms.onAlarm.addListener(onAlarm);