document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  var heightInput = document.getElementById('height');
  var currentWeightInput = document.getElementById('current-weight');
  var targetWeightInput = document.getElementById('target-weight');
  var dietWeeksInput = document.getElementById('diet-weeks');
  var ageInput = document.getElementById('age');
  var activityLevelInput = document.getElementById('activity-level');
  var calcBtn = document.getElementById('calc-btn');
  var resetBtn = document.getElementById('reset-btn');
  var resultSection = document.getElementById('result');

  var resultBmi185 = document.getElementById('result-bmi185');
  var resultBmi20 = document.getElementById('result-bmi20');
  var resultBmi22 = document.getElementById('result-bmi22');
  var resultBmi25 = document.getElementById('result-bmi25');
  var resultCurrentBmi = document.getElementById('result-current-bmi');
  var resultTargetBmi = document.getElementById('result-target-bmi');
  var resultWeightLoss = document.getElementById('result-weight-loss');
  var resultWeeklyLoss = document.getElementById('result-weekly-loss');
  var resultSafety = document.getElementById('result-safety');
  var resultBmr = document.getElementById('result-bmr');
  var resultTdee = document.getElementById('result-tdee');
  var resultCalorieDeficit = document.getElementById('result-calorie-deficit');
  var resultTargetCalories = document.getElementById('result-target-calories');

  function getGender() {
    var radios = document.querySelectorAll('input[name="gender"]');
    for (var i = 0; i < radios.length; i++) {
      if (radios[i].checked) return radios[i].value;
    }
    return 'male';
  }

  // Harris-Benedict式で基礎代謝量を計算
  function calcBMR(weight, heightCm, age, gender) {
    if (gender === 'male') {
      return 88.362 + (13.397 * weight) + (4.799 * heightCm) - (5.677 * age);
    } else {
      return 447.593 + (9.247 * weight) + (3.098 * heightCm) - (4.330 * age);
    }
  }

  calcBtn.addEventListener('click', function () {
    var height = parseFloat(heightInput.value);
    var currentWeight = parseFloat(currentWeightInput.value);
    var targetWeight = parseFloat(targetWeightInput.value);
    var dietWeeks = parseInt(dietWeeksInput.value, 10);
    var age = parseInt(ageInput.value, 10);
    var activityLevel = parseFloat(activityLevelInput.value);
    var gender = getGender();

    if (isNaN(height) || height < 100 || height > 250) {
      alert('身長を正しく入力してください（100〜250cm）。');
      return;
    }
    if (isNaN(currentWeight) || currentWeight < 30 || currentWeight > 300) {
      alert('現在の体重を正しく入力してください（30〜300kg）。');
      return;
    }
    if (isNaN(targetWeight) || targetWeight < 30 || targetWeight > 300) {
      alert('目標体重を正しく入力してください（30〜300kg）。');
      return;
    }
    if (isNaN(dietWeeks) || dietWeeks < 1 || dietWeeks > 104) {
      alert('ダイエット期間を正しく入力してください（1〜104週）。');
      return;
    }
    if (isNaN(age) || age < 15 || age > 100) {
      alert('年齢を正しく入力してください（15〜100歳）。');
      return;
    }

    var heightM = height / 100;

    // BMI別の理想体重
    var weight185 = 18.5 * heightM * heightM;
    var weight20 = 20 * heightM * heightM;
    var weight22 = 22 * heightM * heightM;
    var weight25 = 25 * heightM * heightM;

    // 現在のBMI
    var currentBmi = currentWeight / (heightM * heightM);
    var targetBmi = targetWeight / (heightM * heightM);

    // 減量幅
    var weightLoss = currentWeight - targetWeight;
    var weeklyLoss = weightLoss / dietWeeks;

    // 安全性判定
    var safetyText;
    if (weightLoss <= 0) {
      safetyText = '増量計画です';
    } else if (weeklyLoss <= 0.5) {
      safetyText = '安全（週0.5kg以下）';
    } else if (weeklyLoss <= 1.0) {
      safetyText = '注意が必要（週0.5〜1.0kg）';
    } else {
      safetyText = '危険！ペースが速すぎます（週1.0kg以上）';
    }

    // 基礎代謝量
    var bmr = calcBMR(currentWeight, height, age, gender);
    // 総消費カロリー
    var tdee = bmr * activityLevel;

    // 必要なカロリー制限
    // 脂肪1kg = 7200kcal
    var totalCalorieDeficit = weightLoss * 7200;
    var dailyCalorieDeficit = totalCalorieDeficit / (dietWeeks * 7);
    var targetCalories = tdee - dailyCalorieDeficit;

    // 最低摂取カロリーチェック
    var minCalories = gender === 'male' ? 1500 : 1200;
    var calorieWarning = '';
    if (targetCalories < minCalories && weightLoss > 0) {
      calorieWarning = '（※ ' + minCalories + 'kcal未満は健康リスクあり）';
    }

    resultBmi185.textContent = weight185.toFixed(1) + 'kg';
    resultBmi20.textContent = weight20.toFixed(1) + 'kg';
    resultBmi22.textContent = weight22.toFixed(1) + 'kg';
    resultBmi25.textContent = weight25.toFixed(1) + 'kg';
    resultCurrentBmi.textContent = currentBmi.toFixed(1);
    resultTargetBmi.textContent = targetBmi.toFixed(1);

    if (weightLoss > 0) {
      resultWeightLoss.textContent = weightLoss.toFixed(1) + 'kg 減量';
    } else if (weightLoss < 0) {
      resultWeightLoss.textContent = Math.abs(weightLoss).toFixed(1) + 'kg 増量';
    } else {
      resultWeightLoss.textContent = '現在の体重を維持';
    }

    resultWeeklyLoss.textContent = Math.abs(weeklyLoss).toFixed(2) + 'kg/週';
    resultSafety.textContent = safetyText;
    resultBmr.textContent = Math.round(bmr).toLocaleString() + 'kcal';
    resultTdee.textContent = Math.round(tdee).toLocaleString() + 'kcal';

    if (weightLoss > 0) {
      resultCalorieDeficit.textContent = '-' + Math.round(dailyCalorieDeficit).toLocaleString() + 'kcal';
      resultTargetCalories.textContent = Math.round(targetCalories).toLocaleString() + 'kcal' + calorieWarning;
    } else {
      resultCalorieDeficit.textContent = '+' + Math.round(Math.abs(dailyCalorieDeficit)).toLocaleString() + 'kcal';
      resultTargetCalories.textContent = Math.round(targetCalories).toLocaleString() + 'kcal';
    }

    resultSection.hidden = false;
    resultSection.scrollIntoView({ behavior: 'smooth' });
  });

  resetBtn.addEventListener('click', function () {
    heightInput.value = '';
    currentWeightInput.value = '';
    targetWeightInput.value = '';
    dietWeeksInput.value = '';
    ageInput.value = '';
    activityLevelInput.value = '1.55';
    var radios = document.querySelectorAll('input[name="gender"]');
    radios[0].checked = true;
    resultSection.hidden = true;
  });
});