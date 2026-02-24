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

  // 2024年度国民年金満額（年額）
  var KOKUMIN_FULL_ANNUAL = 816000;
  // 満額に必要な月数
  var KOKUMIN_FULL_MONTHS = 480;
  // 厚生年金の乗率
  var KOUSEI_RATE = 5.481 / 1000;

  function formatYen(val) {
    return Math.floor(val).toLocaleString() + '円';
  }

  function formatMan(val) {
    var man = val / 10000;
    if (man >= 1) {
      return Math.floor(val).toLocaleString() + '円（約' + man.toFixed(1) + '万円）';
    }
    return Math.floor(val).toLocaleString() + '円';
  }

  // 繰上げ・繰下げの増減率を計算
  function calcAdjustmentRate(startAge) {
    if (startAge < 65) {
      // 繰上げ: 1ヶ月あたり0.4%減額
      var months = (65 - startAge) * 12;
      return -0.004 * months;
    } else if (startAge > 65) {
      // 繰下げ: 1ヶ月あたり0.7%増額
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
      alert('現在の年齢を正しく入力してください（20〜74歳）。');
      return;
    }
    if (isNaN(avgIncomeMan) || avgIncomeMan <= 0) {
      alert('平均年収を正しく入力してください。');
      return;
    }
    if (isNaN(kouseiYears) || kouseiYears < 0) {
      alert('厚生年金の加入期間を正しく入力してください。');
      return;
    }

    // 合計加入月数（上限480月）
    var totalMonths = Math.min((kokuminYears + kouseiYears) * 12, KOKUMIN_FULL_MONTHS);

    // 国民年金（基礎年金）年額
    var kokuminAnnual = KOKUMIN_FULL_ANNUAL * totalMonths / KOKUMIN_FULL_MONTHS;

    // 厚生年金年額
    // 平均標準報酬月額 = 平均年収（万円）× 10000 / 12
    var avgMonthlyReward = avgIncomeMan * 10000 / 12;
    var kouseiAnnual = avgMonthlyReward * KOUSEI_RATE * kouseiYears * 12;

    // 65歳基準の合計年額
    var totalBase = kokuminAnnual + kouseiAnnual;

    // 繰上げ/繰下げ調整
    var adjustmentRate = calcAdjustmentRate(startAge);
    var totalAdjusted = totalBase * (1 + adjustmentRate);
    var monthlyAmount = totalAdjusted / 12;

    resultKokumin.textContent = formatYen(kokuminAnnual);
    resultKousei.textContent = formatYen(kouseiAnnual);
    resultTotalBase.textContent = formatYen(totalBase);
    resultTotalAdjusted.textContent = formatYen(totalAdjusted);
    resultMonthly.textContent = formatYen(monthlyAmount);

    if (adjustmentRate < 0) {
      resultRateChange.textContent = (adjustmentRate * 100).toFixed(1) + '%（繰上げ減額）';
    } else if (adjustmentRate > 0) {
      resultRateChange.textContent = '+' + (adjustmentRate * 100).toFixed(1) + '%（繰下げ増額）';
    } else {
      resultRateChange.textContent = '0%（通常受給）';
    }

    // 比較表を作成
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
      tdAge.textContent = age + '歳';

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