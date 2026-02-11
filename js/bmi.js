document.addEventListener('DOMContentLoaded', function () {
  var heightInput = document.getElementById('height');
  var weightInput = document.getElementById('weight');
  var calcBtn = document.getElementById('calc-btn');
  var resetBtn = document.getElementById('reset-btn');
  var resultSection = document.getElementById('result');
  var bmiValue = document.getElementById('bmi-value');
  var bmiCategory = document.getElementById('bmi-category');
  var idealWeight = document.getElementById('ideal-weight');
  var weightDiff = document.getElementById('weight-diff');
  var chartSection = document.getElementById('bmi-chart-section');

  function calcBMI(heightCm, weightKg) {
    var heightM = heightCm / 100;
    return weightKg / (heightM * heightM);
  }

  function getCategory(bmi) {
    if (bmi < 18.5) return { label: 'やせ（低体重）', color: '#3b82f6' };
    if (bmi < 25) return { label: '普通体重', color: '#22c55e' };
    if (bmi < 30) return { label: '肥満（1度）', color: '#f59e0b' };
    if (bmi < 35) return { label: '肥満（2度）', color: '#f97316' };
    if (bmi < 40) return { label: '肥満（3度）', color: '#ef4444' };
    return { label: '肥満（4度）', color: '#dc2626' };
  }

  function getIdealWeight(heightCm) {
    var heightM = heightCm / 100;
    return heightM * heightM * 22;
  }

  function buildChart(heightCm) {
    var table = document.getElementById('bmi-chart');
    var thead = table.querySelector('thead tr');
    var tbody = table.querySelector('tbody');

    // Clear existing
    while (thead.children.length > 1) thead.removeChild(thead.lastChild);
    tbody.innerHTML = '';

    // Weight columns: from 40 to 100 in steps of 5
    var weights = [];
    for (var w = 40; w <= 100; w += 5) weights.push(w);

    weights.forEach(function (w) {
      var th = document.createElement('th');
      th.textContent = w + 'kg';
      thead.appendChild(th);
    });

    // Height rows: from 150 to 185 in steps of 5
    var heights = [];
    for (var h = 150; h <= 185; h += 5) heights.push(h);

    heights.forEach(function (h) {
      var tr = document.createElement('tr');
      var tdH = document.createElement('td');
      tdH.textContent = h + 'cm';
      tdH.style.fontWeight = 'bold';
      if (Math.abs(h - heightCm) < 3) tdH.style.background = 'var(--color-primary-light, #dbeafe)';
      tr.appendChild(tdH);

      weights.forEach(function (w) {
        var td = document.createElement('td');
        var bmi = calcBMI(h, w);
        td.textContent = bmi.toFixed(1);
        if (bmi < 18.5) {
          td.style.background = '#dbeafe';
          td.style.color = '#1e40af';
        } else if (bmi < 25) {
          td.style.background = '#dcfce7';
          td.style.color = '#166534';
        } else if (bmi < 30) {
          td.style.background = '#fef3c7';
          td.style.color = '#92400e';
        } else {
          td.style.background = '#fee2e2';
          td.style.color = '#991b1b';
        }
        tr.appendChild(td);
      });

      tbody.appendChild(tr);
    });

    chartSection.hidden = false;
  }

  calcBtn.addEventListener('click', function () {
    var h = parseFloat(heightInput.value);
    var w = parseFloat(weightInput.value);

    if (!h || !w || h < 100 || h > 250 || w < 20 || w > 300) {
      alert('身長（100〜250cm）と体重（20〜300kg）を正しく入力してください。');
      return;
    }

    var bmi = calcBMI(h, w);
    var category = getCategory(bmi);
    var ideal = getIdealWeight(h);
    var diff = w - ideal;

    bmiValue.textContent = bmi.toFixed(1);
    bmiValue.style.color = category.color;
    bmiCategory.textContent = category.label;
    bmiCategory.style.color = category.color;
    idealWeight.textContent = ideal.toFixed(1) + ' kg';
    if (diff > 0) {
      weightDiff.textContent = '+' + diff.toFixed(1) + ' kg（適正体重より多い）';
      weightDiff.style.color = '#f59e0b';
    } else if (diff < 0) {
      weightDiff.textContent = diff.toFixed(1) + ' kg（適正体重より少ない）';
      weightDiff.style.color = '#3b82f6';
    } else {
      weightDiff.textContent = '0 kg（適正体重です）';
      weightDiff.style.color = '#22c55e';
    }

    resultSection.hidden = false;
    buildChart(h);
    resultSection.scrollIntoView({ behavior: 'smooth' });
  });

  resetBtn.addEventListener('click', function () {
    heightInput.value = '';
    weightInput.value = '';
    resultSection.hidden = true;
    chartSection.hidden = true;
  });
});
