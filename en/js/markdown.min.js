document.addEventListener('DOMContentLoaded', function () {
  var mdInput = document.getElementById('md-input');
  var mdPreview = document.getElementById('md-preview');
  var copyHtmlBtn = document.getElementById('copy-html-btn');
  var resetBtn = document.getElementById('reset-btn');

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
      return '<img src="' + safe + '" alt="' + alt + '" style="max-width:100%;">';
    });
    // Links
    text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, function (m, label, url) {
      var safe = sanitizeUrl(url);
      if (!safe) return m;
      return '<a href="' + safe + '" target="_blank" rel="noopener">' + label + '</a>';
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

  function parseMarkdown(md) {
    var lines = md.split('\n');
    var html = '';
    var i = 0;
    var inCodeBlock = false;
    var codeContent = '';
    var inBlockquote = false;
    var blockquoteContent = '';

    while (i < lines.length) {
      var line = lines[i];

      // Code blocks
      if (line.trim().indexOf('```') === 0) {
        if (inCodeBlock) {
          html += '<pre style="background:var(--color-bg-secondary);padding:16px;border-radius:6px;overflow-x:auto;font-family:var(--font-mono);font-size:0.9em;line-height:1.5;"><code>' + escapeHtml(codeContent.replace(/\n$/, '')) + '</code></pre>';
          codeContent = '';
          inCodeBlock = false;
        } else {
          inCodeBlock = true;
        }
        i++;
        continue;
      }

      if (inCodeBlock) {
        codeContent += line + '\n';
        i++;
        continue;
      }

      // Blockquotes
      if (line.trim().indexOf('> ') === 0 || line.trim() === '>') {
        if (!inBlockquote) {
          inBlockquote = true;
          blockquoteContent = '';
        }
        blockquoteContent += line.trim().replace(/^>\s?/, '') + '\n';
        i++;
        continue;
      } else if (inBlockquote) {
        html += '<blockquote style="border-left:4px solid var(--color-primary);padding:8px 16px;margin:8px 0;color:var(--color-text-secondary);background:var(--color-bg-secondary);border-radius:0 6px 6px 0;">' + parseInline(escapeHtml(blockquoteContent.trim())) + '</blockquote>';
        blockquoteContent = '';
        inBlockquote = false;
      }

      // Horizontal rule
      if (/^(-{3,}|\*{3,}|_{3,})$/.test(line.trim())) {
        html += '<hr style="border:none;border-top:2px solid var(--color-border);margin:16px 0;">';
        i++;
        continue;
      }

      // Headings
      var headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
      if (headingMatch) {
        var level = headingMatch[1].length;
        html += '<h' + level + ' style="margin:16px 0 8px;">' + parseInline(escapeHtml(headingMatch[2])) + '</h' + level + '>';
        i++;
        continue;
      }

      // Tables
      if (line.indexOf('|') !== -1 && i + 1 < lines.length && /^\|?[\s-:|]+\|?$/.test(lines[i + 1].trim())) {
        var tableHtml = '<table style="width:100%;border-collapse:collapse;margin:8px 0;">';
        // Header row
        var headerCells = line.split('|').filter(function (c) { return c.trim() !== ''; });
        tableHtml += '<thead><tr>';
        for (var h = 0; h < headerCells.length; h++) {
          tableHtml += '<th style="border:1px solid var(--color-border);padding:8px;background:var(--color-bg-secondary);text-align:left;">' + parseInline(escapeHtml(headerCells[h].trim())) + '</th>';
        }
        tableHtml += '</tr></thead><tbody>';
        i += 2; // Skip header and separator
        while (i < lines.length && lines[i].indexOf('|') !== -1) {
          var cells = lines[i].split('|').filter(function (c) { return c.trim() !== ''; });
          tableHtml += '<tr>';
          for (var c = 0; c < cells.length; c++) {
            tableHtml += '<td style="border:1px solid var(--color-border);padding:8px;">' + parseInline(escapeHtml(cells[c].trim())) + '</td>';
          }
          tableHtml += '</tr>';
          i++;
        }
        tableHtml += '</tbody></table>';
        html += tableHtml;
        continue;
      }

      // Unordered list
      if (/^[\s]*[-*+]\s+/.test(line)) {
        html += '<ul style="list-style:disc;padding-left:1.5em;margin:8px 0;">';
        while (i < lines.length && /^[\s]*[-*+]\s+/.test(lines[i])) {
          var listItem = lines[i].replace(/^[\s]*[-*+]\s+/, '');
          html += '<li>' + parseInline(escapeHtml(listItem)) + '</li>';
          i++;
        }
        html += '</ul>';
        continue;
      }

      // Ordered list
      if (/^[\s]*\d+\.\s+/.test(line)) {
        html += '<ol style="list-style:decimal;padding-left:1.5em;margin:8px 0;">';
        while (i < lines.length && /^[\s]*\d+\.\s+/.test(lines[i])) {
          var olItem = lines[i].replace(/^[\s]*\d+\.\s+/, '');
          html += '<li>' + parseInline(escapeHtml(olItem)) + '</li>';
          i++;
        }
        html += '</ol>';
        continue;
      }

      // Empty line
      if (line.trim() === '') {
        i++;
        continue;
      }

      // Paragraph
      html += '<p style="margin:8px 0;">' + parseInline(escapeHtml(line)) + '</p>';
      i++;
    }

    // Close any remaining blocks
    if (inCodeBlock) {
      html += '<pre style="background:var(--color-bg-secondary);padding:16px;border-radius:6px;overflow-x:auto;font-family:var(--font-mono);font-size:0.9em;line-height:1.5;"><code>' + escapeHtml(codeContent.replace(/\n$/, '')) + '</code></pre>';
    }
    if (inBlockquote) {
      html += '<blockquote style="border-left:4px solid var(--color-primary);padding:8px 16px;margin:8px 0;color:var(--color-text-secondary);background:var(--color-bg-secondary);border-radius:0 6px 6px 0;">' + parseInline(escapeHtml(blockquoteContent.trim())) + '</blockquote>';
    }

    return html;
  }

  function updatePreview() {
    var md = mdInput.value;
    mdPreview.innerHTML = parseMarkdown(md);
  }

  mdInput.addEventListener('input', updatePreview);

  copyHtmlBtn.addEventListener('click', function () {
    var html = mdPreview.innerHTML;
    if (!html.trim()) {
      alert('プレビューが空です。マークダウンを入力してください。');
      return;
    }
    CalcBox.copy.copyText(html);
  });

  resetBtn.addEventListener('click', function () {
    mdInput.value = '';
    mdPreview.innerHTML = '';
  });
});
