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

module.exports = { passed: passed, failed: failed };
