document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  var inputValue = document.getElementById('input-value');
  var inputBase = document.getElementById('input-base');
  var calcBtn = document.getElementById('calc-btn');
  var resetBtn = document.getElementById('reset-btn');
  var resultSection = document.getElementById('result');
  var resultBin = document.getElementById('result-bin');
  var resultOct = document.getElementById('result-oct');
  var resultDec = document.getElementById('result-dec');
  var resultHex = document.getElementById('result-hex');

  function convert() {
    var value = inputValue.value.trim();
    var base = parseInt(inputBase.value, 10);

    if (!value) {
      alert('Please enter a value to convert.');
      return;
    }

    var decimalValue = parseInt(value, base);

    if (isNaN(decimalValue) || decimalValue < 0) {
      alert('Invalid input. Please enter a value that matches the selected base.');
      return;
    }

    resultBin.textContent = decimalValue.toString(2);
    resultOct.textContent = decimalValue.toString(8);
    resultDec.textContent = decimalValue.toString(10);
    resultHex.textContent = decimalValue.toString(16).toUpperCase();

    resultSection.hidden = false;
    resultSection.scrollIntoView({ behavior: 'smooth' });
  }

  calcBtn.addEventListener('click', convert);

  // Real-time conversion
  inputValue.addEventListener('input', function () {
    var value = inputValue.value.trim();
    var base = parseInt(inputBase.value, 10);
    if (!value) {
      resultSection.hidden = true;
      return;
    }
    var decimalValue = parseInt(value, base);
    if (isNaN(decimalValue) || decimalValue < 0) {
      resultSection.hidden = true;
      return;
    }
    resultBin.textContent = decimalValue.toString(2);
    resultOct.textContent = decimalValue.toString(8);
    resultDec.textContent = decimalValue.toString(10);
    resultHex.textContent = decimalValue.toString(16).toUpperCase();
    resultSection.hidden = false;
  });

  inputBase.addEventListener('change', function () {
    var value = inputValue.value.trim();
    if (value) {
      var base = parseInt(inputBase.value, 10);
      var decimalValue = parseInt(value, base);
      if (!isNaN(decimalValue) && decimalValue >= 0) {
        resultBin.textContent = decimalValue.toString(2);
        resultOct.textContent = decimalValue.toString(8);
        resultDec.textContent = decimalValue.toString(10);
        resultHex.textContent = decimalValue.toString(16).toUpperCase();
        resultSection.hidden = false;
      }
    }
  });

  resetBtn.addEventListener('click', function () {
    inputValue.value = '';
    inputBase.value = '10';
    resultSection.hidden = true;
  });
});