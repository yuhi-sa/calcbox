document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  var UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
  var NUMBERS = '0123456789';
  var SYMBOLS = '!@#$%^&*()-_=+[]{}|;:,.<>?/~`';

  var pwLengthInput = document.getElementById('pw-length');
  var pwCountInput = document.getElementById('pw-count');
  var useUppercase = document.getElementById('use-uppercase');
  var useLowercase = document.getElementById('use-lowercase');
  var useNumbers = document.getElementById('use-numbers');
  var useSymbols = document.getElementById('use-symbols');

  var generateBtn = document.getElementById('generate-btn');
  var resetBtn = document.getElementById('reset-btn');
  var resultSection = document.getElementById('result');
  var passwordList = document.getElementById('password-list');

  function getSecureRandom(max) {
    var array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return array[0] % max;
  }

  function generatePassword(length, charset) {
    var password = '';
    for (var i = 0; i < length; i++) {
      password += charset[getSecureRandom(charset.length)];
    }
    return password;
  }

  function evaluateStrength(length, charsetSize) {
    var entropy = length * (Math.log(charsetSize) / Math.log(2));
    if (entropy < 40) return { label: 'Weak', level: 1 };
    if (entropy < 60) return { label: 'Medium', level: 2 };
    if (entropy < 80) return { label: 'Strong', level: 3 };
    return { label: 'Very Strong', level: 4 };
  }

  function copyToClipboard(text, btn) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        var original = btn.textContent;
        btn.textContent = 'Copied!';
        setTimeout(function () { btn.textContent = original; }, 1500);
      });
    }
  }

  generateBtn.addEventListener('click', function () {
    var length = parseInt(pwLengthInput.value, 10);
    if (isNaN(length) || length < 8 || length > 64) { alert('Password length must be between 8 and 64.'); return; }

    var count = parseInt(pwCountInput.value, 10);
    if (isNaN(count) || count < 1 || count > 10) { alert('Number of passwords must be between 1 and 10.'); return; }

    var charset = '';
    var charsetSize = 0;
    if (useUppercase.checked) { charset += UPPERCASE; charsetSize += UPPERCASE.length; }
    if (useLowercase.checked) { charset += LOWERCASE; charsetSize += LOWERCASE.length; }
    if (useNumbers.checked) { charset += NUMBERS; charsetSize += NUMBERS.length; }
    if (useSymbols.checked) { charset += SYMBOLS; charsetSize += SYMBOLS.length; }

    if (charset.length === 0) { alert('Please select at least one character type.'); return; }

    var strength = evaluateStrength(length, charsetSize);
    passwordList.innerHTML = '';

    for (var i = 0; i < count; i++) {
      var pw = generatePassword(length, charset);
      var item = document.createElement('div');
      item.className = 'result__item';
      item.style.cssText = 'flex-direction: column; align-items: stretch; gap: 8px;';

      var pwRow = document.createElement('div');
      pwRow.style.cssText = 'display: flex; align-items: center; gap: 8px;';

      var pwText = document.createElement('code');
      pwText.style.cssText = 'flex: 1; word-break: break-all; font-size: 1rem; padding: 8px; background: var(--color-bg-secondary, #f5f5f5); border-radius: 4px; font-family: monospace;';
      pwText.textContent = pw;

      var copyBtn = document.createElement('button');
      copyBtn.type = 'button';
      copyBtn.className = 'btn btn--secondary';
      copyBtn.style.cssText = 'padding: 6px 14px; font-size: 0.85rem; white-space: nowrap;';
      copyBtn.textContent = 'Copy';
      (function (password, button) {
        button.addEventListener('click', function () { copyToClipboard(password, button); });
      })(pw, copyBtn);

      pwRow.appendChild(pwText);
      pwRow.appendChild(copyBtn);
      item.appendChild(pwRow);

      var meterRow = document.createElement('div');
      meterRow.style.cssText = 'display: flex; align-items: center; gap: 8px;';

      var meterLabel = document.createElement('span');
      meterLabel.style.cssText = 'font-size: 0.85rem; color: var(--color-text-secondary); white-space: nowrap;';
      meterLabel.textContent = 'Strength:';

      var meterBar = document.createElement('div');
      meterBar.style.cssText = 'flex: 1; height: 6px; background: var(--color-bg-secondary, #e0e0e0); border-radius: 3px; overflow: hidden;';

      var meterFill = document.createElement('div');
      var widthPercent = (strength.level / 4) * 100;
      var fillColor = '#e74c3c';
      if (strength.level === 2) fillColor = '#f39c12';
      if (strength.level === 3) fillColor = '#27ae60';
      if (strength.level === 4) fillColor = '#2980b9';
      meterFill.style.cssText = 'height: 100%; border-radius: 3px; width: ' + widthPercent + '%; background: ' + fillColor + '; transition: width 0.3s;';

      meterBar.appendChild(meterFill);

      var meterText = document.createElement('span');
      meterText.style.cssText = 'font-size: 0.85rem; font-weight: 600; white-space: nowrap; color: ' + fillColor + ';';
      meterText.textContent = strength.label;

      meterRow.appendChild(meterLabel);
      meterRow.appendChild(meterBar);
      meterRow.appendChild(meterText);
      item.appendChild(meterRow);

      passwordList.appendChild(item);
    }

    resultSection.hidden = false;
    resultSection.scrollIntoView({ behavior: 'smooth' });
  });

  resetBtn.addEventListener('click', function () {
    pwLengthInput.value = '16';
    pwCountInput.value = '1';
    useUppercase.checked = true;
    useLowercase.checked = true;
    useNumbers.checked = true;
    useSymbols.checked = true;
    passwordList.innerHTML = '';
    resultSection.hidden = true;
  });
});
