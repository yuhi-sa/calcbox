document.addEventListener('DOMContentLoaded', function () {
  var inputArea = document.getElementById('encode-input');
  var outputArea = document.getElementById('encode-output');
  var outputGroup = document.getElementById('output-group');
  var encodeBtn = document.getElementById('encode-btn');
  var decodeBtn = document.getElementById('decode-btn');
  var resetBtn = document.getElementById('reset-btn');
  var copyBtn = document.getElementById('copy-btn');

  function getSelectedType() {
    var radios = document.querySelectorAll('input[name="encode-type"]');
    for (var i = 0; i < radios.length; i++) {
      if (radios[i].checked) return radios[i].value;
    }
    return 'base64';
  }

  function encodeText(text, type) {
    switch (type) {
      case 'base64':
        return btoa(unescape(encodeURIComponent(text)));
      case 'url':
        return encodeURIComponent(text);
      case 'html':
        return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
      default:
        return text;
    }
  }

  function decodeText(text, type) {
    switch (type) {
      case 'base64':
        return decodeURIComponent(escape(atob(text)));
      case 'url':
        return decodeURIComponent(text);
      case 'html':
        var doc = new DOMParser().parseFromString(text, 'text/html');
        return doc.documentElement.textContent;
      default:
        return text;
    }
  }

  encodeBtn.addEventListener('click', function () {
    var text = inputArea.value;
    if (!text) {
      alert('テキストを入力してください。');
      return;
    }
    var type = getSelectedType();
    try {
      var result = encodeText(text, type);
      outputArea.value = result;
      outputGroup.hidden = false;
    } catch (e) {
      alert('エンコードに失敗しました。入力内容を確認してください。');
    }
  });

  decodeBtn.addEventListener('click', function () {
    var text = inputArea.value;
    if (!text) {
      alert('テキストを入力してください。');
      return;
    }
    var type = getSelectedType();
    try {
      var result = decodeText(text, type);
      outputArea.value = result;
      outputGroup.hidden = false;
    } catch (e) {
      alert('デコードに失敗しました。入力内容を確認してください。');
    }
  });

  copyBtn.addEventListener('click', function () {
    if (window.CalcBox && CalcBox.copy) {
      CalcBox.copy.copyText(outputArea.value);
    } else if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(outputArea.value);
    }
  });

  resetBtn.addEventListener('click', function () {
    inputArea.value = '';
    outputArea.value = '';
    outputGroup.hidden = true;
  });
});