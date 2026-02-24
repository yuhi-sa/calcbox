(function () {
  'use strict';

  var loanAmountInput = document.getElementById('loan-amount');
  var yearEndBalanceInput = document.getElementById('year-end-balance');
  var interestRateInput = document.getElementById('interest-rate');
  var moveInYearSelect = document.getElementById('move-in-year');
  var deductionPeriodSelect = document.getElementById('deduction-period');
  var annualIncomeInput = document.getElementById('annual-income');
  var calcBtn = document.getElementById('calc-btn');
  var resetBtn = document.getElementById('reset-btn');
  var resultSection = document.getElementById('result');
  var firstYearDeductionEl = document.getElementById('first-year-deduction');
  var totalDeductionEl = document.getElementById('total-deduction');
  var deductionRateEl = document.getElementById('deduction-rate');
  var incomeTaxReductionEl = document.getElementById('income-tax-reduction');
  var residentTaxReductionEl = document.getElementById('resident-tax-reduction');
  var yearlySection = document.getElementById('yearly-section');
  var yearlyBody = document.getElementById('yearly-body');
  var recommendationSection = document.getElementById('recommendation-section');

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

  function getDeductionRate(moveInYear) {
    if (moveInYear >= 2022) {
      return 0.007; // 0.7%
    }
    return 0.01; // 1.0%
  }

  function getBorrowingLimit(moveInYear) {
    // Simplified: using general new housing limits
    if (moveInYear >= 2024) {
      return 30000000; // 3,000万円 (general new housing 2024-2025)
    }
    if (moveInYear >= 2022) {
      return 30000000; // 3,000万円
    }
    return 40000000; // 4,000万円 (2021 and earlier)
  }

  function calcIncomeTax(incomeMan) {
    var income = incomeMan * 10000;

    // Employment income deduction
    var employmentDeduction;
    if (income <= 1625000) {
      employmentDeduction = 550000;
    } else if (income <= 1800000) {
      employmentDeduction = income * 0.4 - 100000;
    } else if (income <= 3600000) {
      employmentDeduction = income * 0.3 + 80000;
    } else if (income <= 6600000) {
      employmentDeduction = income * 0.2 + 440000;
    } else if (income <= 8500000) {
      employmentDeduction = income * 0.1 + 1100000;
    } else {
      employmentDeduction = 1950000;
    }

    var earnedIncome = income - employmentDeduction;
    if (earnedIncome < 0) earnedIncome = 0;

    var basicDeduction = 480000;
    var socialInsurance = income * 0.15;
    var taxableIncome = earnedIncome - basicDeduction - socialInsurance;
    if (taxableIncome < 0) taxableIncome = 0;

    // Income tax calculation
    var tax;
    if (taxableIncome <= 1950000) {
      tax = taxableIncome * 0.05;
    } else if (taxableIncome <= 3300000) {
      tax = taxableIncome * 0.10 - 97500;
    } else if (taxableIncome <= 6950000) {
      tax = taxableIncome * 0.20 - 427500;
    } else if (taxableIncome <= 9000000) {
      tax = taxableIncome * 0.23 - 636000;
    } else if (taxableIncome <= 18000000) {
      tax = taxableIncome * 0.33 - 1536000;
    } else if (taxableIncome <= 40000000) {
      tax = taxableIncome * 0.40 - 2796000;
    } else {
      tax = taxableIncome * 0.45 - 4796000;
    }

    // Resident tax max deduction = min(taxableIncome * 5%, 97500)
    var residentTaxMaxDeduction = Math.min(taxableIncome * 0.05, 97500);

    return {
      incomeTax: Math.max(0, tax),
      taxableIncome: taxableIncome,
      residentTaxMaxDeduction: residentTaxMaxDeduction
    };
  }

  calcBtn.addEventListener('click', function () {
    var loanAmountMan = parseFloat(loanAmountInput.value);
    var yearEndBalanceMan = parseFloat(yearEndBalanceInput.value);
    var interestRate = parseFloat(interestRateInput.value);
    var moveInYear = parseInt(moveInYearSelect.value, 10);
    var deductionPeriod = parseInt(deductionPeriodSelect.value, 10);
    var annualIncomeMan = parseFloat(annualIncomeInput.value);

    if (isNaN(loanAmountMan) || loanAmountMan <= 0) {
      alert('借入金額を正しく入力してください。');
      return;
    }
    if (isNaN(yearEndBalanceMan) || yearEndBalanceMan <= 0) {
      alert('年末ローン残高を正しく入力してください。');
      return;
    }
    if (isNaN(interestRate) || interestRate < 0) {
      alert('借入金利を正しく入力してください。');
      return;
    }

    var rate = getDeductionRate(moveInYear);
    var borrowingLimit = getBorrowingLimit(moveInYear);
    var yearEndBalance = yearEndBalanceMan * 10000;
    var monthlyRate = interestRate / 100 / 12;

    // Calculate yearly deductions
    var balance = yearEndBalance;
    var yearlyData = [];
    var totalDeduction = 0;

    for (var y = 1; y <= deductionPeriod; y++) {
      var effectiveBalance = Math.min(balance, borrowingLimit);
      var yearDeduction = Math.floor(effectiveBalance * rate);

      // Cap individual year at max (for 0.7%: max 210,000 for 3000万 limit)
      yearlyData.push({
        year: y,
        balance: balance,
        deduction: yearDeduction
      });
      totalDeduction += yearDeduction;

      // Reduce balance for next year (approximate: equal principal reduction)
      if (monthlyRate > 0) {
        // Approximate yearly principal reduction
        for (var m = 0; m < 12; m++) {
          var interestPart = balance * monthlyRate;
          // Use approximate equal payment
          var loanAmount = loanAmountMan * 10000;
          var totalMonths = 35 * 12; // assume 35-year loan
          var monthlyPayment;
          if (monthlyRate === 0) {
            monthlyPayment = loanAmount / totalMonths;
          } else {
            var x = Math.pow(1 + monthlyRate, totalMonths);
            monthlyPayment = loanAmount * monthlyRate * x / (x - 1);
          }
          var principalPart = monthlyPayment - interestPart;
          if (principalPart > balance) principalPart = balance;
          balance -= principalPart;
          if (balance < 0) balance = 0;
        }
      } else {
        // Zero interest: equal principal reduction over assumed 35 years
        balance -= (loanAmountMan * 10000) / 35;
        if (balance < 0) balance = 0;
      }
    }

    var firstYearDeduction = yearlyData[0].deduction;

    // Tax reduction calculation
    var incomeTaxFromDeduction = 0;
    var residentTaxFromDeduction = 0;

    if (!isNaN(annualIncomeMan) && annualIncomeMan > 0) {
      var taxInfo = calcIncomeTax(annualIncomeMan);
      incomeTaxFromDeduction = Math.min(firstYearDeduction, taxInfo.incomeTax);
      var remaining = firstYearDeduction - incomeTaxFromDeduction;
      residentTaxFromDeduction = Math.min(remaining, taxInfo.residentTaxMaxDeduction);
    }

    firstYearDeductionEl.textContent = formatMan(firstYearDeduction);
    totalDeductionEl.textContent = formatMan(totalDeduction);
    deductionRateEl.textContent = (rate * 100).toFixed(1) + '%';

    if (!isNaN(annualIncomeMan) && annualIncomeMan > 0) {
      incomeTaxReductionEl.textContent = formatYen(incomeTaxFromDeduction);
      residentTaxReductionEl.textContent = formatYen(residentTaxFromDeduction);
    } else {
      incomeTaxReductionEl.textContent = '年収を入力すると計算されます';
      residentTaxReductionEl.textContent = '年収を入力すると計算されます';
    }

    // Build yearly table
    yearlyBody.innerHTML = '';
    for (var i = 0; i < yearlyData.length; i++) {
      var d = yearlyData[i];
      var tr = document.createElement('tr');
      tr.style.borderBottom = '1px solid var(--color-border-light)';

      var tdYear = document.createElement('td');
      tdYear.style.cssText = 'padding: 8px; text-align: center; font-weight: 600;';
      tdYear.textContent = d.year + '年目';

      var tdBalance = document.createElement('td');
      tdBalance.style.cssText = 'padding: 8px; text-align: right;';
      tdBalance.textContent = formatYen(d.balance);

      var tdDeduction = document.createElement('td');
      tdDeduction.style.cssText = 'padding: 8px; text-align: right;';
      tdDeduction.textContent = formatYen(d.deduction);

      tr.appendChild(tdYear);
      tr.appendChild(tdBalance);
      tr.appendChild(tdDeduction);
      yearlyBody.appendChild(tr);
    }

    resultSection.hidden = false;
    yearlySection.hidden = false;
    recommendationSection.hidden = false;
    resultSection.scrollIntoView({ behavior: 'smooth' });
  });

  resetBtn.addEventListener('click', function () {
    loanAmountInput.value = '';
    yearEndBalanceInput.value = '';
    interestRateInput.value = '';
    moveInYearSelect.selectedIndex = 0;
    deductionPeriodSelect.selectedIndex = 0;
    annualIncomeInput.value = '';
    resultSection.hidden = true;
    yearlySection.hidden = true;
    recommendationSection.hidden = true;
    yearlyBody.innerHTML = '';
  });
})();
