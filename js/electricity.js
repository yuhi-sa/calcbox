document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  var applianceList = document.getElementById('appliance-list');
  var addBtn = document.getElementById('add-appliance-btn');
  var calcBtn = document.getElementById('calc-btn');
  var resetBtn = document.getElementById('reset-btn');
  var resultSection = document.getElementById('result');
  var eachResult = document.getElementById('each-result');
  var totalDaily = document.getElementById('total-daily');
  var totalMonthly = document.getElementById('total-monthly');
  var totalYearly = document.getElementById('total-yearly');
  var rateInput = document.getElementById('electricity-rate');

  var presetNames = {
    '500': 'エアコン',
    '150': '冷蔵庫',
    '100': 'テレビ / パソコン',
    '400': '洗濯機',
    '1000': '電子レンジ',
    '1200': 'ドライヤー',
    '60': '照明'
  };

  var rowCount = 1;

  function setupPresetHandler(row) {
    var preset = row.querySelector('.appliance-preset');
    var wattInput = row.querySelector('.appliance-watt');
    preset.addEventListener('change', function () {
      var val = preset.value;
      if (val) {
        wattInput.value = val;
      }
    });
  }

  // Setup the first row's preset handler
  var firstRow = applianceList.querySelector('.appliance-row');
  if (firstRow) {
    setupPresetHandler(firstRow);
  }

  function createApplianceRow() {
    var div = document.createElement('div');
    div.className = 'appliance-row';
    div.setAttribute('data-index', rowCount);
    div.innerHTML =
      '<div class="form-group">' +
        '<label class="form-label">家電プリセット</label>' +
        '<select class="select appliance-preset">' +
          '<option value="">手動で入力</option>' +
          '<option value="500">エアコン（500W）</option>' +
          '<option value="150">冷蔵庫（150W）</option>' +
          '<option value="100">テレビ（100W）</option>' +
          '<option value="400">洗濯機（400W）</option>' +
          '<option value="1000">電子レンジ（1000W）</option>' +
          '<option value="1200">ドライヤー（1200W）</option>' +
          '<option value="60">照明（60W）</option>' +
          '<option value="100">パソコン（100W）</option>' +
        '</select>' +
      '</div>' +
      '<div class="form-group">' +
        '<label class="form-label">消費電力（W）</label>' +
        '<input class="input appliance-watt" type="number" min="1" max="10000" step="1" placeholder="例: 500">' +
      '</div>' +
      '<div class="form-group">' +
        '<label class="form-label">1日の使用時間（時間）</label>' +
        '<input class="input appliance-hours" type="number" min="0.1" max="24" step="0.1" placeholder="例: 8">' +
      '</div>' +
      '<button class="btn btn--secondary remove-appliance-btn" type="button">削除</button>';
    rowCount++;
    return div;
  }

  addBtn.addEventListener('click', function () {
    var row = createApplianceRow();
    applianceList.appendChild(row);

    setupPresetHandler(row);

    row.querySelector('.remove-appliance-btn').addEventListener('click', function () {
      applianceList.removeChild(row);
    });
  });

  function formatYen(val) {
    return val.toLocaleString('ja-JP', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + '円';
  }

  function getApplianceName(row) {
    var preset = row.querySelector('.appliance-preset');
    var watt = row.querySelector('.appliance-watt').value;
    if (preset.value && preset.selectedOptions && preset.selectedOptions[0]) {
      var text = preset.selectedOptions[0].textContent;
      if (text !== '手動で入力') {
        return text;
      }
    }
    return watt + 'W の家電';
  }

  calcBtn.addEventListener('click', function () {
    var rate = parseFloat(rateInput.value);
    if (!rate || rate <= 0) {
      alert('電気料金単価を正しく入力してください。');
      return;
    }

    var rows = applianceList.querySelectorAll('.appliance-row');
    var totalDailyCost = 0;
    var details = [];
    var hasValid = false;

    for (var i = 0; i < rows.length; i++) {
      var wattInput = rows[i].querySelector('.appliance-watt');
      var hoursInput = rows[i].querySelector('.appliance-hours');
      var watt = parseFloat(wattInput.value);
      var hours = parseFloat(hoursInput.value);

      if (!watt || !hours) continue;

      hasValid = true;
      var dailyCost = (watt / 1000) * hours * rate;
      totalDailyCost += dailyCost;

      details.push({
        name: getApplianceName(rows[i]),
        watt: watt,
        hours: hours,
        daily: dailyCost,
        monthly: dailyCost * 30,
        yearly: dailyCost * 365
      });
    }

    if (!hasValid) {
      alert('家電の消費電力と使用時間を少なくとも1つ入力してください。');
      return;
    }

    // Render each appliance result
    eachResult.innerHTML = '';
    details.forEach(function (d) {
      var item = document.createElement('div');
      item.className = 'result__item';
      item.innerHTML =
        '<span class="result__label">' + d.name + '</span>' +
        '<span class="result__value">' +
          '日 ' + formatYen(d.daily) +
          ' / 月 ' + formatYen(d.monthly) +
          ' / 年 ' + formatYen(d.yearly) +
        '</span>';
      eachResult.appendChild(item);
    });

    var monthlyCost = totalDailyCost * 30;
    var yearlyCost = totalDailyCost * 365;

    totalDaily.textContent = formatYen(totalDailyCost);
    totalMonthly.textContent = formatYen(monthlyCost);
    totalYearly.textContent = formatYen(yearlyCost);

    resultSection.hidden = false;
    resultSection.scrollIntoView({ behavior: 'smooth' });
  });

  resetBtn.addEventListener('click', function () {
    rateInput.value = '31';
    // Remove all added rows, keep the first one
    var rows = applianceList.querySelectorAll('.appliance-row');
    for (var i = rows.length - 1; i > 0; i--) {
      applianceList.removeChild(rows[i]);
    }
    // Reset first row
    var first = rows[0];
    if (first) {
      first.querySelector('.appliance-preset').value = '';
      first.querySelector('.appliance-watt').value = '';
      first.querySelector('.appliance-hours').value = '';
    }
    resultSection.hidden = true;
  });
});
