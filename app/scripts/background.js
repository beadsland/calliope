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
    if (request.playAlert) {
      calliopeAlert.play();
      sendResponse({playAlert: "ok"});
    } else {
      sendResponse({unknownMessage: request});
    }
  }
);

//chrome.runtime.onMessage.addListener(
//  function(request, sender, sendResponse) {
//    if (request.playAlert) {
//      sendResponse({calliopeId: "ok"});
//  });
