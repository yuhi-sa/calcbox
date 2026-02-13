document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  var CURRENT_YEAR = 2026;
  var START_YEAR = 1926;

  // 干支 (Junishi) - 12-year cycle
  var JUNISHI = [
    '子(ね)', '丑(うし)', '寅(とら)', '卯(う)',
    '辰(たつ)', '巳(み)', '午(うま)', '未(ひつじ)',
    '申(さる)', '酉(とり)', '戌(いぬ)', '亥(い)'
  ];

  function getJunishi(year) {
    // 子年の基準: 2020年は子年 -> (2020 - 4) % 12 = 0
    var index = ((year - 4) % 12 + 12) % 12;
    return JUNISHI[index];
  }

  function getWareki(year) {
    if (year >= 2019) {
      var reiwa = year - 2018;
      if (year === 2019) {
        return '平成31年 / 令和元年';
      }
      return '令和' + reiwa + '年';
    } else if (year >= 1989) {
      var heisei = year - 1988;
      if (year === 1989) {
        return '昭和64年 / 平成元年';
      }
      return '平成' + heisei + '年';
    } else if (year >= 1926) {
      var showa = year - 1925;
      if (year === 1926) {
        return '昭和元年';
      }
      return '昭和' + showa + '年';
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
    var junishi = getJunishi(y);
    rows.push({
      year: y,
      wareki: wareki,
      age: age,
      junishi: junishi
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
        var junishiLower = row.junishi.toLowerCase();

        var match = yearStr.indexOf(filterLower) !== -1 ||
                    ageStr === filterLower ||
                    warekiLower.indexOf(filterLower) !== -1 ||
                    junishiLower.indexOf(filterLower) !== -1;

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
      tdYear.textContent = row.year + '年';

      var tdWareki = document.createElement('td');
      tdWareki.style.cssText = 'padding: 8px 12px; text-align: center; white-space: nowrap;';
      tdWareki.textContent = row.wareki;

      var tdAge = document.createElement('td');
      tdAge.style.cssText = 'padding: 8px 12px; text-align: center; font-weight: 600;';
      tdAge.textContent = row.age === 0 ? '0歳（誕生年）' : row.age + '歳';

      var tdJunishi = document.createElement('td');
      tdJunishi.style.cssText = 'padding: 8px 12px; text-align: center;';
      tdJunishi.textContent = row.junishi;

      tr.appendChild(tdYear);
      tr.appendChild(tdWareki);
      tr.appendChild(tdAge);
      tr.appendChild(tdJunishi);
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