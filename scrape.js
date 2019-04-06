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
		alert('Desktop notifications not available in your browser. Try Chromium.'); 
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
	    var binStr = response;
    	var arr = binStr.split("\n");

    	var dayNum = 1;
    	for (var i = 0; i < arr.length; i++) {
    		if (arr[i].includes("class=\"day cell_menu_item\"")) {
    			dayNum++;
    		}
    		if (arr[i].includes("spacer day")) {
    			dayNum = 0;
    		}
    		arr[i] = arr[i].replace("<strong>","<strong>"+dayNum);
    	}
    	var items = arr.filter(function(line) {
    		return line.includes("<strong>") && !line.includes("<span class=\"collapsed\">");
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
 * function to get URL based on eatery
 * eatery: the eatery
 * return: the url, as a string
 */
function getURL(eatery) {
	if (eatery == Eatery.RATTY) {
		return 'https://legacy.cafebonappetit.com/weekly-menu/245145';
	} else if (eatery == Eatery.ANDREWS) {
		return 'https://legacy.cafebonappetit.com/weekly-menu/241434';
	} else if (eatery == Eatery.VDUB) {
		return 'https://legacy.cafebonappetit.com/weekly-menu/243669';
	} else if (eatery == Eatery.BLUE) {
		return 'https://legacy.cafebonappetit.com/weekly-menu/244723';
	} else if (eatery == Eatery.IVY) {
		return 'https://legacy.cafebonappetit.com/weekly-menu/240612';
	} else if (eatery == Eatery.JOS) {
		return 'https://legacy.cafebonappetit.com/weekly-menu/246875';
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
		return "breakfast";
	} else if (short == 'L') {
		return "lunch";
	} else if (short == 'D') {
		return "dinner";
	} else if (short == 'Br') {
		return "brunch";
	} else	if (short == 'Ln') {
		return "late night";
	} else	if (short == 'L, D') {
		return "lunch and dinner";
	} else {
		console.log("error expanding meal. Could not expand " + short);
	}
}

/*
 * function to grab, parse, and return what foods the user has saved
 */
function getItems(callback,page, eatery) {
	var fields = ['food'];
    chrome.storage.local.get(fields, function(res) {
    	foods = res.food.split(",");
    	callback(page, foods, eatery);
	});
}

/*
 * function to check whether a specific item is available at an eatery at a certain day
 * eatery: the eatery to check
 * item: the item to check
 * day: the day to check (should be today)
 * return: void if not found, else the time of day
 */
function checkItem(page, foods, eatery) {
	var d = new Date();
	var day = d.getDay();
	if (day == 0) {
		day = 7;
	}
	var data = {};//field input will go in here
	data[Eatery.properties[eatery].name] = "";
	chrome.storage.local.set(data, function () {
		for (index in foods) {
			var item = foods[index];
			for (var i = 0; i < page.length; i++) {
				console.log(page[i]);
				if (page[i].includes(item) && page[i].startsWith(day.toString())) {
					meal = page[i+1];
					meal = meal.slice(meal.indexOf("[")+1,meal.indexOf("]"));
					food = page[i].substring(1,page[i].length);
					notify(food, meal, eatery);
					//TODO: change this to recording which foods are found, then move to a single storage update at the end of the for loop  
					var fields = [Eatery.properties[eatery].name];
				    chrome.storage.local.get(fields, function(res) {
						var data = {};//field input will go in here
						var addString = "" + food + " available at " + expandMeal(meal) + ". ";
						data[Eatery.properties[eatery].name] = res[Eatery.properties[eatery].name] + addString;
						chrome.storage.local.set(data, function () {
							//once storage has been saved
						});
					});

				}
			}
		}
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
		url = getURL(Eateries[eatery]);
		scrapePage(url, checkItem, Eateries[eatery]);
	}
}

//alternate way to do thing onclick
//document.getElementById('scrape-btn').onclick = scrape();

//alternate way to do thing onclick
document.addEventListener('DOMContentLoaded', function()
{
    var link = document.getElementById('scrape-btn');
    link.addEventListener('click', function() {
		scrape();
    });
});