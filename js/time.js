(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var modeRadios = document.querySelectorAll('input[name="time-mode"]');
    var modeCalc = document.getElementById('mode-calc');
    var modeConvert = document.getElementById('mode-convert');
    var modeWage = document.getElementById('mode-wage');

    // --- Mode switching ---
    function switchMode() {
      var selected = getRadioValue('time-mode');
      modeCalc.hidden = selected !== 'calc';
      modeConvert.hidden = selected !== 'convert';
      modeWage.hidden = selected !== 'wage';
      // Hide all results when switching
      hideAllResults();
    }

    function hideAllResults() {
      var results = document.querySelectorAll('.result');
      for (var i = 0; i < results.length; i++) {
        results[i].hidden = true;
      }
    }

    for (var i = 0; i < modeRadios.length; i++) {
      modeRadios[i].addEventListener('change', switchMode);
    }

    function getRadioValue(name) {
      var radios = document.querySelectorAll('input[name="' + name + '"]');
      for (var j = 0; j < radios.length; j++) {
        if (radios[j].checked) return radios[j].value;
      }
      return '';
    }

    function getInt(id) {
      var val = parseInt(document.getElementById(id).value, 10);
      return isNaN(val) ? 0 : val;
    }

    function formatTime(totalMinutes) {
      var negative = totalMinutes < 0;
      var abs = Math.abs(totalMinutes);
      var h = Math.floor(abs / 60);
      var m = abs % 60;
      var prefix = negative ? '-' : '';
      return prefix + h + '時間' + m + '分';
    }

    // --- Mode 1: Time addition/subtraction ---
    document.getElementById('calc-time-btn').addEventListener('click', function () {
      var aH = getInt('calc-a-hours');
      var aM = getInt('calc-a-minutes');
      var bH = getInt('calc-b-hours');
      var bM = getInt('calc-b-minutes');

      var totalA = aH * 60 + aM;
      var totalB = bH * 60 + bM;
      var op = getRadioValue('calc-op');
      var result = op === 'add' ? totalA + totalB : totalA - totalB;

      document.getElementById('calc-result-value').textContent = formatTime(result);
      document.getElementById('calc-result-minutes').textContent = result + '分';

      var resultEl = document.getElementById('calc-result');
      resultEl.hidden = false;
      resultEl.scrollIntoView({ behavior: 'smooth' });
    });

    // --- Mode 2: Time/minute conversion ---
    var convertDirRadios = document.querySelectorAll('input[name="convert-dir"]');
    var convertToMinutesInput = document.getElementById('convert-to-minutes-input');
    var convertToHoursInput = document.getElementById('convert-to-hours-input');

    function switchConvertDir() {
      var dir = getRadioValue('convert-dir');
      convertToMinutesInput.hidden = dir !== 'to-minutes';
      convertToHoursInput.hidden = dir !== 'to-hours';
      document.getElementById('convert-result').hidden = true;
    }

    for (var k = 0; k < convertDirRadios.length; k++) {
      convertDirRadios[k].addEventListener('change', switchConvertDir);
    }

    document.getElementById('convert-btn').addEventListener('click', function () {
      var dir = getRadioValue('convert-dir');
      var resultValue = document.getElementById('convert-result-value');

      if (dir === 'to-minutes') {
        var h = getInt('conv-hours');
        var m = getInt('conv-minutes');
        var total = h * 60 + m;
        resultValue.textContent = total + '分';
      } else {
        var totalMin = getInt('conv-total-minutes');
        resultValue.textContent = formatTime(totalMin);
      }

      var resultEl = document.getElementById('convert-result');
      resultEl.hidden = false;
      resultEl.scrollIntoView({ behavior: 'smooth' });
    });

    // --- Mode 3: Wage calculation ---
    var wageDirRadios = document.querySelectorAll('input[name="wage-dir"]');
    var wageToPayInput = document.getElementById('wage-to-pay-input');
    var wageToRateInput = document.getElementById('wage-to-rate-input');

    function switchWageDir() {
      var dir = getRadioValue('wage-dir');
      wageToPayInput.hidden = dir !== 'to-pay';
      wageToRateInput.hidden = dir !== 'to-rate';
      document.getElementById('wage-result').hidden = true;
    }

    for (var w = 0; w < wageDirRadios.length; w++) {
      wageDirRadios[w].addEventListener('change', switchWageDir);
    }

    document.getElementById('wage-btn').addEventListener('click', function () {
      var dir = getRadioValue('wage-dir');
      var resultLabel = document.getElementById('wage-result-label');
      var resultValue = document.getElementById('wage-result-value');

      if (dir === 'to-pay') {
        var rate = parseInt(document.getElementById('wage-rate').value, 10);
        var h = getInt('wage-hours');
        var m = getInt('wage-minutes');
        if (!rate || rate < 1) {
          alert('時給を正しく入力してください。');
          return;
        }
        if (h === 0 && m === 0) {
          alert('勤務時間を入力してください。');
          return;
        }
        var totalHours = h + m / 60;
        var pay = Math.round(rate * totalHours);
        resultLabel.textContent = '給与総額';
        resultValue.textContent = pay.toLocaleString() + '円';
      } else {
        var totalPay = parseInt(document.getElementById('wage-total-pay').value, 10);
        var rH = getInt('wage-rev-hours');
        var rM = getInt('wage-rev-minutes');
        if (!totalPay || totalPay < 1) {
          alert('給与総額を正しく入力してください。');
          return;
        }
        if (rH === 0 && rM === 0) {
          alert('勤務時間を入力してください。');
          return;
        }
        var totalH = rH + rM / 60;
        var hourlyRate = Math.round(totalPay / totalH);
        resultLabel.textContent = '時給';
        resultValue.textContent = hourlyRate.toLocaleString() + '円';
      }

      var resultEl = document.getElementById('wage-result');
      resultEl.hidden = false;
      resultEl.scrollIntoView({ behavior: 'smooth' });
    });

    // --- Reset ---
    document.getElementById('time-reset-btn').addEventListener('click', function () {
      var inputs = document.querySelectorAll('.tool__body input[type="number"]');
      for (var r = 0; r < inputs.length; r++) {
        inputs[r].value = '';
      }
      // Reset radio buttons to defaults
      document.querySelector('input[name="time-mode"][value="calc"]').checked = true;
      document.querySelector('input[name="calc-op"][value="add"]').checked = true;
      document.querySelector('input[name="convert-dir"][value="to-minutes"]').checked = true;
      document.querySelector('input[name="wage-dir"][value="to-pay"]').checked = true;

      switchMode();
      switchConvertDir();
      switchWageDir();
      hideAllResults();
    });
  });
})();
