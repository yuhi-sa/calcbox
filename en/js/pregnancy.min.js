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
    var y = date.getFullYear();
    var m = ('0' + (date.getMonth() + 1)).slice(-2);
    var d = ('0' + date.getDate()).slice(-2);
    var days = ['日', '月', '火', '水', '木', '金', '土'];
    var dayName = days[date.getDay()];
    return y + '年' + m + '月' + d + '日（' + dayName + '）';
  }

  function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  function getTrimester(weeks) {
    if (weeks < 0) return { label: '妊娠前', color: '#6b7280' };
    if (weeks < 16) return { label: '妊娠初期（1〜4ヶ月）', color: '#f59e0b' };
    if (weeks < 28) return { label: '妊娠中期（5〜7ヶ月）安定期', color: '#22c55e' };
    if (weeks < 40) return { label: '妊娠後期（8〜10ヶ月）', color: '#3b82f6' };
    return { label: '出産予定日超過', color: '#ef4444' };
  }

  function buildTimeline(lmpDate) {
    timelineBody.innerHTML = '';

    var phases = [
      { name: '妊娠初期', weeks: '0〜15週', months: '1〜4ヶ月', startWeek: 0, endWeek: 15, features: 'つわり、眠気、胎児の器官形成' },
      { name: '├ 妊娠超初期', weeks: '0〜3週', months: '1ヶ月', startWeek: 0, endWeek: 3, features: '受精・着床、自覚症状なし' },
      { name: '├ 妊娠2ヶ月', weeks: '4〜7週', months: '2ヶ月', startWeek: 4, endWeek: 7, features: 'つわり開始、妊娠検査薬で陽性' },
      { name: '├ 妊娠3ヶ月', weeks: '8〜11週', months: '3ヶ月', startWeek: 8, endWeek: 11, features: 'つわりのピーク、心拍確認' },
      { name: '└ 妊娠4ヶ月', weeks: '12〜15週', months: '4ヶ月', startWeek: 12, endWeek: 15, features: 'つわり軽減、胎盤完成' },
      { name: '妊娠中期', weeks: '16〜27週', months: '5〜7ヶ月', startWeek: 16, endWeek: 27, features: '安定期、胎動、お腹のふくらみ' },
      { name: '├ 妊娠5ヶ月', weeks: '16〜19週', months: '5ヶ月', startWeek: 16, endWeek: 19, features: '安定期入り、胎動を感じ始める' },
      { name: '├ 妊娠6ヶ月', weeks: '20〜23週', months: '6ヶ月', startWeek: 20, endWeek: 23, features: '胎動活発、性別判明の可能性' },
      { name: '└ 妊娠7ヶ月', weeks: '24〜27週', months: '7ヶ月', startWeek: 24, endWeek: 27, features: 'お腹が目立つ、足のむくみ' },
      { name: '妊娠後期', weeks: '28〜39週', months: '8〜10ヶ月', startWeek: 28, endWeek: 39, features: '出産準備、健診頻度増加' },
      { name: '├ 妊娠8ヶ月', weeks: '28〜31週', months: '8ヶ月', startWeek: 28, endWeek: 31, features: '逆子チェック、産休開始目安' },
      { name: '├ 妊娠9ヶ月', weeks: '32〜35週', months: '9ヶ月', startWeek: 32, endWeek: 35, features: '出産準備、入院グッズの用意' },
      { name: '└ 妊娠10ヶ月', weeks: '36〜39週', months: '10ヶ月', startWeek: 36, endWeek: 39, features: '正期産（37週〜）、いつでも出産OK' }
    ];

    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var diffDays = Math.floor((today - lmpDate) / (1000 * 60 * 60 * 24));
    var currentWeeks = Math.floor(diffDays / 7);

    for (var i = 0; i < phases.length; i++) {
      var p = phases[i];
      var tr = document.createElement('tr');
      tr.style.borderBottom = '1px solid var(--color-border-light)';

      // Highlight current phase
      if (currentWeeks >= p.startWeek && currentWeeks <= p.endWeek) {
        tr.style.background = 'var(--color-primary-light, #dbeafe)';
      }

      var isMainPhase = p.name.indexOf('├') === -1 && p.name.indexOf('└') === -1;
      var fontWeight = isMainPhase ? '600' : '400';

      var startDate = addDays(lmpDate, p.startWeek * 7);
      var endDate = addDays(lmpDate, (p.endWeek + 1) * 7 - 1);
      var dateRange = (startDate.getMonth() + 1) + '/' + startDate.getDate() + '〜' + (endDate.getMonth() + 1) + '/' + endDate.getDate();

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
      alert('最終月経開始日を入力してください。');
      return;
    }

    var lmpDate = new Date(dateStr);
    lmpDate.setHours(0, 0, 0, 0);

    var today = new Date();
    today.setHours(0, 0, 0, 0);

    // Due date = LMP + 280 days
    var dueDate = addDays(lmpDate, 280);

    // Current pregnancy weeks and days
    var diffDays = Math.floor((today - lmpDate) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      alert('最終月経開始日が未来の日付です。正しい日付を入力してください。');
      return;
    }

    if (diffDays > 310) {
      alert('最終月経開始日が44週以上前です。正しい日付を入力してください。');
      return;
    }

    var weeks = Math.floor(diffDays / 7);
    var days = diffDays % 7;

    // Days remaining until due date
    var remaining = Math.floor((dueDate - today) / (1000 * 60 * 60 * 24));

    var trimester = getTrimester(weeks);

    currentWeekEl.textContent = '妊娠' + weeks + '週' + days + '日';
    currentWeekEl.style.color = trimester.color;
    dueDateEl.textContent = formatDate(dueDate);
    trimesterEl.textContent = trimester.label;
    trimesterEl.style.color = trimester.color;

    if (remaining > 0) {
      daysRemainingEl.textContent = 'あと' + remaining + '日';
    } else if (remaining === 0) {
      daysRemainingEl.textContent = '本日が出産予定日です';
      daysRemainingEl.style.color = '#ef4444';
    } else {
      daysRemainingEl.textContent = '出産予定日を' + Math.abs(remaining) + '日超過';
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
