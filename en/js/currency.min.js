document.addEventListener('DOMContentLoaded', function () {
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

  var ratesPerUSD = {
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
      alert('Please enter a positive amount.');
      return;
    }

    if (from === to) {
      alert('Please select different currencies.');
      return;
    }

    var result = convert(amount, from, to);
    var rate = convert(1, from, to);

    fromValue.textContent = formatNumber(amount, from) + ' ' + from;
    toValue.textContent = formatNumber(result, to) + ' ' + to;
    rateValue.textContent = '1 ' + from + ' = ' + formatNumber(rate, to) + ' ' + to;

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
    fromCurrency.value = 'USD';
    toCurrency.value = 'JPY';
    resultSection.hidden = true;
  });
});
