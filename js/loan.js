document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  var loanAmountInput = document.getElementById('loan-amount');
  var interestRateInput = document.getElementById('interest-rate');
  var loanYearsInput = document.getElementById('loan-years');
  var calcBtn = document.getElementById('calc-btn');
  var resetBtn = document.getElementById('reset-btn');
  var resultSection = document.getElementById('result');
  var monthlyPaymentEl = document.getElementById('monthly-payment');
  var monthlyLabel = document.getElementById('monthly-label');
  var totalPaymentEl = document.getElementById('total-payment');
  var totalInterestEl = document.getElementById('total-interest');
  var amortizationSection = document.getElementById('amortization-section');
  var amortizationBody = document.getElementById('amortization-body');

  // Compare mode elements
  var compareToggleBtn = document.getElementById('compare-toggle-btn');
  var compareInputs = document.getElementById('compare-inputs');
  var addConditionBtn = document.getElementById('add-condition-btn');
  var removeConditionBtn = document.getElementById('remove-condition-btn');
  var condition3 = document.getElementById('condition-3');
  var compareResult = document.getElementById('compare-result');
  var compareBody = document.getElementById('compare-body');
  var compareTh3 = document.getElementById('compare-th-3');

  var compareMode = false;
  var conditionCount = 2; // When compare mode is on, starts with 2

  function getRepaymentMethod(suffix) {
    var name = suffix ? 'repayment-method-' + suffix : 'repayment-method';
    var radios = document.querySelectorAll('input[name="' + name + '"]');
    for (var i = 0; i < radios.length; i++) {
      if (radios[i].checked) return radios[i].value;
    }
    return 'equal-payment';
  }

  function formatYen(val) {
    return Math.round(val).toLocaleString() + '円';
  }

  function formatMan(val) {
    var man = val / 10000;
    if (man >= 1) {
      return Math.round(val).toLocaleString() + '円（約' + man.toFixed(1) + '万円）';
    }
    return Math.round(val).toLocaleString() + '円';
  }

  // Equal payment (元利均等返済)
  function calcEqualPayment(principal, monthlyRate, totalMonths) {
    if (monthlyRate === 0) {
      return principal / totalMonths;
    }
    var x = Math.pow(1 + monthlyRate, totalMonths);
    return principal * monthlyRate * x / (x - 1);
  }

  // Calculate loan result for given parameters
  function calcLoan(amountMan, annualRate, years, method) {
    var principal = amountMan * 10000;
    var monthlyRate = annualRate / 100 / 12;
    var totalMonths = years * 12;

    var monthlyPayment, totalPayment, totalInterest;
    var yearlyData = [];

    if (method === 'equal-payment') {
      monthlyPayment = calcEqualPayment(principal, monthlyRate, totalMonths);
      totalPayment = monthlyPayment * totalMonths;
      totalInterest = totalPayment - principal;

      var balance = principal;
      for (var y = 1; y <= years; y++) {
        var yearPrincipal = 0;
        var yearInterest = 0;
        for (var m = 0; m < 12; m++) {
          if (balance <= 0) break;
          var interestPart = balance * monthlyRate;
          var principalPart = monthlyPayment - interestPart;
          if (principalPart > balance) principalPart = balance;
          yearInterest += interestPart;
          yearPrincipal += principalPart;
          balance -= principalPart;
        }
        yearlyData.push({
          year: y,
          payment: yearPrincipal + yearInterest,
          principal: yearPrincipal,
          interest: yearInterest,
          balance: Math.max(0, balance)
        });
      }

      return {
        monthlyPayment: monthlyPayment,
        monthlyLabel: '毎月の返済額',
        monthlyDisplay: formatYen(monthlyPayment),
        totalPayment: totalPayment,
        totalInterest: totalInterest,
        yearlyData: yearlyData,
        method: method
      };

    } else {
      var monthlyPrincipal = principal / totalMonths;
      var firstMonthPayment = monthlyPrincipal + principal * monthlyRate;
      var lastMonthPayment = monthlyPrincipal + monthlyPrincipal * monthlyRate;

      totalPayment = 0;
      totalInterest = 0;

      var balance2 = principal;
      for (var y2 = 1; y2 <= years; y2++) {
        var yearPrincipalSum = 0;
        var yearInterestSum = 0;
        for (var m2 = 0; m2 < 12; m2++) {
          if (balance2 <= 0) break;
          var interestPart2 = balance2 * monthlyRate;
          var principalPart2 = monthlyPrincipal;
          if (principalPart2 > balance2) principalPart2 = balance2;
          yearInterestSum += interestPart2;
          yearPrincipalSum += principalPart2;
          balance2 -= principalPart2;
        }
        var yearPayment = yearPrincipalSum + yearInterestSum;
        totalPayment += yearPayment;
        totalInterest += yearInterestSum;
        yearlyData.push({
          year: y2,
          payment: yearPayment,
          principal: yearPrincipalSum,
          interest: yearInterestSum,
          balance: Math.max(0, balance2)
        });
      }

      return {
        monthlyPayment: firstMonthPayment,
        monthlyLabel: '初回の返済額（毎月変動）',
        monthlyDisplay: formatYen(firstMonthPayment) + ' 〜 ' + formatYen(lastMonthPayment),
        totalPayment: totalPayment,
        totalInterest: totalInterest,
        yearlyData: yearlyData,
        method: method
      };
    }
  }

  // Get input values for a condition (suffix: '' for condition1, '2', '3')
  function getConditionInputs(suffix) {
    var amountId = suffix ? 'loan-amount-' + suffix : 'loan-amount';
    var rateId = suffix ? 'interest-rate-' + suffix : 'interest-rate';
    var yearsId = suffix ? 'loan-years-' + suffix : 'loan-years';

    var amountMan = parseFloat(document.getElementById(amountId).value);
    var annualRate = parseFloat(document.getElementById(rateId).value);
    var years = parseInt(document.getElementById(yearsId).value, 10);
    var method = getRepaymentMethod(suffix || undefined);

    return { amountMan: amountMan, annualRate: annualRate, years: years, method: method };
  }

  // Validate inputs
  function validateInputs(inputs, label) {
    if (isNaN(inputs.amountMan) || inputs.amountMan <= 0) {
      alert(label + 'の借入金額を正しく入力してください。');
      return false;
    }
    if (isNaN(inputs.annualRate) || inputs.annualRate < 0 || inputs.annualRate > 50) {
      alert(label + 'の年利を0〜50%の範囲で入力してください。');
      return false;
    }
    if (isNaN(inputs.years) || inputs.years < 1 || inputs.years > 50) {
      alert(label + 'の返済期間を1〜50年の範囲で入力してください。');
      return false;
    }
    return true;
  }

  // Build comparison table
  function buildCompareTable(results) {
    compareBody.innerHTML = '';
    var count = results.length;

    // Show/hide condition 3 column
    compareTh3.hidden = count < 3;

    var rows = [
      { label: '月々返済額', key: 'monthlyPayment', format: formatYen },
      { label: '総返済額', key: 'totalPayment', format: formatMan },
      { label: '総利息', key: 'totalInterest', format: formatMan }
    ];

    for (var r = 0; r < rows.length; r++) {
      var tr = document.createElement('tr');
      tr.style.borderBottom = '1px solid var(--color-border-light)';

      var tdLabel = document.createElement('td');
      tdLabel.style.cssText = 'padding: 10px 8px; font-weight: 600;';
      tdLabel.textContent = rows[r].label;
      tr.appendChild(tdLabel);

      var baseVal = results[0][rows[r].key];

      for (var c = 0; c < count; c++) {
        var td = document.createElement('td');
        td.style.cssText = 'padding: 10px 8px; text-align: right;';

        var val = results[c][rows[r].key];
        var valueText = rows[r].format(val);

        if (c > 0) {
          var diff = val - baseVal;
          var diffSpan = document.createElement('span');
          diffSpan.style.cssText = 'display: block; font-size: 0.8rem; margin-top: 2px;';
          if (diff > 0) {
            diffSpan.style.color = '#e74c3c';
            diffSpan.textContent = '+' + formatYen(diff);
          } else if (diff < 0) {
            diffSpan.style.color = '#27ae60';
            diffSpan.textContent = formatYen(diff);
          } else {
            diffSpan.style.color = 'var(--color-text-secondary)';
            diffSpan.textContent = '±0円';
          }
          td.textContent = valueText;
          td.appendChild(diffSpan);
        } else {
          td.textContent = valueText;
        }

        if (c === 2 && count < 3) {
          td.hidden = true;
        }
        tr.appendChild(td);
      }

      // Add hidden td for condition 3 if only 2 conditions
      if (count < 3) {
        var tdHidden = document.createElement('td');
        tdHidden.hidden = true;
        tr.appendChild(tdHidden);
      }

      compareBody.appendChild(tr);
    }

    compareResult.hidden = false;
  }

  // Build amortization table from yearlyData
  function buildAmortizationTable(yearlyData) {
    amortizationBody.innerHTML = '';
    for (var i = 0; i < yearlyData.length; i++) {
      var d = yearlyData[i];
      var tr = document.createElement('tr');
      tr.style.borderBottom = '1px solid var(--color-border-light)';

      var tdYear = document.createElement('td');
      tdYear.style.cssText = 'padding: 8px; text-align: center; font-weight: 600;';
      tdYear.textContent = d.year + '年目';

      var tdPayment = document.createElement('td');
      tdPayment.style.cssText = 'padding: 8px; text-align: right;';
      tdPayment.textContent = formatYen(d.payment);

      var tdPrincipal = document.createElement('td');
      tdPrincipal.style.cssText = 'padding: 8px; text-align: right;';
      tdPrincipal.textContent = formatYen(d.principal);

      var tdInterest = document.createElement('td');
      tdInterest.style.cssText = 'padding: 8px; text-align: right;';
      tdInterest.textContent = formatYen(d.interest);

      var tdBalance = document.createElement('td');
      tdBalance.style.cssText = 'padding: 8px; text-align: right;';
      tdBalance.textContent = formatYen(d.balance);

      tr.appendChild(tdYear);
      tr.appendChild(tdPayment);
      tr.appendChild(tdPrincipal);
      tr.appendChild(tdInterest);
      tr.appendChild(tdBalance);
      amortizationBody.appendChild(tr);
    }
  }

  // Compare toggle
  compareToggleBtn.addEventListener('click', function () {
    compareMode = !compareMode;
    compareInputs.hidden = !compareMode;
    compareToggleBtn.textContent = compareMode ? '比較モードを解除' : '条件を追加';
    if (!compareMode) {
      compareResult.hidden = true;
      conditionCount = 2;
      condition3.hidden = true;
      addConditionBtn.hidden = false;
      addConditionBtn.textContent = '条件3を追加';
      removeConditionBtn.hidden = true;
    }
  });

  // Add condition 3
  addConditionBtn.addEventListener('click', function () {
    conditionCount = 3;
    condition3.hidden = false;
    addConditionBtn.hidden = true;
    removeConditionBtn.hidden = false;
  });

  // Remove last condition
  removeConditionBtn.addEventListener('click', function () {
    if (conditionCount === 3) {
      conditionCount = 2;
      condition3.hidden = true;
      addConditionBtn.hidden = false;
      removeConditionBtn.hidden = true;
    }
  });

  calcBtn.addEventListener('click', function () {
    // Always calculate condition 1
    var inputs1 = getConditionInputs('');
    if (!validateInputs(inputs1, '条件1')) return;
    var result1 = calcLoan(inputs1.amountMan, inputs1.annualRate, inputs1.years, inputs1.method);

    // Display condition 1 result
    monthlyLabel.textContent = result1.monthlyLabel;
    monthlyPaymentEl.textContent = result1.monthlyDisplay;
    totalPaymentEl.textContent = formatMan(result1.totalPayment);
    totalInterestEl.textContent = formatMan(result1.totalInterest);

    buildAmortizationTable(result1.yearlyData);

    resultSection.hidden = false;
    amortizationSection.hidden = false;

    // Compare mode
    if (compareMode) {
      var inputs2 = getConditionInputs('2');
      if (!validateInputs(inputs2, '条件2')) return;
      var result2 = calcLoan(inputs2.amountMan, inputs2.annualRate, inputs2.years, inputs2.method);

      var results = [result1, result2];

      if (conditionCount === 3) {
        var inputs3 = getConditionInputs('3');
        if (!validateInputs(inputs3, '条件3')) return;
        var result3 = calcLoan(inputs3.amountMan, inputs3.annualRate, inputs3.years, inputs3.method);
        results.push(result3);
      }

      buildCompareTable(results);
    } else {
      compareResult.hidden = true;
    }

    resultSection.scrollIntoView({ behavior: 'smooth' });
  });

  resetBtn.addEventListener('click', function () {
    loanAmountInput.value = '';
    interestRateInput.value = '';
    loanYearsInput.value = '';
    resultSection.hidden = true;
    amortizationSection.hidden = true;
    amortizationBody.innerHTML = '';
    compareResult.hidden = true;

    // Reset compare inputs
    var ids = ['loan-amount-2', 'interest-rate-2', 'loan-years-2',
               'loan-amount-3', 'interest-rate-3', 'loan-years-3'];
    for (var i = 0; i < ids.length; i++) {
      var el = document.getElementById(ids[i]);
      if (el) el.value = '';
    }
  });
});
