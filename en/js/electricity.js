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
    '500': 'Air Conditioner',
    '150': 'Refrigerator',
    '100': 'TV / PC',
    '400': 'Washing Machine',
    '1000': 'Microwave',
    '1200': 'Hair Dryer',
    '60': 'Lighting'
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
        '<label class="form-label">Appliance Preset</label>' +
        '<select class="select appliance-preset">' +
          '<option value="">Enter manually</option>' +
          '<option value="500">Air Conditioner (500W)</option>' +
          '<option value="150">Refrigerator (150W)</option>' +
          '<option value="100">TV (100W)</option>' +
          '<option value="400">Washing Machine (400W)</option>' +
          '<option value="1000">Microwave (1000W)</option>' +
          '<option value="1200">Hair Dryer (1200W)</option>' +
          '<option value="60">Lighting (60W)</option>' +
          '<option value="100">PC (100W)</option>' +
        '</select>' +
      '</div>' +
      '<div class="form-group">' +
        '<label class="form-label">Power Consumption (W)</label>' +
        '<input class="input appliance-watt" type="number" min="1" max="10000" step="1" placeholder="e.g. 500">' +
      '</div>' +
      '<div class="form-group">' +
        '<label class="form-label">Daily Usage (hours)</label>' +
        '<input class="input appliance-hours" type="number" min="0.1" max="24" step="0.1" placeholder="e.g. 8">' +
      '</div>' +
      '<button class="btn btn--secondary remove-appliance-btn" type="button">Remove</button>';
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

  function formatCost(val) {
    return val.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  }

  function getApplianceName(row) {
    var preset = row.querySelector('.appliance-preset');
    var watt = row.querySelector('.appliance-watt').value;
    if (preset.value && preset.selectedOptions && preset.selectedOptions[0]) {
      var text = preset.selectedOptions[0].textContent;
      if (text !== 'Enter manually') {
        return text;
      }
    }
    return watt + 'W Appliance';
  }

  calcBtn.addEventListener('click', function () {
    var rate = parseFloat(rateInput.value);
    if (!rate || rate <= 0) {
      alert('Please enter a valid electricity rate.');
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
      alert('Please enter the power consumption and usage hours for at least one appliance.');
      return;
    }

    eachResult.innerHTML = '';
    details.forEach(function (d) {
      var item = document.createElement('div');
      item.className = 'result__item';
      item.innerHTML =
        '<span class="result__label">' + d.name + '</span>' +
        '<span class="result__value">' +
          'Daily ' + formatCost(d.daily) +
          ' / Monthly ' + formatCost(d.monthly) +
          ' / Yearly ' + formatCost(d.yearly) +
        '</span>';
      eachResult.appendChild(item);
    });

    var monthlyCost = totalDailyCost * 30;
    var yearlyCost = totalDailyCost * 365;

    totalDaily.textContent = formatCost(totalDailyCost);
    totalMonthly.textContent = formatCost(monthlyCost);
    totalYearly.textContent = formatCost(yearlyCost);

    resultSection.hidden = false;
    resultSection.scrollIntoView({ behavior: 'smooth' });
  });

  resetBtn.addEventListener('click', function () {
    rateInput.value = '31';
    var rows = applianceList.querySelectorAll('.appliance-row');
    for (var i = rows.length - 1; i > 0; i--) {
      applianceList.removeChild(rows[i]);
    }
    var first = rows[0];
    if (first) {
      first.querySelector('.appliance-preset').value = '';
      first.querySelector('.appliance-watt').value = '';
      first.querySelector('.appliance-hours').value = '';
    }
    resultSection.hidden = true;
  });
});
