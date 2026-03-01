document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  var ERAS = [
    { key: 'reiwa', name: 'Reiwa', jaName: '令和', startYear: 2019 },
    { key: 'heisei', name: 'Heisei', jaName: '平成', startYear: 1989 },
    { key: 'showa', name: 'Showa', jaName: '昭和', startYear: 1926 },
    { key: 'taisho', name: 'Taisho', jaName: '大正', startYear: 1912 },
    { key: 'meiji', name: 'Meiji', jaName: '明治', startYear: 1868 }
  ];

  var eraSelect = document.getElementById('era-select');
  var eraYearInput = document.getElementById('era-year');
  var westernYearInput = document.getElementById('western-year');

  var warekiToSeirekiBtn = document.getElementById('wareki-to-seireki-btn');
  var seirekiToWarekiBtn = document.getElementById('seireki-to-wareki-btn');

  var resultWareki = document.getElementById('result-wareki');
  var warekiResultContent = document.getElementById('wareki-result-content');
  var resultSeireki = document.getElementById('result-seireki');
  var seirekiResultContent = document.getElementById('seireki-result-content');

  function findEra(key) {
    for (var i = 0; i < ERAS.length; i++) {
      if (ERAS[i].key === key) return ERAS[i];
    }
    return null;
  }

  function formatEraYear(year) {
    return year === 1 ? ' 1 (Gannen)' : ' ' + year;
  }

  warekiToSeirekiBtn.addEventListener('click', function () {
    var era = findEra(eraSelect.value);
    var eraYear = parseInt(eraYearInput.value, 10);

    if (!era) {
      alert('Please select a Japanese era.');
      return;
    }
    if (isNaN(eraYear) || eraYear < 1) {
      alert('Please enter a year of 1 or greater.');
      return;
    }

    var westernYear = era.startYear + eraYear - 1;

    warekiResultContent.innerHTML = '';

    var item = document.createElement('div');
    item.className = 'result__item';

    var label = document.createElement('span');
    label.className = 'result__label';
    label.textContent = era.name + formatEraYear(eraYear) + ' (' + era.jaName + ')';

    var value = document.createElement('span');
    value.className = 'result__value';
    value.textContent = westernYear + ' AD';

    item.appendChild(label);
    item.appendChild(value);
    warekiResultContent.appendChild(item);

    resultWareki.hidden = false;
    resultWareki.scrollIntoView({ behavior: 'smooth' });
  });

  seirekiToWarekiBtn.addEventListener('click', function () {
    var westernYear = parseInt(westernYearInput.value, 10);

    if (isNaN(westernYear) || westernYear < 1868) {
      alert('Please enter a year of 1868 or later.');
      return;
    }

    seirekiResultContent.innerHTML = '';

    var found = false;
    for (var i = 0; i < ERAS.length; i++) {
      var era = ERAS[i];
      if (westernYear >= era.startYear) {
        var eraYear = westernYear - era.startYear + 1;

        var item = document.createElement('div');
        item.className = 'result__item';

        var label = document.createElement('span');
        label.className = 'result__label';
        label.textContent = westernYear + ' AD';

        var value = document.createElement('span');
        value.className = 'result__value';
        value.textContent = era.name + ' ' + eraYear + ' (' + era.jaName + ')';

        item.appendChild(label);
        item.appendChild(value);
        seirekiResultContent.appendChild(item);

        found = true;

        if (i + 1 < ERAS.length && westernYear === era.startYear) {
          var prevEra = ERAS[i + 1];
          var prevEraYear = westernYear - prevEra.startYear + 1;

          var item2 = document.createElement('div');
          item2.className = 'result__item';

          var label2 = document.createElement('span');
          label2.className = 'result__label';
          label2.textContent = '(Same year)';

          var value2 = document.createElement('span');
          value2.className = 'result__value';
          value2.textContent = prevEra.name + ' ' + prevEraYear + ' (' + prevEra.jaName + ')';

          item2.appendChild(label2);
          item2.appendChild(value2);
          seirekiResultContent.appendChild(item2);
        }

        break;
      }
    }

    if (!found) {
      var item = document.createElement('div');
      item.className = 'result__item';
      var label = document.createElement('span');
      label.className = 'result__label';
      label.textContent = 'No matching Japanese era found.';
      item.appendChild(label);
      seirekiResultContent.appendChild(item);
    }

    resultSeireki.hidden = false;
    resultSeireki.scrollIntoView({ behavior: 'smooth' });
  });
});
