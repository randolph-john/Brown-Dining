# Brown Dining Alert
This is a **chome extension** that alerts the user when their favorite foods are served at the dining halls at **Brown University**.

### Structure  
 Manifest.json              => sets permissions and settings; calls other files  

  ├── options_page.html 	=> html of the settings page  

  |		└── saveData.js 	=> autofills user data; saves user input to chrome; adds dynamicism to buttons  

  ├── popup.html 			=> html of the popup box  

  |		└── popup.js        => injects foods; adds dynamicism to buttons  
  
  ├── scrape.js 			=> scrapes dining.brown.edu and saves data to chrome; creates alerts; runs once a day  
  ├── style.css 			=> CSS file  
  ├── icon.png 				=> the icon image  
  └── README.md 			=> this file  

### Usage

1. Install via chrome extension webstore (https://chrome.google.com/webstore)
2. Click on popup button (right of omnibar)
3. Click on 'settings' button in the popup
4. Enter your favorite foods into the text box
5. Select 'Enable daily desktop notifications' if desired
6. Click 'save'
7. Click on the popup button again
8. Click 'refresh'
9. Any available foods will be displayed

This is a project by **John Randolph** in **2019**. For complaints, bugs, or feedback, email the creator at John_Randolph@brown.edu