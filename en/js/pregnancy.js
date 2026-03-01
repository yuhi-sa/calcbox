(function () {
  'use strict';

  var lastPeriodInput = document.getElementById('last-period');
  var calcBtn = document.getElementById('calc-btn');
  var resetBtn = document.getElementById('reset-btn');
  var resultSection = document.getElementById('result');
  var currentWeekEl = document.getElementById('current-week');
  var dueDateEl = document.getElementById('due-date');
  var daysRemainingEl = document.getElementById('days-remaining');
  var trimesterEl = document.getElementById('trimester');
  var timelineSection = document.getElementById('timeline-section');
  var timelineBody = document.getElementById('timeline-body');

  function formatDate(date) {
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[date.getDay()] + ', ' + months[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
  }

  function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  function getTrimester(weeks) {
    if (weeks < 0) return { label: 'Before pregnancy', color: '#6b7280' };
    if (weeks < 16) return { label: 'First trimester (Months 1-4)', color: '#f59e0b' };
    if (weeks < 28) return { label: 'Second trimester (Months 5-7)', color: '#22c55e' };
    if (weeks < 40) return { label: 'Third trimester (Months 8-10)', color: '#3b82f6' };
    return { label: 'Past due date', color: '#ef4444' };
  }

  function buildTimeline(lmpDate) {
    timelineBody.innerHTML = '';
    var phases = [
      { name: 'First trimester', weeks: 'Wk 0-15', months: 'Mo 1-4', startWeek: 0, endWeek: 15, features: 'Morning sickness, drowsiness, organ formation' },
      { name: '  Early pregnancy', weeks: 'Wk 0-3', months: 'Mo 1', startWeek: 0, endWeek: 3, features: 'Fertilization & implantation, no symptoms' },
      { name: '  Month 2', weeks: 'Wk 4-7', months: 'Mo 2', startWeek: 4, endWeek: 7, features: 'Morning sickness starts, positive test' },
      { name: '  Month 3', weeks: 'Wk 8-11', months: 'Mo 3', startWeek: 8, endWeek: 11, features: 'Peak morning sickness, heartbeat confirmed' },
      { name: '  Month 4', weeks: 'Wk 12-15', months: 'Mo 4', startWeek: 12, endWeek: 15, features: 'Morning sickness eases, placenta forms' },
      { name: 'Second trimester', weeks: 'Wk 16-27', months: 'Mo 5-7', startWeek: 16, endWeek: 27, features: 'Stable period, fetal movement, bump shows' },
      { name: '  Month 5', weeks: 'Wk 16-19', months: 'Mo 5', startWeek: 16, endWeek: 19, features: 'Stable period begins, first fetal movements' },
      { name: '  Month 6', weeks: 'Wk 20-23', months: 'Mo 6', startWeek: 20, endWeek: 23, features: 'Active fetal movement, gender may be known' },
      { name: '  Month 7', weeks: 'Wk 24-27', months: 'Mo 7', startWeek: 24, endWeek: 27, features: 'Bump visible, leg swelling' },
      { name: 'Third trimester', weeks: 'Wk 28-39', months: 'Mo 8-10', startWeek: 28, endWeek: 39, features: 'Birth preparation, more frequent checkups' },
      { name: '  Month 8', weeks: 'Wk 28-31', months: 'Mo 8', startWeek: 28, endWeek: 31, features: 'Breech check, maternity leave starts' },
      { name: '  Month 9', weeks: 'Wk 32-35', months: 'Mo 9', startWeek: 32, endWeek: 35, features: 'Birth preparation, pack hospital bag' },
      { name: '  Month 10', weeks: 'Wk 36-39', months: 'Mo 10', startWeek: 36, endWeek: 39, features: 'Full term (37+ wk), ready for delivery' }
    ];

    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var diffDays = Math.floor((today - lmpDate) / (1000 * 60 * 60 * 24));
    var currentWeeks = Math.floor(diffDays / 7);

    for (var i = 0; i < phases.length; i++) {
      var p = phases[i];
      var tr = document.createElement('tr');
      tr.style.borderBottom = '1px solid var(--color-border-light)';
      if (currentWeeks >= p.startWeek && currentWeeks <= p.endWeek) {
        tr.style.background = 'var(--color-primary-light, #dbeafe)';
      }
      var isMainPhase = p.name.indexOf('  ') !== 0;
      var fontWeight = isMainPhase ? '600' : '400';
      var startDate = addDays(lmpDate, p.startWeek * 7);
      var endDate = addDays(lmpDate, (p.endWeek + 1) * 7 - 1);
      var dateRange = (startDate.getMonth() + 1) + '/' + startDate.getDate() + ' - ' + (endDate.getMonth() + 1) + '/' + endDate.getDate();
      var tdName = document.createElement('td');
      tdName.style.cssText = 'padding: 8px; text-align: left; font-weight: ' + fontWeight + ';';
      tdName.textContent = p.name;
      var tdWeeks = document.createElement('td');
      tdWeeks.style.cssText = 'padding: 8px; text-align: center;';
      tdWeeks.textContent = p.weeks;
      var tdMonths = document.createElement('td');
      tdMonths.style.cssText = 'padding: 8px; text-align: center;';
      tdMonths.textContent = p.months;
      var tdDate = document.createElement('td');
      tdDate.style.cssText = 'padding: 8px; text-align: center; font-size: 0.8rem;';
      tdDate.textContent = dateRange;
      var tdFeatures = document.createElement('td');
      tdFeatures.style.cssText = 'padding: 8px; text-align: left; font-size: 0.8rem;';
      tdFeatures.textContent = p.features;
      tr.appendChild(tdName);
      tr.appendChild(tdWeeks);
      tr.appendChild(tdMonths);
      tr.appendChild(tdDate);
      tr.appendChild(tdFeatures);
      timelineBody.appendChild(tr);
    }
    timelineSection.hidden = false;
  }

  calcBtn.addEventListener('click', function () {
    var dateStr = lastPeriodInput.value;
    if (!dateStr) {
      alert('Please enter the date of your last menstrual period.');
      return;
    }
    var lmpDate = new Date(dateStr);
    lmpDate.setHours(0, 0, 0, 0);
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var dueDate = addDays(lmpDate, 280);
    var diffDays = Math.floor((today - lmpDate) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) {
      alert('The date is in the future. Please enter a valid date.');
      return;
    }
    if (diffDays > 310) {
      alert('The date is more than 44 weeks ago. Please enter a valid date.');
      return;
    }
    var weeks = Math.floor(diffDays / 7);
    var days = diffDays % 7;
    var remaining = Math.floor((dueDate - today) / (1000 * 60 * 60 * 24));
    var trimester = getTrimester(weeks);

    currentWeekEl.textContent = weeks + ' weeks ' + days + ' days';
    currentWeekEl.style.color = trimester.color;
    dueDateEl.textContent = formatDate(dueDate);
    trimesterEl.textContent = trimester.label;
    trimesterEl.style.color = trimester.color;

    if (remaining > 0) {
      daysRemainingEl.textContent = remaining + ' days remaining';
    } else if (remaining === 0) {
      daysRemainingEl.textContent = 'Today is the due date';
      daysRemainingEl.style.color = '#ef4444';
    } else {
      daysRemainingEl.textContent = Math.abs(remaining) + ' days past due date';
      daysRemainingEl.style.color = '#ef4444';
    }

    buildTimeline(lmpDate);
    resultSection.hidden = false;
    resultSection.scrollIntoView({ behavior: 'smooth' });
  });

  resetBtn.addEventListener('click', function () {
    lastPeriodInput.value = '';
    resultSection.hidden = true;
    timelineSection.hidden = true;
    timelineBody.innerHTML = '';
  });
})();
