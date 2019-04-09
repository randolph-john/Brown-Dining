/**
 * function to save the foods the user has inputted to chrome
 */
function saveData() {
  var data = {};//field input will go in here
  data['food'] = document.getElementById('foodInput').value;
  // save to chrome data
  // to save across devices use: chrome.storage.sync.set
  chrome.storage.local.set(data, function () {
    alertify.alert("Prefernces saved");
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