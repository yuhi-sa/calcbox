document.addEventListener('DOMContentLoaded', function () {
  var typeRadios = document.querySelectorAll('input[name="grad-type"]');
  var directionSelect = document.getElementById('direction');
  var directionGroup = document.getElementById('direction-group');
  var radialShapeGroup = document.getElementById('radial-shape-group');
  var shapeRadios = document.querySelectorAll('input[name="radial-shape"]');
  var colorStopsContainer = document.getElementById('color-stops');
  var addStopBtn = document.getElementById('add-stop-btn');
  var preview = document.getElementById('gradient-preview');
  var cssOutput = document.getElementById('css-output');
  var copyBtn = document.getElementById('copy-btn');
  var resetBtn = document.getElementById('reset-btn');

  function getType() {
    for (var i = 0; i < typeRadios.length; i++) {
      if (typeRadios[i].checked) return typeRadios[i].value;
    }
    return 'linear';
  }

  function getShape() {
    for (var i = 0; i < shapeRadios.length; i++) {
      if (shapeRadios[i].checked) return shapeRadios[i].value;
    }
    return 'circle';
  }

  function getColorStops() {
    var rows = colorStopsContainer.querySelectorAll('.color-stop-row');
    var stops = [];
    for (var i = 0; i < rows.length; i++) {
      var color = rows[i].querySelector('.stop-color').value;
      var position = rows[i].querySelector('.stop-position').value;
      stops.push({ color: color, position: parseInt(position, 10) });
    }
    stops.sort(function (a, b) { return a.position - b.position; });
    return stops;
  }

  function buildCSS() {
    var type = getType();
    var stops = getColorStops();
    var stopsStr = stops.map(function (s) { return s.color + ' ' + s.position + '%'; }).join(', ');

    if (type === 'linear') {
      var dir = directionSelect.value;
      return 'background: linear-gradient(' + dir + ', ' + stopsStr + ');';
    } else {
      var shape = getShape();
      return 'background: radial-gradient(' + shape + ', ' + stopsStr + ');';
    }
  }

  function updatePreview() {
    var css = buildCSS();
    var bgValue = css.replace('background: ', '').replace(';', '');
    preview.style.background = bgValue;
    cssOutput.value = css;
  }

  function addStopRow(color, position) {
    var row = document.createElement('div');
    row.className = 'color-stop-row';
    row.style.cssText = 'display:flex;gap:8px;align-items:center;margin-bottom:8px;';
    row.innerHTML =
      '<input type="color" value="' + color + '" class="stop-color" style="width:48px;height:36px;border:none;cursor:pointer;">' +
      '<input type="number" class="input stop-position" min="0" max="100" value="' + position + '" style="width:80px;" placeholder="%">' +
      '<span style="font-size:0.85rem;color:var(--color-text-secondary);">%</span>' +
      '<button type="button" class="btn btn--secondary remove-stop" style="padding:6px 12px;font-size:0.85rem;">Remove</button>';
    colorStopsContainer.appendChild(row);

    row.querySelector('.stop-color').addEventListener('input', updatePreview);
    row.querySelector('.stop-position').addEventListener('input', updatePreview);
    row.querySelector('.remove-stop').addEventListener('click', function () {
      var rows = colorStopsContainer.querySelectorAll('.color-stop-row');
      if (rows.length <= 2) { alert('At least 2 color stops are required.'); return; }
      row.remove();
      updatePreview();
    });

    updatePreview();
  }

  var initialRows = colorStopsContainer.querySelectorAll('.color-stop-row');
  for (var i = 0; i < initialRows.length; i++) {
    (function (row) {
      row.querySelector('.stop-color').addEventListener('input', updatePreview);
      row.querySelector('.stop-position').addEventListener('input', updatePreview);
      row.querySelector('.remove-stop').addEventListener('click', function () {
        var rows = colorStopsContainer.querySelectorAll('.color-stop-row');
        if (rows.length <= 2) { alert('At least 2 color stops are required.'); return; }
        row.remove();
        updatePreview();
      });
    })(initialRows[i]);
  }

  for (var i = 0; i < typeRadios.length; i++) {
    typeRadios[i].addEventListener('change', function () {
      var t = getType();
      directionGroup.style.display = t === 'linear' ? '' : 'none';
      radialShapeGroup.style.display = t === 'radial' ? '' : 'none';
      updatePreview();
    });
  }

  directionSelect.addEventListener('change', updatePreview);

  for (var i = 0; i < shapeRadios.length; i++) {
    shapeRadios[i].addEventListener('change', updatePreview);
  }

  addStopBtn.addEventListener('click', function () {
    var randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    addStopRow(randomColor, 50);
  });

  copyBtn.addEventListener('click', function () {
    CalcBox.copy.copyText(cssOutput.value);
  });

  resetBtn.addEventListener('click', function () {
    typeRadios[0].checked = true;
    directionGroup.style.display = '';
    radialShapeGroup.style.display = 'none';
    directionSelect.value = 'to bottom';
    shapeRadios[0].checked = true;
    colorStopsContainer.innerHTML = '';
    addStopRow('#e67e22', 0);
    addStopRow('#3498db', 100);
  });

  updatePreview();
});
