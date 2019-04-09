/**
 * function to save the foods the user has inputted to chrome
 */
function saveData() {
  var data = {};//field input will go in here
  data['food'] = document.getElementById('foodInput').value;
  if (document.getElementById('enable_notifications').checked) {
    data['notifs'] = "on";
  } else {
    data['notifs'] = "off";
  }
  // save to chrome data
  // to save across devices use: chrome.storage.sync.set
  chrome.storage.local.set(data, function () {
    alertify.alert("Settings saved");
  });
}

// save data when save button is clicked on
document.getElementById('save-btn').onclick = saveData;

document.addEventListener('DOMContentLoaded', function()
{
  chrome.storage.local.get(['food','notifs'], function(res) {
    document.getElementById('foodInput').value = res.food;
    if (res.notifs == "off") {
      document.getElementById('enable_notifications').checked = false;
    }
  });
});