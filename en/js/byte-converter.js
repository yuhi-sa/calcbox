document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  var byteInput = document.getElementById('byte-input');
  var unitSelect = document.getElementById('unit-select');
  var baseBinary = document.getElementById('base-binary');
  var baseDecimal = document.getElementById('base-decimal');
  var resultSection = document.getElementById('result');
  var resultTable = document.getElementById('result-table');

  var binaryUnits = [
    { label: 'B', iec: 'B', si: 'B', power: 0 },
    { label: 'KiB', iec: 'KiB', si: 'KB', power: 1 },
    { label: 'MiB', iec: 'MiB', si: 'MB', power: 2 },
    { label: 'GiB', iec: 'GiB', si: 'GB', power: 3 },
    { label: 'TiB', iec: 'TiB', si: 'TB', power: 4 },
    { label: 'PiB', iec: 'PiB', si: 'PB', power: 5 }
  ];

  var decimalUnits = [
    { label: 'B', iec: 'B', si: 'B', power: 0 },
    { label: 'KB', iec: 'KiB', si: 'KB', power: 1 },
    { label: 'MB', iec: 'MiB', si: 'MB', power: 2 },
    { label: 'GB', iec: 'GiB', si: 'GB', power: 3 },
    { label: 'TB', iec: 'TiB', si: 'TB', power: 4 },
    { label: 'PB', iec: 'PiB', si: 'PB', power: 5 }
  ];

  function formatNumber(num) {
    if (num === 0) return '0';
    if (Math.abs(num) >= 1) {
      // Show up to 6 decimal places, remove trailing zeros
      var str = num.toFixed(6);
      str = str.replace(/\.?0+$/, '');
      // Add thousands separator
      var parts = str.split('.');
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      return parts.join('.');
    } else {
      // Very small number
      return num.toPrecision(6);
    }
  }

  function convert() {
    var value = parseFloat(byteInput.value);
    if (isNaN(value) || byteInput.value.trim() === '') {
      resultSection.hidden = true;
      return;
    }

    var unitIndex = parseInt(unitSelect.value, 10);
    var isBinary = baseBinary.checked;
    var base = isBinary ? 1024 : 1000;

    // Convert to bytes first
    var bytes = value * Math.pow(base, unitIndex);

    var html = '<table style="width:100%;border-collapse:collapse;font-size:0.9rem;">';
    html += '<thead><tr>';
    html += '<th style="padding:10px 12px;border:1px solid var(--color-border);background:var(--color-bg-secondary);text-align:left;">Unit</th>';
    html += '<th style="padding:10px 12px;border:1px solid var(--color-border);background:var(--color-bg-secondary);text-align:left;">IEC Notation</th>';
    html += '<th style="padding:10px 12px;border:1px solid var(--color-border);background:var(--color-bg-secondary);text-align:right;">Value</th>';
    html += '<th style="padding:10px 12px;border:1px solid var(--color-border);background:var(--color-bg-secondary);text-align:center;width:60px;">Copy</th>';
    html += '</tr></thead><tbody>';

    var units = isBinary ? binaryUnits : decimalUnits;

    for (var i = 0; i < units.length; i++) {
      var converted = bytes / Math.pow(base, units[i].power);
      var displayLabel = isBinary ? units[i].iec : units[i].si;
      var altLabel = isBinary ? units[i].si : units[i].iec;
      var formattedVal = formatNumber(converted);

      html += '<tr>';
      html += '<td style="padding:10px 12px;border:1px solid var(--color-border);font-weight:bold;">' + displayLabel;
      if (i > 0) {
        html += ' <span style="color:var(--color-text-secondary);font-weight:normal;font-size:0.8rem;">(' + altLabel + ')</span>';
      }
      html += '</td>';
      html += '<td style="padding:10px 12px;border:1px solid var(--color-border);font-family:var(--font-mono);font-size:0.85rem;color:var(--color-text-secondary);">' + (isBinary ? '1024^' + units[i].power : '1000^' + units[i].power) + '</td>';
      html += '<td style="padding:10px 12px;border:1px solid var(--color-border);text-align:right;font-family:var(--font-mono);">' + formattedVal + ' ' + displayLabel + '</td>';
      html += '<td style="padding:10px 12px;border:1px solid var(--color-border);text-align:center;"><button class="copy-btn" data-value="' + converted + '" style="padding:4px 10px;font-size:0.8rem;cursor:pointer;border:1px solid var(--color-border);border-radius:var(--radius-sm);background:var(--color-bg);color:var(--color-text);">Copy</button></td>';
      html += '</tr>';
    }

    html += '</tbody></table>';

    // Also show the other system
    var otherBase = isBinary ? 1000 : 1024;
    var otherUnits = isBinary ? decimalUnits : binaryUnits;
    var otherLabel = isBinary ? 'Decimal (SI / x1000)' : 'Binary (IEC / x1024)';

    html += '<h4 style="margin-top:var(--space-lg);margin-bottom:var(--space-sm);">Reference: ' + otherLabel + '</h4>';
    html += '<table style="width:100%;border-collapse:collapse;font-size:0.9rem;">';
    html += '<thead><tr>';
    html += '<th style="padding:10px 12px;border:1px solid var(--color-border);background:var(--color-bg-secondary);text-align:left;">Unit</th>';
    html += '<th style="padding:10px 12px;border:1px solid var(--color-border);background:var(--color-bg-secondary);text-align:right;">Value</th>';
    html += '<th style="padding:10px 12px;border:1px solid var(--color-border);background:var(--color-bg-secondary);text-align:center;width:60px;">Copy</th>';
    html += '</tr></thead><tbody>';

    for (var j = 0; j < otherUnits.length; j++) {
      var otherConverted = bytes / Math.pow(otherBase, otherUnits[j].power);
      var otherDisplayLabel = isBinary ? otherUnits[j].si : otherUnits[j].iec;
      var otherFormattedVal = formatNumber(otherConverted);

      html += '<tr>';
      html += '<td style="padding:10px 12px;border:1px solid var(--color-border);font-weight:bold;">' + otherDisplayLabel + '</td>';
      html += '<td style="padding:10px 12px;border:1px solid var(--color-border);text-align:right;font-family:var(--font-mono);">' + otherFormattedVal + ' ' + otherDisplayLabel + '</td>';
      html += '<td style="padding:10px 12px;border:1px solid var(--color-border);text-align:center;"><button class="copy-btn" data-value="' + otherConverted + '" style="padding:4px 10px;font-size:0.8rem;cursor:pointer;border:1px solid var(--color-border);border-radius:var(--radius-sm);background:var(--color-bg);color:var(--color-text);">Copy</button></td>';
      html += '</tr>';
    }

    html += '</tbody></table>';

    resultTable.innerHTML = html;
    resultSection.hidden = false;

    // Attach copy handlers
    var copyBtns = resultTable.querySelectorAll('.copy-btn');
    for (var k = 0; k < copyBtns.length; k++) {
      (function (btn) {
        btn.addEventListener('click', function () {
          var val = btn.getAttribute('data-value');
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(val).then(function () {
              var original = btn.textContent;
              btn.textContent = 'OK';
              setTimeout(function () {
                btn.textContent = original;
              }, 1500);
            });
          }
        });
      })(copyBtns[k]);
    }
  }

  byteInput.addEventListener('input', convert);
  unitSelect.addEventListener('change', convert);
  baseBinary.addEventListener('change', convert);
  baseDecimal.addEventListener('change', convert);
});
