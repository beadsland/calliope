'use strict';

var swipeLeft = function(reflink) {
  document.title = document.title.replace(/^.*—/u, "");
  var passcoll = document.getElementsByClassName("doubletake-pass-button");
  if (passcoll.length) {
    passcoll[0].click();
    if (alreadyWordCounts()) {
      alreadyWordCounts().remove();
      setTimeout(function() { parsePage() }, 500 + Math.random()*500);
    } else {
      setTimeout(function() { selectProfile() }, 500);
    }
  }
}

var badNoiseRatio = function(wc, fc) {
  var location = document.getElementsByClassName("cardsummary-location");
  if (location.length) {
    location = location[0].innerText;
    if (location == "Manhattan, NY") { return (wc-fc < 50 || fc/wc > 0.20) }
    if (location == "Brooklyn, NY") { return (wc-fc < 100 || fc/wc > 0.15) }
    if (location == "Philadephia, PA") { return (wc-fc < 150 || fc/wc > 0.125) }
    if (location == "Conshohocken, PA") { return (wc-fc < 150 || fc/wc > 0.11) }
    if (location.includes(", NJ")) { return (wc-fc < 150 || fc/wc > 0.10) }
  }
  return (wc-fc < 150 || fc/wc > 0.09);
}

var checkLeftPage = function(reflink) {
  console.log("awaiting departure...");
  if (document.location.href.includes("profile")) {
    setTimeout(function() { checkLeftPage(reflink) }, 2000);
  } else {
    selectProfile();
  }
}

var checkEye = function() {
  var essays = getEssays();
  if (essays.length) {
    document.title = "👁 " + document.title.replace("👁 ", "");
  } else {
    setTimeout(function() { checkEye() }, 1000);
  }
}

var handlePage = function(wc, fc, reflink, thislink) {
  console.log("handling...");
  if (!thislink) {
    document.title = "👁 " + document.title.replace("👁 ", "");
    setTimeout(function() { checkLeftPage(reflink) }, 2000);
  }
  if ( badNoiseRatio(wc, fc) ) {
    setTimeout(function() { swipeLeft(reflink) }, 500);
  } else {
    if (thislink) {
      window.location.href = thislink;
    } else {
      checkLeftPage(reflink);
    }
  }
}

var parsePage = function(essays, reflink, n) {
  window.scrollTo(0, 680);

  var realname = document.getElementsByClassName("cardsummary-realname");
  if (realname.length) {
    document.title = realname[0].innerText + "—" + document.title.replace(/^.*—/, "");
  } else {
    setTimeout(function() { checkEye() }, 2000);
    window.scrollTo(0, 230);
    var more = document.getElementsByClassName("profile-essays-expander");
    if (more.length) { more[0].click() }
  }

  var linkcoll = document.getElementsByClassName("cardsummary-profile-link");
  var thislink = "";
  if (linkcoll.length) {
    thislink = linkcoll[0].getElementsByTagName("a")[0].href;
  }
  console.log(thislink + " v. " + reflink);
  if (thislink == reflink) { document.location = "http://okcupid.com"; }
  else {
    if (!reflink && !n) { reflink = thislink; }

    console.log("parsing...");
    if (!essays) { essays = getEssays() }
    var wc = getEssayWordCounts(essays);
    if (typeof wc !== 'undefined') {
      setTimeout(function() { handlePage(wc[0], wc[1], reflink, thislink) }, 500);
    } else {
      setTimeout(function() { parsePage(essays, reflink, n) }, 500);
    }
  }
}

var loadStacks = function(stacks, n, reflink) {
  if (!document.getElementsByClassName("stacks-title-bar").length) {
    visitStacks(stacks, n-1, reflink);
  } else {
    if (document.getElementsByClassName("stacks-paywall").length) {
      visitStacks(stacks, n-1, reflink);
    }
  }
  setTimeout(function() {
    parsePage(getEssays(), reflink, n); }, 1000
  );
}

var visitStacks = function(stacks, n, reflink) {
  console.log("visiting...");
  window.scrollTo(0, 680);
  stacks[n].click();
  setTimeout(function() { loadStacks(stacks, n, reflink); }, 500);
}

var checkStacks = function(reflink) {
  console.log("checking...");
  window.scrollTo(0, 680);
  var stacks = document.getElementsByClassName("stacks-menu-item");
  if (stacks.length) {
    setTimeout(function() { visitStacks(stacks, stacks.length-1, reflink); }, 1000);
  }
  else { setTimeout(function() { selectProfile(reflink) }, 5000); }
}

var waitProfile = function() {
  console.log("waiting...");
  window.scrollTo(0, 680);
  var essays = getEssays();
  if (!essays.length) { setTimeout(function() { waitProfile() }, 3000); }
  else { setTimeout(function() { parsePage(essays); }, 1000); }
}

var getKeyDown = function(e) {
  if (!document.getElementsByClassName("messenger-composer").length) {
    console.log(e);
    if (e.key == "ArrowLeft") {
      document.getElementsByClassName("pass-pill-button")[0].click();
    }
    if (e.key == "ArrowRight") {
      document.getElementsByClassName("like-pill-button")[0].click();
    }
  }
}

var selectProfile = function(reflink) {
  console.log("selecting...");
  window.onkeydown = getKeyDown;
  if (!window.location.href.includes("profile")) { checkStacks(reflink); }
  else { waitProfile(); }
}

var checkReady = function() {
  if (alreadyWordCounts()) {
    setTimeout(function() { checkReady() }, 10000);
  } else {
    if (document.location.href.includes("okcupid.com")) {
      console.log("loading okcupid...");
      window.scrollTo(0, 680);
      if (document.readyState == "complete") { selectProfile(); }
      else { setTimeout(function() { checkReady() }, 3000); }
    }
  }
}

checkReady();
