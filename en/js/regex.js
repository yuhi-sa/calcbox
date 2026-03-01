document.addEventListener('DOMContentLoaded', function () {
  var patternInput = document.getElementById('regex-pattern');
  var testInput = document.getElementById('regex-test');
  var flagG = document.getElementById('flag-g');
  var flagI = document.getElementById('flag-i');
  var flagM = document.getElementById('flag-m');
  var calcBtn = document.getElementById('calc-btn');
  var resetBtn = document.getElementById('reset-btn');
  var resultSection = document.getElementById('result');
  var matchCount = document.getElementById('match-count');
  var matchResult = document.getElementById('match-result');
  var matchList = document.getElementById('match-list');

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  calcBtn.addEventListener('click', function () {
    var pattern = patternInput.value;
    var testStr = testInput.value;

    if (!pattern) {
      alert('Please enter a regex pattern.');
      return;
    }
    if (!testStr) {
      alert('Please enter a test string.');
      return;
    }

    var flags = '';
    if (flagG.checked) flags += 'g';
    if (flagI.checked) flags += 'i';
    if (flagM.checked) flags += 'm';

    var regex;
    try {
      regex = new RegExp(pattern, flags);
    } catch (e) {
      alert('Invalid regex pattern: ' + e.message);
      return;
    }

    // Find all matches (with iteration limit to prevent ReDoS)
    var matches = [];
    var match;
    var MAX_ITERATIONS = 10000;
    if (flags.indexOf('g') !== -1) {
      var count = 0;
      while ((match = regex.exec(testStr)) !== null) {
        matches.push({ value: match[0], index: match.index });
        if (match[0].length === 0) {
          regex.lastIndex++;
        }
        count++;
        if (count >= MAX_ITERATIONS) {
          alert('Too many matches (' + MAX_ITERATIONS + ' limit reached). Please review your pattern.');
          break;
        }
      }
    } else {
      match = regex.exec(testStr);
      if (match) {
        matches.push({ value: match[0], index: match.index });
      }
    }

    matchCount.textContent = matches.length + ' match' + (matches.length !== 1 ? 'es' : '');

    // Build highlighted result
    var highlighted = '';
    var lastIndex = 0;
    for (var i = 0; i < matches.length; i++) {
      var m = matches[i];
      highlighted += escapeHtml(testStr.substring(lastIndex, m.index));
      highlighted += '<mark style="background-color: #fef08a; padding: 1px 2px; border-radius: 2px;">' + escapeHtml(m.value) + '</mark>';
      lastIndex = m.index + m.value.length;
    }
    highlighted += escapeHtml(testStr.substring(lastIndex));
    matchResult.innerHTML = highlighted.replace(/\n/g, '<br>');

    // Build match list
    matchList.innerHTML = '';
    for (var j = 0; j < matches.length; j++) {
      var li = document.createElement('li');
      li.textContent = '"' + matches[j].value + '" (index: ' + matches[j].index + ')';
      matchList.appendChild(li);
    }

    resultSection.hidden = false;
    resultSection.scrollIntoView({ behavior: 'smooth' });
  });

  resetBtn.addEventListener('click', function () {
    patternInput.value = '';
    testInput.value = '';
    flagG.checked = true;
    flagI.checked = false;
    flagM.checked = false;
    resultSection.hidden = true;
  });
});