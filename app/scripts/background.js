'use strict';

chrome.runtime.onInstalled.addListener(function (details) {
  console.log('previousVersion', details.previousVersion);
});

chrome.tabs.onUpdated.addListener(function (tabId) {
  chrome.pageAction.show(tabId);
});

var calliopeAlert = new Audio('data/notice.mp3');

chrome.runtime.onMessageExternal.addListener(
  function(request, sender, sendResponse) {
    if (request.alert) { calliopeAlert.play(); }
  }
);

console.log('\'Allo \'Allo! Event Page for Page Action');
