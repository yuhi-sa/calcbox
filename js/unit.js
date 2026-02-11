document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  var fromValueInput = document.getElementById('from-value');
  var fromUnitSelect = document.getElementById('from-unit');
  var toUnitSelect = document.getElementById('to-unit');
  var convertBtn = document.getElementById('convert-btn');
  var swapBtn = document.getElementById('swap-btn');
  var resetBtn = document.getElementById('reset-btn');
  var resultSection = document.getElementById('result');
  var convertResult = document.getElementById('convert-result');
  var tableSection = document.getElementById('conversion-table-section');
  var conversionTable = document.getElementById('conversion-table');

  // Unit definitions: each unit has a factor to convert TO the base unit
  // For temperature, special handling is needed
  var units = {
    length: {
      name: '長さ',
      base: 'm',
      items: [
        { key: 'mm', label: 'ミリメートル (mm)', factor: 0.001 },
        { key: 'cm', label: 'センチメートル (cm)', factor: 0.01 },
        { key: 'm', label: 'メートル (m)', factor: 1 },
        { key: 'km', label: 'キロメートル (km)', factor: 1000 },
        { key: 'inch', label: 'インチ (inch)', factor: 0.0254 },
        { key: 'feet', label: 'フィート (feet)', factor: 0.3048 },
        { key: 'mile', label: 'マイル (mile)', factor: 1609.344 }
      ],
      sampleValues: [1, 10, 100, 500, 1000]
    },
    weight: {
      name: '重さ',
      base: 'g',
      items: [
        { key: 'mg', label: 'ミリグラム (mg)', factor: 0.001 },
        { key: 'g', label: 'グラム (g)', factor: 1 },
        { key: 'kg', label: 'キログラム (kg)', factor: 1000 },
        { key: 't', label: 'トン (t)', factor: 1000000 },
        { key: 'oz', label: 'オンス (oz)', factor: 28.3495 },
        { key: 'lb', label: 'ポンド (lb)', factor: 453.592 }
      ],
      sampleValues: [1, 10, 100, 500, 1000]
    },
    temperature: {
      name: '温度',
      base: 'C',
      items: [
        { key: 'C', label: '摂氏 (\u2103)' },
        { key: 'F', label: '華氏 (\u2109)' },
        { key: 'K', label: 'ケルビン (K)' }
      ],
      sampleValues: [-40, 0, 20, 36.5, 100]
    },
    area: {
      name: '面積',
      base: 'm2',
      items: [
        { key: 'mm2', label: '平方ミリメートル (mm\u00B2)', factor: 0.000001 },
        { key: 'cm2', label: '平方センチメートル (cm\u00B2)', factor: 0.0001 },
        { key: 'm2', label: '平方メートル (m\u00B2)', factor: 1 },
        { key: 'km2', label: '平方キロメートル (km\u00B2)', factor: 1000000 },
        { key: 'ha', label: 'ヘクタール (ha)', factor: 10000 },
        { key: 'a', label: 'アール (a)', factor: 100 },
        { key: 'tsubo', label: '坪', factor: 3.30579 },
        { key: 'jo', label: '畳', factor: 1.6562 }
      ],
      sampleValues: [1, 10, 30, 50, 100]
    }
  };

  function getCurrentCategory() {
    var radios = document.querySelectorAll('input[name="category"]');
    for (var i = 0; i < radios.length; i++) {
      if (radios[i].checked) return radios[i].value;
    }
    return 'length';
  }

  function populateUnitSelects(category) {
    var cat = units[category];
    fromUnitSelect.innerHTML = '';
    toUnitSelect.innerHTML = '';

    cat.items.forEach(function (item) {
      var opt1 = document.createElement('option');
      opt1.value = item.key;
      opt1.textContent = item.label;
      fromUnitSelect.appendChild(opt1);

      var opt2 = document.createElement('option');
      opt2.value = item.key;
      opt2.textContent = item.label;
      toUnitSelect.appendChild(opt2);
    });

    // Set default to unit to second item if available
    if (cat.items.length > 1) {
      toUnitSelect.value = cat.items[1].key;
    }
  }

  // Temperature conversion functions (all go through Celsius as intermediate)
  function toCelsius(value, fromKey) {
    switch (fromKey) {
      case 'C': return value;
      case 'F': return (value - 32) * 5 / 9;
      case 'K': return value - 273.15;
      default: return value;
    }
  }

  function fromCelsius(celsius, toKey) {
    switch (toKey) {
      case 'C': return celsius;
      case 'F': return celsius * 9 / 5 + 32;
      case 'K': return celsius + 273.15;
      default: return celsius;
    }
  }

  function convert(value, fromKey, toKey, category) {
    if (category === 'temperature') {
      var celsius = toCelsius(value, fromKey);
      return fromCelsius(celsius, toKey);
    }

    var cat = units[category];
    var fromFactor = null;
    var toFactor = null;

    cat.items.forEach(function (item) {
      if (item.key === fromKey) fromFactor = item.factor;
      if (item.key === toKey) toFactor = item.factor;
    });

    if (fromFactor === null || toFactor === null) return NaN;

    // Convert to base unit, then to target
    var baseValue = value * fromFactor;
    return baseValue / toFactor;
  }

  function formatResult(num) {
    if (Math.abs(num) >= 1000000 || (Math.abs(num) < 0.001 && num !== 0)) {
      return num.toExponential(6);
    }
    // Use up to 6 significant digits
    var str = Number(num.toPrecision(10)).toString();
    // Limit decimal places
    if (str.indexOf('.') !== -1) {
      var parts = str.split('.');
      if (parts[1].length > 6) {
        return Number(num).toFixed(6).replace(/0+$/, '').replace(/\.$/, '');
      }
    }
    return str;
  }

  function getUnitLabel(key, category) {
    var cat = units[category];
    for (var i = 0; i < cat.items.length; i++) {
      if (cat.items[i].key === key) return cat.items[i].label;
    }
    return key;
  }

  function getUnitShortLabel(key) {
    // Extract the part in parentheses
    var map = {
      'mm': 'mm', 'cm': 'cm', 'm': 'm', 'km': 'km',
      'inch': 'inch', 'feet': 'feet', 'mile': 'mile',
      'mg': 'mg', 'g': 'g', 'kg': 'kg', 't': 't',
      'oz': 'oz', 'lb': 'lb',
      'C': '\u2103', 'F': '\u2109', 'K': 'K',
      'mm2': 'mm\u00B2', 'cm2': 'cm\u00B2', 'm2': 'm\u00B2', 'km2': 'km\u00B2',
      'ha': 'ha', 'a': 'a', 'tsubo': '坪', 'jo': '畳'
    };
    return map[key] || key;
  }

  function buildConversionTable(fromKey, toKey, category) {
    var cat = units[category];
    var sampleValues = cat.sampleValues;

    var thead = conversionTable.querySelector('thead tr');
    var tbody = conversionTable.querySelector('tbody');
    thead.innerHTML = '';
    tbody.innerHTML = '';

    var fromShort = getUnitShortLabel(fromKey);
    var toShort = getUnitShortLabel(toKey);

    var th1 = document.createElement('th');
    th1.textContent = fromShort;
    thead.appendChild(th1);

    var th2 = document.createElement('th');
    th2.textContent = toShort;
    thead.appendChild(th2);

    sampleValues.forEach(function (val) {
      var converted = convert(val, fromKey, toKey, category);
      var tr = document.createElement('tr');

      var td1 = document.createElement('td');
      td1.textContent = val + ' ' + fromShort;
      tr.appendChild(td1);

      var td2 = document.createElement('td');
      td2.textContent = formatResult(converted) + ' ' + toShort;
      tr.appendChild(td2);

      tbody.appendChild(tr);
    });

    tableSection.hidden = false;
  }

  function doConvert() {
    var value = parseFloat(fromValueInput.value);
    var category = getCurrentCategory();

    if (isNaN(value)) {
      alert('変換元の値を入力してください。');
      return;
    }

    var fromKey = fromUnitSelect.value;
    var toKey = toUnitSelect.value;

    var result = convert(value, fromKey, toKey, category);

    var fromShort = getUnitShortLabel(fromKey);
    var toShort = getUnitShortLabel(toKey);

    convertResult.textContent = value + ' ' + fromShort + ' = ' + formatResult(result) + ' ' + toShort;

    resultSection.hidden = false;
    buildConversionTable(fromKey, toKey, category);
    resultSection.scrollIntoView({ behavior: 'smooth' });
  }

  convertBtn.addEventListener('click', doConvert);

  swapBtn.addEventListener('click', function () {
    var tempUnit = fromUnitSelect.value;
    fromUnitSelect.value = toUnitSelect.value;
    toUnitSelect.value = tempUnit;

    // If result is already shown, reconvert with the converted value
    if (!resultSection.hidden && fromValueInput.value) {
      doConvert();
    }
  });

  resetBtn.addEventListener('click', function () {
    fromValueInput.value = '';
    var category = getCurrentCategory();
    populateUnitSelects(category);
    resultSection.hidden = true;
    tableSection.hidden = true;
  });

  // Category change handler
  var categoryRadios = document.querySelectorAll('input[name="category"]');
  categoryRadios.forEach(function (radio) {
    radio.addEventListener('change', function () {
      populateUnitSelects(radio.value);
      resultSection.hidden = true;
      tableSection.hidden = true;
      fromValueInput.value = '';
    });
  });

  // Initialize
  populateUnitSelects('length');
});
