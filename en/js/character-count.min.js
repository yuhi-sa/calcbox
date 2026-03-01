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

    // 文字数（スペース込み、改行除く）
    var charsWithSpace = text.replace(/\n/g, '').length;
    resultChars.textContent = charsWithSpace.toLocaleString();

    // 文字数（スペース除く）
    var charsNoSpace = text.replace(/[\s\n]/g, '').length;
    resultCharsNoSpace.textContent = charsNoSpace.toLocaleString();

    // 行数
    if (text === '') {
      resultLines.textContent = '0';
    } else {
      var lines = text.split('\n').length;
      resultLines.textContent = lines.toLocaleString();
    }

    // 段落数
    if (text.trim() === '') {
      resultParagraphs.textContent = '0';
    } else {
      var paragraphs = text.split(/\n\s*\n/).filter(function (p) {
        return p.trim() !== '';
      }).length;
      resultParagraphs.textContent = paragraphs.toLocaleString();
    }

    // バイト数
    var bytes = countBytes(text);
    resultBytes.textContent = bytes.toLocaleString() + ' バイト';

    // 原稿用紙換算（400字詰め）
    var sheets = Math.floor(charsWithSpace / 400);
    var remainder = charsWithSpace % 400;
    resultManuscript.textContent = sheets + '枚と' + remainder + '文字';
  }

  textInput.addEventListener('input', updateCounts);

  clearBtn.addEventListener('click', function () {
    textInput.value = '';
    updateCounts();
  });
});