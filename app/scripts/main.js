'use strict';

console.log('\'Allo \'Allo! Content script for calliope extension');

var injectJs = function(jsScript) {
  var s = document.createElement('script');
  s.textContent = jsScript;
  s.onload = function () { this.parentNode.removeChild(this); };
  document.head.appendChild(s);
};

var injectFlags = function(flags, list) {
  var flags = flags.toLowerCase().split("\n");
  flags = flags.map(flag => flag.trim()).join("\", \"");
  flags = "document.flagwords = document.flagwords.concat( [\"" + flags + "\"] )";
  injectJs(flags);
  if (list.length) {
    var url = list.shift();
    console.log("injecting " + url + "...");
    fetch(url).then( response => response.text() )
              .then( text => injectFlags(text, list) );
  } else {
    var mods = ['wordcount', 'doubletake', 'beeline'];
    mods = mods.map(item => chrome.runtime.getURL("scripts/inline/" + item + ".js") );
    injectMods("", mods);
  }
}

var injectMods = function(text, list) {
  injectJs(text);
  if (list.length) {
    var url = list.shift();
    console.log("injecting " + url + "...");
    fetch(url).then( response => response.text() )
              .then( text => injectMods(text, list) );
  };
}

injectJs("document.flagwords = [];");


var flags = ['bother', 'food', 'simple', 'travel', 'countries', 'cities',
             'bougie', 'gender', 'obsess', 'sports'];

flags = flags.map(item => chrome.runtime.getURL("data/" + item + ".txt") );
injectFlags("", flags);
