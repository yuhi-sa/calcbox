document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  var targetDateInput = document.getElementById('target-date');
  var targetTimeInput = document.getElementById('target-time');
  var startBtn = document.getElementById('start-btn');
  var resetBtn = document.getElementById('reset-btn');
  var countdownDisplay = document.getElementById('countdown-display');
  var countdownValue = document.getElementById('countdown-value');
  var countdownTarget = document.getElementById('countdown-target');
  var countdownMessage = document.getElementById('countdown-message');

  var intervalId = null;

  var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  var y = tomorrow.getFullYear();
  var m = String(tomorrow.getMonth() + 1).padStart(2, '0');
  var d = String(tomorrow.getDate()).padStart(2, '0');
  targetDateInput.value = y + '-' + m + '-' + d;

  function updateCountdown(targetTime) {
    var now = new Date().getTime();
    var diff = targetTime - now;

    if (diff <= 0) {
      countdownValue.textContent = '0 days 00 hours 00 min 00 sec';
      countdownMessage.textContent = "Time's up!";
      countdownMessage.hidden = false;
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
      return;
    }

    var days = Math.floor(diff / (1000 * 60 * 60 * 24));
    var hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((diff % (1000 * 60)) / 1000);

    countdownValue.textContent =
      days + ' days ' +
      String(hours).padStart(2, '0') + ' hours ' +
      String(minutes).padStart(2, '0') + ' min ' +
      String(seconds).padStart(2, '0') + ' sec';
  }

  startBtn.addEventListener('click', function () {
    var dateStr = targetDateInput.value;
    var timeStr = targetTimeInput.value || '00:00';

    if (!dateStr) {
      alert('Please enter a target date.');
      return;
    }

    var targetTime = new Date(dateStr + 'T' + timeStr + ':00').getTime();
    if (isNaN(targetTime)) {
      alert('Please enter a valid date and time.');
      return;
    }

    var targetDate = new Date(targetTime);
    var fmt = new Intl.DateTimeFormat('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
      weekday: 'short',
      hour: '2-digit', minute: '2-digit',
      hour12: true
    });
    countdownTarget.textContent = 'Target: ' + fmt.format(targetDate);

    if (intervalId) {
      clearInterval(intervalId);
    }

    countdownMessage.hidden = true;
    countdownDisplay.hidden = false;

    updateCountdown(targetTime);
    intervalId = setInterval(function () {
      updateCountdown(targetTime);
    }, 1000);
  });

  resetBtn.addEventListener('click', function () {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
    countdownDisplay.hidden = true;
    countdownMessage.hidden = true;
    countdownValue.textContent = '0 days 00 hours 00 min 00 sec';
    countdownTarget.textContent = '';

    var tmr = new Date();
    tmr.setDate(tmr.getDate() + 1);
    var yy = tmr.getFullYear();
    var mm = String(tmr.getMonth() + 1).padStart(2, '0');
    var dd = String(tmr.getDate()).padStart(2, '0');
    targetDateInput.value = yy + '-' + mm + '-' + dd;
    targetTimeInput.value = '00:00';
  });
});
