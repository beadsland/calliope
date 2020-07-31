'use strict';

var getEssays = function() {
  var essays = document.getElementsByClassName("qmessays");
  if (essays.length) { return essays; }
  else {
    essays = document.getElementsByClassName("profile-essays");
    if (essays.length) { return essays; } else { return []; }
  }
}

var strikeWords = function(para, text) {
  if (para.innerHTML.indexOf('</s>') == -1) {
    document.flagwords.forEach(function (item, index) {
      if (item > "") {
        var regex = new RegExp('\\b(' + item + ')\\b', 'gi');
        text = text.replace(regex, '<s>$1</s>');
      }
    });
    para.innerHTML = text;
  };
}

var getEssayWords = function(essays) {
  if (!essays) { essays = getEssays(); }
  if (essays.length) {
    var paragraphs = essays[0].getElementsByTagName("p");

    var words = [];
    for (var index = 0; index < paragraphs.length; index++) {
      var text = paragraphs[index].innerText;
      strikeWords(paragraphs[index], text)
      text = text.toLowerCase();
      words = words.concat( text.match(/\w+/g) );
    }
    if (paragraphs.length) { return words };
  }
}

const wcId = "calliope-wordcounts";

var formatWordCountDetails = function(wc, fc) {
  var newIcon = document.createElement("div");
  newIcon.setAttribute("class", "matchprofile-details-icon");
  newIcon.setAttribute("style", "font-size: 150%; top: 1px; display: inline-block");
  newIcon.innerText = "✒️";

  var newText = document.createElement("div");
  newText.setAttribute("class", "matchprofile-details-text");
  newText.setAttribute("style", "display: inline-block");
  var str = fc + " : " + wc + " (" + Math.round(fc/wc*1000)/10 + "%)";
  newText.innerHTML = str.bold();

  var newItem = document.createElement("div");
  newItem.appendChild(newIcon);
  newItem.appendChild(newText);
  newItem.setAttribute("id", wcId);
  newItem.setAttribute("class", "matchprofile-details-section");

  return newItem;
}

var injectWordCountDetails = function(wc, fc) {
  var newItem = formatWordCountDetails(wc, fc);
  var details = document.getElementsByClassName("matchprofile-details")[0];
  if (details) { details.insertBefore(newItem, details.childNodes[0]); }
  return newItem;
}

var alreadyWordCounts = function() {
  return document.getElementById(wcId);
}

var getEssayWordCounts = function(essays) {
  if (!alreadyWordCounts()) {
    var words = getEssayWords(essays);

    if (words && words.length) {
      var wc = words.length;
      var fc = words.reduce(function ( count, word ) {
        if (document.flagwords.includes(word)) { count = count + 1; }
        return count;
      }, 0);

      console.log(fc + " / " + wc);
      if (wc) { var det = injectWordCountDetails(wc, fc); }
      return [wc, fc, det];
    }
  }
}
