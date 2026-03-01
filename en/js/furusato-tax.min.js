(function () {
  'use strict';

  var incomeInput = document.getElementById('annual-income');
  var familySelect = document.getElementById('family-type');
  var housingLoanRadios = document.querySelectorAll('input[name="housing-loan"]');
  var housingLoanAmountGroup = document.getElementById('housing-loan-amount-group');
  var housingLoanAmountInput = document.getElementById('housing-loan-amount');
  var calcBtn = document.getElementById('calc-btn');
  var resetBtn = document.getElementById('reset-btn');
  var resultSection = document.getElementById('result');
  var maxDeductionEl = document.getElementById('max-deduction');
  var benefitAmountEl = document.getElementById('benefit-amount');
  var recommendationSection = document.getElementById('recommendation-section');
  var tableSection = document.getElementById('table-section');
  var incomeTableBody = document.getElementById('income-table-body');

  housingLoanRadios.forEach(function (radio) {
    radio.addEventListener('change', function () {
      housingLoanAmountGroup.hidden = this.value !== 'yes';
    });
  });

  function getHousingLoanValue() {
    for (var i = 0; i < housingLoanRadios.length; i++) {
      if (housingLoanRadios[i].checked) return housingLoanRadios[i].value;
    }
    return 'none';
  }

  function calcDeductionLimit(incomeMan, familyType, housingLoanMan) {
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

    var dependentDeduction = 0;
    switch (familyType) {
      case 'single':
        dependentDeduction = 0;
        break;
      case 'married':
        dependentDeduction = 380000;
        break;
      case 'married-child1':
        dependentDeduction = 380000 + 380000;
        break;
      case 'married-child2':
        dependentDeduction = 380000 + 380000 + 630000;
        break;
    }

    var taxableIncome = earnedIncome - basicDeduction - socialInsurance - dependentDeduction;
    if (taxableIncome < 0) taxableIncome = 0;

    var taxRate;
    if (taxableIncome <= 1950000) {
      taxRate = 0.05;
    } else if (taxableIncome <= 3300000) {
      taxRate = 0.10;
    } else if (taxableIncome <= 6950000) {
      taxRate = 0.20;
    } else if (taxableIncome <= 9000000) {
      taxRate = 0.23;
    } else if (taxableIncome <= 18000000) {
      taxRate = 0.33;
    } else if (taxableIncome <= 40000000) {
      taxRate = 0.40;
    } else {
      taxRate = 0.45;
    }

    var residentTaxableIncome = taxableIncome;
    var residentTaxRate = 0.10;
    var residentTax = residentTaxableIncome * residentTaxRate;

    var denominator = 1 - residentTaxRate - taxRate * 1.021;
    if (denominator <= 0) denominator = 0.001;

    var limit = (residentTax * 0.2) / denominator + 2000;

    if (housingLoanMan > 0) {
      var housingLoanYen = housingLoanMan * 10000;
      var reduction = housingLoanYen * 0.15;
      limit = limit - reduction;
    }

    if (limit < 2000) limit = 2000;

    return Math.floor(limit);
  }

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

  function buildTable(housingLoanMan) {
    incomeTableBody.innerHTML = '';
    var incomes = [300, 400, 500, 600, 700, 800, 900, 1000, 1200, 1500, 2000];
    var families = ['single', 'married', 'married-child1', 'married-child2'];

    for (var i = 0; i < incomes.length; i++) {
      var tr = document.createElement('tr');
      tr.style.borderBottom = '1px solid var(--color-border-light)';

      var tdIncome = document.createElement('td');
      tdIncome.style.cssText = 'padding: 8px; text-align: center; font-weight: 600;';
      tdIncome.textContent = incomes[i] + ' x10K';
      tr.appendChild(tdIncome);

      for (var j = 0; j < families.length; j++) {
        var td = document.createElement('td');
        td.style.cssText = 'padding: 8px; text-align: right;';
        var limit = calcDeductionLimit(incomes[i], families[j], housingLoanMan);
        td.textContent = formatYen(limit);
        tr.appendChild(td);
      }

      incomeTableBody.appendChild(tr);
    }

    tableSection.hidden = false;
  }

  calcBtn.addEventListener('click', function () {
    var incomeMan = parseFloat(incomeInput.value);

    if (isNaN(incomeMan) || incomeMan <= 0) {
      alert('Please enter a valid annual income.');
      return;
    }

    var familyType = familySelect.value;
    var housingLoan = getHousingLoanValue();
    var housingLoanMan = 0;

    if (housingLoan === 'yes') {
      housingLoanMan = parseFloat(housingLoanAmountInput.value) || 0;
    }

    var limit = calcDeductionLimit(incomeMan, familyType, housingLoanMan);
    var benefit = limit - 2000;
    if (benefit < 0) benefit = 0;

    maxDeductionEl.textContent = formatMan(limit);
    benefitAmountEl.textContent = formatMan(benefit);

    resultSection.hidden = false;
    recommendationSection.hidden = false;
    buildTable(housingLoanMan);
    resultSection.scrollIntoView({ behavior: 'smooth' });
  });

  resetBtn.addEventListener('click', function () {
    incomeInput.value = '';
    familySelect.selectedIndex = 0;
    housingLoanRadios[0].checked = true;
    housingLoanAmountGroup.hidden = true;
    housingLoanAmountInput.value = '';
    resultSection.hidden = true;
    recommendationSection.hidden = true;
    tableSection.hidden = true;
    incomeTableBody.innerHTML = '';
  });
})();
