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
      //alert("Complete");
    });
}

/**
 * function to save the foods the user has inputted to chrome
 */
function saveData() {
  var data = {};//field input will go in here
  data['food'] = document.getElementById('foodInput').value;
  // save to chrome data
  // to save across devices use: chrome.storage.sync.set
  chrome.storage.local.set(data, function () {
    pushToServer(data);
  });
}

// save data when save button is clicked on
document.getElementById('save-btn').onclick = saveData;

document.addEventListener('DOMContentLoaded', function()
{
  chrome.storage.local.get(['food'], function(res) {
    document.getElementById('foodInput').value = res.food;
  });
});