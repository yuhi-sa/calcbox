(function () {
  'use strict';

  var modeRadios = document.querySelectorAll('input[name="calc-mode"]');
  var wakeTimeGroup = document.getElementById('wake-time-group');
  var sleepTimeGroup = document.getElementById('sleep-time-group');
  var wakeTimeInput = document.getElementById('wake-time');
  var sleepTimeInput = document.getElementById('sleep-time');
  var calcBtn = document.getElementById('calc-btn');
  var resetBtn = document.getElementById('reset-btn');
  var resultSection = document.getElementById('result');
  var resultTitle = document.getElementById('result-title');
  var resultCards = document.getElementById('result-cards');
  var resultNote = document.getElementById('result-note');

  var CYCLE_MINUTES = 90;
  var FALL_ASLEEP_MINUTES = 14;

  modeRadios.forEach(function (radio) {
    radio.addEventListener('change', function () {
      if (this.value === 'wake') {
        wakeTimeGroup.hidden = false;
        sleepTimeGroup.hidden = true;
      } else {
        wakeTimeGroup.hidden = true;
        sleepTimeGroup.hidden = false;
      }
    });
  });

  function getMode() {
    for (var i = 0; i < modeRadios.length; i++) {
      if (modeRadios[i].checked) return modeRadios[i].value;
    }
    return 'wake';
  }

  function formatTime(hours, minutes) {
    var h = ((hours % 24) + 24) % 24;
    var m = ((minutes % 60) + 60) % 60;
    return ('0' + h).slice(-2) + ':' + ('0' + m).slice(-2);
  }

  function formatDuration(totalMinutes) {
    var h = Math.floor(totalMinutes / 60);
    var m = totalMinutes % 60;
    return h + 'h' + (m > 0 ? ' ' + m + 'min' : '');
  }

  function getRecommendation(cycles) {
    if (cycles >= 6) return { label: 'Plenty of sleep', color: '#22c55e', icon: '\u25ce' };
    if (cycles >= 5) return { label: 'Recommended', color: '#3b82f6', icon: '\u25cb' };
    if (cycles >= 4) return { label: 'Minimum sleep', color: '#f59e0b', icon: '\u25b3' };
    return { label: 'Sleep deprived', color: '#ef4444', icon: '\u00d7' };
  }

  function createCard(time, cycles, sleepMinutes, recommendation) {
    var card = document.createElement('div');
    card.style.cssText = 'border: 2px solid var(--color-border); border-radius: 8px; padding: 16px; text-align: center; transition: border-color 0.2s;';
    if (cycles === 5) {
      card.style.borderColor = 'var(--color-primary)';
    }
    var timeEl = document.createElement('div');
    timeEl.style.cssText = 'font-size: 1.8rem; font-weight: 700; color: var(--color-text);';
    timeEl.textContent = time;
    var cyclesEl = document.createElement('div');
    cyclesEl.style.cssText = 'font-size: 0.9rem; color: var(--color-text-secondary); margin-top: 4px;';
    cyclesEl.textContent = cycles + ' cycles (' + formatDuration(sleepMinutes) + ')';
    var recEl = document.createElement('div');
    recEl.style.cssText = 'font-size: 0.85rem; font-weight: 600; margin-top: 8px; color: ' + recommendation.color + ';';
    recEl.textContent = recommendation.icon + ' ' + recommendation.label;
    card.appendChild(timeEl);
    card.appendChild(cyclesEl);
    card.appendChild(recEl);
    return card;
  }

  calcBtn.addEventListener('click', function () {
    var mode = getMode();
    resultCards.innerHTML = '';

    if (mode === 'wake') {
      var wakeTime = wakeTimeInput.value;
      if (!wakeTime) {
        alert('Please enter the desired wake-up time.');
        return;
      }
      var parts = wakeTime.split(':');
      var wakeHour = parseInt(parts[0], 10);
      var wakeMin = parseInt(parts[1], 10);
      var wakeTotalMin = wakeHour * 60 + wakeMin;
      resultTitle.textContent = 'Bedtimes to wake up at ' + wakeTime;
      var cycles = [6, 5, 4];
      for (var i = 0; i < cycles.length; i++) {
        var c = cycles[i];
        var sleepMinutes = c * CYCLE_MINUTES;
        var bedTotalMin = wakeTotalMin - sleepMinutes - FALL_ASLEEP_MINUTES;
        var bedHour = Math.floor(((bedTotalMin % 1440) + 1440) % 1440 / 60);
        var bedMin = ((bedTotalMin % 60) + 60) % 60;
        var timeStr = formatTime(bedHour, bedMin);
        var rec = getRecommendation(c);
        var card = createCard(timeStr, c, sleepMinutes, rec);
        resultCards.appendChild(card);
      }
      resultNote.textContent = 'Note: Approx. 14 minutes to fall asleep is factored in. Get into bed at the displayed time.';
    } else {
      var sleepTime = sleepTimeInput.value;
      if (!sleepTime) {
        alert('Please enter your bedtime.');
        return;
      }
      var parts = sleepTime.split(':');
      var sleepHour = parseInt(parts[0], 10);
      var sleepMin = parseInt(parts[1], 10);
      var sleepTotalMin = sleepHour * 60 + sleepMin;
      resultTitle.textContent = 'Wake-up times if you go to bed at ' + sleepTime;
      var cycles = [4, 5, 6];
      for (var i = 0; i < cycles.length; i++) {
        var c = cycles[i];
        var sleepMinutes = c * CYCLE_MINUTES;
        var wakeTotalMin = sleepTotalMin + FALL_ASLEEP_MINUTES + sleepMinutes;
        var wakeHour = Math.floor(((wakeTotalMin % 1440) + 1440) % 1440 / 60);
        var wakeMin = ((wakeTotalMin % 60) + 60) % 60;
        var timeStr = formatTime(wakeHour, wakeMin);
        var rec = getRecommendation(c);
        var card = createCard(timeStr, c, sleepMinutes, rec);
        resultCards.appendChild(card);
      }
      resultNote.textContent = 'Note: Approx. 14 minutes to fall asleep is factored in. These times align with the end of a sleep cycle for easier waking.';
    }

    resultSection.hidden = false;
    resultSection.scrollIntoView({ behavior: 'smooth' });
  });

  resetBtn.addEventListener('click', function () {
    wakeTimeInput.value = '07:00';
    sleepTimeInput.value = '23:00';
    modeRadios[0].checked = true;
    wakeTimeGroup.hidden = false;
    sleepTimeGroup.hidden = true;
    resultSection.hidden = true;
    resultCards.innerHTML = '';
  });
})();
