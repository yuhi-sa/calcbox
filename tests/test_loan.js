'use strict';

var assert = require('assert');

// Extract pure functions from js/loan.js for testing

function formatYen(val) {
  return Math.round(val).toLocaleString() + '\u5186';
}

function formatMan(val) {
  var man = val / 10000;
  if (man >= 1) {
    return Math.round(val).toLocaleString() + '\u5186\uff08\u7d04' + man.toFixed(1) + '\u4e07\u5186\uff09';
  }
  return Math.round(val).toLocaleString() + '\u5186';
}

function calcEqualPayment(principal, monthlyRate, totalMonths) {
  if (monthlyRate === 0) {
    return principal / totalMonths;
  }
  var x = Math.pow(1 + monthlyRate, totalMonths);
  return principal * monthlyRate * x / (x - 1);
}

var passed = 0;
var failed = 0;

function test(name, fn) {
  try {
    fn();
    passed++;
    console.log('  PASS: ' + name);
  } catch (e) {
    failed++;
    console.log('  FAIL: ' + name);
    console.log('    ' + e.message);
  }
}

console.log('test_loan.js');

// calcEqualPayment tests
test('Equal payment calculation with known values (3000man, 1.5%, 35yr)', function () {
  // 3000万円, 1.5% annual, 35 years
  var principal = 30000000;
  var monthlyRate = 0.015 / 12;
  var totalMonths = 35 * 12;
  var payment = calcEqualPayment(principal, monthlyRate, totalMonths);
  // Expected ~91,855 yen per month (known reference value)
  assert.ok(Math.abs(payment - 91855) < 5,
    'Expected ~91855, got ' + Math.round(payment));
});

test('Equal payment calculation with 1000man, 2%, 10yr', function () {
  var principal = 10000000;
  var monthlyRate = 0.02 / 12;
  var totalMonths = 10 * 12;
  var payment = calcEqualPayment(principal, monthlyRate, totalMonths);
  // Expected ~92,013 yen per month
  assert.ok(Math.abs(payment - 92013) < 5,
    'Expected ~92013, got ' + Math.round(payment));
});

test('Zero interest rate returns simple division', function () {
  var principal = 1200000;
  var totalMonths = 12;
  var payment = calcEqualPayment(principal, 0, totalMonths);
  assert.strictEqual(payment, 100000);
});

test('Zero interest rate with different values', function () {
  var principal = 3600000;
  var totalMonths = 36;
  var payment = calcEqualPayment(principal, 0, totalMonths);
  assert.strictEqual(payment, 100000);
});

test('Total payment exceeds principal when interest > 0', function () {
  var principal = 10000000;
  var monthlyRate = 0.03 / 12;
  var totalMonths = 30 * 12;
  var payment = calcEqualPayment(principal, monthlyRate, totalMonths);
  var totalPayment = payment * totalMonths;
  assert.ok(totalPayment > principal,
    'Total payment (' + totalPayment + ') should exceed principal (' + principal + ')');
});

// formatYen tests
test('formatYen uses Math.round', function () {
  var result = formatYen(12345.6);
  assert.ok(result.indexOf('12,346') !== -1 || result.indexOf('12346') !== -1,
    'Expected rounded value 12346 in result: ' + result);
});

test('formatYen rounds down when < 0.5', function () {
  var result = formatYen(12345.4);
  assert.ok(result.indexOf('12,345') !== -1 || result.indexOf('12345') !== -1,
    'Expected rounded value 12345 in result: ' + result);
});

test('formatYen appends yen suffix', function () {
  var result = formatYen(1000);
  assert.ok(result.indexOf('\u5186') !== -1, 'Expected yen character in: ' + result);
});

// formatMan tests
test('formatMan shows man notation for values >= 10000', function () {
  var result = formatMan(50000);
  assert.ok(result.indexOf('\u4e07\u5186') !== -1, 'Expected man-yen in: ' + result);
});

test('formatMan does not show man notation for values < 10000', function () {
  var result = formatMan(5000);
  assert.ok(result.indexOf('\u4e07\u5186') === -1, 'Should not have man-yen in: ' + result);
});

// --- calcLoan (extracted logic for comparison testing) ---
function calcLoan(amountMan, annualRate, years, method) {
  var principal = amountMan * 10000;
  var monthlyRate = annualRate / 100 / 12;
  var totalMonths = years * 12;

  var monthlyPayment, totalPayment, totalInterest;

  if (method === 'equal-payment') {
    monthlyPayment = calcEqualPayment(principal, monthlyRate, totalMonths);
    totalPayment = monthlyPayment * totalMonths;
    totalInterest = totalPayment - principal;
  } else {
    var monthlyPrincipal = principal / totalMonths;
    monthlyPayment = monthlyPrincipal + principal * monthlyRate;
    totalPayment = 0;
    totalInterest = 0;
    var balance = principal;
    for (var y = 1; y <= years; y++) {
      for (var m = 0; m < 12; m++) {
        if (balance <= 0) break;
        var interestPart = balance * monthlyRate;
        var principalPart = monthlyPrincipal;
        if (principalPart > balance) principalPart = balance;
        totalInterest += interestPart;
        totalPayment += principalPart + interestPart;
        balance -= principalPart;
      }
    }
  }

  return {
    monthlyPayment: monthlyPayment,
    totalPayment: totalPayment,
    totalInterest: totalInterest
  };
}

// --- Comparison feature tests ---
console.log('\nComparison feature tests');

test('calcLoan returns correct structure for equal-payment', function () {
  var result = calcLoan(3000, 1.5, 35, 'equal-payment');
  assert.ok(result.monthlyPayment > 0, 'monthlyPayment should be positive');
  assert.ok(result.totalPayment > 0, 'totalPayment should be positive');
  assert.ok(result.totalInterest > 0, 'totalInterest should be positive');
  assert.ok(result.totalPayment > result.totalInterest, 'totalPayment should exceed totalInterest');
});

test('calcLoan returns correct structure for equal-principal', function () {
  var result = calcLoan(3000, 1.5, 35, 'equal-principal');
  assert.ok(result.monthlyPayment > 0, 'monthlyPayment should be positive');
  assert.ok(result.totalPayment > 0, 'totalPayment should be positive');
  assert.ok(result.totalInterest > 0, 'totalInterest should be positive');
});

test('Higher interest rate leads to higher total payment', function () {
  var result1 = calcLoan(3000, 1.0, 35, 'equal-payment');
  var result2 = calcLoan(3000, 2.0, 35, 'equal-payment');
  assert.ok(result2.totalPayment > result1.totalPayment,
    'Higher rate (' + Math.round(result2.totalPayment) + ') should exceed lower rate (' + Math.round(result1.totalPayment) + ')');
});

test('Higher interest rate leads to higher total interest', function () {
  var result1 = calcLoan(3000, 1.0, 35, 'equal-payment');
  var result2 = calcLoan(3000, 2.0, 35, 'equal-payment');
  assert.ok(result2.totalInterest > result1.totalInterest,
    'Higher rate interest (' + Math.round(result2.totalInterest) + ') should exceed lower rate (' + Math.round(result1.totalInterest) + ')');
});

test('Comparison diff: same conditions yield zero difference', function () {
  var result1 = calcLoan(3000, 1.5, 35, 'equal-payment');
  var result2 = calcLoan(3000, 1.5, 35, 'equal-payment');
  var diff = result2.totalPayment - result1.totalPayment;
  assert.strictEqual(diff, 0, 'Same conditions should have zero diff');
});

test('Comparison diff: lower rate is cheaper (negative diff)', function () {
  var result1 = calcLoan(3000, 2.0, 35, 'equal-payment');
  var result2 = calcLoan(3000, 1.0, 35, 'equal-payment');
  var diff = result2.totalPayment - result1.totalPayment;
  assert.ok(diff < 0, 'Lower rate should produce negative diff: ' + diff);
});

test('Comparison diff: higher rate is more expensive (positive diff)', function () {
  var result1 = calcLoan(3000, 1.0, 35, 'equal-payment');
  var result2 = calcLoan(3000, 2.0, 35, 'equal-payment');
  var diff = result2.totalPayment - result1.totalPayment;
  assert.ok(diff > 0, 'Higher rate should produce positive diff: ' + diff);
});

test('Three conditions comparison: can calculate all three', function () {
  var r1 = calcLoan(3000, 1.0, 35, 'equal-payment');
  var r2 = calcLoan(3000, 1.5, 35, 'equal-payment');
  var r3 = calcLoan(3000, 2.0, 35, 'equal-payment');
  assert.ok(r1.totalPayment < r2.totalPayment, 'r1 < r2');
  assert.ok(r2.totalPayment < r3.totalPayment, 'r2 < r3');
});

test('Equal-principal has lower total interest than equal-payment', function () {
  var ep = calcLoan(3000, 1.5, 35, 'equal-payment');
  var epr = calcLoan(3000, 1.5, 35, 'equal-principal');
  assert.ok(epr.totalInterest < ep.totalInterest,
    'Equal-principal interest (' + Math.round(epr.totalInterest) + ') should be less than equal-payment (' + Math.round(ep.totalInterest) + ')');
});

test('Shorter loan period leads to less total interest', function () {
  var long = calcLoan(3000, 1.5, 35, 'equal-payment');
  var short = calcLoan(3000, 1.5, 20, 'equal-payment');
  assert.ok(short.totalInterest < long.totalInterest,
    '20yr interest (' + Math.round(short.totalInterest) + ') should be less than 35yr (' + Math.round(long.totalInterest) + ')');
});

test('Shorter loan period leads to higher monthly payment', function () {
  var long = calcLoan(3000, 1.5, 35, 'equal-payment');
  var short = calcLoan(3000, 1.5, 20, 'equal-payment');
  assert.ok(short.monthlyPayment > long.monthlyPayment,
    '20yr monthly (' + Math.round(short.monthlyPayment) + ') should exceed 35yr (' + Math.round(long.monthlyPayment) + ')');
});

module.exports = { passed: passed, failed: failed };
