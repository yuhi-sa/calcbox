document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  var ageInput = document.getElementById('age');
  var heightInput = document.getElementById('height');
  var weightInput = document.getElementById('weight');
  var calcBtn = document.getElementById('calc-btn');
  var resetBtn = document.getElementById('reset-btn');
  var resultSection = document.getElementById('result');
  var resultBodyfat = document.getElementById('result-bodyfat');
  var resultCategory = document.getElementById('result-category');
  var resultBmi = document.getElementById('result-bmi');
  var resultIdeal = document.getElementById('result-ideal');

  function getGender() {
    var radios = document.querySelectorAll('input[name="gender"]');
    for (var i = 0; i < radios.length; i++) {
      if (radios[i].checked) return radios[i].value;
    }
    return 'male';
  }

  function calcBMI(heightCm, weightKg) {
    var heightM = heightCm / 100;
    return weightKg / (heightM * heightM);
  }

  function calcBodyFat(bmi, age, gender) {
    var genderFactor = gender === 'male' ? 1 : 0;
    return 1.2 * bmi + 0.23 * age - 10.8 * genderFactor - 5.4;
  }

  function getCategory(bodyFatPercent, gender) {
    if (gender === 'male') {
      if (bodyFatPercent < 10) return 'Lean';
      if (bodyFatPercent < 15) return 'Normal (-)';
      if (bodyFatPercent < 20) return 'Normal (+)';
      if (bodyFatPercent < 25) return 'Slightly overweight';
      return 'Obese';
    } else {
      if (bodyFatPercent < 20) return 'Lean';
      if (bodyFatPercent < 25) return 'Normal (-)';
      if (bodyFatPercent < 30) return 'Normal (+)';
      if (bodyFatPercent < 35) return 'Slightly overweight';
      return 'Obese';
    }
  }

  calcBtn.addEventListener('click', function () {
    var age = parseFloat(ageInput.value);
    var height = parseFloat(heightInput.value);
    var weight = parseFloat(weightInput.value);
    var gender = getGender();

    if (isNaN(age) || age < 18 || age > 120) {
      alert('Please enter a valid age (18 or older).');
      return;
    }
    if (isNaN(height) || height < 100 || height > 250) {
      alert('Please enter a valid height.');
      return;
    }
    if (isNaN(weight) || weight < 20 || weight > 300) {
      alert('Please enter a valid weight.');
      return;
    }

    var bmi = calcBMI(height, weight);
    var bodyFat = calcBodyFat(bmi, age, gender);
    var category = getCategory(bodyFat, gender);
    var heightM = height / 100;
    var idealWeight = 22 * heightM * heightM;

    resultBodyfat.textContent = bodyFat.toFixed(1) + '%';
    resultCategory.textContent = category;
    resultBmi.textContent = bmi.toFixed(1);
    resultIdeal.textContent = idealWeight.toFixed(1) + 'kg';

    resultSection.hidden = false;
    resultSection.scrollIntoView({ behavior: 'smooth' });
  });

  resetBtn.addEventListener('click', function () {
    ageInput.value = '';
    heightInput.value = '';
    weightInput.value = '';
    resultSection.hidden = true;
  });
});
