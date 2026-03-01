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

  function getRepaymentMethod() {
    var radios = document.querySelectorAll('input[name="repayment-method"]');
    for (var i = 0; i < radios.length; i++) {
      if (radios[i].checked) return radios[i].value;
    }
    return 'equal-payment';
  }

  function formatCurrency(val) {
    return Math.round(val).toLocaleString();
  }

  function formatCurrencyLarge(val) {
    return Math.round(val).toLocaleString();
  }

  // Equal payment
  function calcEqualPayment(principal, monthlyRate, totalMonths) {
    if (monthlyRate === 0) {
      return principal / totalMonths;
    }
    var x = Math.pow(1 + monthlyRate, totalMonths);
    return principal * monthlyRate * x / (x - 1);
  }

  calcBtn.addEventListener('click', function () {
    var amountMan = parseFloat(loanAmountInput.value);
    var annualRate = parseFloat(interestRateInput.value);
    var years = parseInt(loanYearsInput.value, 10);

    if (isNaN(amountMan) || amountMan <= 0) {
      alert('Please enter a valid loan amount.');
      return;
    }
    if (isNaN(annualRate) || annualRate < 0 || annualRate > 50) {
      alert('Please enter an interest rate between 0% and 50%.');
      return;
    }
    if (isNaN(years) || years < 1 || years > 50) {
      alert('Please enter a loan term between 1 and 50 years.');
      return;
    }

    var principal = amountMan * 10000; // Convert 万円 to 円
    var monthlyRate = annualRate / 100 / 12;
    var totalMonths = years * 12;
    var method = getRepaymentMethod();

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

      monthlyLabel.textContent = 'Monthly Payment';
      monthlyPaymentEl.textContent = formatCurrency(monthlyPayment);

    } else {
      var monthlyPrincipal = principal / totalMonths;
      var firstMonthPayment = monthlyPrincipal + principal * monthlyRate;
      var lastMonthPayment = monthlyPrincipal + monthlyPrincipal * monthlyRate;

      totalPayment = 0;
      totalInterest = 0;

      var balance = principal;
      for (var y = 1; y <= years; y++) {
        var yearPrincipalSum = 0;
        var yearInterestSum = 0;
        for (var m = 0; m < 12; m++) {
          if (balance <= 0) break;
          var interestPart = balance * monthlyRate;
          var principalPart = monthlyPrincipal;
          if (principalPart > balance) principalPart = balance;
          yearInterestSum += interestPart;
          yearPrincipalSum += principalPart;
          balance -= principalPart;
        }
        var yearPayment = yearPrincipalSum + yearInterestSum;
        totalPayment += yearPayment;
        totalInterest += yearInterestSum;
        yearlyData.push({
          year: y,
          payment: yearPayment,
          principal: yearPrincipalSum,
          interest: yearInterestSum,
          balance: Math.max(0, balance)
        });
      }

      monthlyLabel.textContent = 'First Month Payment (varies monthly)';
      monthlyPaymentEl.textContent = formatCurrency(firstMonthPayment) + ' - ' + formatCurrency(lastMonthPayment);
    }

    totalPaymentEl.textContent = formatCurrencyLarge(totalPayment);
    totalInterestEl.textContent = formatCurrencyLarge(totalInterest);

    // Build amortization table
    amortizationBody.innerHTML = '';
    for (var i = 0; i < yearlyData.length; i++) {
      var d = yearlyData[i];
      var tr = document.createElement('tr');
      tr.style.borderBottom = '1px solid var(--color-border-light)';

      var tdYear = document.createElement('td');
      tdYear.style.cssText = 'padding: 8px; text-align: center; font-weight: 600;';
      tdYear.textContent = 'Year ' + d.year;

      var tdPayment = document.createElement('td');
      tdPayment.style.cssText = 'padding: 8px; text-align: right;';
      tdPayment.textContent = formatCurrency(d.payment);

      var tdPrincipal = document.createElement('td');
      tdPrincipal.style.cssText = 'padding: 8px; text-align: right;';
      tdPrincipal.textContent = formatCurrency(d.principal);

      var tdInterest = document.createElement('td');
      tdInterest.style.cssText = 'padding: 8px; text-align: right;';
      tdInterest.textContent = formatCurrency(d.interest);

      var tdBalance = document.createElement('td');
      tdBalance.style.cssText = 'padding: 8px; text-align: right;';
      tdBalance.textContent = formatCurrency(d.balance);

      tr.appendChild(tdYear);
      tr.appendChild(tdPayment);
      tr.appendChild(tdPrincipal);
      tr.appendChild(tdInterest);
      tr.appendChild(tdBalance);
      amortizationBody.appendChild(tr);
    }

    resultSection.hidden = false;
    amortizationSection.hidden = false;
    resultSection.scrollIntoView({ behavior: 'smooth' });
  });

  resetBtn.addEventListener('click', function () {
    loanAmountInput.value = '';
    interestRateInput.value = '';
    loanYearsInput.value = '';
    resultSection.hidden = true;
    amortizationSection.hidden = true;
    amortizationBody.innerHTML = '';
  });
});
