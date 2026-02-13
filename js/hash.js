document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  var hashInput = document.getElementById('hash-input');
  var resultSection = document.getElementById('result');
  var sha1Value = document.getElementById('sha1-value');
  var sha256Value = document.getElementById('sha256-value');
  var sha512Value = document.getElementById('sha512-value');

  var debounceTimer = null;

  function arrayBufferToHex(buffer) {
    var byteArray = new Uint8Array(buffer);
    var hex = '';
    for (var i = 0; i < byteArray.length; i++) {
      hex += ('0' + byteArray[i].toString(16)).slice(-2);
    }
    return hex;
  }

  function computeHash(algorithm, text) {
    var encoder = new TextEncoder();
    var data = encoder.encode(text);
    return crypto.subtle.digest(algorithm, data).then(function (buffer) {
      return arrayBufferToHex(buffer);
    });
  }

  function calculateHashes() {
    var text = hashInput.value;

    if (text.length === 0) {
      resultSection.hidden = true;
      return;
    }

    Promise.all([
      computeHash('SHA-1', text),
      computeHash('SHA-256', text),
      computeHash('SHA-512', text)
    ]).then(function (results) {
      sha1Value.textContent = results[0];
      sha256Value.textContent = results[1];
      sha512Value.textContent = results[2];
      resultSection.hidden = false;
    });
  }

  hashInput.addEventListener('input', function () {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    debounceTimer = setTimeout(calculateHashes, 300);
  });

  // Copy buttons
  function copyToClipboard(text, btn) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        var original = btn.textContent;
        btn.textContent = 'コピー済み';
        setTimeout(function () {
          btn.textContent = original;
        }, 1500);
      });
    }
  }

  var copyBtns = document.querySelectorAll('.copy-btn');
  for (var i = 0; i < copyBtns.length; i++) {
    (function (btn) {
      btn.addEventListener('click', function () {
        var targetId = btn.getAttribute('data-target');
        var targetEl = document.getElementById(targetId);
        if (targetEl) {
          copyToClipboard(targetEl.textContent, btn);
        }
      });
    })(copyBtns[i]);
  }
});