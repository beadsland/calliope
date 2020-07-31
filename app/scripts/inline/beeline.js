'use strict';

var toggleBeeline = function() {
  var x = document.getElementById("beeline-display");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}

var simulateKey = function(keyCode, type, modifiers) {
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

var pickNoiseCap = function(content) {
  var location = content.filter(
    node => node.classList.contains("encounters-story-section--location")
  )[0];
  var town = location.getElementsByClassName("location-widget__town")[0].innerText;
  var dist = location.getElementsByClassName("location-widget__distance");
  if (dist.length) {
    dist = Number(dist[0].innerText.match(/([0-9.]+) miles? away/)[1]);
  } else { dist = 100; }

  console.log(town, dist);

  console.log(content);
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
  
      
  if (town.includes(", New York")) { dist = Math.max(0.5, dist-2) / 2; }
  if (town.includes(", New Jersey")) { dist = Math.max(0.5, dist-2) / 3; }
  if (town.includes(", Pennsylvania")) { dist = Math.abs(dist-85); }    
    
  var cap = 1/dist;
  var words = 50*(1-cap);

  var lies = content.filter(
    node => node.classList.contains("encounters-story-section--question")
  );
  for (var lie of lies) {
    if (lie.children[0].innerText == "Two truths and a lie...") {
      words = words + 30; // overestimate word count devoted to being coy
      lie.children[1].children[0].style = "font-size: 90%; line-height: 90%";
      console.log(lie);
    }
  }

  return [cap, words];
}

var grabEssays = function(content) {
  var noiseCap = pickNoiseCap(content)
  console.log(noiseCap);
    
  var hr = document.createElement("hr");
  hr.style.margin="5px";

  var essays = content.filter( node => node.tagName.toUpperCase() != "FIGURE"
                            && node.className != "encounters-story-profile-image");
  console.log(essays);
  essays = essays.map( node => [...node.childNodes, hr] ).flat();
  essays = essays.map( node => node.cloneNode(true) );
  essays.push( document.createElement("p") );

  var div = document.createElement("div");
  essays.forEach(node => div.appendChild(node));
  var counts = getEssayWordCounts([div]);

  console.log(counts);
  var wc = counts[0];
  var fc = counts[1];

  essays.splice(1, 0, counts[2]);

  if ( (wc-fc < noiseCap[1]) || (fc/wc > noiseCap[0]) ) {
    var left = document.getElementsByClassName("encounters-action--dislike")[0];
    setTimeout(function() {
      console.log("swiping left...");
      left.click(left);
    }, 500 + 500*Math.random());
  } else {
    setTimeout(function() { 
      document.title = document.title.replace(/(^.*—)/u, "👁 $1"); 
      bleepBeat();
     }, 1000);
  }

  return essays;
}

var bleepBeat = function() {
  if (document.title.includes("👁")) {
    var calliopeExtensionId = "gjlhdlcfbflbmnfikgceeegbiedlbhbj";
    chrome.runtime.sendMessage(calliopeExtensionId, {alert: "alert"});
    setTimeout(function() { bleepBeat() }, 15000);    
  }
}

var stylePhotos = function(photos) {
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

var grabProfilePhoto = function(node) {
  if (node.className == "encounters-story-profile-image") {
    return node.children[0];
  } else { return node }  
}

var grabPhotos = function(content) {
  var photos = content.map( node => grabProfilePhoto(node) );
  var photos = photos.filter( node => node.tagName.toUpperCase() == "FIGURE" );
  photos = photos.map( node => [...node.childNodes] ).flat();
  photos = photos.filter( node => node.tagName.toUpperCase() == "PICTURE" );
  photos = photos.map( node => [node.children[0].cloneNode(true)] ).flat();
  if (photos.length > 1) {
    if (photos[0].currentSrc == photos[photos.length-1].currentSrc) { photos.pop(); }
  }

  if (photos.length) { return stylePhotos(photos); }
  else { return grabPhotos(content); }
}

var buildBeeline = function(content) {
  console.log("building...");

  var div = document.createElement("div");
  div.id = "beeline-display";
  div.style.position = "absolute";
  div.style.top = "10px";
  div.style.zIndex = "1";
  div.style.backgroundColor = "white";
  div.style.borderStyle = "dashed";
  div.style.padding = "10px";

  var essays = grabEssays(content);
  essays.forEach(function(item) { div.appendChild(item); });

  var photos = grabPhotos(content);
  div.appendChild(photos);

  var header = document.getElementsByClassName("encounters-story-profile__name");
  document.title = header[0].innerText + "—" + document.title; 
    
  return div;
}

var hookClick = function(value) {
  console.log(value);
  console.log(document.title.replace(/^.*—/u, ""));
  document.title = document.title.replace(/^.*—/u, "");
  var user = document.getElementById("beeline-display");
  if (user) { user.parentNode.removeChild(user); }
  var togg = document.getElementById("beeline-toggle");
  if (togg) { togg.parentNode.removeChild(togg); }
  setTimeout(function() { readProfile() }, 500);
}

var buildToggle = function() {
  var tog = document.createElement("button");
  tog.id = "beeline-toggle";
  tog.style.position = "absolute";
  tog.style.zIndex = "1";
  tog.style.top = "-5px";
  tog.style.backgroundColor = "#00ee00";
  tog.style.margin = "2px 2px";
  tog.setAttribute("onclick", "toggleBeeline()");
  tog.innerHTML = "<b>Toggle Beeline</b>";
  return tog;
}

var parseProfile = function(content) {
  console.log("parsing...");
  var user = document.getElementsByClassName("responsive-box")[0];

  var beeline = buildBeeline(content);
  user.parentNode.insertBefore(beeline, user);
  var toggle = buildToggle();
  user.parentNode.insertBefore(toggle, user);

  var controls = document.getElementsByClassName("encounters-controls__actions")[0];
  controls.addEventListener("click", hookClick);
  document.addEventListener("keydown", hookClick);
}

var reloadSite = function() {
  document.location.href = "http://www.okcupid.com/";
}

var checkEmpty = function() {
  console.log("checking if empty stack...");
  var content = document.getElementsByClassName("encounters-user__blocker");
  if (content.length) {
    console.log("preparing to launch alternate site...");
    setTimeout(function() { reloadSite(); }, 1000 * 60 * 10); 
  }
  else { setTimeout(function() { checkReady(); }, 1000); }
}    

var readProfile = function() {
  console.log("reading...");

  var content = document.getElementsByClassName("encounters-story__content");
  content = [...content];
  content = content.map( node => node.firstChild );
  
  if (!content.length) { setTimeout(function() { checkEmpty() }, 200); }
  else {
    var head = content.map( node => [...node.childNodes] ).flat();
    head = content.map( node => node.className );
    head = head.filter( cls => cls == "encounters-story-profile" );
    if (head.length != 1) { setTimeout(function() { checkReady() }, 200); }
    else { setTimeout(function() { parseProfile(content); }, 1000); }
  }
}

var checkLogin = function() {
  var buttons = document.getElementsByClassName("button");
  buttons = [...buttons];
  buttons = buttons.filter( button => button.dataset.seoLabel == "sign-in" );

  if (buttons.length) {
    console.log("logging in...");
    buttons[0].click();
    setTimeout(function() { checkReady() }, 3000);
  } else { readProfile(); }
}


var checkReady = function() {    
  if (alreadyWordCounts()) {
    setTimeout(function() { checkReady() }, 10000);
  } else {
    console.log("loading...");
    if (document.readyState == "complete") { checkLogin(); }
    else { setTimeout(function() { checkReady() }, 3000); }
  }
}

checkReady();

