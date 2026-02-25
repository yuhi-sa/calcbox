document.addEventListener('DOMContentLoaded', function () {
  var textBefore = document.getElementById('text-before');
  var textAfter = document.getElementById('text-after');
  var compareBtn = document.getElementById('compare-btn');
  var resetBtn = document.getElementById('reset-btn');
  var resultSection = document.getElementById('result');
  var diffOutput = document.getElementById('diff-output');
  var diffResult = document.getElementById('diff-result');
  var beforeCount = document.getElementById('before-count');
  var afterCount = document.getElementById('after-count');
  var charDiff = document.getElementById('char-diff');
  var addedLines = document.getElementById('added-lines');
  var removedLines = document.getElementById('removed-lines');

  function escapeHtml(text) {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  // Simple LCS-based line diff
  function lcs(a, b) {
    var m = a.length;
    var n = b.length;
    var dp = [];
    for (var i = 0; i <= m; i++) {
      dp[i] = [];
      for (var j = 0; j <= n; j++) {
        dp[i][j] = 0;
      }
    }
    for (var i = 1; i <= m; i++) {
      for (var j = 1; j <= n; j++) {
        if (a[i - 1] === b[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1] + 1;
        } else {
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        }
      }
    }
    return dp;
  }

  function getDiff(aLines, bLines) {
    var dp = lcs(aLines, bLines);
    var result = [];
    var i = aLines.length;
    var j = bLines.length;

    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && aLines[i - 1] === bLines[j - 1]) {
        result.unshift({ type: 'equal', text: aLines[i - 1] });
        i--;
        j--;
      } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
        result.unshift({ type: 'added', text: bLines[j - 1] });
        j--;
      } else {
        result.unshift({ type: 'removed', text: aLines[i - 1] });
        i--;
      }
    }

    return result;
  }

  compareBtn.addEventListener('click', function () {
    var before = textBefore.value;
    var after = textAfter.value;

    if (!before && !after) {
      alert('比較するテキストを入力してください。');
      return;
    }

    var aLines = before.split('\n');
    var bLines = after.split('\n');

    var MAX_LINES = 3000;
    if (aLines.length > MAX_LINES || bLines.length > MAX_LINES) {
      alert('テキストが大きすぎます。各テキストは' + MAX_LINES + '行以内にしてください。');
      return;
    }
    var diff = getDiff(aLines, bLines);

    var added = 0;
    var removed = 0;
    var html = '';

    for (var i = 0; i < diff.length; i++) {
      var d = diff[i];
      var lineText = escapeHtml(d.text || '');
      if (!lineText && d.text === '') lineText = '&nbsp;';

      if (d.type === 'added') {
        added++;
        html += '<div style="background:#dcfce7;color:#166534;padding:2px 8px;border-left:3px solid #22c55e;">+ ' + lineText + '</div>';
      } else if (d.type === 'removed') {
        removed++;
        html += '<div style="background:#fee2e2;color:#991b1b;padding:2px 8px;border-left:3px solid #ef4444;">- ' + lineText + '</div>';
      } else {
        html += '<div style="padding:2px 8px;border-left:3px solid transparent;">&nbsp; ' + lineText + '</div>';
      }
    }

    beforeCount.textContent = before.length + ' 文字';
    afterCount.textContent = after.length + ' 文字';
    var diff_val = after.length - before.length;
    if (diff_val > 0) {
      charDiff.textContent = '+' + diff_val + ' 文字';
      charDiff.style.color = '#22c55e';
    } else if (diff_val < 0) {
      charDiff.textContent = diff_val + ' 文字';
      charDiff.style.color = '#ef4444';
    } else {
      charDiff.textContent = '0 文字（変更なし）';
      charDiff.style.color = '';
    }
    addedLines.textContent = '+' + added + ' 行';
    removedLines.textContent = '-' + removed + ' 行';

    diffResult.innerHTML = html;
    resultSection.hidden = false;
    diffOutput.hidden = false;
    resultSection.scrollIntoView({ behavior: 'smooth' });
  });

  resetBtn.addEventListener('click', function () {
    textBefore.value = '';
    textAfter.value = '';
    resultSection.hidden = true;
    diffOutput.hidden = true;
    diffResult.innerHTML = '';
  });
});
