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

  function formatYen(val) {
    return Math.floor(val).toLocaleString() + '円';
  }

  calcBtn.addEventListener('click', function () {
    var paymentAmount = parseFloat(paymentAmountInput.value);

    if (isNaN(paymentAmount) || paymentAmount <= 0) {
      alert('支払い金額を正しく入力してください。');
      return;
    }

    var bestDiscount = -1;
    var bestCardName = '';
    var activeCount = 0;

    for (var i = 0; i < cards.length; i++) {
      var card = cards[i];
      var rate = parseFloat(card.rateInput.value);
      var pointValue = parseFloat(card.valueInput.value);
      var name = card.nameInput.value || ('カード' + (i + 1));

      if (isNaN(rate) || rate <= 0) {
        card.resultEl.hidden = true;
        continue;
      }
      if (isNaN(pointValue) || pointValue <= 0) {
        pointValue = 1;
      }

      activeCount++;

      // 獲得ポイント数 = 支払い金額 × (還元率 / 100)
      // ポイントは通常100円単位で付与されるカードが多いが、ここでは単純計算
      var earnedPoints = paymentAmount * (rate / 100);
      // 実質割引額
      var discountAmount = earnedPoints * pointValue;
      // 実質還元率
      var effectiveRate = (discountAmount / paymentAmount) * 100;

      card.titleEl.textContent = name;
      card.pointsEl.textContent = Math.floor(earnedPoints).toLocaleString() + 'ポイント';
      card.discountEl.textContent = formatYen(discountAmount);
      card.effectiveEl.textContent = effectiveRate.toFixed(2) + '%';
      card.resultEl.hidden = false;

      if (discountAmount > bestDiscount) {
        bestDiscount = discountAmount;
        bestCardName = name;
      }
    }

    if (activeCount === 0) {
      alert('少なくとも1つのカードの還元率を入力してください。');
      return;
    }

    if (activeCount >= 2) {
      resultBestCard.textContent = bestCardName + '（実質割引額: ' + formatYen(bestDiscount) + '）';
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