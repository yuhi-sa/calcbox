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
    return Math.round(val).toLocaleString() + ' JPY';
  }

  function formatMan(val) {
    var man = val / 10000;
    if (man >= 1) {
      return Math.round(val).toLocaleString() + ' JPY (approx. ' + man.toFixed(1) + ' x10K JPY)';
    }
    return Math.round(val).toLocaleString() + ' JPY';
  }

  function getDeductionRate(moveInYear) {
    if (moveInYear >= 2022) {
      return 0.007;
    }
    return 0.01;
  }

  function getBorrowingLimit(moveInYear) {
    if (moveInYear >= 2024) {
      return 30000000;
    }
    if (moveInYear >= 2022) {
      return 30000000;
    }
    return 40000000;
  }

  function calcIncomeTax(incomeMan) {
    var income = incomeMan * 10000;

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
      alert('Please enter a valid loan amount.');
      return;
    }
    if (isNaN(yearEndBalanceMan) || yearEndBalanceMan <= 0) {
      alert('Please enter a valid year-end loan balance.');
      return;
    }
    if (isNaN(interestRate) || interestRate < 0) {
      alert('Please enter a valid loan interest rate.');
      return;
    }

    var rate = getDeductionRate(moveInYear);
    var borrowingLimit = getBorrowingLimit(moveInYear);
    var yearEndBalance = yearEndBalanceMan * 10000;
    var monthlyRate = interestRate / 100 / 12;

    var balance = yearEndBalance;
    var yearlyData = [];
    var totalDeduction = 0;

    for (var y = 1; y <= deductionPeriod; y++) {
      var effectiveBalance = Math.min(balance, borrowingLimit);
      var yearDeduction = Math.floor(effectiveBalance * rate);

      yearlyData.push({
        year: y,
        balance: balance,
        deduction: yearDeduction
      });
      totalDeduction += yearDeduction;

      if (monthlyRate > 0) {
        for (var m = 0; m < 12; m++) {
          var interestPart = balance * monthlyRate;
          var loanAmount = loanAmountMan * 10000;
          var totalMonths = 35 * 12;
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
        balance -= (loanAmountMan * 10000) / 35;
        if (balance < 0) balance = 0;
      }
    }

    var firstYearDeduction = yearlyData[0].deduction;

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
      incomeTaxReductionEl.textContent = 'Enter annual income to calculate';
      residentTaxReductionEl.textContent = 'Enter annual income to calculate';
    }

    yearlyBody.innerHTML = '';
    for (var i = 0; i < yearlyData.length; i++) {
      var d = yearlyData[i];
      var tr = document.createElement('tr');
      tr.style.borderBottom = '1px solid var(--color-border-light)';

      var tdYear = document.createElement('td');
      tdYear.style.cssText = 'padding: 8px; text-align: center; font-weight: 600;';
      tdYear.textContent = 'Year ' + d.year;

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
