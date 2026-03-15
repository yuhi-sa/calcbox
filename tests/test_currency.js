'use strict';

var assert = require('assert');

// Extract pure functions and data from js/currency.js for testing

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

console.log('test_currency.js');

// Same currency conversion
test('Conversion between same currency returns same value', function () {
  assert.strictEqual(convert(100, 'USD', 'USD'), 100);
});

test('JPY to JPY returns same value', function () {
  assert.strictEqual(convert(1000, 'JPY', 'JPY'), 1000);
});

// USD to JPY
test('USD to JPY conversion uses correct rate', function () {
  var result = convert(1, 'USD', 'JPY');
  assert.strictEqual(result, 149.50);
});

test('USD to JPY for 100 USD', function () {
  var result = convert(100, 'USD', 'JPY');
  assert.strictEqual(result, 14950);
});

// JPY to USD is inverse
test('JPY to USD conversion is inverse of USD to JPY', function () {
  var result = convert(149.50, 'JPY', 'USD');
  assert.ok(Math.abs(result - 1) < 1e-10, 'Expected ~1, got ' + result);
});

test('Round-trip conversion preserves value', function () {
  var original = 1000;
  var converted = convert(original, 'EUR', 'JPY');
  var backConverted = convert(converted, 'JPY', 'EUR');
  assert.ok(Math.abs(backConverted - original) < 1e-10,
    'Expected ~' + original + ', got ' + backConverted);
});

// Cross-currency conversion
test('EUR to GBP uses correct cross rate', function () {
  // 1 EUR = (1/0.92) USD = (1/0.92) * 0.79 GBP
  var expected = (1 / 0.92) * 0.79;
  var result = convert(1, 'EUR', 'GBP');
  assert.ok(Math.abs(result - expected) < 1e-10,
    'Expected ' + expected + ', got ' + result);
});

// formatNumber tests
test('formatNumber returns 0 decimals for JPY', function () {
  assert.strictEqual(formatNumber(1234.567, 'JPY'), '1235');
});

test('formatNumber returns 0 decimals for KRW', function () {
  assert.strictEqual(formatNumber(1234.567, 'KRW'), '1235');
});

test('formatNumber returns 2 decimals for USD', function () {
  assert.strictEqual(formatNumber(1234.567, 'USD'), '1234.57');
});

test('formatNumber returns 2 decimals for EUR', function () {
  assert.strictEqual(formatNumber(1.5, 'EUR'), '1.50');
});

module.exports = { passed: passed, failed: failed };
