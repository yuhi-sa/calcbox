document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  var timerValue = document.getElementById('timer-value');
  var startStopBtn = document.getElementById('start-stop-btn');
  var lapBtn = document.getElementById('lap-btn');
  var resetBtn = document.getElementById('reset-btn');
  var lapSection = document.getElementById('lap-section');
  var lapTbody = document.getElementById('lap-tbody');

  var running = false;
  var startTime = 0;
  var elapsed = 0;
  var intervalId = null;
  var laps = [];
  var lastLapTime = 0;

  function formatTime(ms) {
    var totalSeconds = Math.floor(ms / 1000);
    var hours = Math.floor(totalSeconds / 3600);
    var minutes = Math.floor((totalSeconds % 3600) / 60);
    var seconds = totalSeconds % 60;
    var centiseconds = Math.floor((ms % 1000) / 10);

    return String(hours).padStart(2, '0') + ':' +
           String(minutes).padStart(2, '0') + ':' +
           String(seconds).padStart(2, '0') + '.' +
           String(centiseconds).padStart(2, '0');
  }

  function updateDisplay() {
    var currentElapsed = elapsed;
    if (running) {
      currentElapsed = elapsed + (Date.now() - startTime);
    }
    timerValue.textContent = formatTime(currentElapsed);
  }

  function startTimer() {
    running = true;
    startTime = Date.now();
    startStopBtn.textContent = 'Stop';
    startStopBtn.classList.remove('btn--primary');
    startStopBtn.classList.add('btn--secondary');
    lapBtn.disabled = false;

    intervalId = setInterval(updateDisplay, 10);
  }

  function stopTimer() {
    running = false;
    elapsed += Date.now() - startTime;
    startStopBtn.textContent = 'Start';
    startStopBtn.classList.remove('btn--secondary');
    startStopBtn.classList.add('btn--primary');

    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
    updateDisplay();
  }

  startStopBtn.addEventListener('click', function () {
    if (running) {
      stopTimer();
    } else {
      startTimer();
    }
  });

  lapBtn.addEventListener('click', function () {
    if (!running) return;

    var currentElapsed = elapsed + (Date.now() - startTime);
    var lapTime = currentElapsed - lastLapTime;
    lastLapTime = currentElapsed;

    laps.push({ lapTime: lapTime, totalTime: currentElapsed });

    var row = document.createElement('tr');

    var numCell = document.createElement('td');
    numCell.style.cssText = 'text-align:center; padding:8px 12px; font-weight:600;';
    numCell.textContent = laps.length;

    var lapCell = document.createElement('td');
    lapCell.style.cssText = 'text-align:center; padding:8px 12px; font-family:monospace;';
    lapCell.textContent = formatTime(lapTime);

    var totalCell = document.createElement('td');
    totalCell.style.cssText = 'text-align:center; padding:8px 12px; font-family:monospace;';
    totalCell.textContent = formatTime(currentElapsed);

    row.appendChild(numCell);
    row.appendChild(lapCell);
    row.appendChild(totalCell);

    if (lapTbody.firstChild) {
      lapTbody.insertBefore(row, lapTbody.firstChild);
    } else {
      lapTbody.appendChild(row);
    }

    lapSection.hidden = false;
  });

  resetBtn.addEventListener('click', function () {
    if (running) {
      stopTimer();
    }
    running = false;
    elapsed = 0;
    startTime = 0;
    lastLapTime = 0;
    laps = [];

    timerValue.textContent = '00:00:00.00';
    startStopBtn.textContent = 'Start';
    startStopBtn.classList.remove('btn--secondary');
    startStopBtn.classList.add('btn--primary');
    lapBtn.disabled = true;
    lapTbody.innerHTML = '';
    lapSection.hidden = true;
  });
});
