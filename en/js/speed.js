document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  var modeRadios = document.querySelectorAll('input[name="calc-mode"]');
  var inputDistance = document.getElementById('input-distance');
  var inputSpeed = document.getElementById('input-speed');
  var inputTime = document.getElementById('input-time');
  var distanceInput = document.getElementById('distance');
  var speedInput = document.getElementById('speed-val');
  var timeHours = document.getElementById('time-hours');
  var timeMinutes = document.getElementById('time-minutes');
  var calcBtn = document.getElementById('calc-btn');
  var resetBtn = document.getElementById('reset-btn');
  var resultSection = document.getElementById('result');
  var resultConversion = document.getElementById('result-conversion');
  var resultSpeed = document.getElementById('result-speed');
  var resultDistance = document.getElementById('result-distance');
  var resultTime = document.getElementById('result-time');
  var resultSpeedRow = document.getElementById('result-speed-row');
  var resultDistanceRow = document.getElementById('result-distance-row');
  var resultTimeRow = document.getElementById('result-time-row');
  var convKmh = document.getElementById('conv-kmh');
  var convMs = document.getElementById('conv-ms');
  var convMph = document.getElementById('conv-mph');
  var convPace = document.getElementById('conv-pace');

  function getMode() {
    for (var i = 0; i < modeRadios.length; i++) {
      if (modeRadios[i].checked) return modeRadios[i].value;
    }
    return 'speed';
  }

  function updateInputVisibility() {
    var mode = getMode();
    // Show/hide input groups based on mode
    if (mode === 'speed') {
      // Need distance + time to calculate speed
      inputDistance.hidden = false;
      inputSpeed.hidden = true;
      inputTime.hidden = false;
    } else if (mode === 'distance') {
      // Need speed + time to calculate distance
      inputDistance.hidden = true;
      inputSpeed.hidden = false;
      inputTime.hidden = false;
    } else {
      // Need speed + distance to calculate time
      inputDistance.hidden = false;
      inputSpeed.hidden = false;
      inputTime.hidden = true;
    }
  }

  for (var i = 0; i < modeRadios.length; i++) {
    modeRadios[i].addEventListener('change', updateInputVisibility);
  }

  updateInputVisibility();

  function formatTime(totalHours) {
    var h = Math.floor(totalHours);
    var remainMinutes = (totalHours - h) * 60;
    var m = Math.floor(remainMinutes);
    var s = Math.round((remainMinutes - m) * 60);
    if (s === 60) {
      m += 1;
      s = 0;
    }
    if (m === 60) {
      h += 1;
      m = 0;
    }
    var parts = [];
    if (h > 0) parts.push(h + '時間');
    if (m > 0) parts.push(m + '分');
    if (s > 0) parts.push(s + '秒');
    if (parts.length === 0) parts.push('0秒');
    return parts.join('');
  }

  function formatPace(kmh) {
    if (kmh <= 0) return '-';
    var minutesPerKm = 60 / kmh;
    var mins = Math.floor(minutesPerKm);
    var secs = Math.round((minutesPerKm - mins) * 60);
    if (secs === 60) {
      mins += 1;
      secs = 0;
    }
    var secStr = secs < 10 ? '0' + secs : '' + secs;
    return mins + "'" + secStr + '"/km';
  }

  function roundTo(val, decimals) {
    var factor = Math.pow(10, decimals);
    return Math.round(val * factor) / factor;
  }

  function showConversion(kmh) {
    convKmh.textContent = roundTo(kmh, 2) + ' km/h';
    convMs.textContent = roundTo(kmh / 3.6, 2) + ' m/s';
    convMph.textContent = roundTo(kmh / 1.60934, 2) + ' mph';
    convPace.textContent = formatPace(kmh);
    resultConversion.hidden = false;
  }

  calcBtn.addEventListener('click', function () {
    var mode = getMode();
    var speed, distance, timeH;

    if (mode === 'speed') {
      distance = parseFloat(distanceInput.value);
      var hours = parseFloat(timeHours.value) || 0;
      var minutes = parseFloat(timeMinutes.value) || 0;
      timeH = hours + minutes / 60;

      if (isNaN(distance) || distance < 0) {
        alert('距離を正しく入力してください。');
        return;
      }
      if (timeH <= 0) {
        alert('時間を正しく入力してください（0より大きい値）。');
        return;
      }

      speed = distance / timeH;

      resultSpeed.textContent = roundTo(speed, 2) + ' km/h';
      resultDistance.textContent = roundTo(distance, 2) + ' km';
      resultTime.textContent = formatTime(timeH);

      resultSpeedRow.style.fontWeight = 'bold';
      resultDistanceRow.style.fontWeight = '';
      resultTimeRow.style.fontWeight = '';

      showConversion(speed);

    } else if (mode === 'distance') {
      speed = parseFloat(speedInput.value);
      var hours2 = parseFloat(timeHours.value) || 0;
      var minutes2 = parseFloat(timeMinutes.value) || 0;
      timeH = hours2 + minutes2 / 60;

      if (isNaN(speed) || speed < 0) {
        alert('速度を正しく入力してください。');
        return;
      }
      if (timeH <= 0) {
        alert('時間を正しく入力してください（0より大きい値）。');
        return;
      }

      distance = speed * timeH;

      resultSpeed.textContent = roundTo(speed, 2) + ' km/h';
      resultDistance.textContent = roundTo(distance, 2) + ' km';
      resultTime.textContent = formatTime(timeH);

      resultSpeedRow.style.fontWeight = '';
      resultDistanceRow.style.fontWeight = 'bold';
      resultTimeRow.style.fontWeight = '';

      showConversion(speed);

    } else {
      // time mode
      speed = parseFloat(speedInput.value);
      distance = parseFloat(distanceInput.value);

      if (isNaN(speed) || speed <= 0) {
        alert('速度を正しく入力してください（0より大きい値）。');
        return;
      }
      if (isNaN(distance) || distance < 0) {
        alert('距離を正しく入力してください。');
        return;
      }

      timeH = distance / speed;

      resultSpeed.textContent = roundTo(speed, 2) + ' km/h';
      resultDistance.textContent = roundTo(distance, 2) + ' km';
      resultTime.textContent = formatTime(timeH);

      resultSpeedRow.style.fontWeight = '';
      resultDistanceRow.style.fontWeight = '';
      resultTimeRow.style.fontWeight = 'bold';

      showConversion(speed);
    }

    resultSection.hidden = false;
    resultSection.scrollIntoView({ behavior: 'smooth' });
  });

  resetBtn.addEventListener('click', function () {
    distanceInput.value = '';
    speedInput.value = '';
    timeHours.value = '0';
    timeMinutes.value = '0';
    resultSection.hidden = true;
    resultConversion.hidden = true;
    resultSpeedRow.style.fontWeight = '';
    resultDistanceRow.style.fontWeight = '';
    resultTimeRow.style.fontWeight = '';
  });
});