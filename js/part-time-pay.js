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
    return Math.floor(val).toLocaleString() + '円';
  }

  calcBtn.addEventListener('click', function () {
    var hourlyWage = parseFloat(hourlyWageInput.value);
    var hoursPerDay = parseFloat(hoursPerDayInput.value);
    var daysPerWeek = parseInt(daysPerWeekInput.value, 10);
    var nightHours = parseFloat(nightHoursInput.value) || 0;
    var transportCost = parseFloat(transportCostInput.value) || 0;

    if (isNaN(hourlyWage) || hourlyWage <= 0) {
      alert('時給を正しく入力してください。');
      return;
    }
    if (isNaN(hoursPerDay) || hoursPerDay <= 0 || hoursPerDay > 24) {
      alert('1日の勤務時間を正しく入力してください（0.5〜24時間）。');
      return;
    }
    if (isNaN(daysPerWeek) || daysPerWeek < 1 || daysPerWeek > 7) {
      alert('週の勤務日数を正しく入力してください（1〜7日）。');
      return;
    }
    if (nightHours < 0 || nightHours > hoursPerDay) {
      alert('深夜勤務時間は0〜1日の勤務時間以内で入力してください。');
      return;
    }

    // 深夜手当の計算（25%割増）
    var nightBonus = hourlyWage * 0.25 * nightHours;

    // 通常勤務の給料（深夜時間も含む基本給）
    var baseDailyPay = hourlyWage * hoursPerDay;

    // 日給 = 基本給 + 深夜手当 + 交通費
    var dailyPay = baseDailyPay + nightBonus + transportCost;

    // 週給
    var weeklyPay = dailyPay * daysPerWeek;

    // 月給（52週 / 12ヶ月 = 約4.33週）
    var monthlyPay = weeklyPay * 52 / 12;

    // 年収（52週）
    var annualPay = weeklyPay * 52;

    // 交通費を除いた年収で壁の判定（交通費は通常非課税）
    var annualPayExclTransport = (baseDailyPay + nightBonus) * daysPerWeek * 52;

    // 103万円の壁
    var wall103Text;
    if (annualPayExclTransport <= 1030000) {
      var remaining103 = 1030000 - annualPayExclTransport;
      wall103Text = '超えません（残り ' + formatYen(remaining103) + '）';
    } else {
      var overAmount103 = annualPayExclTransport - 1030000;
      wall103Text = '超えます（' + formatYen(overAmount103) + ' 超過）';
    }

    // 130万円の壁
    var wall130Text;
    if (annualPayExclTransport <= 1300000) {
      var remaining130 = 1300000 - annualPayExclTransport;
      wall130Text = '超えません（残り ' + formatYen(remaining130) + '）';
    } else {
      var overAmount130 = annualPayExclTransport - 1300000;
      wall130Text = '超えます（' + formatYen(overAmount130) + ' 超過）';
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