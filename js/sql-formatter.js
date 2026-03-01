document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  var sqlInput = document.getElementById('sql-input');
  var formatBtn = document.getElementById('format-btn');
  var minifyBtn = document.getElementById('minify-btn');
  var copyBtn = document.getElementById('copy-btn');
  var errorMsg = document.getElementById('error-msg');
  var resultSection = document.getElementById('result');
  var resultInfo = document.getElementById('result-info');
  var sqlOutput = document.getElementById('sql-output');

  var KEYWORDS = [
    'SELECT', 'DISTINCT', 'FROM', 'WHERE', 'AND', 'OR', 'NOT',
    'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE',
    'CREATE', 'TABLE', 'ALTER', 'DROP', 'INDEX', 'VIEW',
    'JOIN', 'INNER', 'LEFT', 'RIGHT', 'OUTER', 'FULL', 'CROSS', 'ON',
    'ORDER', 'BY', 'ASC', 'DESC', 'GROUP', 'HAVING',
    'LIMIT', 'OFFSET', 'UNION', 'ALL', 'EXCEPT', 'INTERSECT',
    'AS', 'IN', 'BETWEEN', 'LIKE', 'IS', 'NULL', 'EXISTS',
    'CASE', 'WHEN', 'THEN', 'ELSE', 'END',
    'COUNT', 'SUM', 'AVG', 'MIN', 'MAX',
    'PRIMARY', 'KEY', 'FOREIGN', 'REFERENCES', 'CONSTRAINT',
    'DEFAULT', 'CHECK', 'UNIQUE', 'NOT NULL',
    'IF', 'CASCADE', 'TRUNCATE', 'REPLACE', 'MERGE',
    'TOP', 'FETCH', 'NEXT', 'ROWS', 'ONLY', 'WITH', 'RECURSIVE'
  ];

  var NEWLINE_BEFORE = [
    'SELECT', 'FROM', 'WHERE', 'AND', 'OR',
    'ORDER BY', 'GROUP BY', 'HAVING', 'LIMIT', 'OFFSET',
    'INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL JOIN', 'CROSS JOIN', 'JOIN',
    'LEFT OUTER JOIN', 'RIGHT OUTER JOIN', 'FULL OUTER JOIN',
    'UNION', 'UNION ALL', 'EXCEPT', 'INTERSECT',
    'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM',
    'CREATE TABLE', 'ALTER TABLE', 'DROP TABLE',
    'ON', 'WHEN', 'ELSE', 'END', 'THEN'
  ];

  var INDENT_AFTER = ['SELECT', 'SET', 'VALUES'];

  function hideError() {
    errorMsg.hidden = true;
    errorMsg.textContent = '';
  }

  function showError(msg) {
    errorMsg.textContent = msg;
    errorMsg.hidden = false;
    resultSection.hidden = true;
  }

  function uppercaseKeywords(sql) {
    var sortedKeywords = KEYWORDS.slice().sort(function (a, b) { return b.length - a.length; });
    var tokens = tokenize(sql);
    return tokens.map(function (token) {
      if (token.type === 'word') {
        var upper = token.value.toUpperCase();
        for (var i = 0; i < sortedKeywords.length; i++) {
          if (upper === sortedKeywords[i]) {
            return { type: 'keyword', value: upper };
          }
        }
      }
      return token;
    });
  }

  function tokenize(sql) {
    var tokens = [];
    var i = 0;
    while (i < sql.length) {
      // Skip whitespace
      if (/\s/.test(sql[i])) {
        var ws = '';
        while (i < sql.length && /\s/.test(sql[i])) {
          ws += sql[i];
          i++;
        }
        tokens.push({ type: 'whitespace', value: ws });
        continue;
      }
      // String literal
      if (sql[i] === "'" || sql[i] === '"') {
        var quote = sql[i];
        var str = quote;
        i++;
        while (i < sql.length) {
          if (sql[i] === quote) {
            str += sql[i];
            i++;
            if (i < sql.length && sql[i] === quote) {
              str += sql[i];
              i++;
            } else {
              break;
            }
          } else {
            str += sql[i];
            i++;
          }
        }
        tokens.push({ type: 'string', value: str });
        continue;
      }
      // Parentheses and operators
      if ('(),;'.indexOf(sql[i]) !== -1) {
        tokens.push({ type: 'punctuation', value: sql[i] });
        i++;
        continue;
      }
      // Operators
      if ('<>=!'.indexOf(sql[i]) !== -1) {
        var op = sql[i];
        i++;
        if (i < sql.length && '=<>'.indexOf(sql[i]) !== -1) {
          op += sql[i];
          i++;
        }
        tokens.push({ type: 'operator', value: op });
        continue;
      }
      // Dot, asterisk, etc.
      if (sql[i] === '.' || sql[i] === '*' || sql[i] === '+' || sql[i] === '-' || sql[i] === '/') {
        tokens.push({ type: 'operator', value: sql[i] });
        i++;
        continue;
      }
      // Word (identifier or keyword)
      if (/[a-zA-Z_]/.test(sql[i])) {
        var word = '';
        while (i < sql.length && /[a-zA-Z0-9_]/.test(sql[i])) {
          word += sql[i];
          i++;
        }
        tokens.push({ type: 'word', value: word });
        continue;
      }
      // Number
      if (/[0-9]/.test(sql[i])) {
        var num = '';
        while (i < sql.length && /[0-9.]/.test(sql[i])) {
          num += sql[i];
          i++;
        }
        tokens.push({ type: 'number', value: num });
        continue;
      }
      // Other
      tokens.push({ type: 'other', value: sql[i] });
      i++;
    }
    return tokens;
  }

  function formatSql(sql) {
    var tokens = uppercaseKeywords(sql);
    // Remove whitespace tokens and rebuild
    var nonWs = tokens.filter(function (t) { return t.type !== 'whitespace'; });

    var result = '';
    var indent = 0;
    var newlineBefore = false;

    for (var i = 0; i < nonWs.length; i++) {
      var token = nonWs[i];
      var val = token.value;

      // Check for compound keywords
      var compound = '';
      if (i + 1 < nonWs.length) {
        compound = val + ' ' + nonWs[i + 1].value;
      }

      var isNewlineBefore = false;
      var isCompound = false;

      for (var n = 0; n < NEWLINE_BEFORE.length; n++) {
        if (compound === NEWLINE_BEFORE[n]) {
          isNewlineBefore = true;
          isCompound = true;
          break;
        }
        if (val === NEWLINE_BEFORE[n]) {
          isNewlineBefore = true;
          break;
        }
      }

      if (isNewlineBefore && i > 0) {
        // Dedent for major clauses
        if (['SELECT', 'FROM', 'WHERE', 'ORDER BY', 'GROUP BY', 'HAVING',
             'LIMIT', 'UNION', 'UNION ALL', 'EXCEPT', 'INTERSECT',
             'INSERT INTO', 'UPDATE', 'DELETE FROM', 'CREATE TABLE',
             'ALTER TABLE', 'DROP TABLE', 'VALUES'].indexOf(isCompound ? compound : val) !== -1) {
          indent = 0;
        }
        result += '\n' + repeat('  ', indent);
      } else if (i > 0 && token.type !== 'punctuation' && nonWs[i - 1].type !== 'punctuation') {
        if (nonWs[i - 1].value !== '(' && val !== ')') {
          result += ' ';
        }
      }

      if (val === '(') {
        result += val;
      } else if (val === ')') {
        result += val;
      } else if (val === ',') {
        result += val + '\n' + repeat('  ', indent);
      } else if (val === ';') {
        result += val + '\n';
        indent = 0;
      } else {
        if (isCompound) {
          result += compound;
          i++;
        } else {
          result += val;
        }
      }

      var checkVal = isCompound ? compound : val;
      for (var a = 0; a < INDENT_AFTER.length; a++) {
        if (checkVal === INDENT_AFTER[a]) {
          indent = 1;
          break;
        }
      }
    }

    return result.trim();
  }

  function minifySql(sql) {
    var tokens = tokenize(sql);
    var result = '';
    var prevNonWs = null;
    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i];
      if (token.type === 'whitespace') {
        if (prevNonWs && prevNonWs.type === 'word' || prevNonWs && prevNonWs.type === 'number' || prevNonWs && prevNonWs.type === 'keyword') {
          // Look ahead
          var next = null;
          for (var j = i + 1; j < tokens.length; j++) {
            if (tokens[j].type !== 'whitespace') {
              next = tokens[j];
              break;
            }
          }
          if (next && (next.type === 'word' || next.type === 'number' || next.type === 'keyword' || next.type === 'string')) {
            result += ' ';
          }
        }
        continue;
      }
      result += token.value;
      prevNonWs = token;
    }
    return result.trim();
  }

  function repeat(str, count) {
    var result = '';
    for (var i = 0; i < count; i++) {
      result += str;
    }
    return result;
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  function highlightKeywords(formatted) {
    var lines = formatted.split('\n');
    var highlighted = lines.map(function (line) {
      var tokens = tokenize(line);
      return tokens.map(function (token) {
        if (token.type === 'word') {
          var upper = token.value.toUpperCase();
          for (var i = 0; i < KEYWORDS.length; i++) {
            if (upper === KEYWORDS[i] && token.value === upper) {
              return '<span style="color:var(--color-primary);font-weight:bold;">' + escapeHtml(token.value) + '</span>';
            }
          }
        }
        return escapeHtml(token.value);
      }).join('');
    });
    return highlighted.join('\n');
  }

  // Store plain text for copy
  var plainResult = '';

  formatBtn.addEventListener('click', function () {
    hideError();
    var raw = sqlInput.value.trim();
    if (!raw) {
      showError('SQL文を入力してください。');
      return;
    }
    var formatted = formatSql(raw);
    plainResult = formatted;
    sqlOutput.innerHTML = highlightKeywords(formatted);
    resultInfo.textContent = '整形済み';
    resultSection.hidden = false;
    resultSection.scrollIntoView({ behavior: 'smooth' });
  });

  minifyBtn.addEventListener('click', function () {
    hideError();
    var raw = sqlInput.value.trim();
    if (!raw) {
      showError('SQL文を入力してください。');
      return;
    }
    var minified = minifySql(raw);
    plainResult = minified;
    sqlOutput.innerHTML = highlightKeywords(minified);
    resultInfo.textContent = '圧縮済み';
    resultSection.hidden = false;
    resultSection.scrollIntoView({ behavior: 'smooth' });
  });

  copyBtn.addEventListener('click', function () {
    if (!plainResult) return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(plainResult).then(function () {
        var original = copyBtn.textContent;
        copyBtn.textContent = 'コピー済み';
        setTimeout(function () {
          copyBtn.textContent = original;
        }, 1500);
      });
    }
  });
});
