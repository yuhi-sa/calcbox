document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  var jsonInput = document.getElementById('json-input');
  var formatBtn = document.getElementById('format-btn');
  var minifyBtn = document.getElementById('minify-btn');
  var copyBtn = document.getElementById('copy-btn');
  var errorMsg = document.getElementById('error-msg');
  var resultSection = document.getElementById('result');
  var resultInfo = document.getElementById('result-info');
  var jsonOutput = document.getElementById('json-output');

  function hideError() {
    errorMsg.hidden = true;
    errorMsg.textContent = '';
  }

  function showError(msg) {
    errorMsg.textContent = msg;
    errorMsg.hidden = false;
    resultSection.hidden = true;
  }

  function showResult(text, mode) {
    hideError();
    jsonOutput.textContent = text;
    var bytes = new Blob([text]).size;
    var sizeStr = bytes < 1024 ? bytes + ' bytes' : (bytes / 1024).toFixed(1) + ' KB';
    resultInfo.textContent = mode + ' | ' + sizeStr;
    resultSection.hidden = false;
    resultSection.scrollIntoView({ behavior: 'smooth' });
  }

  formatBtn.addEventListener('click', function () {
    var raw = jsonInput.value.trim();
    if (!raw) {
      showError('Please enter JSON data.');
      return;
    }
    try {
      var parsed = JSON.parse(raw);
      var formatted = JSON.stringify(parsed, null, 2);
      showResult(formatted, 'Formatted');
    } catch (e) {
      showError('JSON syntax error: ' + e.message);
    }
  });

  minifyBtn.addEventListener('click', function () {
    var raw = jsonInput.value.trim();
    if (!raw) {
      showError('Please enter JSON data.');
      return;
    }
    try {
      var parsed = JSON.parse(raw);
      var minified = JSON.stringify(parsed);
      showResult(minified, 'Minified');
    } catch (e) {
      showError('JSON syntax error: ' + e.message);
    }
  });

  copyBtn.addEventListener('click', function () {
    var text = jsonOutput.textContent;
    if (!text) return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        var original = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        setTimeout(function () {
          copyBtn.textContent = original;
        }, 1500);
      });
    }
  });
});