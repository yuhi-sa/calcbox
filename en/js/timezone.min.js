document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  var CITIES = [
    { name: 'Tokyo', tz: 'Asia/Tokyo' },
    { name: 'New York', tz: 'America/New_York' },
    { name: 'London', tz: 'Europe/London' },
    { name: 'Paris', tz: 'Europe/Paris' },
    { name: 'Sydney', tz: 'Australia/Sydney' },
    { name: 'Beijing', tz: 'Asia/Shanghai' },
    { name: 'Dubai', tz: 'Asia/Dubai' },
    { name: 'Los Angeles', tz: 'America/Los_Angeles' },
    { name: 'Singapore', tz: 'Asia/Singapore' },
    { name: 'Berlin', tz: 'Europe/Berlin' }
  ];

  var worldClocksContainer = document.getElementById('world-clocks');
  var sourceTzSelect = document.getElementById('source-tz');
  var targetTzSelect = document.getElementById('target-tz');
  var sourceDateInput = document.getElementById('source-date');
  var sourceTimeInput = document.getElementById('source-time');
  var convertBtn = document.getElementById('convert-btn');
  var resetBtn = document.getElementById('reset-btn');
  var resultSection = document.getElementById('result');
  var convertResult = document.getElementById('convert-result');

  var clockElements = [];
  CITIES.forEach(function (city) {
    var card = document.createElement('div');
    card.style.cssText = 'padding:12px 16px; border-radius:8px; background:var(--color-bg-secondary, #f5f5f5); text-align:center;';

    var nameEl = document.createElement('div');
    nameEl.style.cssText = 'font-weight:600; font-size:0.95rem; margin-bottom:4px;';
    nameEl.textContent = city.name;

    var timeEl = document.createElement('div');
    timeEl.style.cssText = 'font-size:1.4rem; font-weight:700; font-family:monospace;';
    timeEl.textContent = '--:--:--';

    var dateEl = document.createElement('div');
    dateEl.style.cssText = 'font-size:0.8rem; color:var(--color-text-secondary); margin-top:2px;';
    dateEl.textContent = '';

    card.appendChild(nameEl);
    card.appendChild(timeEl);
    card.appendChild(dateEl);
    worldClocksContainer.appendChild(card);

    clockElements.push({ tz: city.tz, timeEl: timeEl, dateEl: dateEl });
  });

  CITIES.forEach(function (city) {
    var opt1 = document.createElement('option');
    opt1.value = city.tz;
    opt1.textContent = city.name;
    sourceTzSelect.appendChild(opt1);

    var opt2 = document.createElement('option');
    opt2.value = city.tz;
    opt2.textContent = city.name;
    targetTzSelect.appendChild(opt2);
  });

  sourceTzSelect.value = 'Asia/Tokyo';
  targetTzSelect.value = 'America/New_York';

  function setDefaultDateTime() {
    var now = new Date();
    var fmt = new Intl.DateTimeFormat('sv-SE', {
      timeZone: sourceTzSelect.value,
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      hour12: false
    });
    var parts = fmt.format(now).split(' ');
    sourceDateInput.value = parts[0];
    sourceTimeInput.value = parts[1];
  }
  setDefaultDateTime();

  function updateClocks() {
    var now = new Date();
    clockElements.forEach(function (item) {
      var timeFmt = new Intl.DateTimeFormat('en-US', {
        timeZone: item.tz,
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        hour12: false
      });
      var dateFmt = new Intl.DateTimeFormat('en-US', {
        timeZone: item.tz,
        year: 'numeric', month: 'long', day: 'numeric',
        weekday: 'short'
      });
      item.timeEl.textContent = timeFmt.format(now);
      item.dateEl.textContent = dateFmt.format(now);
    });
  }

  updateClocks();
  setInterval(updateClocks, 1000);

  convertBtn.addEventListener('click', function () {
    var dateStr = sourceDateInput.value;
    var timeStr = sourceTimeInput.value;
    if (!dateStr || !timeStr) {
      alert('Please enter a date and time.');
      return;
    }

    var sourceTz = sourceTzSelect.value;
    var targetTz = targetTzSelect.value;

    var inputDatetime = new Date(dateStr + 'T' + timeStr);
    if (isNaN(inputDatetime.getTime())) {
      alert('Please enter a valid date and time.');
      return;
    }

    var guess = new Date(dateStr + 'T' + timeStr + 'Z');
    var sourceFmt = new Intl.DateTimeFormat('sv-SE', {
      timeZone: sourceTz,
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      hour12: false
    });

    var guessLocal = sourceFmt.format(guess);
    var guessDate = new Date(guessLocal.replace(' ', 'T') + 'Z');
    var diff = guess.getTime() - guessDate.getTime();
    var utcTime = new Date(guess.getTime() + diff);

    var verifyLocal = sourceFmt.format(utcTime);
    var verifyDate = new Date(verifyLocal.replace(' ', 'T') + 'Z');
    var diff2 = utcTime.getTime() - verifyDate.getTime();
    if (Math.abs(diff2) > 1000) {
      utcTime = new Date(guess.getTime() + diff + (diff - diff2));
    }

    var resultFmt = new Intl.DateTimeFormat('en-US', {
      timeZone: targetTz,
      year: 'numeric', month: 'long', day: 'numeric',
      weekday: 'short',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      hour12: true
    });

    var sourceName = '';
    var targetName = '';
    CITIES.forEach(function (c) {
      if (c.tz === sourceTz) sourceName = c.name;
      if (c.tz === targetTz) targetName = c.name;
    });

    convertResult.textContent = targetName + ': ' + resultFmt.format(utcTime);
    resultSection.hidden = false;
    resultSection.scrollIntoView({ behavior: 'smooth' });
  });

  resetBtn.addEventListener('click', function () {
    sourceTzSelect.value = 'Asia/Tokyo';
    targetTzSelect.value = 'America/New_York';
    setDefaultDateTime();
    resultSection.hidden = true;
  });

  sourceTzSelect.addEventListener('change', function () {
    setDefaultDateTime();
  });
});
