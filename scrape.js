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

/**
 * function to send a desktop notification to the user
 * item: the food item
 * eatery: the eatery where it is - must be Eatery Enum
 * time: breakfast, lunch, dinner
 */
function notify(item, time, eatery) {
	if (!Notification) {
		alertify.alert('Desktop notifications not available in your browser. Try Chromium.'); 
		return;
	}

	if (Notification.permission !== "granted")
		Notification.requestPermission();
	else {
		var notification = new Notification('Brown Dining Alert', {
			// TODO: update this icon
			icon: "icon.png",
			body: ("Food alert: " + item + " available at " + Eatery.properties[eatery].name + " for " + expandMeal(time)),
		});
		notification.onclick = function () {
			window.open(getURL(eatery));
		};
	}
}

/*
 * scrapes and returns the raw html from the page whose URL is passed in
 * url: the url to grab, as a string
 * day: the day of the week, as an int (1-7)
 * return: array in the form: even numbered indices are dayNum+food, odd numbered indices are dayNum+[Meal]
 */
 function scrapePage(url, callback, eatery) {

	$.get(url, function(response) {
		//console.log(response);
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
    	getItems(callback, items, eatery);
   });
};

/*
 * function to get url of menu page
 * eatery: the eatery, as an Enum
 */
function getMenuURL(eatery) {
	url = getURL(eatery);
	$.get(url, function(response) {
		//console.log(response);
	    var binStr = response;
    	var arr = binStr.split("\n");

    	var items = arr.filter(function(line) {
    		return line.includes("hidden-small");
    	});
    	//items is array with only one element - line with url
    	menuURL = items[0].slice(items[0].indexOf("href")+6, items[0].indexOf("target")-2);
		scrapePage(menuURL, checkItem, eatery);
   });

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

/* 
 * function that converts characters to full strings
 * shortKey: the short key to be converted
 * return: the longer version of the name
 */
function expandMeal(short) {
	if (short == 'B') {
		return "Breakfast";
	} else if (short == 'L') {
		return "Lunch";
	} else if (short == 'D') {
		return "Dinner";
	} else if (short == 'Br') {
		return "Brunch";
	} else	if (short == 'Ln') {
		return "Late night";
	} else if (short == 'L, D') {
		return "Lunch and dinner";
	} else if (short == "CB") {
		return "Continental Breakfast";
	} else {
		console.log("error expanding meal. Could not expand " + short);
		return "Unknown time";
	}
}

/*
 * function to grab, parse, and return what foods the user has saved
 */
function getItems(callback,page, eatery) {
	var fields = ['food','notifs'];
    chrome.storage.local.get(fields, function(res) {
    	foods = res.food.split(",");
    	//this is checkItem
    	notifs = true;
    	if (res.notifs == "off") {
    		notifs = false;
    	}
    	callback(page, foods, eatery, notifs);
	});
}

/*
 * function to check whether a specific item is available at an eatery at a certain day
 * eatery: the eatery to check
 * item: the item to check
 * day: the day to check (should be today)
 * return: void if not found, else the time of day
 */
function checkItem(page, foods, eatery, notifs) {
	var d = new Date();
	var day = d.getDay();
	if (day == 0) {
		day = 7;
	}
	var data = {};//field input will go in here
	data[Eatery.properties[eatery].name] = "";
	chrome.storage.local.set(data, function () {
		var toStore = "";
		for (index in foods) {
			var item = foods[index];
			if (item != "") {
				for (var i = 0; i < page.length; i++) {
					//console.log(page[i]);
					if (page[i].includes(item) && page[i].startsWith(day.toString())) {
						meal = page[i+1];
						meal = meal.slice(meal.indexOf("[")+1,meal.indexOf("]"));
						food = page[i].substring(1,page[i].length);
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
			//data[Eatery.properties[eatery].name] = res[Eatery.properties[eatery].name] + toStore;
			data[Eatery.properties[eatery].name] = toStore;
			chrome.storage.local.set(data, function () {
				//once storage has been saved
			});
		});
	});
}


/*
 * function to scrape
 */
function scrape() {
	var Eateries = [Eatery.RATTY, Eatery.ANDREWS, Eatery.VDUB, Eatery.BLUE, Eatery.IVY, Eatery.JOS]
	for (eatery in Eateries) {
		//first clear the saved data about this eatery
		//now perform the scrape of that eatery
		getMenuURL(Eateries[eatery]);
	}
}

//alternate way to do thing onclick
//document.getElementById('scrape-btn').onclick = scrape();

//alternate way to do thing onclick
document.addEventListener('DOMContentLoaded', function()
{
    var link = document.getElementById('scrape-btn');
    link.addEventListener('click', function() {
		document.getElementById("foodInject").innerHTML = "refreshing...";
		scrape();
		setTimeout(function(){
			document.getElementById("foodInject").innerHTML = "";
			setTimeout(function(){
				inject();
			}, 100);
		}, 3000);
    });
});