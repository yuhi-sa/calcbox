(function () {
  'use strict';

  var genderRadios = document.querySelectorAll('input[name="gender"]');
  var ageInput = document.getElementById('age');
  var heightInput = document.getElementById('height');
  var weightInput = document.getElementById('weight');
  var activitySelect = document.getElementById('activity-level');
  var calcBtn = document.getElementById('calc-btn');
  var resetBtn = document.getElementById('reset-btn');
  var resultSection = document.getElementById('result');
  var bmrValueEl = document.getElementById('bmr-value');
  var tdeeValueEl = document.getElementById('tdee-value');
  var bmiValueEl = document.getElementById('bmi-value');
  var activityTableSection = document.getElementById('activity-table-section');
  var activityTableBody = document.getElementById('activity-table-body');
  var goalSection = document.getElementById('goal-section');
  var goalTableBody = document.getElementById('goal-table-body');

  function getGender() {
    for (var i = 0; i < genderRadios.length; i++) {
      if (genderRadios[i].checked) return genderRadios[i].value;
    }
    return 'male';
  }

  // Harris-Benedict equation (revised 1984)
  function calcBMR(gender, weightKg, heightCm, age) {
    if (gender === 'male') {
      return 88.362 + (13.397 * weightKg) + (4.799 * heightCm) - (5.677 * age);
    }
    return 447.593 + (9.247 * weightKg) + (3.098 * heightCm) - (4.330 * age);
  }

  function calcBMI(heightCm, weightKg) {
    var heightM = heightCm / 100;
    return weightKg / (heightM * heightM);
  }

  var activityLevels = [
    { factor: 1.2, label: 'ほとんど運動しない', desc: 'デスクワーク中心、運動習慣なし' },
    { factor: 1.375, label: '軽い運動', desc: '週1〜3回の軽い運動やウォーキング' },
    { factor: 1.55, label: '中程度の運動', desc: '週3〜5回のジョギングや水泳など' },
    { factor: 1.725, label: '激しい運動', desc: '週6〜7回のハードなトレーニング' },
    { factor: 1.9, label: '非常に激しい運動', desc: 'プロアスリート、肉体労働者' }
  ];

  function buildActivityTable(bmr, selectedFactor) {
    activityTableBody.innerHTML = '';

    for (var i = 0; i < activityLevels.length; i++) {
      var level = activityLevels[i];
      var tdee = Math.round(bmr * level.factor);

      var tr = document.createElement('tr');
      tr.style.borderBottom = '1px solid var(--color-border-light)';

      if (level.factor === selectedFactor) {
        tr.style.background = 'var(--color-primary-light, #dbeafe)';
        tr.style.fontWeight = '600';
      }

      var tdLabel = document.createElement('td');
      tdLabel.style.cssText = 'padding: 8px; text-align: left;';
      tdLabel.textContent = level.label;

      var tdFactor = document.createElement('td');
      tdFactor.style.cssText = 'padding: 8px; text-align: center;';
      tdFactor.textContent = '× ' + level.factor;

      var tdCalorie = document.createElement('td');
      tdCalorie.style.cssText = 'padding: 8px; text-align: right; font-weight: 600;';
      tdCalorie.textContent = tdee.toLocaleString() + ' kcal';

      var tdDesc = document.createElement('td');
      tdDesc.style.cssText = 'padding: 8px; text-align: left; font-size: 0.8rem; color: var(--color-text-secondary);';
      tdDesc.textContent = level.desc;

      tr.appendChild(tdLabel);
      tr.appendChild(tdFactor);
      tr.appendChild(tdCalorie);
      tr.appendChild(tdDesc);
      activityTableBody.appendChild(tr);
    }

    activityTableSection.hidden = false;
  }

  function buildGoalTable(tdee) {
    goalTableBody.innerHTML = '';

    var goals = [
      { label: '大幅な減量', calories: Math.round(tdee * 0.75), desc: 'TDEEの75%。急激な減量は体への負担が大きいため医師に相談を。' },
      { label: 'ゆるやかな減量', calories: Math.round(tdee * 0.85), desc: 'TDEEの85%。月に約1〜2kgの減量ペース。持続しやすい。' },
      { label: '体重維持', calories: Math.round(tdee), desc: '現在の体重を維持するカロリー量。' },
      { label: 'ゆるやかな増量', calories: Math.round(tdee * 1.10), desc: 'TDEEの110%。筋肉をつけながらゆっくり増量。' },
      { label: '積極的な増量', calories: Math.round(tdee * 1.20), desc: 'TDEEの120%。筋トレと併用で筋肉量を増やす。' }
    ];

    for (var i = 0; i < goals.length; i++) {
      var goal = goals[i];

      var tr = document.createElement('tr');
      tr.style.borderBottom = '1px solid var(--color-border-light)';

      if (goal.label === '体重維持') {
        tr.style.background = 'var(--color-primary-light, #dbeafe)';
        tr.style.fontWeight = '600';
      }

      var tdLabel = document.createElement('td');
      tdLabel.style.cssText = 'padding: 8px; text-align: left;';
      tdLabel.textContent = goal.label;

      var tdCalorie = document.createElement('td');
      tdCalorie.style.cssText = 'padding: 8px; text-align: right; font-weight: 600;';
      tdCalorie.textContent = goal.calories.toLocaleString() + ' kcal';

      var tdDesc = document.createElement('td');
      tdDesc.style.cssText = 'padding: 8px; text-align: left; font-size: 0.8rem; color: var(--color-text-secondary);';
      tdDesc.textContent = goal.desc;

      tr.appendChild(tdLabel);
      tr.appendChild(tdCalorie);
      tr.appendChild(tdDesc);
      goalTableBody.appendChild(tr);
    }

    goalSection.hidden = false;
  }

  calcBtn.addEventListener('click', function () {
    var gender = getGender();
    var age = parseInt(ageInput.value, 10);
    var height = parseFloat(heightInput.value);
    var weight = parseFloat(weightInput.value);
    var activityFactor = parseFloat(activitySelect.value);

    if (isNaN(age) || age < 1 || age > 120) {
      alert('年齢を正しく入力してください（1〜120歳）。');
      return;
    }
    if (isNaN(height) || height < 100 || height > 250) {
      alert('身長を正しく入力してください（100〜250cm）。');
      return;
    }
    if (isNaN(weight) || weight < 20 || weight > 300) {
      alert('体重を正しく入力してください（20〜300kg）。');
      return;
    }

    var bmr = calcBMR(gender, weight, height, age);
    var tdee = bmr * activityFactor;
    var bmi = calcBMI(height, weight);

    bmrValueEl.textContent = Math.round(bmr).toLocaleString() + ' kcal/日';
    tdeeValueEl.textContent = Math.round(tdee).toLocaleString() + ' kcal/日';
    bmiValueEl.textContent = bmi.toFixed(1);

    buildActivityTable(bmr, activityFactor);
    buildGoalTable(tdee);

    resultSection.hidden = false;
    resultSection.scrollIntoView({ behavior: 'smooth' });
  });

  resetBtn.addEventListener('click', function () {
    ageInput.value = '';
    heightInput.value = '';
    weightInput.value = '';
    genderRadios[0].checked = true;
    activitySelect.selectedIndex = 2;
    resultSection.hidden = true;
    activityTableSection.hidden = true;
    goalSection.hidden = true;
    activityTableBody.innerHTML = '';
    goalTableBody.innerHTML = '';
  });
})();
