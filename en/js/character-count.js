document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  var textInput = document.getElementById('text-input');
  var clearBtn = document.getElementById('clear-btn');
  var resultChars = document.getElementById('result-chars');
  var resultCharsNoSpace = document.getElementById('result-chars-no-space');
  var resultLines = document.getElementById('result-lines');
  var resultParagraphs = document.getElementById('result-paragraphs');
  var resultBytes = document.getElementById('result-bytes');
  var resultManuscript = document.getElementById('result-manuscript');

  function countBytes(str) {
    return new Blob([str]).size;
  }

  function updateCounts() {
    var text = textInput.value;

    var charsWithSpace = text.replace(/\n/g, '').length;
    resultChars.textContent = charsWithSpace.toLocaleString();

    var charsNoSpace = text.replace(/[\s\n]/g, '').length;
    resultCharsNoSpace.textContent = charsNoSpace.toLocaleString();

    if (text === '') {
      resultLines.textContent = '0';
    } else {
      var lines = text.split('\n').length;
      resultLines.textContent = lines.toLocaleString();
    }

    if (text.trim() === '') {
      resultParagraphs.textContent = '0';
    } else {
      var paragraphs = text.split(/\n\s*\n/).filter(function (p) {
        return p.trim() !== '';
      }).length;
      resultParagraphs.textContent = paragraphs.toLocaleString();
    }

    var bytes = countBytes(text);
    resultBytes.textContent = bytes.toLocaleString() + ' bytes';

    var words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
    resultManuscript.textContent = words.toLocaleString() + ' words';
  }

  textInput.addEventListener('input', updateCounts);

  clearBtn.addEventListener('click', function () {
    textInput.value = '';
    updateCounts();
  });
});
