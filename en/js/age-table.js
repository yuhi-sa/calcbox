document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  var CURRENT_YEAR = 2026;
  var START_YEAR = 1926;

  // Chinese Zodiac - 12-year cycle
  var ZODIAC = [
    'Rat', 'Ox', 'Tiger', 'Rabbit',
    'Dragon', 'Snake', 'Horse', 'Goat',
    'Monkey', 'Rooster', 'Dog', 'Boar'
  ];

  function getZodiac(year) {
    var index = ((year - 4) % 12 + 12) % 12;
    return ZODIAC[index];
  }

  function getWareki(year) {
    if (year >= 2019) {
      var reiwa = year - 2018;
      if (year === 2019) {
        return 'Heisei 31 / Reiwa 1';
      }
      return 'Reiwa ' + reiwa;
    } else if (year >= 1989) {
      var heisei = year - 1988;
      if (year === 1989) {
        return 'Showa 64 / Heisei 1';
      }
      return 'Heisei ' + heisei;
    } else if (year >= 1926) {
      var showa = year - 1925;
      if (year === 1926) {
        return 'Showa 1';
      }
      return 'Showa ' + showa;
    }
    return '';
  }

  var searchInput = document.getElementById('search-input');
  var tableBody = document.getElementById('age-table-body');
  var noResults = document.getElementById('no-results');

  // Build table data
  var rows = [];
  for (var y = CURRENT_YEAR; y >= START_YEAR; y--) {
    var age = CURRENT_YEAR - y;
    var wareki = getWareki(y);
    var zodiac = getZodiac(y);
    rows.push({
      year: y,
      wareki: wareki,
      age: age,
      zodiac: zodiac
    });
  }

  function renderTable(filter) {
    tableBody.innerHTML = '';
    var filterLower = (filter || '').trim().toLowerCase();
    var visibleCount = 0;

    for (var i = 0; i < rows.length; i++) {
      var row = rows[i];

      // Filter logic
      if (filterLower) {
        var yearStr = String(row.year);
        var ageStr = String(row.age);
        var warekiLower = row.wareki.toLowerCase();
        var zodiacLower = row.zodiac.toLowerCase();

        var match = yearStr.indexOf(filterLower) !== -1 ||
                    ageStr === filterLower ||
                    warekiLower.indexOf(filterLower) !== -1 ||
                    zodiacLower.indexOf(filterLower) !== -1;

        if (!match) continue;
      }

      visibleCount++;

      var tr = document.createElement('tr');

      // Highlight current year
      if (row.year === CURRENT_YEAR) {
        tr.style.cssText = 'background: var(--color-primary-light, rgba(59, 130, 246, 0.1)); font-weight: 600;';
      } else {
        tr.style.cssText = 'border-bottom: 1px solid var(--color-border, #e5e7eb);';
      }

      var tdYear = document.createElement('td');
      tdYear.style.cssText = 'padding: 8px 12px; text-align: center;';
      tdYear.textContent = row.year;

      var tdWareki = document.createElement('td');
      tdWareki.style.cssText = 'padding: 8px 12px; text-align: center; white-space: nowrap;';
      tdWareki.textContent = row.wareki;

      var tdAge = document.createElement('td');
      tdAge.style.cssText = 'padding: 8px 12px; text-align: center; font-weight: 600;';
      tdAge.textContent = row.age === 0 ? '0 (birth year)' : row.age;

      var tdZodiac = document.createElement('td');
      tdZodiac.style.cssText = 'padding: 8px 12px; text-align: center;';
      tdZodiac.textContent = row.zodiac;

      tr.appendChild(tdYear);
      tr.appendChild(tdWareki);
      tr.appendChild(tdAge);
      tr.appendChild(tdZodiac);
      tableBody.appendChild(tr);
    }

    noResults.style.display = visibleCount === 0 ? 'block' : 'none';
  }

  // Initial render
  renderTable('');

  // Search/filter
  searchInput.addEventListener('input', function () {
    renderTable(searchInput.value);
  });
});
