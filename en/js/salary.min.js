document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  var salaryInput = document.getElementById('salary');
  var salaryLabel = document.getElementById('salary-label');
  var ageInput = document.getElementById('age');
  var dependentsInput = document.getElementById('dependents');
  var calcBtn = document.getElementById('calc-btn');
  var resetBtn = document.getElementById('reset-btn');
  var resultSection = document.getElementById('result');

  var resultAnnualNet = document.getElementById('result-annual-net');
  var resultMonthlyNet = document.getElementById('result-monthly-net');
  var resultGrossAnnual = document.getElementById('result-gross-annual');
  var resultHealth = document.getElementById('result-health');
  var resultPension = document.getElementById('result-pension');
  var resultEmployment = document.getElementById('result-employment');
  var resultNursing = document.getElementById('result-nursing');
  var resultNursingRow = document.getElementById('result-nursing-row');
  var resultSocialTotal = document.getElementById('result-social-total');
  var resultIncomeTax = document.getElementById('result-income-tax');
  var resultResidentTax = document.getElementById('result-resident-tax');
  var resultTaxTotal = document.getElementById('result-tax-total');
  var resultDeductionTotal = document.getElementById('result-deduction-total');

  function getInputType() {
    var radios = document.querySelectorAll('input[name="input-type"]');
    for (var i = 0; i < radios.length; i++) {
      if (radios[i].checked) return radios[i].value;
    }
    return 'annual';
  }

  function formatYen(val) {
    return Math.floor(val).toLocaleString() + ' JPY';
  }

  // Update label when input type changes
  var inputTypeRadios = document.querySelectorAll('input[name="input-type"]');
  for (var i = 0; i < inputTypeRadios.length; i++) {
    inputTypeRadios[i].addEventListener('change', function () {
      var type = getInputType();
      if (type === 'annual') {
        salaryLabel.textContent = 'Gross Annual Salary (JPY)';
        salaryInput.placeholder = 'e.g. 4000000';
      } else {
        salaryLabel.textContent = 'Gross Monthly Salary (JPY)';
        salaryInput.placeholder = 'e.g. 300000';
      }
    });
  }

  function calcEmploymentIncomeDeduction(annualIncome) {
    if (annualIncome <= 1625000) {
      return 550000;
    } else if (annualIncome <= 1800000) {
      return annualIncome * 0.4 - 100000;
    } else if (annualIncome <= 3600000) {
      return annualIncome * 0.3 + 80000;
    } else if (annualIncome <= 6600000) {
      return annualIncome * 0.2 + 440000;
    } else if (annualIncome <= 8500000) {
      return annualIncome * 0.1 + 1100000;
    } else {
      return 1950000;
    }
  }

  function calcIncomeTax(taxableIncome) {
    if (taxableIncome <= 0) return 0;
    if (taxableIncome <= 1950000) {
      return taxableIncome * 0.05;
    } else if (taxableIncome <= 3300000) {
      return taxableIncome * 0.10 - 97500;
    } else if (taxableIncome <= 6950000) {
      return taxableIncome * 0.20 - 427500;
    } else if (taxableIncome <= 9000000) {
      return taxableIncome * 0.23 - 636000;
    } else if (taxableIncome <= 18000000) {
      return taxableIncome * 0.33 - 1536000;
    } else if (taxableIncome <= 40000000) {
      return taxableIncome * 0.40 - 2796000;
    } else {
      return taxableIncome * 0.45 - 4796000;
    }
  }

  calcBtn.addEventListener('click', function () {
    var salaryVal = parseFloat(salaryInput.value);
    var ageVal = parseInt(ageInput.value, 10);
    var dependentsVal = parseInt(dependentsInput.value, 10);

    if (isNaN(salaryVal) || salaryVal < 0) {
      alert('Please enter a valid gross salary amount.');
      return;
    }
    if (isNaN(ageVal) || ageVal < 18 || ageVal > 100) {
      alert('Please enter a valid age (18-100).');
      return;
    }
    if (isNaN(dependentsVal) || dependentsVal < 0) {
      dependentsVal = 0;
    }

    var inputType = getInputType();
    var annualGross;
    if (inputType === 'annual') {
      annualGross = salaryVal;
    } else {
      annualGross = salaryVal * 12;
    }

    var healthInsurance = Math.floor(annualGross * 0.05);
    var pension = Math.floor(annualGross * 0.0915);
    var employmentInsurance = Math.floor(annualGross * 0.006);
    var nursingInsurance = 0;
    if (ageVal >= 40) {
      nursingInsurance = Math.floor(annualGross * 0.008);
    }
    var socialInsuranceTotal = healthInsurance + pension + employmentInsurance + nursingInsurance;

    var employmentIncomeDeduction = calcEmploymentIncomeDeduction(annualGross);
    var incomeAfterDeduction = annualGross - employmentIncomeDeduction;
    if (incomeAfterDeduction < 0) incomeAfterDeduction = 0;

    var basicDeduction = 480000;
    var socialInsuranceDeduction = socialInsuranceTotal;
    var dependentDeductionIncomeTax = dependentsVal * 380000;

    var taxableIncomeForIncomeTax = incomeAfterDeduction - basicDeduction - socialInsuranceDeduction - dependentDeductionIncomeTax;
    if (taxableIncomeForIncomeTax < 0) taxableIncomeForIncomeTax = 0;
    taxableIncomeForIncomeTax = Math.floor(taxableIncomeForIncomeTax / 1000) * 1000;

    var incomeTax = Math.floor(calcIncomeTax(taxableIncomeForIncomeTax));

    var basicDeductionResident = 430000;
    var dependentDeductionResident = dependentsVal * 330000;

    var taxableIncomeForResident = incomeAfterDeduction - basicDeductionResident - socialInsuranceDeduction - dependentDeductionResident;
    if (taxableIncomeForResident < 0) taxableIncomeForResident = 0;
    taxableIncomeForResident = Math.floor(taxableIncomeForResident / 1000) * 1000;

    var residentTax = Math.floor(taxableIncomeForResident * 0.10);

    var taxTotal = incomeTax + residentTax;
    var deductionTotal = socialInsuranceTotal + taxTotal;
    var annualNet = annualGross - deductionTotal;
    var monthlyNet = Math.floor(annualNet / 12);

    resultAnnualNet.textContent = formatYen(annualNet);
    resultMonthlyNet.textContent = formatYen(monthlyNet);
    resultGrossAnnual.textContent = formatYen(annualGross);
    resultHealth.textContent = formatYen(healthInsurance);
    resultPension.textContent = formatYen(pension);
    resultEmployment.textContent = formatYen(employmentInsurance);

    if (ageVal >= 40) {
      resultNursing.textContent = formatYen(nursingInsurance);
      resultNursingRow.style.display = '';
    } else {
      resultNursingRow.style.display = 'none';
    }

    resultSocialTotal.textContent = formatYen(socialInsuranceTotal);
    resultIncomeTax.textContent = formatYen(incomeTax);
    resultResidentTax.textContent = formatYen(residentTax);
    resultTaxTotal.textContent = formatYen(taxTotal);
    resultDeductionTotal.textContent = formatYen(deductionTotal);

    resultSection.hidden = false;
    resultSection.scrollIntoView({ behavior: 'smooth' });
  });

  resetBtn.addEventListener('click', function () {
    salaryInput.value = '';
    ageInput.value = '';
    dependentsInput.value = '0';
    resultSection.hidden = true;
    var radios = document.querySelectorAll('input[name="input-type"]');
    radios[0].checked = true;
    salaryLabel.textContent = 'Gross Annual Salary (JPY)';
    salaryInput.placeholder = 'e.g. 4000000';
  });
});
