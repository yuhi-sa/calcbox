document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  var currentAgeInput = document.getElementById('current-age');
  var avgIncomeInput = document.getElementById('avg-income');
  var kokuminYearsInput = document.getElementById('kokumin-years');
  var kouseiYearsInput = document.getElementById('kousei-years');
  var startAgeInput = document.getElementById('start-age');
  var calcBtn = document.getElementById('calc-btn');
  var resetBtn = document.getElementById('reset-btn');
  var resultSection = document.getElementById('result');
  var comparisonSection = document.getElementById('comparison-section');
  var comparisonBody = document.getElementById('comparison-body');

  var resultKokumin = document.getElementById('result-kokumin');
  var resultKousei = document.getElementById('result-kousei');
  var resultTotalBase = document.getElementById('result-total-base');
  var resultTotalAdjusted = document.getElementById('result-total-adjusted');
  var resultMonthly = document.getElementById('result-monthly');
  var resultRateChange = document.getElementById('result-rate-change');

  var KOKUMIN_FULL_ANNUAL = 816000;
  var KOKUMIN_FULL_MONTHS = 480;
  var KOUSEI_RATE = 5.481 / 1000;

  function formatYen(val) {
    return Math.floor(val).toLocaleString() + ' JPY';
  }

  function formatMan(val) {
    var man = val / 10000;
    if (man >= 1) {
      return Math.floor(val).toLocaleString() + ' JPY (approx. ' + man.toFixed(1) + ' x10K JPY)';
    }
    return Math.floor(val).toLocaleString() + ' JPY';
  }

  function calcAdjustmentRate(startAge) {
    if (startAge < 65) {
      var months = (65 - startAge) * 12;
      return -0.004 * months;
    } else if (startAge > 65) {
      var months = (startAge - 65) * 12;
      return 0.007 * months;
    }
    return 0;
  }

  calcBtn.addEventListener('click', function () {
    var currentAge = parseInt(currentAgeInput.value, 10);
    var avgIncomeMan = parseFloat(avgIncomeInput.value);
    var kokuminYears = parseInt(kokuminYearsInput.value, 10) || 0;
    var kouseiYears = parseInt(kouseiYearsInput.value, 10);
    var startAge = parseInt(startAgeInput.value, 10);

    if (isNaN(currentAge) || currentAge < 20 || currentAge > 74) {
      alert('Please enter a valid current age (20-74).');
      return;
    }
    if (isNaN(avgIncomeMan) || avgIncomeMan <= 0) {
      alert('Please enter a valid average annual income.');
      return;
    }
    if (isNaN(kouseiYears) || kouseiYears < 0) {
      alert('Please enter a valid Employee Pension enrollment period.');
      return;
    }

    var totalMonths = Math.min((kokuminYears + kouseiYears) * 12, KOKUMIN_FULL_MONTHS);

    var kokuminAnnual = KOKUMIN_FULL_ANNUAL * totalMonths / KOKUMIN_FULL_MONTHS;

    var avgMonthlyReward = avgIncomeMan * 10000 / 12;
    var kouseiAnnual = avgMonthlyReward * KOUSEI_RATE * kouseiYears * 12;

    var totalBase = kokuminAnnual + kouseiAnnual;

    var adjustmentRate = calcAdjustmentRate(startAge);
    var totalAdjusted = totalBase * (1 + adjustmentRate);
    var monthlyAmount = totalAdjusted / 12;

    resultKokumin.textContent = formatYen(kokuminAnnual);
    resultKousei.textContent = formatYen(kouseiAnnual);
    resultTotalBase.textContent = formatYen(totalBase);
    resultTotalAdjusted.textContent = formatYen(totalAdjusted);
    resultMonthly.textContent = formatYen(monthlyAmount);

    if (adjustmentRate < 0) {
      resultRateChange.textContent = (adjustmentRate * 100).toFixed(1) + '% (early claim reduction)';
    } else if (adjustmentRate > 0) {
      resultRateChange.textContent = '+' + (adjustmentRate * 100).toFixed(1) + '% (deferred claim increase)';
    } else {
      resultRateChange.textContent = '0% (standard claim)';
    }

    comparisonBody.innerHTML = '';
    var ages = [60, 62, 65, 67, 70, 75];
    var lifeExpectancy = 85;

    for (var i = 0; i < ages.length; i++) {
      var age = ages[i];
      var rate = calcAdjustmentRate(age);
      var adjusted = totalBase * (1 + rate);
      var monthly = adjusted / 12;
      var receivingYears = lifeExpectancy - age;
      var lifetime = adjusted * receivingYears;

      var tr = document.createElement('tr');
      tr.style.borderBottom = '1px solid var(--color-border-light)';

      if (age === startAge) {
        tr.style.background = 'var(--color-bg-secondary)';
        tr.style.fontWeight = '600';
      }

      var tdAge = document.createElement('td');
      tdAge.style.cssText = 'padding: 8px; text-align: center; font-weight: 600;';
      tdAge.textContent = 'Age ' + age;

      var tdRate = document.createElement('td');
      tdRate.style.cssText = 'padding: 8px; text-align: right;';
      if (rate < 0) {
        tdRate.textContent = (rate * 100).toFixed(1) + '%';
      } else if (rate > 0) {
        tdRate.textContent = '+' + (rate * 100).toFixed(1) + '%';
      } else {
        tdRate.textContent = '0%';
      }

      var tdMonthly = document.createElement('td');
      tdMonthly.style.cssText = 'padding: 8px; text-align: right;';
      tdMonthly.textContent = formatYen(monthly);

      var tdAnnual = document.createElement('td');
      tdAnnual.style.cssText = 'padding: 8px; text-align: right;';
      tdAnnual.textContent = formatYen(adjusted);

      var tdLifetime = document.createElement('td');
      tdLifetime.style.cssText = 'padding: 8px; text-align: right;';
      tdLifetime.textContent = formatMan(lifetime);

      tr.appendChild(tdAge);
      tr.appendChild(tdRate);
      tr.appendChild(tdMonthly);
      tr.appendChild(tdAnnual);
      tr.appendChild(tdLifetime);
      comparisonBody.appendChild(tr);
    }

    resultSection.hidden = false;
    comparisonSection.hidden = false;
    resultSection.scrollIntoView({ behavior: 'smooth' });
  });

  resetBtn.addEventListener('click', function () {
    currentAgeInput.value = '';
    avgIncomeInput.value = '';
    kokuminYearsInput.value = '0';
    kouseiYearsInput.value = '';
    startAgeInput.value = '65';
    resultSection.hidden = true;
    comparisonSection.hidden = true;
    comparisonBody.innerHTML = '';
  });
});
