document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  var hourlyWageInput = document.getElementById('hourly-wage');
  var hoursPerDayInput = document.getElementById('hours-per-day');
  var daysPerWeekInput = document.getElementById('days-per-week');
  var nightHoursInput = document.getElementById('night-hours');
  var transportCostInput = document.getElementById('transport-cost');
  var calcBtn = document.getElementById('calc-btn');
  var resetBtn = document.getElementById('reset-btn');
  var resultSection = document.getElementById('result');

  var resultDaily = document.getElementById('result-daily');
  var resultWeekly = document.getElementById('result-weekly');
  var resultMonthly = document.getElementById('result-monthly');
  var resultAnnual = document.getElementById('result-annual');
  var resultNightPay = document.getElementById('result-night-pay');
  var resultWall103 = document.getElementById('result-wall-103');
  var resultWall130 = document.getElementById('result-wall-130');

  function formatYen(val) {
    return Math.floor(val).toLocaleString() + ' JPY';
  }

  calcBtn.addEventListener('click', function () {
    var hourlyWage = parseFloat(hourlyWageInput.value);
    var hoursPerDay = parseFloat(hoursPerDayInput.value);
    var daysPerWeek = parseInt(daysPerWeekInput.value, 10);
    var nightHours = parseFloat(nightHoursInput.value) || 0;
    var transportCost = parseFloat(transportCostInput.value) || 0;

    if (isNaN(hourlyWage) || hourlyWage <= 0) {
      alert('Please enter a valid hourly wage.');
      return;
    }
    if (isNaN(hoursPerDay) || hoursPerDay <= 0 || hoursPerDay > 24) {
      alert('Please enter valid working hours per day (0.5-24 hours).');
      return;
    }
    if (isNaN(daysPerWeek) || daysPerWeek < 1 || daysPerWeek > 7) {
      alert('Please enter valid working days per week (1-7 days).');
      return;
    }
    if (nightHours < 0 || nightHours > hoursPerDay) {
      alert('Night shift hours must be between 0 and daily working hours.');
      return;
    }

    var nightBonus = hourlyWage * 0.25 * nightHours;

    var baseDailyPay = hourlyWage * hoursPerDay;

    var dailyPay = baseDailyPay + nightBonus + transportCost;

    var weeklyPay = dailyPay * daysPerWeek;

    var monthlyPay = weeklyPay * 52 / 12;

    var annualPay = weeklyPay * 52;

    var annualPayExclTransport = (baseDailyPay + nightBonus) * daysPerWeek * 52;

    // 1.03M JPY threshold
    var wall103Text;
    if (annualPayExclTransport <= 1030000) {
      var remaining103 = 1030000 - annualPayExclTransport;
      wall103Text = 'Below threshold (remaining: ' + formatYen(remaining103) + ')';
    } else {
      var overAmount103 = annualPayExclTransport - 1030000;
      wall103Text = 'Exceeds threshold (by ' + formatYen(overAmount103) + ')';
    }

    // 1.3M JPY threshold
    var wall130Text;
    if (annualPayExclTransport <= 1300000) {
      var remaining130 = 1300000 - annualPayExclTransport;
      wall130Text = 'Below threshold (remaining: ' + formatYen(remaining130) + ')';
    } else {
      var overAmount130 = annualPayExclTransport - 1300000;
      wall130Text = 'Exceeds threshold (by ' + formatYen(overAmount130) + ')';
    }

    resultDaily.textContent = formatYen(dailyPay);
    resultWeekly.textContent = formatYen(weeklyPay);
    resultMonthly.textContent = formatYen(monthlyPay);
    resultAnnual.textContent = formatYen(annualPay);
    resultNightPay.textContent = formatYen(nightBonus);
    resultWall103.textContent = wall103Text;
    resultWall130.textContent = wall130Text;

    resultSection.hidden = false;
    resultSection.scrollIntoView({ behavior: 'smooth' });
  });

  resetBtn.addEventListener('click', function () {
    hourlyWageInput.value = '';
    hoursPerDayInput.value = '';
    daysPerWeekInput.value = '';
    nightHoursInput.value = '0';
    transportCostInput.value = '0';
    resultSection.hidden = true;
  });
});
