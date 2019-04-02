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
      alertify.alert("Successfully saved your foods to the server!");
    })
    .fail(function() {
      alertify.alert("Error");
    })
    .always(function() {
      window.alert("Complete");
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
 * function that is called when the options page is loaded. It:
 * - caches all data stored in the server
 * - generates the html to be injected and injects it
 */
function onLoad() {
}

document.addEventListener('DOMContentLoaded', onLoad);

document.getElementById('save').onclick = saveData;