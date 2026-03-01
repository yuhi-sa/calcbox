document.addEventListener('DOMContentLoaded', function () {
  var nInput = document.getElementById('n-value');
  var rInput = document.getElementById('r-value');
  var rGroup = document.getElementById('r-group');
  var calcBtn = document.getElementById('calc-btn');
  var resetBtn = document.getElementById('reset-btn');
  var resultSection = document.getElementById('result');
  var formulaValue = document.getElementById('formula-value');
  var calcResult = document.getElementById('calc-result');
  var presetResult = document.getElementById('preset-result');
  var presetDetail = document.getElementById('preset-detail');
  var presetCoin = document.getElementById('preset-coin');
  var presetDice = document.getElementById('preset-dice');
  var presetLotto = document.getElementById('preset-lotto');

  function getMode() {
    var radios = document.querySelectorAll('input[name="calc-mode"]');
    for (var i = 0; i < radios.length; i++) {
      if (radios[i].checked) return radios[i].value;
    }
    return 'npr';
  }

  // Toggle r-group visibility based on mode
  var modeRadios = document.querySelectorAll('input[name="calc-mode"]');
  for (var i = 0; i < modeRadios.length; i++) {
    modeRadios[i].addEventListener('change', function () {
      rGroup.style.display = getMode() === 'factorial' ? 'none' : '';
    });
  }

  function factorial(num) {
    if (num < 0) return NaN;
    if (num === 0 || num === 1) return 1;
    var result = 1;
    for (var i = 2; i <= num; i++) {
      result *= i;
    }
    return result;
  }

  function permutation(n, r) {
    if (r > n || r < 0 || n < 0) return NaN;
    var result = 1;
    for (var i = 0; i < r; i++) {
      result *= (n - i);
    }
    return result;
  }

  function combination(n, r) {
    if (r > n || r < 0 || n < 0) return NaN;
    if (r === 0 || r === n) return 1;
    // Use smaller r for efficiency
    if (r > n - r) r = n - r;
    var result = 1;
    for (var i = 0; i < r; i++) {
      result = result * (n - i) / (i + 1);
    }
    return Math.round(result);
  }

  function formatNumber(num) {
    if (isNaN(num) || !isFinite(num)) return 'N/A';
    if (num > 1e15) return num.toExponential(4);
    return num.toLocaleString();
  }

  calcBtn.addEventListener('click', function () {
    var mode = getMode();
    var n = parseInt(nInput.value, 10);

    if (isNaN(n) || n < 0 || n > 170) {
      alert('Please enter a value for n between 0 and 170.');
      return;
    }

    var result, formula;

    if (mode === 'factorial') {
      result = factorial(n);
      formula = n + '!';
    } else {
      var r = parseInt(rInput.value, 10);
      if (isNaN(r) || r < 0) {
        alert('Please enter a non-negative integer for r.');
        return;
      }
      if (r > n) {
        alert('r must be less than or equal to n.');
        return;
      }

      if (mode === 'npr') {
        result = permutation(n, r);
        formula = n + 'P' + r;
      } else {
        result = combination(n, r);
        formula = n + 'C' + r;
      }
    }

    formulaValue.textContent = formula;
    calcResult.textContent = formatNumber(result);

    resultSection.hidden = false;
    resultSection.scrollIntoView({ behavior: 'smooth' });
  });

  resetBtn.addEventListener('click', function () {
    nInput.value = '';
    rInput.value = '';
    resultSection.hidden = true;
    presetResult.hidden = true;
    rGroup.style.display = '';
    var radios = document.querySelectorAll('input[name="calc-mode"]');
    radios[0].checked = true;
  });

  presetCoin.addEventListener('click', function () {
    var html = '';
    html += '<p><strong>Coin Flip Probabilities</strong></p>';
    html += '<p>Probability of heads: 1/2 = <strong>50.00%</strong></p>';
    html += '<p>Heads twice in a row: 1/4 = <strong>25.00%</strong></p>';
    html += '<p>Heads three times in a row: 1/8 = <strong>12.50%</strong></p>';
    html += '<p>3 heads out of 5 flips: 10/32 = <strong>31.25%</strong></p>';
    presetDetail.innerHTML = html;
    presetResult.hidden = false;
  });

  presetDice.addEventListener('click', function () {
    var html = '';
    html += '<p><strong>Dice Probabilities</strong></p>';
    html += '<p>Rolling a specific number: 1/6 ≒ <strong>16.67%</strong></p>';
    html += '<p>Rolling an even number: 3/6 = <strong>50.00%</strong></p>';
    html += '<p>Sum of two dice equals 7: 6/36 = <strong>16.67%</strong></p>';
    html += '<p>Doubles with two dice: 6/36 = <strong>16.67%</strong></p>';
    html += '<p>At least one 6 with two dice: 11/36 ≒ <strong>30.56%</strong></p>';
    presetDetail.innerHTML = html;
    presetResult.hidden = false;
  });

  presetLotto.addEventListener('click', function () {
    var c = combination(43, 6);
    var prob = 1 / c;
    var html = '';
    html += '<p><strong>Lottery (choose 6 from 43)</strong></p>';
    html += '<p>Number of combinations (43C6): <strong>' + formatNumber(c) + ' ways</strong></p>';
    html += '<p>Jackpot probability: 1/' + formatNumber(c) + ' ≒ <strong>' + (prob * 100).toExponential(2) + '%</strong></p>';
    html += '<p>Match 5 of 6 (6C5 x 37C1 / 43C6): <strong>' + ((combination(6, 5) * combination(37, 1) / c) * 100).toFixed(4) + '%</strong></p>';
    presetDetail.innerHTML = html;
    presetResult.hidden = false;
  });
});