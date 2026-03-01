document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  var checkboxes = {
    'owner-r': document.getElementById('owner-r'),
    'owner-w': document.getElementById('owner-w'),
    'owner-x': document.getElementById('owner-x'),
    'group-r': document.getElementById('group-r'),
    'group-w': document.getElementById('group-w'),
    'group-x': document.getElementById('group-x'),
    'others-r': document.getElementById('others-r'),
    'others-w': document.getElementById('others-w'),
    'others-x': document.getElementById('others-x')
  };

  var octalInput = document.getElementById('octal-input');
  var symbolicOutput = document.getElementById('symbolic-output');
  var chmodCmd = document.getElementById('chmod-cmd');
  var copyOctalBtn = document.getElementById('copy-octal-btn');
  var copySymbolicBtn = document.getElementById('copy-symbolic-btn');
  var copyCmdBtn = document.getElementById('copy-cmd-btn');

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

  function getOctalDigit(who) {
    var val = 0;
    if (checkboxes[who + '-r'].checked) val += 4;
    if (checkboxes[who + '-w'].checked) val += 2;
    if (checkboxes[who + '-x'].checked) val += 1;
    return val;
  }

  function getSymbolicPart(who) {
    var r = checkboxes[who + '-r'].checked ? 'r' : '-';
    var w = checkboxes[who + '-w'].checked ? 'w' : '-';
    var x = checkboxes[who + '-x'].checked ? 'x' : '-';
    return r + w + x;
  }

  function updateFromCheckboxes() {
    var owner = getOctalDigit('owner');
    var group = getOctalDigit('group');
    var others = getOctalDigit('others');
    var octal = '' + owner + group + others;

    octalInput.value = octal;
    symbolicOutput.textContent = getSymbolicPart('owner') + getSymbolicPart('group') + getSymbolicPart('others');
    chmodCmd.textContent = 'chmod ' + octal + ' filename';
  }

  function setCheckboxesFromDigit(who, digit) {
    checkboxes[who + '-r'].checked = (digit & 4) !== 0;
    checkboxes[who + '-w'].checked = (digit & 2) !== 0;
    checkboxes[who + '-x'].checked = (digit & 1) !== 0;
  }

  function updateFromOctal() {
    var val = octalInput.value.trim();
    if (!/^[0-7]{3}$/.test(val)) return;

    var owner = parseInt(val[0], 10);
    var group = parseInt(val[1], 10);
    var others = parseInt(val[2], 10);

    setCheckboxesFromDigit('owner', owner);
    setCheckboxesFromDigit('group', group);
    setCheckboxesFromDigit('others', others);

    symbolicOutput.textContent = getSymbolicPart('owner') + getSymbolicPart('group') + getSymbolicPart('others');
    chmodCmd.textContent = 'chmod ' + val + ' filename';
  }

  // Attach checkbox event listeners
  var keys = Object.keys(checkboxes);
  for (var i = 0; i < keys.length; i++) {
    checkboxes[keys[i]].addEventListener('change', updateFromCheckboxes);
  }

  // Octal input listener
  octalInput.addEventListener('input', updateFromOctal);

  // Copy buttons
  copyOctalBtn.addEventListener('click', function () {
    copyToClipboard(octalInput.value, copyOctalBtn);
  });

  copySymbolicBtn.addEventListener('click', function () {
    copyToClipboard(symbolicOutput.textContent, copySymbolicBtn);
  });

  copyCmdBtn.addEventListener('click', function () {
    copyToClipboard(chmodCmd.textContent, copyCmdBtn);
  });

  // Preset buttons
  var presetBtns = document.querySelectorAll('.preset-btn');
  for (var j = 0; j < presetBtns.length; j++) {
    (function (btn) {
      btn.addEventListener('click', function () {
        octalInput.value = btn.getAttribute('data-octal');
        updateFromOctal();
      });
    })(presetBtns[j]);
  }

  // Initialize with 755
  octalInput.value = '755';
  updateFromOctal();
});