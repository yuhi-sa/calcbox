document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  var minInput = document.getElementById('rand-min');
  var maxInput = document.getElementById('rand-max');
  var countInput = document.getElementById('rand-count');
  var uniqueCheck = document.getElementById('rand-unique');
  var sortCheck = document.getElementById('rand-sort');

  var generateBtn = document.getElementById('generate-btn');
  var resetBtn = document.getElementById('reset-btn');
  var copyAllBtn = document.getElementById('copy-all-btn');
  var resultSection = document.getElementById('result');
  var resultSummary = document.getElementById('result-summary');
  var randomResults = document.getElementById('random-results');

  var lastResults = [];

  function getSecureRandom(min, max) {
    var range = max - min + 1;
    var array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return min + (array[0] % range);
  }

  generateBtn.addEventListener('click', function () {
    var min = parseInt(minInput.value, 10);
    var max = parseInt(maxInput.value, 10);
    var count = parseInt(countInput.value, 10);

    if (isNaN(min) || isNaN(max)) {
      alert('最小値と最大値を正しく入力してください。');
      return;
    }
    if (min > max) {
      alert('最小値は最大値以下にしてください。');
      return;
    }
    if (isNaN(count) || count < 1 || count > 1000) {
      alert('生成個数は1〜1000の範囲で入力してください。');
      return;
    }

    var range = max - min + 1;
    var unique = uniqueCheck.checked;

    if (unique && count > range) {
      alert('重複なしの場合、生成個数は範囲内の整数の数（' + range + '個）以下にしてください。');
      return;
    }

    var results = [];

    if (unique) {
      var used = {};
      while (results.length < count) {
        var num = getSecureRandom(min, max);
        if (!used[num]) {
          used[num] = true;
          results.push(num);
        }
      }
    } else {
      for (var i = 0; i < count; i++) {
        results.push(getSecureRandom(min, max));
      }
    }

    if (sortCheck.checked) {
      results.sort(function (a, b) { return a - b; });
    }

    lastResults = results;

    randomResults.innerHTML = '';
    for (var j = 0; j < results.length; j++) {
      var tag = document.createElement('span');
      tag.style.cssText = 'display:inline-block;padding:6px 12px;background:var(--color-bg-secondary);border:1px solid var(--color-border);border-radius:var(--radius-sm);font-size:0.95rem;font-weight:500;font-family:var(--font-mono);';
      tag.textContent = results[j];
      randomResults.appendChild(tag);
    }

    resultSummary.textContent = count + '個の乱数（' + min + '〜' + max + '）';
    resultSection.hidden = false;
    resultSection.scrollIntoView({ behavior: 'smooth' });
  });

  copyAllBtn.addEventListener('click', function () {
    if (lastResults.length === 0) return;
    var text = lastResults.join(', ');
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        var original = copyAllBtn.textContent;
        copyAllBtn.textContent = 'Copied';
        setTimeout(function () {
          copyAllBtn.textContent = original;
        }, 1500);
      });
    }
  });

  resetBtn.addEventListener('click', function () {
    minInput.value = '1';
    maxInput.value = '100';
    countInput.value = '10';
    uniqueCheck.checked = false;
    sortCheck.checked = false;
    randomResults.innerHTML = '';
    resultSummary.textContent = '';
    resultSection.hidden = true;
    lastResults = [];
  });
});