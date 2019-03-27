// class constant for max number of loops allowed
var MAX_NUM_LOOPS = 9;
// class constant for max number of pages per loop allowed
var MAX_NUM_PAGES = 10;

// cached number of loops
var NUM_LOOPS = 1;
// cached number of pages for each loop
var NUM_PAGES = [3];
// cached array of array of strings
var PAGES = [];

/**
 * function to push the data to the server
 * alerts when done, successful or unsuccessful, sometimes...
 */
function pushToServer(data)
{
  $.ajax({
      type: 'POST',
      data: data,
      success: function(data) {
      }
    })
    .done(function() {
      alertify.alert("Successfully saved your loops to the server!");
    })
    .fail(function() {
      alertify.alert("Error");
    })
    .always(function() {
      //window.alert("Complete");
    });
}

/**
 * function to save the data the user has inputted to the server
 * first checks that something is entered in every page field
 * saves in three fields:
 * - 'num_loops' - int for the number of loops
 * - 'num_pages' - array of ints for the number of pages in each loop
 * - 'pages' - array of arrays of ints for the pages themselves
 */
function saveData() {
  var data = {};//field input will go in here
  // need num_loops, num_pages (array of ints) - num_pages_i, pages (array of array of ints) - page_i_j
  data['num_loops'] = document.getElementById('num_loops').value;
  num_pages = [];
  pages = [];
  for (i = 1; i <= data['num_loops']; i++)
  {
    next_num_pages = document.getElementById(("num_pages_" + i)).value;
    //check that there is something there
    if (!next_num_pages) {
      alertify.alert("Please enter the " + document.getElementById(("num_pages_" + i)).name + ".");
      return;
    }
    num_pages.push(next_num_pages);
    next_pages = [];
    for (j = 1; j <= next_num_pages; j++) {
      next_page = document.getElementById(("page_" + i + "_" + j)).value;
      if (!next_page) {
        alertify.alert("Please enter the " + document.getElementById(("page_" + i + "_" + j)).name + ".");
        return;
      }
      next_pages.push(next_page);
    }
    pages.push(next_pages);
  }
  data['num_pages'] = num_pages;
  data['pages'] = pages;
  // save to chrome data
  // to save across devices use: chrome.storage.sync.set
  chrome.storage.local.set(data, function () {
    pushToServer(data);
  });
}

/**
 * function to read data from the server and cache it 
 * in the local variables. Updates all local variables from 
 * the server
 */
function cacheData() {
  var fields = ['num_loops','num_pages','pages'];
  chrome.storage.local.get(fields, function(res) {
    if (res.num_loops != undefined) {
      NUM_LOOPS = res.num_loops; // int
      if (res.num_pages != undefined) {
        NUM_PAGES = res.num_pages; // array of ints
      } else {
        NUM_PAGES = [];
        for (i = 0; i < NUM_LOOPS; i++) {
          NUM_PAGES.push(3);
        }
      }
    } else {
      NUM_LOOPS = 1; // int
      NUM_PAGES = [3]; // array of ints
    }
    if (res.pages != undefined) {
      PAGES = res.pages;
    }
  });
}

/**
 * function to generate the num_loops_div - field for
 * number of loops - and insert it into the page
 */
function buildNumLoops() {
  html = "<div class = \"form-group\"><label for=\"\">Number of Loops</label><select name=\"number of Loops\" id=\"num_loops\" class = \"jr-dropdown\" ng-model=\"num_loops\" ng-init=\"num_loops = \'" + NUM_LOOPS + "\'\">";
  for (i = 1; i <= MAX_NUM_LOOPS; i++) {
    html = html + "<option value=\"" + i + "\">" + i + "</option>";
  }
  html = html + "</select></div>";
  document.getElementById("num_loops_div").innerHTML = html;
}

/**
 * function to generate the page - fields for
 * number of pages - and insert it into the page
 */
function buildNumPages() {
  html2 = "";
  for (i = 1; i <= MAX_NUM_PAGES; i++) { // for every loop
    init = 3;
    if (NUM_PAGES.length >= i) {
      init = NUM_PAGES[i-1]
    }
    html2 = html2 + "<div class = \"form-group\" ng-show=\"num_loops.toString() >= " + i + "\"><label>Number of pages in loop " + i + "</label><select name=\"number of pages in loop " + i + "\" id=\"num_pages_" + i + "\" class = \"jr-dropdown\" ng-model=\"num_pages_" + i + "\" ng-init=\"num_pages_" + i + " = '" + init + "'\">";
    for (j = 2; j <= MAX_NUM_PAGES; j++) {
      html2 = html2 + "<option value=\"" + j + "\">" + j + "</option>";
    } 
    html2 = html2 + "</select></div>";
  }
  document.getElementById("bodydiv").innerHTML = html2;
}

/**
 * function to generate the page - fields for
 * number of pages, number of loops, and page
 * names - and insert it into the page
 */
function buildPage() {
  html = "";
  for (i = 1; i <= MAX_NUM_LOOPS; i++) {
    html = html + "<option value=\"" + i + "\">" + i + "</option>";
  }
  html = html + "</select></div>";
  for (i = 1; i <= MAX_NUM_PAGES; i++) { // for every loop
    init = 3;
    if (NUM_PAGES.length >= i) {
      init = NUM_PAGES[i-1]
    }
    html = html + "<div class = \"form-group\" ng-show = \"num_loops.toString() >= " + i + "\"><label>Number of pages in loop " + i + "</label><select name=\"number of pages in loop " + i + "\" id=\"num_pages_" + i + "\" class = \"jr-dropdown\" ng-model=\"num_pages_" + i + "\" ng-init=\"num_pages_" + i + " = '" + init + "'\">";
    for (j = 2; j <= MAX_NUM_PAGES; j++) {
      html = html + "<option value=\"" + j + "\">" + j + "</option>";
    } 
    html = html + "</select>";
    for (j = 1; j <= MAX_NUM_PAGES; j++) { // for every page in that loop
      page_name = "page_" + i + "_" + j;
      html = html + "<div class = \"form-group\" ng-show = \"num_pages_" + i + ".toString() >= " + j + "\"><label for=\"\">Page " + j + "</label><input name=\"page " + j + " in loop " + i + "\" type=\"text\" id=\"" + page_name + "\" class = \"jr-text-box\"></div>";
    }
    html = html + "</div>";
  }
  start_num_loops = NUM_LOOPS;
  html = "<div class = \"form-group\"><label for=\"\">Number of Loops</label><select name=\"number of Loops\" id=\"num_loops\" class = \"jr-dropdown\" ng-model=\"num_loops\" ng-init=\"num_loops = \'" + start_num_loops + "\'\">" + html;
  document.getElementById("bodydiv").innerHTML = html;
}

/**
 * function to autofill the number of loops
 */
function restoreNumLoops() {
  document.getElementById("num_loops").value = NUM_LOOPS;
}

/**
 * function to autofill the page loop names
 * and field for number of pages
 */
function restorePages() {
  document.getElementById("num_loops").value = NUM_LOOPS;
  for (i = 0; i < PAGES.length; i++) { // for every loop
    document.getElementById(("num_pages_" + (i+1))).value = NUM_PAGES[i];
    for (j = 0; j < PAGES[i].length; j++) { // for every page in that loop
      page_name = "page_" + (i+1) + "_" + (j+1);
      document.getElementById(page_name).value = PAGES[i][j];
    }
  }
}

/**
 * function that is called when the options page is loaded. It:
 * - caches all data stored in the server
 * - generates the html to be injected and injects it
 */
function onLoad() {
  // want to:
  // - cache
  // - build numLoops
  // - restore numLoops - don't need?
  // - build numPages
  // - restore numPages
  // - build pages
  // - restore pages
  cacheData(); // caches all data in chrome storage to local
  buildNumLoops();
  /*setTimeout(function() {
    restoreNumLoops(); // autofills the number of loops
  }, 200);*/
  setTimeout(function() {
    buildNumPages();
  }, 200);
  /*buildPage(); // generates & injects the HTML and autofills num_loops and num_pages_i
  setTimeout(function() {
    restorePages(); // autofills all the pages
  }, 200);*/
}

document.addEventListener('DOMContentLoaded', onLoad);

document.getElementById('save').onclick = saveData;