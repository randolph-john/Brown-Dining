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
    alert("Settings saved");
  });
}

/**
 * function to send feedback email
 */
function sendEmail() {
  subject = "Brown Dining Service Feedback or Bug Report";
  body = "DATA: Foods: " + document.getElementById('foodInput').value + ";enable_notifications: " + document.getElementById('enable_notifications').checked + "          Please enter message below:";
  window.open('mailto:john_randolph@brown.edu?subject=' + subject  + '&body=' + body);
}

/**
 * function to show or hide div
 */
function showHide() {
  var x = document.getElementById("tips-div");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}

// save data when save button is clicked on
document.getElementById('save-btn').onclick = saveData;

// send email
document.getElementById('feedback-btn').onclick = sendEmail;

// show or hide tips + mistakes onclick
document.getElementById('tips-link').onclick = showHide;

document.addEventListener('DOMContentLoaded', function()
{
  chrome.storage.local.get(['food','notifs'], function(res) {
    document.getElementById('foodInput').value = res.food;
    if (res.notifs == "off") {
      document.getElementById('enable_notifications').checked = false;
    }
  });
});