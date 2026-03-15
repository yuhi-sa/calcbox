'use strict';

var assert = require('assert');

// Extract pure functions from js/markdown.js for testing

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function sanitizeUrl(url) {
  url = url.trim();
  if (/^(https?:\/\/|\/|\.\/|\.\.\/)/.test(url)) {
    return url.replace(/"/g, '&quot;');
  }
  return '';
}

function parseInline(text) {
  // Images (before links to avoid conflict)
  text = text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, function (m, alt, url) {
    var safe = sanitizeUrl(url);
    if (!safe) return m;
    return '<img src="' + safe + '" alt="' + escapeHtml(alt) + '" style="max-width:100%;">';
  });
  // Links
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, function (m, label, url) {
    var safe = sanitizeUrl(url);
    if (!safe) return m;
    return '<a href="' + safe + '" target="_blank" rel="noopener">' + escapeHtml(label) + '</a>';
  });
  // Bold
  text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  text = text.replace(/__(.+?)__/g, '<strong>$1</strong>');
  // Italic
  text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');
  text = text.replace(/_(.+?)_/g, '<em>$1</em>');
  // Inline code
  text = text.replace(/`([^`]+)`/g, '<code style="background:var(--color-bg-secondary);padding:2px 6px;border-radius:3px;font-family:var(--font-mono);font-size:0.9em;">$1</code>');
  // Strikethrough
  text = text.replace(/~~(.+?)~~/g, '<del>$1</del>');
  return text;
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

console.log('test_markdown.js');

// sanitizeUrl tests
test('sanitizeUrl blocks javascript: protocol', function () {
  assert.strictEqual(sanitizeUrl('javascript:alert(1)'), '');
});

test('sanitizeUrl blocks javascript: with spaces', function () {
  assert.strictEqual(sanitizeUrl('  javascript:alert(1)'), '');
});

test('sanitizeUrl blocks data: protocol', function () {
  assert.strictEqual(sanitizeUrl('data:text/html,<script>alert(1)</script>'), '');
});

test('sanitizeUrl allows https:// URLs', function () {
  assert.strictEqual(sanitizeUrl('https://example.com'), 'https://example.com');
});

test('sanitizeUrl allows http:// URLs', function () {
  assert.strictEqual(sanitizeUrl('http://example.com'), 'http://example.com');
});

test('sanitizeUrl allows relative URLs starting with /', function () {
  assert.strictEqual(sanitizeUrl('/path/to/page'), '/path/to/page');
});

test('sanitizeUrl allows relative URLs starting with ./', function () {
  assert.strictEqual(sanitizeUrl('./image.png'), './image.png');
});

test('sanitizeUrl allows relative URLs starting with ../', function () {
  assert.strictEqual(sanitizeUrl('../image.png'), '../image.png');
});

test('sanitizeUrl escapes double quotes in URL', function () {
  assert.strictEqual(sanitizeUrl('https://example.com/"test"'), 'https://example.com/&quot;test&quot;');
});

// escapeHtml tests
test('escapeHtml escapes < and >', function () {
  assert.strictEqual(escapeHtml('<script>'), '&lt;script&gt;');
});

test('escapeHtml escapes &', function () {
  assert.strictEqual(escapeHtml('a & b'), 'a &amp; b');
});

test('escapeHtml escapes double quotes', function () {
  assert.strictEqual(escapeHtml('"hello"'), '&quot;hello&quot;');
});

test('escapeHtml escapes all special chars together', function () {
  assert.strictEqual(escapeHtml('<a href="x">&'), '&lt;a href=&quot;x&quot;&gt;&amp;');
});

// parseInline tests
test('parseInline handles bold with **', function () {
  assert.ok(parseInline('**bold**').indexOf('<strong>bold</strong>') !== -1);
});

test('parseInline handles italic with *', function () {
  assert.ok(parseInline('*italic*').indexOf('<em>italic</em>') !== -1);
});

test('parseInline handles inline code', function () {
  var result = parseInline('`code`');
  assert.ok(result.indexOf('<code') !== -1);
  assert.ok(result.indexOf('code</code>') !== -1);
});

test('parseInline handles links', function () {
  var result = parseInline('[click](https://example.com)');
  assert.ok(result.indexOf('href="https://example.com"') !== -1);
  assert.ok(result.indexOf('>click</a>') !== -1);
});

test('parseInline rejects link with javascript: URL', function () {
  var result = parseInline('[click](javascript:alert(1))');
  assert.ok(result.indexOf('href=') === -1);
  // Original markdown text should remain unchanged
  assert.ok(result.indexOf('[click](javascript:alert(1))') !== -1);
});

test('parseInline handles images', function () {
  var result = parseInline('![alt text](https://example.com/img.png)');
  assert.ok(result.indexOf('<img') !== -1);
  assert.ok(result.indexOf('src="https://example.com/img.png"') !== -1);
  assert.ok(result.indexOf('alt="alt text"') !== -1);
});

test('XSS attempt in image alt attribute is escaped', function () {
  var result = parseInline('![<script>alert(1)</script>](https://example.com/img.png)');
  assert.ok(result.indexOf('<script>') === -1);
  assert.ok(result.indexOf('&lt;script&gt;') !== -1);
});

test('parseInline handles strikethrough', function () {
  assert.ok(parseInline('~~deleted~~').indexOf('<del>deleted</del>') !== -1);
});

module.exports = { passed: passed, failed: failed };
