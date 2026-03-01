document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  var paymentAmountInput = document.getElementById('payment-amount');
  var calcBtn = document.getElementById('calc-btn');
  var resetBtn = document.getElementById('reset-btn');
  var resultSection = document.getElementById('result');

  var cards = [
    {
      nameInput: document.getElementById('card1-name'),
      rateInput: document.getElementById('card1-rate'),
      valueInput: document.getElementById('card1-value'),
      resultEl: document.getElementById('result-card1'),
      titleEl: document.getElementById('result-card1-title'),
      pointsEl: document.getElementById('result-card1-points'),
      discountEl: document.getElementById('result-card1-discount'),
      effectiveEl: document.getElementById('result-card1-effective')
    },
    {
      nameInput: document.getElementById('card2-name'),
      rateInput: document.getElementById('card2-rate'),
      valueInput: document.getElementById('card2-value'),
      resultEl: document.getElementById('result-card2'),
      titleEl: document.getElementById('result-card2-title'),
      pointsEl: document.getElementById('result-card2-points'),
      discountEl: document.getElementById('result-card2-discount'),
      effectiveEl: document.getElementById('result-card2-effective')
    },
    {
      nameInput: document.getElementById('card3-name'),
      rateInput: document.getElementById('card3-rate'),
      valueInput: document.getElementById('card3-value'),
      resultEl: document.getElementById('result-card3'),
      titleEl: document.getElementById('result-card3-title'),
      pointsEl: document.getElementById('result-card3-points'),
      discountEl: document.getElementById('result-card3-discount'),
      effectiveEl: document.getElementById('result-card3-effective')
    }
  ];

  var resultRecommendation = document.getElementById('result-recommendation');
  var resultBestCard = document.getElementById('result-best-card');

  function formatCurrency(val) {
    return Math.floor(val).toLocaleString();
  }

  calcBtn.addEventListener('click', function () {
    var paymentAmount = parseFloat(paymentAmountInput.value);

    if (isNaN(paymentAmount) || paymentAmount <= 0) {
      alert('Please enter a valid payment amount.');
      return;
    }

    var bestDiscount = -1;
    var bestCardName = '';
    var activeCount = 0;

    for (var i = 0; i < cards.length; i++) {
      var card = cards[i];
      var rate = parseFloat(card.rateInput.value);
      var pointValue = parseFloat(card.valueInput.value);
      var name = card.nameInput.value || ('Card ' + (i + 1));

      if (isNaN(rate) || rate <= 0) {
        card.resultEl.hidden = true;
        continue;
      }
      if (isNaN(pointValue) || pointValue <= 0) {
        pointValue = 1;
      }

      activeCount++;

      var earnedPoints = paymentAmount * (rate / 100);
      var discountAmount = earnedPoints * pointValue;
      var effectiveRate = (discountAmount / paymentAmount) * 100;

      card.titleEl.textContent = name;
      card.pointsEl.textContent = Math.floor(earnedPoints).toLocaleString() + ' points';
      card.discountEl.textContent = formatCurrency(discountAmount);
      card.effectiveEl.textContent = effectiveRate.toFixed(2) + '%';
      card.resultEl.hidden = false;

      if (discountAmount > bestDiscount) {
        bestDiscount = discountAmount;
        bestCardName = name;
      }
    }

    if (activeCount === 0) {
      alert('Please enter the reward rate for at least one card.');
      return;
    }

    if (activeCount >= 2) {
      resultBestCard.textContent = bestCardName + ' (effective discount: ' + formatCurrency(bestDiscount) + ')';
      resultRecommendation.hidden = false;
    } else {
      resultRecommendation.hidden = true;
    }

    resultSection.hidden = false;
    resultSection.scrollIntoView({ behavior: 'smooth' });
  });

  resetBtn.addEventListener('click', function () {
    paymentAmountInput.value = '';
    for (var i = 0; i < cards.length; i++) {
      cards[i].nameInput.value = '';
      cards[i].rateInput.value = '';
      cards[i].valueInput.value = i === 0 ? '1' : '';
      cards[i].resultEl.hidden = true;
    }
    resultRecommendation.hidden = true;
    resultSection.hidden = true;
  });
});
