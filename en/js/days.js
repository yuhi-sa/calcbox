document.addEventListener('DOMContentLoaded', function () {
  var WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  function toDateString(date) {
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    var d = date.getDate();
    return m + '/' + d + '/' + y;
  }

  function getWeekday(date) {
    return WEEKDAYS[date.getDay()];
  }

  function diffDays(d1, d2) {
    var ms = d2.getTime() - d1.getTime();
    return Math.round(ms / (1000 * 60 * 60 * 24));
  }

  // Set default dates
  var today = new Date();
  var todayStr = today.toISOString().split('T')[0];
  document.getElementById('start-date').value = todayStr;
  document.getElementById('base-date').value = todayStr;

  // --- Days between dates ---
  document.getElementById('calc-diff-btn').addEventListener('click', function () {
    var startVal = document.getElementById('start-date').value;
    var endVal = document.getElementById('end-date').value;
    if (!startVal || !endVal) {
      alert('Please enter both start and end dates.');
      return;
    }
    var start = new Date(startVal);
    var end = new Date(endVal);
    var days = Math.abs(diffDays(start, end));
    var weeks = Math.floor(days / 7);
    var remainDays = days % 7;

    document.getElementById('diff-days').textContent = days + ' days';
    document.getElementById('diff-weeks').textContent = weeks + ' weeks ' + remainDays + ' days';
    document.getElementById('start-weekday').textContent = toDateString(start) + ' (' + getWeekday(start) + ')';
    document.getElementById('end-weekday').textContent = toDateString(end) + ' (' + getWeekday(end) + ')';
    document.getElementById('diff-result').hidden = false;
  });

  // --- Date after X days ---
  document.getElementById('calc-add-btn').addEventListener('click', function () {
    var baseVal = document.getElementById('base-date').value;
    var addVal = document.getElementById('add-days').value;
    if (!baseVal || addVal === '') {
      alert('Please enter a base date and number of days.');
      return;
    }
    var base = new Date(baseVal);
    var addDays = parseInt(addVal, 10);
    var result = new Date(base);
    result.setDate(result.getDate() + addDays);

    var label = addDays >= 0
      ? addDays + ' days after ' + toDateString(base)
      : Math.abs(addDays) + ' days before ' + toDateString(base);

    document.getElementById('add-result-date').textContent = label + ' = ' + toDateString(result);
    document.getElementById('add-result-weekday').textContent = getWeekday(result);
    document.getElementById('add-result').hidden = false;
  });

  // --- Countdown ---
  document.getElementById('calc-countdown-btn').addEventListener('click', function () {
    var targetVal = document.getElementById('target-date').value;
    if (!targetVal) {
      alert('Please enter a target date.');
      return;
    }
    var target = new Date(targetVal);
    var now = new Date();
    now.setHours(0, 0, 0, 0);
    var days = diffDays(now, target);

    var countdownDays = document.getElementById('countdown-days');
    if (days > 0) {
      countdownDays.textContent = days + ' days remaining';
      countdownDays.style.color = '#22c55e';
    } else if (days === 0) {
      countdownDays.textContent = "That's today!";
      countdownDays.style.color = '#3b82f6';
    } else {
      countdownDays.textContent = Math.abs(days) + ' days ago';
      countdownDays.style.color = '#ef4444';
    }

    document.getElementById('countdown-weekday').textContent = toDateString(target) + ' (' + getWeekday(target) + ')';
    document.getElementById('countdown-result').hidden = false;
  });
});
