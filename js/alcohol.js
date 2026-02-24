document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  var bodyWeightInput = document.getElementById('body-weight');
  var drinkTimeInput = document.getElementById('drink-time');
  var beerInput = document.getElementById('beer-amount');
  var wineInput = document.getElementById('wine-amount');
  var sakeInput = document.getElementById('sake-amount');
  var shochuInput = document.getElementById('shochu-amount');
  var highballInput = document.getElementById('highball-amount');
  var customAmountInput = document.getElementById('custom-amount');
  var customAbvInput = document.getElementById('custom-abv');
  var calcBtn = document.getElementById('calc-btn');
  var resetBtn = document.getElementById('reset-btn');
  var resultSection = document.getElementById('result');

  var resultAlcoholGrams = document.getElementById('result-alcohol-grams');
  var resultBac = document.getElementById('result-bac');
  var resultDecomposeHours = document.getElementById('result-decompose-hours');
  var resultSoberTime = document.getElementById('result-sober-time');
  var resultDriveTime = document.getElementById('result-drive-time');

  // アルコール比重
  var ALCOHOL_DENSITY = 0.8;

  function getGender() {
    var radios = document.querySelectorAll('input[name="gender"]');
    for (var i = 0; i < radios.length; i++) {
      if (radios[i].checked) return radios[i].value;
    }
    return 'male';
  }

  // ml × 度数(%) × 0.8 = アルコール量(g)
  function calcAlcoholGrams(ml, abvPercent) {
    return ml * (abvPercent / 100) * ALCOHOL_DENSITY;
  }

  function formatTime(hours, minutes) {
    var h = Math.floor(hours) % 24;
    var m = Math.floor(minutes);
    return (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m;
  }

  function addHoursToTime(timeStr, addHours) {
    var parts = timeStr.split(':');
    var startH = parseInt(parts[0], 10);
    var startM = parseInt(parts[1], 10);

    var totalMinutes = startH * 60 + startM + Math.round(addHours * 60);
    var days = Math.floor(totalMinutes / (24 * 60));
    totalMinutes = totalMinutes % (24 * 60);
    if (totalMinutes < 0) totalMinutes += 24 * 60;

    var h = Math.floor(totalMinutes / 60);
    var m = totalMinutes % 60;

    var timeFormatted = formatTime(h, m);
    if (days > 0) {
      timeFormatted += '（翌';
      if (days > 1) timeFormatted += days + '日';
      timeFormatted += '日）';
    }
    return timeFormatted;
  }

  calcBtn.addEventListener('click', function () {
    var weight = parseFloat(bodyWeightInput.value);
    var drinkTime = drinkTimeInput.value;
    var gender = getGender();

    if (isNaN(weight) || weight < 30 || weight > 200) {
      alert('体重を正しく入力してください（30〜200kg）。');
      return;
    }
    if (!drinkTime) {
      alert('飲酒開始時刻を入力してください。');
      return;
    }

    var beer = parseFloat(beerInput.value) || 0;
    var wine = parseFloat(wineInput.value) || 0;
    var sake = parseFloat(sakeInput.value) || 0;
    var shochu = parseFloat(shochuInput.value) || 0;
    var highball = parseFloat(highballInput.value) || 0;
    var customAmount = parseFloat(customAmountInput.value) || 0;
    var customAbv = parseFloat(customAbvInput.value) || 0;

    // 日本酒は合をmlに変換（1合 = 180ml）
    var sakeMl = sake * 180;

    // 各種アルコール量(g)を計算
    var totalAlcohol = 0;
    totalAlcohol += calcAlcoholGrams(beer, 5);
    totalAlcohol += calcAlcoholGrams(wine, 12);
    totalAlcohol += calcAlcoholGrams(sakeMl, 15);
    totalAlcohol += calcAlcoholGrams(shochu, 25);
    totalAlcohol += calcAlcoholGrams(highball, 7);
    totalAlcohol += calcAlcoholGrams(customAmount, customAbv);

    if (totalAlcohol <= 0) {
      alert('飲酒量を入力してください。');
      return;
    }

    // 体内水分率
    var waterRatio = gender === 'male' ? 0.68 : 0.55;

    // 血中アルコール濃度（BAC）% - Widmark式
    var bac = totalAlcohol / (weight * waterRatio) * 100;

    // 分解速度: 体重1kgあたり0.1g/時間
    var decompositionRate = weight * 0.1;
    var decomposeHours = totalAlcohol / decompositionRate;

    // 安全マージン: 1時間追加
    var driveHours = decomposeHours + 1;

    var hours = Math.floor(decomposeHours);
    var minutes = Math.round((decomposeHours - hours) * 60);
    if (minutes === 60) {
      hours += 1;
      minutes = 0;
    }

    resultAlcoholGrams.textContent = totalAlcohol.toFixed(1) + 'g';
    resultBac.textContent = bac.toFixed(3) + '%';
    resultDecomposeHours.textContent = hours + '時間' + minutes + '分';
    resultSoberTime.textContent = addHoursToTime(drinkTime, decomposeHours);
    resultDriveTime.textContent = addHoursToTime(drinkTime, driveHours);

    resultSection.hidden = false;
    resultSection.scrollIntoView({ behavior: 'smooth' });
  });

  resetBtn.addEventListener('click', function () {
    bodyWeightInput.value = '';
    drinkTimeInput.value = '19:00';
    beerInput.value = '0';
    wineInput.value = '0';
    sakeInput.value = '0';
    shochuInput.value = '0';
    highballInput.value = '0';
    customAmountInput.value = '0';
    customAbvInput.value = '0';
    var radios = document.querySelectorAll('input[name="gender"]');
    radios[0].checked = true;
    resultSection.hidden = true;
  });
});