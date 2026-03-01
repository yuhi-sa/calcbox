document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  var countInput = document.getElementById('uuid-count');
  var generateBtn = document.getElementById('generate-btn');
  var copyAllBtn = document.getElementById('copy-all-btn');
  var resultSection = document.getElementById('result');
  var uuidList = document.getElementById('uuid-list');
  var validateInput = document.getElementById('uuid-validate');
  var validateResult = document.getElementById('validate-result');

  function generateUUIDv4() {
    var bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    var hex = '';
    for (var i = 0; i < 16; i++) {
      hex += ('0' + bytes[i].toString(16)).slice(-2);
    }
    return hex.slice(0, 8) + '-' + hex.slice(8, 12) + '-' + hex.slice(12, 16) + '-' + hex.slice(16, 20) + '-' + hex.slice(20);
  }

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

  function generate() {
    var count = parseInt(countInput.value, 10);
    if (isNaN(count) || count < 1) count = 1;
    if (count > 100) count = 100;
    countInput.value = count;

    uuidList.innerHTML = '';
    var uuids = [];
    for (var i = 0; i < count; i++) {
      var uuid = generateUUIDv4();
      uuids.push(uuid);
      var row = document.createElement('div');
      row.style.cssText = 'display:flex;align-items:center;gap:var(--space-sm);margin-bottom:var(--space-xs);';
      var code = document.createElement('code');
      code.textContent = uuid;
      code.style.cssText = 'flex:1;font-family:var(--font-mono);font-size:0.9rem;word-break:break-all;';
      var btn = document.createElement('button');
      btn.className = 'btn btn--secondary';
      btn.textContent = 'コピー';
      btn.style.cssText = 'padding:4px 10px;font-size:0.8rem;white-space:nowrap;';
      (function (u, b) {
        b.addEventListener('click', function () {
          copyToClipboard(u, b);
        });
      })(uuid, btn);
      row.appendChild(code);
      row.appendChild(btn);
      uuidList.appendChild(row);
    }

    resultSection.hidden = false;
    copyAllBtn.hidden = false;

    copyAllBtn.onclick = function () {
      copyToClipboard(uuids.join('\n'), copyAllBtn);
    };
  }

  generateBtn.addEventListener('click', generate);

  var uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  validateInput.addEventListener('input', function () {
    var val = validateInput.value.trim();
    if (val.length === 0) {
      validateResult.textContent = '';
      return;
    }
    if (uuidRegex.test(val)) {
      var version = val.charAt(14);
      validateResult.textContent = '有効なUUID（v' + version + '）です';
      validateResult.style.color = 'var(--color-success, #22c55e)';
    } else {
      validateResult.textContent = '無効なUUID形式です';
      validateResult.style.color = 'var(--color-accent)';
    }
  });

  generate();
});