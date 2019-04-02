var Eatery = {
	RATTY: 1,
	ANDREWS: 2,
	VDUB: 3,
	BLUE: 4,
	IVY: 5,
	JOS: 6
}

/*
 * scrapes and returns the raw html from the page whose URL is passed in
 * url: the url to grab, as a string
 * day: the day of the week, as an int (1-7)
 * return: array in the form: even numbered indices are dayNum+food, odd numbered indices are dayNum+[Meal]
 */
function scrapePage(url, day) {

	var xhr = new XMLHttpRequest();
	xhr.open('GET', url, true);

	// Hack to pass bytes through unprocessed.
	xhr.overrideMimeType('text/plain; charset=x-user-defined');

	var rawHTML = "";

	var items;

	xhr.onreadystatechange = function(e) {
	  if (this.readyState == 4 && this.status == 200) {
	    var binStr = this.responseText;
    	rawHTML += binStr;
    	var arr = rawHTML.split("\n");

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
    	items = arr.filter(function(line) {
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
    	for (var i = 0; i < items.length; i++) {
    		console.log(items[i]);
    	}
	  }
	};

	xhr.send();
	return items;
};

/*
 * function to check whether a specific item is available at an eatery at a certain day
 * eatery: the eatery to check
 * item: the item to check
 * day: the day to check (should be today)
 * return: void if not found, else the time of day
 */
function checkItem(eatery, item, day) {
	url = "";
	if (eatery == Eatery.RATTY) {
		url = 'https://legacy.cafebonappetit.com/weekly-menu/239717';
	} else if (eatery == Eatery.ANDREWS) {
		url = 'https://legacy.cafebonappetit.com/weekly-menu/241433';
	} else if (eatery == Eatery.VDUB) {
		url = 'https://legacy.cafebonappetit.com/weekly-menu/239876';
	} else if (eatery == Eatery.BLUE) {
		url = 'https://legacy.cafebonappetit.com/weekly-menu/245495';
	} else if (eatery == Eatery.IVY) {
		url = 'https://legacy.cafebonappetit.com/weekly-menu/239716';
	} else if (eatery == Eatery.JOS) {
		url = 'https://legacy.cafebonappetit.com/weekly-menu/240101';
	}
	page = scrape(url, day);
	for (var i = 0; i < page.length; i++) {
		if (page[i].includes(item) && page[i].startsWith(day.toString())) {
			return page[i+1].substring(2,3);
		}
	}
	return null;
}

function scrape() {
	console.log(checkItem(Eatery.RATTY,"pancakes",3));
}

document.getElementById('scrape-btn').onclick = scrape;

//alternate way to do thing onclick
/*document.addEventListener('DOMContentLoaded', function()
{
    var link = document.getElementById('scrape-btn');
    link.addEventListener('click', function() {
    	alert("inasdf");
        notify("a","b","c");
    });
});*/