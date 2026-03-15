function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function sanitizeUrl(url: string): string {
  url = url.trim();
  if (/^(https?:\/\/|\/|\.\/|\.\.\/)/.test(url)) return url.replace(/"/g, '&quot;');
  return '';
}

function parseInline(text: string): string {
  text = text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_, alt, url) => {
    const safe = sanitizeUrl(url);
    return safe ? `<img src="${safe}" alt="${escapeHtml(alt)}" style="max-width:100%;">` : _;
  });
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, url) => {
    const safe = sanitizeUrl(url);
    return safe ? `<a href="${safe}" target="_blank" rel="noopener">${escapeHtml(label)}</a>` : _;
  });
  text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  text = text.replace(/__(.+?)__/g, '<strong>$1</strong>');
  text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');
  text = text.replace(/_(.+?)_/g, '<em>$1</em>');
  text = text.replace(/`([^`]+)`/g, '<code style="background:#f3f4f6;padding:2px 6px;border-radius:3px;font-size:0.9em;">$1</code>');
  text = text.replace(/~~(.+?)~~/g, '<del>$1</del>');
  return text;
}

export function parseMarkdown(md: string): string {
  const lines = md.split('\n');
  let html = '';
  let i = 0;
  let inCodeBlock = false;
  let codeContent = '';

  while (i < lines.length) {
    const line = lines[i];

    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        html += `<pre style="background:#f3f4f6;padding:16px;border-radius:6px;overflow-x:auto;font-size:0.9em;line-height:1.5;"><code>${escapeHtml(codeContent.replace(/\n$/, ''))}</code></pre>`;
        codeContent = '';
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
      }
      i++; continue;
    }
    if (inCodeBlock) { codeContent += line + '\n'; i++; continue; }

    if (/^(-{3,}|\*{3,}|_{3,})$/.test(line.trim())) {
      html += '<hr style="border:none;border-top:2px solid #e5e7eb;margin:16px 0;">'; i++; continue;
    }

    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      html += `<h${level} style="margin:16px 0 8px;">${parseInline(escapeHtml(headingMatch[2]))}</h${level}>`; i++; continue;
    }

    if (/^[\s]*[-*+]\s+/.test(line)) {
      html += '<ul style="list-style:disc;padding-left:1.5em;margin:8px 0;">';
      while (i < lines.length && /^[\s]*[-*+]\s+/.test(lines[i])) {
        html += `<li>${parseInline(escapeHtml(lines[i].replace(/^[\s]*[-*+]\s+/, '')))}</li>`; i++;
      }
      html += '</ul>'; continue;
    }

    if (/^[\s]*\d+\.\s+/.test(line)) {
      html += '<ol style="list-style:decimal;padding-left:1.5em;margin:8px 0;">';
      while (i < lines.length && /^[\s]*\d+\.\s+/.test(lines[i])) {
        html += `<li>${parseInline(escapeHtml(lines[i].replace(/^[\s]*\d+\.\s+/, '')))}</li>`; i++;
      }
      html += '</ol>'; continue;
    }

    if (line.trim() === '') { i++; continue; }
    html += `<p style="margin:8px 0;">${parseInline(escapeHtml(line))}</p>`; i++;
  }

  if (inCodeBlock) {
    html += `<pre style="background:#f3f4f6;padding:16px;border-radius:6px;overflow-x:auto;font-size:0.9em;"><code>${escapeHtml(codeContent.replace(/\n$/, ''))}</code></pre>`;
  }

  return html;
}
