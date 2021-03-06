'use strict';

var toggleBumbleBeeline = function() {
  var x = document.getElementById("beeline-display");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}

var simulateBumbleKey = function(keyCode, type, modifiers) {
	var evtName = (typeof(type) === "string") ? "key" + type : "keydown";
	var modifier = (typeof(modifiers) === "object") ? modifier : {};

	var event = document.createEvent("HTMLEvents");
	event.initEvent(evtName, true, false);
	event.keyCode = keyCode;

	for (var i in modifiers) {
		event[i] = modifiers[i];
	}

	document.dispatchEvent(event);
}

var pickBumbleNoiseCap = function(content) {
  var location = content.filter(
    node => node.classList.contains("encounters-story-section--location")
  )[0];
  var town = location.getElementsByClassName("location-widget__town")[0].innerText;
  var dist = location.getElementsByClassName("location-widget__distance");
  if (dist.length) {
    dist = Number(dist[0].innerText.match(/([0-9.]+) miles? away/)[1]);
  } else { 
    if (town.includes("Manhattan")) {
        dist = 1.5
    } else {
        dist = 100; 
    }
  }

  console.log(town, dist);

//  console.log(content);
  var townP = document.createElement("div");
  townP.className = "p-2 font-weight-medium";
  townP.innerText = town;
  var detail = content.filter(
    node => node.classList.contains("encounters-story-profile")
  )[0];

  if (detail.children.length == 1) {
    detail.appendChild(document.createElement("div"));
  }
  if (detail.children.length == 2) {
    detail.insertBefore(document.createElement("div"), detail.lastElementChild);
  }
  if (detail.children.length == 3) {
    detail.children[1].appendChild(townP);
  }

  var truedist = dist;
    
  if (town.includes(", New York")) { dist = Math.max(0.5, dist-2) / 2; }
  if (town.includes("Staten Island")) { dist = dist * 1.5; }
  if (town.includes(", New Jersey")) { dist = Math.max(0.5, dist-2) / 3; }
  if (town.includes(", Pennsylvania")) { dist = Math.abs(dist-85) * 1.5; }  
    
//  dist = dist / 3;

  
  var header = document.getElementsByClassName("encounters-story-profile__age");
  var age = parseInt( header[0].lastChild.textContent );
  var myage = Date.now() - new Date(1973, 11, 11);
  myage = myage / (1000 * 60 * 60 * 24 * 365.25)     
  
  var agediff = Math.abs(myage - age) - .5;
  dist = dist + agediff/4;
    
  var cap = 1/(dist-3.75);
  if (cap < 0) { cap = 1 };
  console.log("Cap: ", cap);
  var words = 75*(1-cap);
  if (cap > .175) { cap = .175; }
  console.log("Words: ", words);

    //  if (words < 10) { words = 10; }
//  if (words < 10) { words = Math.min(10, (truedist-4)*2); }
//  console.log("Words: ", words);

  var lies = content.filter(
    node => node.classList.contains("encounters-story-section--question")
  );
  for (var lie of lies) {
    if (lie.children[0].innerText == "Two truths and a lie...") {
      words = words + 25; // overestimate word count devoted to being coy
      lie.children[1].children[0].style = "font-size: 90%; line-height: 90%";
      console.log(lie);
    }
  }

  return [cap, words];
}

var checkMatchQueue = function(name) {
  var spot = document.getElementsByClassName("contact-promo--feature-spotlight");
    
  if (name == getProfileName()) {
    if (spot.length == 0) {
        chrome.runtime.sendMessage(document.calliope.id, {playAlert: "beep"});
        setTimeout(function() { checkMatchQueue(name) }, 1000);
    } else {
        autoSwipeLeft();   
    }
  }
}

var autoSwipeLeft = function() {
    var left = document.getElementsByClassName("encounters-action--dislike")[0];
    setTimeout(function() {
    console.log("swiping left...");
    left.click(left);
    }, 500 + 500*Math.random());    
}

var autoSwipeRight = function() {
    var right = document.getElementsByClassName("encounters-action--like")[0];
    setTimeout(function() {
        chrome.runtime.sendMessage(document.calliope.id, {playAlert: "beep"});
        console.log("swiping RIGHT...");
        right.click(right);
    }, 500 + 500*Math.random());
    //      document.title = document.title.replace(/(^.*—)/u, "👁 $1");
    //      bleepBumbleBeat();
    //     }, 1000);    
}


var grabBumbleEssays = function(content) {
  var noiseCap = pickBumbleNoiseCap(content)

  var hr = document.createElement("hr");
  hr.style.margin="5px";

  var essays = content.filter( node => node.tagName.toUpperCase() != "FIGURE"
                            && node.className != "encounters-story-profile-image");
//  console.log(essays);
  essays = essays.map( node => [...node.childNodes, hr] ).flat();
  essays = essays.map( node => node.cloneNode(true) );
  essays.push( document.createElement("p") );

  var div = document.createElement("div");
  essays.forEach(node => div.appendChild(node));
  var counts = getEssayWordCounts([div]);

  console.log("noise cap:", noiseCap);
  console.log("counts:", counts);
  var wc = counts[0];
  var fc = counts[1];

  essays.splice(1, 0, counts[2]);

  if ( (wc-fc < noiseCap[1]) || (fc/wc > noiseCap[0]) ) {
    if ( (wc-fc < noiseCap[1]/2) || (fc/wc > noiseCap[0]*2) ) {
       autoSwipeLeft();
    } else {
       checkMatchQueue(getProfileName());
    }
  } else {
    autoSwipeRight();
  }

  return essays;
}

var getProfileName = function() {
    var header = document.getElementsByClassName("encounters-story-profile__name");
    return header[0].innerText
}

var bleepBumbleBeat = function() {
  if (document.title.includes("👁")) {
    chrome.runtime.sendMessage(document.calliope.id, {playAlert: "beep"});
    setTimeout(function() { bleepBumbleBeat() }, 15000);
  }
}

var styleBumblePhotos = function(photos) {
  var div = document.createElement("div");
  div.style.position = "absolute";
  div.style.zIndex = -1;
  div.style.top = "0px";
  div.style.right = "0px";
  div.style.margin = "5px";
  div.style.height = "120px";

  photos.forEach(function(item) {
    item.style.position = "relative";
    item.style.maxHeight = "100px";
    item.style.width = "auto";
    item.style.margin = "5px";
    div.append(item);
  });

  return div;
}

var grabBumbleProfilePhoto = function(node) {
  if (node.className == "encounters-story-profile-image") {
    return node.children[0];
  } else { return node }
}

var grabBumblePhotos = function(content) {
  var photos = content.map( node => grabBumbleProfilePhoto(node) );
  var photos = photos.filter( node => node.tagName.toUpperCase() == "FIGURE" );
  photos = photos.map( node => [...node.childNodes] ).flat();
  photos = photos.filter( node => node.tagName.toUpperCase() == "PICTURE" );
  photos = photos.map( node => [node.children[0].cloneNode(true)] ).flat();
  if (photos.length > 1) {
    if (photos[0].currentSrc == photos[photos.length-1].currentSrc) { photos.pop(); }
  }

  if (photos.length) { return styleBumblePhotos(photos); }
  else { return grabBumblePhotos(content); }
}

var buildBumbleBeeline = function(content) {
  console.log("building...");

  var div = document.createElement("div");
  div.id = "beeline-display";
  div.style.position = "absolute";
  div.style.top = "10px";
  div.style.zIndex = "1";
  div.style.backgroundColor = "white";
  div.style.borderStyle = "dashed";
  div.style.padding = "10px";

  var essays = grabBumbleEssays(content);
  essays.forEach(function(item) { div.appendChild(item); });

  var photos = grabBumblePhotos(content);
  div.appendChild(photos);

  document.title = getProfileName() + "—" + document.title;

  return div;
}

var hookBumbleClick = function(value) {
//  var counts = {};
//  document.profilewords.forEach(function(x) { counts[x] = (counts[x] || 0)+1; });
    
//  alert(counts);
    
  console.log(value);
  console.log(document.title.replace(/^.*—/u, ""));
  document.title = document.title.replace(/^.*—/u, "");
  var user = document.getElementById("beeline-display");
  if (user) { user.parentNode.removeChild(user); }
  var togg = document.getElementById("beeline-toggle");
  if (togg) { togg.parentNode.removeChild(togg); }
  setTimeout(function() { readBumbleProfile() }, 500);
}

var buildBumbleToggle = function() {
  var tog = document.createElement("button");
  tog.id = "beeline-toggle";
  tog.style.position = "absolute";
  tog.style.zIndex = "1";
  tog.style.top = "-5px";
  tog.style.backgroundColor = "#00ee00";
  tog.style.margin = "2px 2px";
  tog.setAttribute("onclick", "toggleBumbleBeeline()");
  tog.innerHTML = "<b>Toggle Beeline</b>";
  return tog;
}

var parseBumbleProfile = function(content) {
  console.log("parsing...");
  var user = document.getElementsByClassName("responsive-box")[0];

  var beeline = buildBumbleBeeline(content);
  user.parentNode.insertBefore(beeline, user);
  var toggle = buildBumbleToggle();
  user.parentNode.insertBefore(toggle, user);

  var controls = document.getElementsByClassName("encounters-controls__actions")[0];
  controls.addEventListener("click", hookBumbleClick);
  document.addEventListener("keydown", hookBumbleClick);
}

var reloadBumbleSite = function() {
  document.location.href = "http://www.bumble.com/app";
}

var checkBumbleEmpty = function() {
  console.log("checking if empty stack...");
  var content = document.getElementsByClassName("encounters-user__blocker");
  if (content.length) {
    console.log("preparing to launch alternate site...");
    setTimeout(function() { reloadBumbleSite(); }, 1000 * 60 * 10);
  }
  else { setTimeout(function() { checkBumbleReady(); }, 1000); }
}

var getKeyDown = function(e) {
  if (!document.getElementsByClassName("messenger-composer").length) {
    console.log(e);
    if (e.key == "ArrowLeft") {
      var left = document.getElementsByClassName("encounters-action--dislike")[0];
      console.log("left");
      //alert("left");
      left.click(left);
      e.preventDefault(); // none of this works, it left clicks anyway
      e.stopPropagation();
      return false
    }
    if (e.key == "ArrowRight") {
      var right = document.getElementsByClassName("encounters-action--superswipe")[0];
      console.log("right");
      alert("right");
      right.click(right);
      e.preventDefault(); // whether this works or not is moot as circumvented
      e.stopPropagation();
      return false
    }
  }
}

var readBumbleProfile = function() {
  console.log("reading...");
  window.onkeydown = getKeyDown;    
    
  var content = document.getElementsByClassName("encounters-story__content");
  content = [...content];
  content = content.map( node => node.firstChild );

  if (!content.length) { setTimeout(function() { checkBumbleEmpty() }, 200); }
  else {
    var head = content.map( node => [...node.childNodes] ).flat();
    head = content.map( node => node.className );
    head = head.filter( cls => cls == "encounters-story-profile" );
    if (head.length != 1) { setTimeout(function() { checkBumbleReady() }, 200); }
    else { setTimeout(function() { parseBumbleProfile(content); }, 1000); }
  }
}

var checkBumbleLogin = function() {
  var buttons = document.getElementsByClassName("button");
  buttons = [...buttons];
  buttons = buttons.filter( button => button.dataset.seoLabel == "sign-in" );

  if (buttons.length) {
    console.log("logging in...");
    buttons[0].click();
    setTimeout(function() { checkBumbleReady() }, 3000);
  } else { readBumbleProfile(); }
}


var checkBumbleReady = function() {
  if (alreadyWordCounts()) {
    setTimeout(function() { checkBumbleReady() }, 10000);
  } else {
    if (document.location.href.includes("bumble.com")) {
      console.log("loading bumble...");
      if (document.readyState == "complete") { checkBumbleLogin(); }
      else { setTimeout(function() { checkBumbleReady() }, 3000); }
    }
  }
}

checkBumbleReady();
