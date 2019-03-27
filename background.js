//CLASS VARIABLES:
NUM_PAGES = 0;
PAGES=[];
CURRENT_URL = "fakesite.com";

/*
 * strips the front of the url
 * @param url the url to be stripped
 * @return the stripped url
 */
function stripFront(url) {
    if (url.startsWith("https://")) {
        url = url.substring(8,url.length);
    } else if (url.startsWith("http://")) {
        url = url.substring(7,url.length);
    }
    if (url.startsWith("www.")) {
        url = url.substring(4,url.length);
    }
    if (url.endsWith("/")) {
        url = url.substring(0,url.length-1);
    }
    return url;
}

/*
 * strips the end of the url
 * @param url the url to be stripped
 * @return the stripped url
 */
function stripEnd(url) {
    if (url.indexOf(".com") != (-1)) {
        url = url.substring(0,url.indexOf(".com")+4);
    }
    return url;
}

/*
 * adds everything to the domain to turn it to a url
 * @param domain - the domain to be built up
 * @return built-up url
 */
function buildup(domain) {
    return ("https://www." + domain);
}

/**
 * gets the current URL of the tab the user is on
 * None if user is not on a tab
 * @return current tab url, None if not on tab
 */
function getCurrentURL() {
    theUrl = null;
    chrome.tabs.query({'active': true, 'currentWindow': true}, function (tabs) {
        theUrl = tabs[0].url;
    });
    setTimeout(function() {
        CURRENT_URL = theUrl;
    }, 50);
}

/**
 * gets the value of the stored pages in the loop
 * updates the class variables
 */
function getStoredLoop() {
  var fields = ['num_pages','page_one','page_two','page_three','page_four','page_five','page_six','page_seven','page_eight','page_nine'];
    chrome.storage.local.get(fields, function(res) {
        NUM_PAGES = res.num_pages;
        if (NUM_PAGES == 1) {
            PAGES = [stripFront(res.page_one)];
        } else if (NUM_PAGES == 2) {
            PAGES = [stripFront(res.page_one), stripFront(res.page_two)];
        } else if (NUM_PAGES == 3) {
            PAGES = [stripFront(res.page_one), stripFront(res.page_two), stripFront(res.page_three)];
        } else if (NUM_PAGES == 4) {
            PAGES = [stripFront(res.page_one), stripFront(res.page_two), stripFront(res.page_three), stripFront(res.page_four)];
        } else if (NUM_PAGES == 5) {
            PAGES = [stripFront(res.page_one), stripFront(res.page_two), stripFront(res.page_three), stripFront(res.page_four), 
                     stripFront(res.page_five)];
        } else if (NUM_PAGES == 6) {
            PAGES = [stripFront(res.page_one), stripFront(res.page_two), stripFront(res.page_three), stripFront(res.page_four), 
                     stripFront(res.page_five), stripFront(res.page_six)];
        } else if (NUM_PAGES == 7) {
            PAGES = [stripFront(res.page_one), stripFront(res.page_two), stripFront(res.page_three), stripFront(res.page_four), 
                     stripFront(res.page_five), stripFront(res.page_six), stripFront(res.page_seven)];
        } else if (NUM_PAGES == 8) {
            PAGES = [stripFront(res.page_one), stripFront(res.page_two), stripFront(res.page_three), stripFront(res.page_four), 
                     stripFront(res.page_five), stripFront(res.page_six), stripFront(res.page_seven), stripFront(res.page_eight)];
        } else if (NUM_PAGES == 9) {
            PAGES = [stripFront(res.page_one), stripFront(res.page_two), stripFront(res.page_three), stripFront(res.page_four), 
                     stripFront(res.page_five), stripFront(res.page_six), stripFront(res.page_seven), stripFront(res.page_eight),
                     stripFront(res.page_nine)];
        } else {
            alertify.alert("ERROR: num_pages not between 1 and 9");
        }
  });
}

// changes the page based on keystroke 
// and current page in loop 
chrome.commands.onCommand.addListener(function(command) {
    getStoredLoop();
    getCurrentURL();
    setTimeout(function() {
        current = stripFront(stripEnd(CURRENT_URL));
        if (command === "loop_one") {
            var found = false;
            for (i = 0; i < NUM_PAGES-1; i++) {
                if (current === stripEnd(PAGES[i])) {
                    chrome.tabs.update({url: buildup(PAGES[i+1])});
                    found = true;
                }
            }
            if (current === stripEnd(PAGES[NUM_PAGES-1]) || !found) {
                chrome.tabs.update({url: buildup(PAGES[0])});
                found = true;
            }
            //chrome.extension.sendMessage({action: "change_page", url: "facebook.com"});
        
        } else if (command === "loop_two") {
            chrome.extension.sendMessage({action: "change_page", url: "reddit.com/r/ultimate"});
        } else if (command === "loop_three"){
            chrome.extension.sendMessage({action: "change_page", url: "youtube.com"});
        }
    }, 100);
});

//sendResponse({disable: disabled});