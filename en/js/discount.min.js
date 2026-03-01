document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  var originalPriceInput = document.getElementById('original-price');
  var discountPercentInput = document.getElementById('discount-percent');
  var discountAmountInput = document.getElementById('discount-amount');
  var discountPercent1Input = document.getElementById('discount-percent1');
  var discountPercent2Input = document.getElementById('discount-percent2');

  var percentGroup = document.getElementById('percent-group');
  var amountGroup = document.getElementById('amount-group');
  var doubleGroup1 = document.getElementById('double-group1');
  var doubleGroup2 = document.getElementById('double-group2');

  var calcBtn = document.getElementById('calc-btn');
  var resetBtn = document.getElementById('reset-btn');
  var resultSection = document.getElementById('result');
  var resultPrice = document.getElementById('result-price');
  var resultDiscount = document.getElementById('result-discount');
  var resultRate = document.getElementById('result-rate');
  var resultDoubleDetailItem = document.getElementById('result-double-detail-item');
  var resultDoubleDetail = document.getElementById('result-double-detail');
  var resultDisplay = document.getElementById('result-display');

  function getMode() {
    var radios = document.querySelectorAll('input[name="calc-mode"]');
    for (var i = 0; i < radios.length; i++) {
      if (radios[i].checked) return radios[i].value;
    }
    return 'percent';
  }

  function formatPrice(val) {
    return Math.floor(val).toLocaleString();
  }

  function formatPercent(val) {
    if (val === Math.floor(val)) {
      return val + '%';
    }
    return val.toFixed(1) + '%';
  }

  // Update visible fields when mode changes
  var modeRadios = document.querySelectorAll('input[name="calc-mode"]');
  for (var i = 0; i < modeRadios.length; i++) {
    modeRadios[i].addEventListener('change', function () {
      var mode = getMode();
      percentGroup.hidden = mode !== 'percent';
      amountGroup.hidden = mode !== 'amount';
      doubleGroup1.hidden = mode !== 'double';
      doubleGroup2.hidden = mode !== 'double';
    });
  }

  calcBtn.addEventListener('click', function () {
    var original = parseFloat(originalPriceInput.value);
    if (isNaN(original) || original < 0) {
      alert('Please enter a valid original price.');
      return;
    }

    var mode = getMode();
    var discountedPrice, discountAmount, discountRate;

    if (mode === 'percent') {
      var percent = parseFloat(discountPercentInput.value);
      if (isNaN(percent) || percent < 0 || percent > 100) {
        alert('Please enter a discount rate between 0 and 100.');
        return;
      }
      discountAmount = original * percent / 100;
      discountedPrice = original - discountAmount;
      discountRate = percent;
      resultDoubleDetailItem.hidden = true;

    } else if (mode === 'amount') {
      var amount = parseFloat(discountAmountInput.value);
      if (isNaN(amount) || amount < 0) {
        alert('Please enter a valid discount amount.');
        return;
      }
      if (amount > original) {
        alert('The discount amount exceeds the original price.');
        return;
      }
      discountAmount = amount;
      discountedPrice = original - discountAmount;
      discountRate = original > 0 ? (discountAmount / original) * 100 : 0;
      resultDoubleDetailItem.hidden = true;

    } else {
      // double discount
      var p1 = parseFloat(discountPercent1Input.value);
      var p2 = parseFloat(discountPercent2Input.value);
      if (isNaN(p1) || p1 < 0 || p1 > 100) {
        alert('Please enter the first discount rate between 0 and 100.');
        return;
      }
      if (isNaN(p2) || p2 < 0 || p2 > 100) {
        alert('Please enter the second discount rate between 0 and 100.');
        return;
      }
      var afterFirst = original * (1 - p1 / 100);
      discountedPrice = afterFirst * (1 - p2 / 100);
      discountAmount = original - discountedPrice;
      discountRate = original > 0 ? (discountAmount / original) * 100 : 0;

      var simpleSum = p1 + p2;
      resultDoubleDetail.textContent = formatPercent(Math.round(discountRate * 10) / 10) + ' (differs from simple sum of ' + formatPercent(simpleSum) + ')';
      resultDoubleDetailItem.hidden = false;
    }

    resultPrice.textContent = formatPrice(discountedPrice);
    resultDiscount.textContent = formatPrice(discountAmount);
    resultRate.textContent = formatPercent(Math.round(discountRate * 10) / 10);

    // Build display text
    var displayParts = [];
    var roundedRate = Math.round(discountRate * 10) / 10;
    displayParts.push(formatPercent(roundedRate) + ' OFF');
    resultDisplay.textContent = displayParts.join(' / ');

    resultSection.hidden = false;
    resultSection.scrollIntoView({ behavior: 'smooth' });
  });

  resetBtn.addEventListener('click', function () {
    originalPriceInput.value = '';
    discountPercentInput.value = '';
    discountAmountInput.value = '';
    discountPercent1Input.value = '';
    discountPercent2Input.value = '';
    resultSection.hidden = true;
    resultDoubleDetailItem.hidden = true;
  });
});
