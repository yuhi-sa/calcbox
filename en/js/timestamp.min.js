document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  var currentTimestamp = document.getElementById('current-timestamp');
  var copyCurrentBtn = document.getElementById('copy-current-btn');
  var tsInput = document.getElementById('ts-input');
  var tsUnit = document.getElementById('ts-unit');
  var tsToDateBtn = document.getElementById('ts-to-date-btn');
  var tsResult = document.getElementById('ts-result');
  var tsDateOutput = document.getElementById('ts-date-output');
  var copyTsDateBtn = document.getElementById('copy-ts-date-btn');
  var dateInput = document.getElementById('date-input');
  var dateToTsBtn = document.getElementById('date-to-ts-btn');
  var dateResult = document.getElementById('date-result');
  var dateTsS = document.getElementById('date-ts-s');
  var dateTsMs = document.getElementById('date-ts-ms');

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

  function pad(n) {
    return n < 10 ? '0' + n : '' + n;
  }

  function formatDate(date) {
    return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate()) + ' ' +
      pad(date.getHours()) + ':' + pad(date.getMinutes()) + ':' + pad(date.getSeconds());
  }

  function updateCurrentTimestamp() {
    var now = Math.floor(Date.now() / 1000);
    currentTimestamp.textContent = now;
  }

  updateCurrentTimestamp();
  setInterval(updateCurrentTimestamp, 1000);

  copyCurrentBtn.addEventListener('click', function () {
    copyToClipboard(currentTimestamp.textContent, copyCurrentBtn);
  });

  // Set default datetime-local value to now
  var now = new Date();
  var localISO = now.getFullYear() + '-' + pad(now.getMonth() + 1) + '-' + pad(now.getDate()) + 'T' + pad(now.getHours()) + ':' + pad(now.getMinutes()) + ':' + pad(now.getSeconds());
  dateInput.value = localISO;

  tsToDateBtn.addEventListener('click', function () {
    var val = tsInput.value.trim();
    if (!val || isNaN(Number(val))) {
      tsResult.hidden = true;
      return;
    }
    var ts = Number(val);
    var ms = tsUnit.value === 'ms' ? ts : ts * 1000;
    var date = new Date(ms);
    if (isNaN(date.getTime())) {
      tsDateOutput.textContent = 'Invalid タイムスタンプです';
      tsResult.hidden = false;
      return;
    }
    tsDateOutput.textContent = formatDate(date) + ' (' + date.toISOString() + ')';
    tsResult.hidden = false;
  });

  copyTsDateBtn.addEventListener('click', function () {
    copyToClipboard(tsDateOutput.textContent, copyTsDateBtn);
  });

  dateToTsBtn.addEventListener('click', function () {
    var val = dateInput.value;
    if (!val) {
      dateResult.hidden = true;
      return;
    }
    var date = new Date(val);
    if (isNaN(date.getTime())) {
      dateResult.hidden = true;
      return;
    }
    var s = Math.floor(date.getTime() / 1000);
    var ms = date.getTime();
    dateTsS.textContent = s;
    dateTsMs.textContent = ms;
    dateResult.hidden = false;
  });

  // Auto-detect seconds vs milliseconds
  tsInput.addEventListener('input', function () {
    var val = tsInput.value.trim();
    if (val.length >= 13) {
      tsUnit.value = 'ms';
    } else if (val.length <= 10 && val.length > 0) {
      tsUnit.value = 's';
    }
  });

  // Copy buttons for date-to-ts section
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