document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  var searchInput = document.getElementById('search-input');
  var categoryFilters = document.getElementById('category-filters');
  var statusList = document.getElementById('status-list');
  var noResults = document.getElementById('no-results');

  var currentCategory = 'all';

  var STATUS_CODES = [
    { code: 100, name: 'Continue', desc: 'Indicates the initial part of the request has been received and has not been rejected. The client should continue sending the rest of the request.' },
    { code: 101, name: 'Switching Protocols', desc: 'Indicates the server is switching protocols as requested by the client. Used during WebSocket upgrades.' },
    { code: 102, name: 'Processing', desc: 'Indicates the server has received the request and is processing it, but no response is available yet (WebDAV).' },
    { code: 103, name: 'Early Hints', desc: 'Used to return some response headers before the final response. Useful for preloading resources.' },
    { code: 200, name: 'OK', desc: 'Indicates the request was successful. For GET requests, the resource is returned; for POST, the result of the action is returned.' },
    { code: 201, name: 'Created', desc: 'Indicates the request was successful and a new resource was created. Typically returned after POST or PUT requests.' },
    { code: 202, name: 'Accepted', desc: 'Indicates the request was accepted but processing has not yet completed. Used for asynchronous operations.' },
    { code: 203, name: 'Non-Authoritative Information', desc: 'The request was successful, but the returned meta-information is from a local or third-party copy, not the origin server.' },
    { code: 204, name: 'No Content', desc: 'The request was successful, but there is no content to return. Often used after successful DELETE requests.' },
    { code: 205, name: 'Reset Content', desc: 'The request was successful and instructs the client to reset the document view. Used for clearing form inputs.' },
    { code: 206, name: 'Partial Content', desc: 'Only part of the resource is returned as requested by the Range header. Used for resumable downloads.' },
    { code: 207, name: 'Multi-Status', desc: 'Used to return results for multiple resource operations at once (WebDAV).' },
    { code: 208, name: 'Already Reported', desc: 'Indicates DAV binding members have already been enumerated in a previous part and need not be included again (WebDAV).' },
    { code: 226, name: 'IM Used', desc: 'The server has fulfilled a GET request and the response represents the result of instance-manipulations applied to the current instance.' },
    { code: 300, name: 'Multiple Choices', desc: 'Indicates the requested resource has multiple choices. The user or user agent can select one.' },
    { code: 301, name: 'Moved Permanently', desc: 'The requested resource has been permanently moved to a new URL. Future requests should use the new URL. Link equity is passed in SEO.' },
    { code: 302, name: 'Found', desc: 'The requested resource temporarily resides at a different URL. The original URL should continue to be used.' },
    { code: 303, name: 'See Other', desc: 'The response can be retrieved from a different URL. Used for POST-to-GET redirects (PRG pattern).' },
    { code: 304, name: 'Not Modified', desc: 'The resource has not been modified since the last request. The cached version can be used.' },
    { code: 307, name: 'Temporary Redirect', desc: 'A temporary redirect. Unlike 302, the request method must not be changed when following the redirect.' },
    { code: 308, name: 'Permanent Redirect', desc: 'A permanent redirect. Unlike 301, the request method must not be changed when following the redirect.' },
    { code: 400, name: 'Bad Request', desc: 'The client request has a syntax error or is malformed. Often caused by invalid parameters.' },
    { code: 401, name: 'Unauthorized', desc: 'Authentication is required. The resource can be accessed by providing valid credentials.' },
    { code: 402, name: 'Payment Required', desc: 'Reserved for future use. Sometimes used for digital content or APIs that require payment.' },
    { code: 403, name: 'Forbidden', desc: 'The server understood the request but refused access. Returned when the user lacks sufficient permissions.' },
    { code: 404, name: 'Not Found', desc: 'The requested resource does not exist on the server. Caused by incorrect URLs or deleted pages.' },
    { code: 405, name: 'Method Not Allowed', desc: 'The HTTP method used in the request is not allowed for the target resource.' },
    { code: 406, name: 'Not Acceptable', desc: 'The server cannot generate appropriate content based on the Accept headers in the request.' },
    { code: 407, name: 'Proxy Authentication Required', desc: 'Authentication with the proxy server is required. Similar to 401 but for proxy authentication.' },
    { code: 408, name: 'Request Timeout', desc: 'The server timed out waiting for the client request.' },
    { code: 409, name: 'Conflict', desc: 'The request conflicts with the current state of the server. Often caused by concurrent update conflicts.' },
    { code: 410, name: 'Gone', desc: 'The requested resource is permanently unavailable. Unlike 404, it explicitly indicates the resource will never be available again.' },
    { code: 411, name: 'Length Required', desc: 'The Content-Length header is required but was not included in the request.' },
    { code: 412, name: 'Precondition Failed', desc: 'A precondition in the request headers (e.g. If-Match) was not met by the server.' },
    { code: 413, name: 'Content Too Large', desc: 'The request body exceeds the size the server can process. Often caused by file upload limits.' },
    { code: 414, name: 'URI Too Long', desc: 'The request URI exceeds the length the server can process.' },
    { code: 415, name: 'Unsupported Media Type', desc: 'The media type (Content-Type) of the request is not supported by the server.' },
    { code: 416, name: 'Range Not Satisfiable', desc: 'The range specified in the Range header exceeds the size of the resource.' },
    { code: 417, name: 'Expectation Failed', desc: 'The server cannot meet the expectation specified in the Expect header.' },
    { code: 418, name: "I'm a Teapot", desc: 'A joke status code defined in RFC 2324. It means "I am a teapot" and represents a teapot refusing to brew coffee.' },
    { code: 421, name: 'Misdirected Request', desc: 'The request was directed to a server that cannot produce a response.' },
    { code: 422, name: 'Unprocessable Content', desc: 'The request syntax is correct, but the contained data cannot be processed by the server. Used for validation errors.' },
    { code: 423, name: 'Locked', desc: 'The resource is locked and cannot be accessed (WebDAV).' },
    { code: 424, name: 'Failed Dependency', desc: 'The request failed because a previous dependent request failed (WebDAV).' },
    { code: 425, name: 'Too Early', desc: 'The server refused to process a request that might be replayed (replay attack prevention).' },
    { code: 426, name: 'Upgrade Required', desc: 'The client needs to upgrade to a different protocol.' },
    { code: 428, name: 'Precondition Required', desc: 'The server requires conditional headers (e.g. If-Match) in the request.' },
    { code: 429, name: 'Too Many Requests', desc: 'The client has sent too many requests in a given time period (rate limiting).' },
    { code: 431, name: 'Request Header Fields Too Large', desc: 'The request header fields are too large.' },
    { code: 451, name: 'Unavailable For Legal Reasons', desc: 'The resource cannot be provided for legal reasons. Used for censorship or copyright issues.' },
    { code: 500, name: 'Internal Server Error', desc: 'A generic error code indicating an error occurred on the server. Returned when there are problems with server-side programs or systems.' },
    { code: 501, name: 'Not Implemented', desc: 'The request method is not supported by the server.' },
    { code: 502, name: 'Bad Gateway', desc: 'A server acting as a gateway or proxy received an invalid response from the upstream server.' },
    { code: 503, name: 'Service Unavailable', desc: 'The server is temporarily unable to handle the request. Caused by maintenance or overload.' },
    { code: 504, name: 'Gateway Timeout', desc: 'A server acting as a gateway or proxy did not receive a timely response from the upstream server.' },
    { code: 505, name: 'HTTP Version Not Supported', desc: 'The HTTP version used in the request is not supported by the server.' },
    { code: 506, name: 'Variant Also Negotiates', desc: 'An internal server configuration error where transparent content negotiation results in a circular reference.' },
    { code: 507, name: 'Insufficient Storage', desc: 'The server lacks sufficient storage to process the request (WebDAV).' },
    { code: 508, name: 'Loop Detected', desc: 'The server detected an infinite loop while processing the request (WebDAV).' },
    { code: 510, name: 'Not Extended', desc: 'Further extensions to the server are required to fulfill the request.' },
    { code: 511, name: 'Network Authentication Required', desc: 'Authentication is required to access the network. Used by captive portals (e.g. public Wi-Fi login pages).' }
  ];

  var categoryColors = {
    '1': '#2196F3',
    '2': '#4CAF50',
    '3': '#FF9800',
    '4': '#f44336',
    '5': '#9C27B0'
  };

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  function render() {
    var query = searchInput.value.trim().toLowerCase();
    var filtered = STATUS_CODES.filter(function (item) {
      var categoryMatch = currentCategory === 'all' || String(item.code)[0] === currentCategory;
      if (!categoryMatch) return false;
      if (!query) return true;
      return String(item.code).indexOf(query) !== -1 ||
             item.name.toLowerCase().indexOf(query) !== -1 ||
             item.desc.toLowerCase().indexOf(query) !== -1;
    });

    if (filtered.length === 0) {
      statusList.innerHTML = '';
      noResults.hidden = false;
      return;
    }

    noResults.hidden = true;
    var html = '';
    filtered.forEach(function (item) {
      var cat = String(item.code)[0];
      var color = categoryColors[cat] || '#666';
      html += '<div class="status-item" style="border:1px solid var(--color-border);border-left:4px solid ' + color + ';border-radius:var(--radius-sm);margin-bottom:var(--space-sm);cursor:pointer;">';
      html += '<div class="status-header" data-code="' + item.code + '" style="padding:12px 16px;display:flex;align-items:center;gap:12px;">';
      html += '<span style="font-family:var(--font-mono);font-weight:bold;font-size:1.1rem;color:' + color + ';min-width:40px;">' + item.code + '</span>';
      html += '<span style="font-weight:600;">' + escapeHtml(item.name) + '</span>';
      html += '<span style="margin-left:auto;color:var(--color-text-secondary);font-size:1.2rem;transition:transform 0.2s;" class="chevron">&#9662;</span>';
      html += '</div>';
      html += '<div class="status-detail" style="display:none;padding:0 16px 12px 68px;color:var(--color-text-secondary);font-size:0.9rem;line-height:1.6;">' + escapeHtml(item.desc) + '</div>';
      html += '</div>';
    });

    statusList.innerHTML = html;

    // Attach toggle handlers
    var headers = statusList.querySelectorAll('.status-header');
    for (var i = 0; i < headers.length; i++) {
      (function (header) {
        header.addEventListener('click', function () {
          var detail = header.nextElementSibling;
          var chevron = header.querySelector('.chevron');
          if (detail.style.display === 'none') {
            detail.style.display = 'block';
            chevron.style.transform = 'rotate(180deg)';
          } else {
            detail.style.display = 'none';
            chevron.style.transform = '';
          }
        });
      })(headers[i]);
    }
  }

  // Category filter buttons
  var filterBtns = categoryFilters.querySelectorAll('button');
  for (var i = 0; i < filterBtns.length; i++) {
    (function (btn) {
      btn.addEventListener('click', function () {
        currentCategory = btn.getAttribute('data-category');
        for (var j = 0; j < filterBtns.length; j++) {
          filterBtns[j].className = filterBtns[j].getAttribute('data-category') === currentCategory ? 'btn btn--primary' : 'btn btn--secondary';
        }
        render();
      });
    })(filterBtns[i]);
  }

  searchInput.addEventListener('input', render);

  // Initial render
  render();
});
