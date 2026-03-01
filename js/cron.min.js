document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  var cronInput = document.getElementById('cron-input');
  var parseBtn = document.getElementById('parse-btn');
  var errorMsg = document.getElementById('error-msg');
  var resultSection = document.getElementById('result');
  var cronDescription = document.getElementById('cron-description');
  var fieldExplanation = document.getElementById('field-explanation');
  var nextRuns = document.getElementById('next-runs');

  var weekdays = ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'];
  var months = ['', '1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

  function parseField(field, min, max) {
    var values = [];
    var parts = field.split(',');
    for (var i = 0; i < parts.length; i++) {
      var part = parts[i].trim();
      if (part.indexOf('/') !== -1) {
        var stepParts = part.split('/');
        var step = parseInt(stepParts[1], 10);
        if (isNaN(step) || step <= 0) return null;
        var rangeStart = min;
        var rangeEnd = max;
        if (stepParts[0] !== '*') {
          if (stepParts[0].indexOf('-') !== -1) {
            var rangeParts = stepParts[0].split('-');
            rangeStart = parseInt(rangeParts[0], 10);
            rangeEnd = parseInt(rangeParts[1], 10);
          } else {
            rangeStart = parseInt(stepParts[0], 10);
          }
        }
        for (var v = rangeStart; v <= rangeEnd; v += step) {
          values.push(v);
        }
      } else if (part.indexOf('-') !== -1) {
        var rParts = part.split('-');
        var rStart = parseInt(rParts[0], 10);
        var rEnd = parseInt(rParts[1], 10);
        if (isNaN(rStart) || isNaN(rEnd)) return null;
        for (var v2 = rStart; v2 <= rEnd; v2++) {
          values.push(v2);
        }
      } else if (part === '*') {
        for (var v3 = min; v3 <= max; v3++) {
          values.push(v3);
        }
      } else {
        var num = parseInt(part, 10);
        if (isNaN(num)) return null;
        values.push(num);
      }
    }
    return values.length > 0 ? values : null;
  }

  function describeField(field, fieldName) {
    if (field === '*') return fieldName + ': すべて（*）';
    if (field.indexOf('/') !== -1) {
      var parts = field.split('/');
      if (parts[0] === '*') return fieldName + ': ' + parts[1] + 'ごと';
      return fieldName + ': ' + parts[0] + 'から' + parts[1] + 'ごと';
    }
    if (field.indexOf('-') !== -1) {
      var range = field.split('-');
      return fieldName + ': ' + range[0] + 'から' + range[1] + 'まで';
    }
    if (field.indexOf(',') !== -1) {
      return fieldName + ': ' + field + '（列挙）';
    }
    return fieldName + ': ' + field;
  }

  function describeCron(parts) {
    var min = parts[0], hour = parts[1], day = parts[2], month = parts[3], dow = parts[4];
    var desc = '';

    if (min === '*' && hour === '*' && day === '*' && month === '*' && dow === '*') {
      return '毎分実行';
    }
    if (min === '0' && hour === '*' && day === '*' && month === '*' && dow === '*') {
      return '毎時0分に実行';
    }
    if (hour === '*' && day === '*' && month === '*' && dow === '*') {
      if (min.indexOf('/') !== -1) {
        return min.split('/')[1] + '分ごとに実行';
      }
    }
    if (day === '*' && month === '*' && dow === '*') {
      desc = '毎日 ';
    } else if (dow !== '*' && day === '*' && month === '*') {
      var dowVal = dow === '7' ? '0' : dow;
      var dowNames = dowVal.split(',').map(function (d) {
        var n = parseInt(d, 10);
        return weekdays[n] || d;
      });
      desc = '毎週' + dowNames.join('・') + ' ';
    } else if (day !== '*' && month === '*' && dow === '*') {
      desc = '毎月' + day + '日 ';
    } else if (month !== '*') {
      desc = months[parseInt(month, 10)] + (day !== '*' ? day + '日' : '毎日') + ' ';
    }

    if (hour !== '*' && min !== '*') {
      desc += hour + '時' + min + '分に実行';
    } else if (hour !== '*') {
      desc += hour + '時の毎分実行';
    } else if (min !== '*') {
      if (min.indexOf('/') !== -1) {
        desc += min.split('/')[1] + '分ごとに実行';
      } else {
        desc += '毎時' + min + '分に実行';
      }
    } else {
      desc += '毎分実行';
    }

    return desc;
  }

  function pad(n) {
    return n < 10 ? '0' + n : '' + n;
  }

  function getNextRuns(minVals, hourVals, dayVals, monthVals, dowVals, count) {
    var results = [];
    var now = new Date();
    var candidate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes() + 1, 0, 0);
    var maxIterations = 525600; // 1 year of minutes

    for (var i = 0; i < maxIterations && results.length < count; i++) {
      var m = candidate.getMonth() + 1;
      var d = candidate.getDate();
      var h = candidate.getHours();
      var mi = candidate.getMinutes();
      var w = candidate.getDay();

      if (monthVals.indexOf(m) !== -1 &&
          dayVals.indexOf(d) !== -1 &&
          dowVals.indexOf(w) !== -1 &&
          hourVals.indexOf(h) !== -1 &&
          minVals.indexOf(mi) !== -1) {
        results.push(new Date(candidate));
      }
      candidate = new Date(candidate.getTime() + 60000);
    }
    return results;
  }

  function parseCron() {
    var expr = cronInput.value.trim();
    if (!expr) {
      errorMsg.hidden = true;
      resultSection.hidden = true;
      return;
    }

    var parts = expr.split(/\s+/);
    if (parts.length !== 5) {
      errorMsg.textContent = 'Cron式は5つのフィールド（分 時 日 月 曜日）で構成される必要があります。';
      errorMsg.hidden = false;
      resultSection.hidden = true;
      return;
    }

    var minVals = parseField(parts[0], 0, 59);
    var hourVals = parseField(parts[1], 0, 23);
    var dayVals = parseField(parts[2], 1, 31);
    var monthVals = parseField(parts[3], 1, 12);
    var dowVals = parseField(parts[4], 0, 7);

    if (!minVals || !hourVals || !dayVals || !monthVals || !dowVals) {
      errorMsg.textContent = 'Cron式の解析に失敗しました。各フィールドの値を確認してください。';
      errorMsg.hidden = false;
      resultSection.hidden = true;
      return;
    }

    // Normalize day-of-week: 7 -> 0 (both mean Sunday)
    for (var i = 0; i < dowVals.length; i++) {
      if (dowVals[i] === 7) dowVals[i] = 0;
    }

    errorMsg.hidden = true;

    cronDescription.textContent = describeCron(parts);

    var fieldNames = ['分（0-59）', '時（0-23）', '日（1-31）', '月（1-12）', '曜日（0-7）'];
    var html = '<table style="width:100%;border-collapse:collapse;">';
    for (var j = 0; j < 5; j++) {
      html += '<tr style="border-bottom:1px solid var(--color-border);">';
      html += '<td style="padding:var(--space-xs) var(--space-sm);font-weight:600;white-space:nowrap;">' + fieldNames[j] + '</td>';
      html += '<td style="padding:var(--space-xs) var(--space-sm);font-family:var(--font-mono);">' + parts[j] + '</td>';
      html += '<td style="padding:var(--space-xs) var(--space-sm);">' + describeField(parts[j], fieldNames[j].split('（')[0]) + '</td>';
      html += '</tr>';
    }
    html += '</table>';
    fieldExplanation.innerHTML = html;

    var runs = getNextRuns(minVals, hourVals, dayVals, monthVals, dowVals, 5);
    nextRuns.innerHTML = '';
    for (var k = 0; k < runs.length; k++) {
      var li = document.createElement('li');
      li.style.cssText = 'padding:var(--space-xs) 0;border-bottom:1px solid var(--color-border);';
      var r = runs[k];
      li.textContent = r.getFullYear() + '-' + pad(r.getMonth() + 1) + '-' + pad(r.getDate()) + ' ' +
        pad(r.getHours()) + ':' + pad(r.getMinutes()) + ' (' + weekdays[r.getDay()] + ')';
      nextRuns.appendChild(li);
    }
    if (runs.length === 0) {
      var li2 = document.createElement('li');
      li2.textContent = '1年以内に実行予定が見つかりませんでした。';
      nextRuns.appendChild(li2);
    }

    resultSection.hidden = false;
  }

  parseBtn.addEventListener('click', parseCron);

  cronInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') parseCron();
  });

  // Preset buttons
  var presetBtns = document.querySelectorAll('.preset-btn');
  for (var i = 0; i < presetBtns.length; i++) {
    (function (btn) {
      btn.addEventListener('click', function () {
        cronInput.value = btn.getAttribute('data-cron');
        parseCron();
      });
    })(presetBtns[i]);
  }
});