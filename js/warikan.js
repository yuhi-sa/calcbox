document.addEventListener('DOMContentLoaded', function () {
  var totalAmountInput = document.getElementById('total-amount');

  // --- 均等割り ---
  var equalPeopleInput = document.getElementById('equal-people');
  var calcEqualBtn = document.getElementById('calc-equal-btn');
  var equalResult = document.getElementById('equal-result');
  var perPerson = document.getElementById('per-person');
  var collectedTotal = document.getElementById('collected-total');
  var remainder = document.getElementById('remainder');

  function getRoundingMethod() {
    var radios = document.querySelectorAll('input[name="rounding"]');
    for (var i = 0; i < radios.length; i++) {
      if (radios[i].checked) return radios[i].value;
    }
    return 'ceil';
  }

  function getUnit(name) {
    var radios = document.querySelectorAll('input[name="' + name + '"]');
    for (var i = 0; i < radios.length; i++) {
      if (radios[i].checked) return parseInt(radios[i].value, 10);
    }
    return 100;
  }

  function roundByUnit(value, unit, method) {
    if (unit === 1) {
      if (method === 'ceil') return Math.ceil(value);
      if (method === 'floor') return Math.floor(value);
      return Math.round(value);
    }
    if (method === 'ceil') return Math.ceil(value / unit) * unit;
    if (method === 'floor') return Math.floor(value / unit) * unit;
    return Math.round(value / unit) * unit;
  }

  function formatYen(val) {
    return val.toLocaleString() + '円';
  }

  calcEqualBtn.addEventListener('click', function () {
    var total = parseInt(totalAmountInput.value, 10);
    var people = parseInt(equalPeopleInput.value, 10);
    if (!total || total < 1) {
      alert('合計金額を入力してください。');
      return;
    }
    if (!people || people < 2) {
      alert('人数は2人以上で入力してください。');
      return;
    }

    var method = getRoundingMethod();
    var unit = getUnit('unit');
    var raw = total / people;
    var rounded = roundByUnit(raw, unit, method);
    var collected = rounded * people;
    var diff = collected - total;

    perPerson.textContent = formatYen(rounded);
    collectedTotal.textContent = formatYen(collected);

    if (diff > 0) {
      remainder.textContent = '+' + formatYen(diff) + '（余り）';
      remainder.style.color = '#22c55e';
    } else if (diff < 0) {
      remainder.textContent = formatYen(diff) + '（不足）';
      remainder.style.color = '#ef4444';
    } else {
      remainder.textContent = '0円（ぴったり）';
      remainder.style.color = '#22c55e';
    }

    equalResult.hidden = false;
    equalResult.scrollIntoView({ behavior: 'smooth' });
  });

  // --- 傾斜配分 ---
  var groupMore = document.getElementById('group-more');
  var groupNormal = document.getElementById('group-normal');
  var groupLess = document.getElementById('group-less');
  var calcKeishaBtn = document.getElementById('calc-keisha-btn');
  var keishaResult = document.getElementById('keisha-result');
  var keishaMore = document.getElementById('keisha-more');
  var keishaNormal = document.getElementById('keisha-normal');
  var keishaLess = document.getElementById('keisha-less');
  var keishaCollected = document.getElementById('keisha-collected');
  var keishaRemainder = document.getElementById('keisha-remainder');

  var RATIO_MORE = 1.5;
  var RATIO_NORMAL = 1.0;
  var RATIO_LESS = 0.7;

  calcKeishaBtn.addEventListener('click', function () {
    var total = parseInt(totalAmountInput.value, 10);
    if (!total || total < 1) {
      alert('合計金額を入力してください。');
      return;
    }

    var nMore = parseInt(groupMore.value, 10) || 0;
    var nNormal = parseInt(groupNormal.value, 10) || 0;
    var nLess = parseInt(groupLess.value, 10) || 0;
    var totalPeople = nMore + nNormal + nLess;

    if (totalPeople < 2) {
      alert('合計人数が2人以上になるよう入力してください。');
      return;
    }

    var unit = getUnit('keisha-unit');

    // Calculate weighted total
    var weightedTotal = nMore * RATIO_MORE + nNormal * RATIO_NORMAL + nLess * RATIO_LESS;
    var baseAmount = total / weightedTotal;

    var moreAmount = roundByUnit(baseAmount * RATIO_MORE, unit, 'round');
    var normalAmount = roundByUnit(baseAmount * RATIO_NORMAL, unit, 'round');
    var lessAmount = roundByUnit(baseAmount * RATIO_LESS, unit, 'round');

    var collected = moreAmount * nMore + normalAmount * nNormal + lessAmount * nLess;
    var diff = collected - total;

    keishaMore.textContent = nMore > 0 ? formatYen(moreAmount) + ' x ' + nMore + '人' : '-';
    keishaNormal.textContent = nNormal > 0 ? formatYen(normalAmount) + ' x ' + nNormal + '人' : '-';
    keishaLess.textContent = nLess > 0 ? formatYen(lessAmount) + ' x ' + nLess + '人' : '-';
    keishaCollected.textContent = formatYen(collected);

    if (diff > 0) {
      keishaRemainder.textContent = '+' + formatYen(diff) + '（余り）';
      keishaRemainder.style.color = '#22c55e';
    } else if (diff < 0) {
      keishaRemainder.textContent = formatYen(diff) + '（不足）';
      keishaRemainder.style.color = '#ef4444';
    } else {
      keishaRemainder.textContent = '0円（ぴったり）';
      keishaRemainder.style.color = '#22c55e';
    }

    keishaResult.hidden = false;
    keishaResult.scrollIntoView({ behavior: 'smooth' });
  });

  // --- リセット ---
  document.getElementById('reset-btn').addEventListener('click', function () {
    totalAmountInput.value = '';
    equalPeopleInput.value = '';
    groupMore.value = '0';
    groupNormal.value = '0';
    groupLess.value = '0';
    equalResult.hidden = true;
    keishaResult.hidden = true;
  });
});
