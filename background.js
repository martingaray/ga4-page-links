// The toolbar action opens the global panel, including outside Analytics.
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })
  .catch(error => console.error("Could not enable the toolbar side panel:", error.message));
