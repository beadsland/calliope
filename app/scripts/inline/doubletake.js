'use strict';

var swipeLeft = function() {
  var passcoll = document.getElementsByClassName("doubletake-pass-button");
  if (passcoll.length) {
    passcoll[0].click();
    if (alreadyWordCounts()) {
      alreadyWordCounts().remove();
      setTimeout(function() { parsePage() }, 500 + Math.random()*500);
    } else {
      setTimeout(function() { checkStacks() }, 500);
    }
  }
}

var handlePage = function(wc, fc) {
  console.log("handling...");
  if ( (wc-fc < 150) || (fc/wc > 0.08) ) {
    setTimeout(function() { swipeLeft() }, 500);
  } else {
    var linkcoll = document.getElementsByClassName("cardsummary-profile-link");
    if (linkcoll.length) {
      window.location.href = linkcoll[0].getElementsByTagName("a")[0].href;
    } else {
      setTimeout(function() { checkStacks() }, 500);
    }
  }
}

var parsePage = function(essays) {
  console.log("parsing...");
  var wc = getEssayWordCounts(essays);
  if (typeof wc !== 'undefined') {
    setTimeout(function() { handlePage(wc[0], wc[1]) }, 500);
  }
}

var loadStacks = function(stacks, n) {
  if (!document.getElementsByClassName("stacks-title-bar").length) {
    visitStacks(stacks, n-1);
  } else {
    if (document.getElementsByClassName("stacks-paywall").length) {
      visitStacks(stacks, n-1);
    }
  }
  setTimeout(function() { parsePage(getEssays()); }, 1000);
}

var visitStacks = function(stacks, n) {
  console.log("visiting...");
  console.log(stacks.length);
  stacks[n].click();
  setTimeout(function() { loadStacks(stacks, n); }, 500);
}

var checkStacks = function() {
  console.log("checking...");
  var stacks = document.getElementsByClassName("stacks-menu-item");
  if (stacks.length) {
    setTimeout(function() { visitStacks(stacks, stacks.length-1); }, 1000);
  }
  else { setTimeout(function() { checkStacks() }, 5000); }
}

var waitProfile = function() {
  console.log("waiting...");
  var essays = getEssays();
  if (!essays.length) { setTimeout(function() { waitProfile() }, 3000); }
  else { setTimeout(function() { parsePage(essays); }, 1000); }
}

var selectProfile = function() {
  console.log("selecting...");
  if (window.location.href.indexOf("profile") == -1) { checkStacks(); }
  else { waitProfile(); }
}

var checkReady = function() {
  if (alreadyWordCounts()) {
    setTimeout(function() { checkReady() }, 10000);
  } else {
    console.log("loading...");
    if (document.readyState == "complete"  &&
       document.location.href.includes("okcupid.com")) { selectProfile(); }
    else { setTimeout(function() { checkReady() }, 3000); }
  }
}

checkReady();
