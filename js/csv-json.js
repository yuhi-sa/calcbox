document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  var csvInput = document.getElementById('csv-input');
  var jsonInput = document.getElementById('json-input');
  var delimiterSelect = document.getElementById('delimiter-select');
  var headerToggle = document.getElementById('header-toggle');
  var csvToJsonBtn = document.getElementById('csv-to-json-btn');
  var jsonToCsvBtn = document.getElementById('json-to-csv-btn');
  var copyBtn = document.getElementById('copy-btn');
  var errorMsg = document.getElementById('error-msg');
  var resultSection = document.getElementById('result');
  var resultInfo = document.getElementById('result-info');
  var output = document.getElementById('output');
  var previewSection = document.getElementById('preview-section');
  var previewTable = document.getElementById('preview-table');

  function hideError() {
    errorMsg.hidden = true;
    errorMsg.textContent = '';
  }

  function showError(msg) {
    errorMsg.textContent = msg;
    errorMsg.hidden = false;
    resultSection.hidden = true;
    previewSection.hidden = true;
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  function parseCsvLine(line, delimiter) {
    var fields = [];
    var current = '';
    var inQuotes = false;
    for (var i = 0; i < line.length; i++) {
      var ch = line[i];
      if (inQuotes) {
        if (ch === '"') {
          if (i + 1 < line.length && line[i + 1] === '"') {
            current += '"';
            i++;
          } else {
            inQuotes = false;
          }
        } else {
          current += ch;
        }
      } else {
        if (ch === '"') {
          inQuotes = true;
        } else if (ch === delimiter) {
          fields.push(current);
          current = '';
        } else {
          current += ch;
        }
      }
    }
    fields.push(current);
    return fields;
  }

  function csvToJson(csvText, delimiter, hasHeader) {
    var lines = csvText.split(/\r?\n/).filter(function (l) { return l.trim() !== ''; });
    if (lines.length === 0) return [];

    var rows = lines.map(function (line) {
      return parseCsvLine(line, delimiter);
    });

    if (hasHeader && rows.length > 0) {
      var headers = rows[0];
      var data = [];
      for (var i = 1; i < rows.length; i++) {
        var obj = {};
        for (var j = 0; j < headers.length; j++) {
          var val = rows[i][j] !== undefined ? rows[i][j] : '';
          var num = Number(val);
          obj[headers[j]] = val !== '' && !isNaN(num) && isFinite(num) ? num : val;
        }
        data.push(obj);
      }
      return data;
    } else {
      return rows;
    }
  }

  function jsonToCsv(data, delimiter) {
    if (!Array.isArray(data) || data.length === 0) return '';

    if (typeof data[0] === 'object' && !Array.isArray(data[0])) {
      var keys = [];
      data.forEach(function (obj) {
        Object.keys(obj).forEach(function (k) {
          if (keys.indexOf(k) === -1) keys.push(k);
        });
      });
      var lines = [keys.map(function (k) { return escapeCsvField(String(k), delimiter); }).join(delimiter)];
      data.forEach(function (obj) {
        var row = keys.map(function (k) {
          var val = obj[k] !== undefined && obj[k] !== null ? String(obj[k]) : '';
          return escapeCsvField(val, delimiter);
        });
        lines.push(row.join(delimiter));
      });
      return lines.join('\n');
    } else {
      return data.map(function (row) {
        if (Array.isArray(row)) {
          return row.map(function (v) { return escapeCsvField(String(v), delimiter); }).join(delimiter);
        }
        return String(row);
      }).join('\n');
    }
  }

  function escapeCsvField(field, delimiter) {
    if (field.indexOf('"') !== -1 || field.indexOf(delimiter) !== -1 || field.indexOf('\n') !== -1) {
      return '"' + field.replace(/"/g, '""') + '"';
    }
    return field;
  }

  function showPreview(data, hasHeader) {
    if (!Array.isArray(data) || data.length === 0) {
      previewSection.hidden = true;
      return;
    }

    var html = '';
    if (typeof data[0] === 'object' && !Array.isArray(data[0])) {
      var keys = [];
      data.forEach(function (obj) {
        Object.keys(obj).forEach(function (k) {
          if (keys.indexOf(k) === -1) keys.push(k);
        });
      });
      html += '<thead><tr>';
      keys.forEach(function (k) { html += '<th style="padding:8px 12px;border:1px solid var(--color-border);background:var(--color-bg-secondary);text-align:left;">' + escapeHtml(k) + '</th>'; });
      html += '</tr></thead><tbody>';
      var maxRows = Math.min(data.length, 50);
      for (var i = 0; i < maxRows; i++) {
        html += '<tr>';
        keys.forEach(function (k) {
          var val = data[i][k] !== undefined && data[i][k] !== null ? String(data[i][k]) : '';
          html += '<td style="padding:8px 12px;border:1px solid var(--color-border);">' + escapeHtml(val) + '</td>';
        });
        html += '</tr>';
      }
      html += '</tbody>';
    } else {
      html += '<tbody>';
      var maxRows2 = Math.min(data.length, 50);
      for (var r = 0; r < maxRows2; r++) {
        html += '<tr>';
        var row = Array.isArray(data[r]) ? data[r] : [data[r]];
        row.forEach(function (v) {
          html += '<td style="padding:8px 12px;border:1px solid var(--color-border);">' + escapeHtml(String(v)) + '</td>';
        });
        html += '</tr>';
      }
      html += '</tbody>';
    }

    previewTable.innerHTML = html;
    previewSection.hidden = false;
  }

  csvToJsonBtn.addEventListener('click', function () {
    hideError();
    var raw = csvInput.value.trim();
    if (!raw) {
      showError('CSVデータを入力してください。');
      return;
    }
    var delimiter = delimiterSelect.value;
    var hasHeader = headerToggle.checked;
    try {
      var data = csvToJson(raw, delimiter, hasHeader);
      var jsonStr = JSON.stringify(data, null, 2);
      jsonInput.value = jsonStr;
      output.textContent = jsonStr;
      resultInfo.textContent = 'CSV → JSON | ' + data.length + '件のレコード';
      resultSection.hidden = false;
      showPreview(data, hasHeader);
      resultSection.scrollIntoView({ behavior: 'smooth' });
    } catch (e) {
      showError('CSV変換エラー: ' + e.message);
    }
  });

  jsonToCsvBtn.addEventListener('click', function () {
    hideError();
    var raw = jsonInput.value.trim();
    if (!raw) {
      showError('JSONデータを入力してください。');
      return;
    }
    var delimiter = delimiterSelect.value;
    try {
      var data = JSON.parse(raw);
      if (!Array.isArray(data)) {
        showError('JSON配列を入力してください（例: [{...}, {...}]）。');
        return;
      }
      var csvStr = jsonToCsv(data, delimiter);
      csvInput.value = csvStr;
      output.textContent = csvStr;
      resultInfo.textContent = 'JSON → CSV | ' + data.length + '件のレコード';
      resultSection.hidden = false;
      showPreview(data, true);
      resultSection.scrollIntoView({ behavior: 'smooth' });
    } catch (e) {
      showError('JSONの構文エラー: ' + e.message);
    }
  });

  copyBtn.addEventListener('click', function () {
    var text = output.textContent;
    if (!text) return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        var original = copyBtn.textContent;
        copyBtn.textContent = 'コピー済み';
        setTimeout(function () {
          copyBtn.textContent = original;
        }, 1500);
      });
    }
  });
});
