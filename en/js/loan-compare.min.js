document.addEventListener('DOMContentLoaded', function () {
  var calcBtn = document.getElementById('calc-btn');
  var resetBtn = document.getElementById('reset-btn');
  var resultSection = document.getElementById('result-section');
  var comparisonTable = document.getElementById('comparison-table');

  function formatNumber(n) {
    return n.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  function calcLoan(principalMan, ratePercent, termYears) {
    var principal = principalMan * 10000;
    var monthlyRate = ratePercent / 100 / 12;
    var months = termYears * 12;

    if (monthlyRate === 0) {
      var monthlyPayment = principal / months;
      return {
        monthlyPayment: monthlyPayment,
        totalPayment: principal,
        totalInterest: 0
      };
    }

    var x = Math.pow(1 + monthlyRate, months);
    var monthlyPayment = principal * monthlyRate * x / (x - 1);
    var totalPayment = monthlyPayment * months;
    var totalInterest = totalPayment - principal;

    return {
      monthlyPayment: monthlyPayment,
      totalPayment: totalPayment,
      totalInterest: totalInterest
    };
  }

  function getPlanInputs(suffix) {
    var p = parseFloat(document.getElementById('principal-' + suffix).value);
    var r = parseFloat(document.getElementById('rate-' + suffix).value);
    var t = parseFloat(document.getElementById('term-' + suffix).value);
    if (!p || !r && r !== 0 || !t) return null;
    if (p <= 0 || r < 0 || t <= 0) return null;
    return { principal: p, rate: r, term: t };
  }

  calcBtn.addEventListener('click', function () {
    var planA = getPlanInputs('a');
    var planB = getPlanInputs('b');
    var planC = getPlanInputs('c');

    if (!planA || !planB) {
      alert('Please enter valid loan amount, interest rate, and term for Plan A and Plan B.');
      return;
    }

    var plans = [
      { name: 'Plan A', data: planA, result: calcLoan(planA.principal, planA.rate, planA.term) },
      { name: 'Plan B', data: planB, result: calcLoan(planB.principal, planB.rate, planB.term) }
    ];

    if (planC) {
      plans.push({ name: 'Plan C', data: planC, result: calcLoan(planC.principal, planC.rate, planC.term) });
    }

    var samePrincipal = plans.every(function (p) { return p.data.principal === plans[0].data.principal; });
    var bestIdx = -1;
    if (samePrincipal) {
      bestIdx = 0;
      for (var i = 1; i < plans.length; i++) {
        if (plans[i].result.totalInterest < plans[bestIdx].result.totalInterest) {
          bestIdx = i;
        }
      }
    }

    var html = '<table style="width:100%;border-collapse:collapse;font-size:0.9rem;">';
    html += '<thead><tr>';
    html += '<th style="border:1px solid var(--color-border);padding:10px;background:var(--color-bg-secondary);text-align:left;"></th>';
    for (var i = 0; i < plans.length; i++) {
      var bgColor = (bestIdx >= 0 && i === bestIdx) ? '#dcfce7' : 'var(--color-bg-secondary)';
      html += '<th style="border:1px solid var(--color-border);padding:10px;background:' + bgColor + ';text-align:center;">' + plans[i].name;
      if (bestIdx >= 0 && i === bestIdx) html += '<br><span style="color:#22c55e;font-size:0.8rem;">Recommended</span>';
      html += '</th>';
    }
    html += '</tr></thead><tbody>';

    var rows = [
      { label: 'Loan Amount', key: 'principal', format: function (p) { return formatNumber(p.data.principal) + ' x10K'; } },
      { label: 'Interest Rate', key: 'rate', format: function (p) { return p.data.rate + ' %'; } },
      { label: 'Loan Term', key: 'term', format: function (p) { return p.data.term + ' yrs'; } },
      { label: 'Monthly Payment', key: 'monthlyPayment', format: function (p) { return formatNumber(Math.round(p.result.monthlyPayment)); } },
      { label: 'Total Payment', key: 'totalPayment', format: function (p) { return formatNumber(Math.round(p.result.totalPayment)); } },
      { label: 'Total Interest', key: 'totalInterest', format: function (p) { return formatNumber(Math.round(p.result.totalInterest)); }, highlight: true }
    ];

    for (var r = 0; r < rows.length; r++) {
      html += '<tr>';
      html += '<td style="border:1px solid var(--color-border);padding:10px;font-weight:600;background:var(--color-bg-secondary);">' + rows[r].label + '</td>';
      for (var i = 0; i < plans.length; i++) {
        var cellBg = '';
        if (rows[r].highlight && bestIdx >= 0 && i === bestIdx) {
          cellBg = 'background:#dcfce7;color:#166534;font-weight:600;';
        }
        html += '<td style="border:1px solid var(--color-border);padding:10px;text-align:center;' + cellBg + '">' + rows[r].format(plans[i]) + '</td>';
      }
      html += '</tr>';
    }

    html += '</tbody></table>';

    if (!samePrincipal) {
      html += '<p style="margin-top:12px;font-size:0.85rem;color:var(--color-text-secondary);">* Since loan amounts differ, no recommendation is shown. Compare with the same loan amount for a more accurate comparison.</p>';
    }

    comparisonTable.innerHTML = html;
    resultSection.hidden = false;
    resultSection.scrollIntoView({ behavior: 'smooth' });
  });

  resetBtn.addEventListener('click', function () {
    var ids = ['principal-a', 'rate-a', 'term-a', 'principal-b', 'rate-b', 'term-b', 'principal-c', 'rate-c', 'term-c'];
    for (var i = 0; i < ids.length; i++) {
      document.getElementById(ids[i]).value = '';
    }
    resultSection.hidden = true;
    comparisonTable.innerHTML = '';
  });
});
