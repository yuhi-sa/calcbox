document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  var amountInput = document.getElementById('amount');
  var fromCurrency = document.getElementById('from-currency');
  var toCurrency = document.getElementById('to-currency');
  var calcBtn = document.getElementById('calc-btn');
  var resetBtn = document.getElementById('reset-btn');
  var swapBtn = document.getElementById('swap-btn');
  var resultSection = document.getElementById('result');
  var fromValue = document.getElementById('from-value');
  var toValue = document.getElementById('to-value');
  var rateValue = document.getElementById('rate-value');

  // 1 USD を基準とした固定レート（2026年2月時点の概算・フォールバック用）
  var fallbackRates = {
    USD: 1,
    JPY: 149.50,
    EUR: 0.92,
    GBP: 0.79,
    CNY: 7.24,
    KRW: 1330,
    TWD: 32.5,
    AUD: 1.55,
    CAD: 1.36,
    CHF: 0.89
  };

  var ratesPerUSD = fallbackRates;
  var ratesSource = 'fallback'; // 'api' or 'fallback'
  var ratesLastUpdated = null;

  // レートをAPIから取得
  function fetchRates() {
    var noteEl = getOrCreateNoteEl();
    noteEl.textContent = 'レート取得中...';

    fetch('https://api.exchangerate-api.com/v4/latest/USD')
      .then(function (response) {
        if (!response.ok) {
          throw new Error('API response not ok');
        }
        return response.json();
      })
      .then(function (data) {
        if (data && data.rates) {
          var newRates = {};
          var currencies = Object.keys(fallbackRates);
          for (var i = 0; i < currencies.length; i++) {
            var code = currencies[i];
            if (data.rates[code] !== undefined) {
              newRates[code] = data.rates[code];
            } else {
              newRates[code] = fallbackRates[code];
            }
          }
          ratesPerUSD = newRates;
          ratesSource = 'api';
          ratesLastUpdated = new Date();
          updateRateNote();
        }
      })
      .catch(function () {
        ratesPerUSD = fallbackRates;
        ratesSource = 'fallback';
        updateRateNote();
      });
  }

  function getOrCreateNoteEl() {
    var noteEl = document.getElementById('rate-note');
    if (!noteEl) {
      noteEl = document.createElement('p');
      noteEl.id = 'rate-note';
      noteEl.style.cssText = 'font-size:0.85em;color:var(--color-text-secondary);margin-top:8px;text-align:center;';
      var toolBody = document.querySelector('.tool__body');
      if (toolBody) {
        toolBody.appendChild(noteEl);
      }
    }
    return noteEl;
  }

  function updateRateNote() {
    var noteEl = getOrCreateNoteEl();
    if (ratesSource === 'api' && ratesLastUpdated) {
      var h = ('0' + ratesLastUpdated.getHours()).slice(-2);
      var m = ('0' + ratesLastUpdated.getMinutes()).slice(-2);
      var dateStr = ratesLastUpdated.getFullYear() + '/' +
        (ratesLastUpdated.getMonth() + 1) + '/' +
        ratesLastUpdated.getDate() + ' ' + h + ':' + m;
      noteEl.textContent = '※ APIからリアルタイムレートを取得（最終更新: ' + dateStr + '）。実際の取引レートとは異なる場合があります。';
    } else {
      noteEl.textContent = '※ レートは2026年2月時点の概算値です（API取得に失敗）。実際の取引レートとは異なります。';
    }
  }

  function convert(amount, from, to) {
    var amountInUSD = amount / ratesPerUSD[from];
    return amountInUSD * ratesPerUSD[to];
  }

  function formatNumber(num, currency) {
    if (currency === 'JPY' || currency === 'KRW') {
      return num.toFixed(0);
    }
    return num.toFixed(2);
  }

  calcBtn.addEventListener('click', function () {
    var amount = parseFloat(amountInput.value);
    var from = fromCurrency.value;
    var to = toCurrency.value;

    if (!amount || amount <= 0) {
      alert('正の金額を入力してください。');
      return;
    }

    if (from === to) {
      alert('異なる通貨を選択してください。');
      return;
    }

    var result = convert(amount, from, to);
    var rate = convert(1, from, to);

    fromValue.textContent = formatNumber(amount, from) + ' ' + from;
    toValue.textContent = formatNumber(result, to) + ' ' + to;
    rateValue.textContent = '1 ' + from + ' = ' + formatNumber(rate, to) + ' ' + to;

    updateRateNote();

    resultSection.hidden = false;
    resultSection.scrollIntoView({ behavior: 'smooth' });
  });

  swapBtn.addEventListener('click', function () {
    var temp = fromCurrency.value;
    fromCurrency.value = toCurrency.value;
    toCurrency.value = temp;
  });

  resetBtn.addEventListener('click', function () {
    amountInput.value = '';
    fromCurrency.value = 'JPY';
    toCurrency.value = 'USD';
    resultSection.hidden = true;
  });

  // ページ読み込み時にレートを取得
  fetchRates();
});
