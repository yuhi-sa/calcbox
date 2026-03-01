document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  var jwtInput = document.getElementById('jwt-input');
  var errorMsg = document.getElementById('error-msg');
  var resultSection = document.getElementById('result');
  var expStatus = document.getElementById('exp-status');
  var jwtHeader = document.getElementById('jwt-header');
  var jwtPayload = document.getElementById('jwt-payload');
  var copyHeaderBtn = document.getElementById('copy-header-btn');
  var copyPayloadBtn = document.getElementById('copy-payload-btn');

  function copyToClipboard(text, btn) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        var original = btn.textContent;
        btn.textContent = 'Copied';
        setTimeout(function () {
          btn.textContent = original;
        }, 1500);
      });
    }
  }

  function base64urlDecode(str) {
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    while (str.length % 4) {
      str += '=';
    }
    try {
      var decoded = atob(str);
      var bytes = new Uint8Array(decoded.length);
      for (var i = 0; i < decoded.length; i++) {
        bytes[i] = decoded.charCodeAt(i);
      }
      return new TextDecoder().decode(bytes);
    } catch (e) {
      return null;
    }
  }

  function decodeJWT() {
    var token = jwtInput.value.trim();

    if (!token) {
      resultSection.hidden = true;
      errorMsg.hidden = true;
      return;
    }

    var parts = token.split('.');
    if (parts.length !== 3) {
      errorMsg.textContent = 'Invalid JWT format. A JWT must have three parts: xxxxx.yyyyy.zzzzz';
      errorMsg.hidden = false;
      resultSection.hidden = true;
      return;
    }

    var headerStr = base64urlDecode(parts[0]);
    var payloadStr = base64urlDecode(parts[1]);

    if (!headerStr || !payloadStr) {
      errorMsg.textContent = 'Base64url decoding failed. Please check the token format.';
      errorMsg.hidden = false;
      resultSection.hidden = true;
      return;
    }

    var header, payload;
    try {
      header = JSON.parse(headerStr);
    } catch (e) {
      errorMsg.textContent = 'Failed to parse header JSON.';
      errorMsg.hidden = false;
      resultSection.hidden = true;
      return;
    }
    try {
      payload = JSON.parse(payloadStr);
    } catch (e) {
      errorMsg.textContent = 'Failed to parse payload JSON.';
      errorMsg.hidden = false;
      resultSection.hidden = true;
      return;
    }

    errorMsg.hidden = true;

    jwtHeader.textContent = JSON.stringify(header, null, 2);
    jwtPayload.textContent = JSON.stringify(payload, null, 2);

    // Check expiration
    if (typeof payload.exp === 'number') {
      var now = Math.floor(Date.now() / 1000);
      if (payload.exp < now) {
        expStatus.textContent = 'Expired (expired on ' + new Date(payload.exp * 1000).toLocaleString('en-US') + ')';
        expStatus.style.background = 'var(--color-error-bg)';
        expStatus.style.color = 'var(--color-accent)';
        expStatus.style.border = '1px solid var(--color-error-border)';
      } else {
        expStatus.textContent = 'Valid (expires ' + new Date(payload.exp * 1000).toLocaleString('en-US') + ')';
        expStatus.style.background = '#dcfce7';
        expStatus.style.color = '#166534';
        expStatus.style.border = '1px solid #bbf7d0';
      }
    } else {
      expStatus.textContent = 'No exp (expiration) field';
      expStatus.style.background = 'var(--color-bg-secondary)';
      expStatus.style.color = 'var(--color-text-secondary)';
      expStatus.style.border = '1px solid var(--color-border)';
    }

    resultSection.hidden = false;
  }

  var debounceTimer = null;
  jwtInput.addEventListener('input', function () {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(decodeJWT, 300);
  });

  copyHeaderBtn.addEventListener('click', function () {
    copyToClipboard(jwtHeader.textContent, copyHeaderBtn);
  });

  copyPayloadBtn.addEventListener('click', function () {
    copyToClipboard(jwtPayload.textContent, copyPayloadBtn);
  });
});