document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  var searchInput = document.getElementById('search-input');
  var categoryFilters = document.getElementById('category-filters');
  var statusList = document.getElementById('status-list');
  var noResults = document.getElementById('no-results');

  var currentCategory = 'all';

  var STATUS_CODES = [
    { code: 100, name: 'Continue', desc: 'リクエストの最初の部分が受信され、まだ拒否されていないことを示します。クライアントはリクエストの残りを送信し続けるべきです。' },
    { code: 101, name: 'Switching Protocols', desc: 'サーバーがクライアントのリクエストに従ってプロトコルを切り替えることを示します。WebSocketへのアップグレード時などに使われます。' },
    { code: 102, name: 'Processing', desc: 'サーバーがリクエストを受け取り処理中ですが、まだレスポンスが利用できないことを示します（WebDAV）。' },
    { code: 103, name: 'Early Hints', desc: '最終的なレスポンスに先立って、一部のレスポンスヘッダーを返すために使われます。リソースのプリロードに活用されます。' },
    { code: 200, name: 'OK', desc: 'リクエストが成功したことを示します。GETリクエストではリソースが返され、POSTではアクションの結果が返されます。' },
    { code: 201, name: 'Created', desc: 'リクエストが成功し、新しいリソースが作成されたことを示します。POSTやPUTリクエストの後に返されます。' },
    { code: 202, name: 'Accepted', desc: 'リクエストが受理されましたが、まだ処理が完了していないことを示します。非同期処理で使われます。' },
    { code: 203, name: 'Non-Authoritative Information', desc: 'リクエストは成功しましたが、返されたメタ情報がオリジンサーバーのものではなく、ローカルまたはサードパーティのコピーであることを示します。' },
    { code: 204, name: 'No Content', desc: 'リクエストは成功しましたが、返すコンテンツがないことを示します。DELETEリクエストの成功時などに使われます。' },
    { code: 205, name: 'Reset Content', desc: 'リクエストは成功し、クライアントにドキュメントビューをリセットするよう指示します。フォームの入力をクリアする場合に使われます。' },
    { code: 206, name: 'Partial Content', desc: 'Rangeヘッダーによって要求されたリソースの一部のみが返されることを示します。ファイルの分割ダウンロードで使われます。' },
    { code: 207, name: 'Multi-Status', desc: '複数のリソースに対する操作の結果を一度に返す場合に使われます（WebDAV）。' },
    { code: 208, name: 'Already Reported', desc: 'DAVバインディングのメンバーは既に前の部分で列挙されており、再度含める必要がないことを示します（WebDAV）。' },
    { code: 226, name: 'IM Used', desc: 'サーバーがGETリクエストを処理し、レスポンスが現在のインスタンスに適用されたインスタンス操作の結果であることを示します。' },
    { code: 300, name: 'Multiple Choices', desc: 'リクエストされたリソースに複数の選択肢があることを示します。ユーザーまたはユーザーエージェントが選択できます。' },
    { code: 301, name: 'Moved Permanently', desc: 'リクエストされたリソースが恒久的に新しいURLに移動したことを示します。今後は新しいURLを使用すべきです。SEOではリンクジュースが引き継がれます。' },
    { code: 302, name: 'Found', desc: 'リクエストされたリソースが一時的に別のURLに存在することを示します。元のURLを引き続き使用すべきです。' },
    { code: 303, name: 'See Other', desc: 'レスポンスを別のURLで取得できることを示します。POSTの後にGETリダイレクトする場合（PRGパターン）に使われます。' },
    { code: 304, name: 'Not Modified', desc: 'リソースが前回のリクエスト以降変更されていないことを示します。キャッシュされたバージョンを使用できます。' },
    { code: 307, name: 'Temporary Redirect', desc: '一時的なリダイレクトを示します。302と異なり、リクエストメソッドを変更せずにリダイレクト先にアクセスすべきです。' },
    { code: 308, name: 'Permanent Redirect', desc: '恒久的なリダイレクトを示します。301と異なり、リクエストメソッドを変更せずにリダイレクト先にアクセスすべきです。' },
    { code: 400, name: 'Bad Request', desc: 'クライアントのリクエストに構文エラーがある、または不正な形式であることを示します。パラメータの誤りなどが原因です。' },
    { code: 401, name: 'Unauthorized', desc: '認証が必要であることを示します。有効な認証情報を提供することで、リソースにアクセスできます。' },
    { code: 402, name: 'Payment Required', desc: '将来の使用のために予約されているコードです。一部のデジタルコンテンツやAPIで支払いが必要な場合に使われることがあります。' },
    { code: 403, name: 'Forbidden', desc: 'サーバーがリクエストを理解しましたが、アクセスを拒否したことを示します。認証しても権限が不足している場合に返されます。' },
    { code: 404, name: 'Not Found', desc: 'リクエストされたリソースがサーバー上に存在しないことを示します。URLの間違いやページの削除が原因で発生します。' },
    { code: 405, name: 'Method Not Allowed', desc: 'リクエストで使用されたHTTPメソッドが、対象リソースでは許可されていないことを示します。' },
    { code: 406, name: 'Not Acceptable', desc: 'サーバーがリクエストのAcceptヘッダーに基づいて、適切なコンテンツを生成できないことを示します。' },
    { code: 407, name: 'Proxy Authentication Required', desc: 'プロキシサーバーによる認証が必要であることを示します。401と似ていますが、プロキシに対する認証です。' },
    { code: 408, name: 'Request Timeout', desc: 'サーバーがクライアントからのリクエストを待機中にタイムアウトしたことを示します。' },
    { code: 409, name: 'Conflict', desc: 'リクエストがサーバーの現在の状態と競合していることを示します。同時更新の衝突などで発生します。' },
    { code: 410, name: 'Gone', desc: 'リクエストされたリソースが恒久的に利用できなくなったことを示します。404と異なり、二度と利用できないことを明示します。' },
    { code: 411, name: 'Length Required', desc: 'Content-Lengthヘッダーが必要ですが、リクエストに含まれていないことを示します。' },
    { code: 412, name: 'Precondition Failed', desc: 'リクエストの前提条件（If-Match等のヘッダー）がサーバーで満たされなかったことを示します。' },
    { code: 413, name: 'Content Too Large', desc: 'リクエストボディがサーバーの処理可能なサイズを超えていることを示します。ファイルアップロードの上限超過などで発生します。' },
    { code: 414, name: 'URI Too Long', desc: 'リクエストURIがサーバーの処理可能な長さを超えていることを示します。' },
    { code: 415, name: 'Unsupported Media Type', desc: 'リクエストのメディアタイプ（Content-Type）がサーバーでサポートされていないことを示します。' },
    { code: 416, name: 'Range Not Satisfiable', desc: 'Rangeヘッダーで指定された範囲がリソースのサイズを超えていることを示します。' },
    { code: 417, name: 'Expectation Failed', desc: 'Expectヘッダーで指定された期待値をサーバーが満たせないことを示します。' },
    { code: 418, name: "I'm a Teapot", desc: 'ジョークRFC（RFC 2324）で定義されたコードです。「私はティーポットです」という意味で、コーヒーを淹れることを拒否するティーポットを表します。' },
    { code: 421, name: 'Misdirected Request', desc: 'リクエストが、レスポンスを生成できないサーバーに送られたことを示します。' },
    { code: 422, name: 'Unprocessable Content', desc: 'リクエストの構文は正しいですが、含まれるデータがサーバーで処理できないことを示します。バリデーションエラーに使われます。' },
    { code: 423, name: 'Locked', desc: 'リソースがロックされていてアクセスできないことを示します（WebDAV）。' },
    { code: 424, name: 'Failed Dependency', desc: '依存する前のリクエストが失敗したため、このリクエストも失敗したことを示します（WebDAV）。' },
    { code: 425, name: 'Too Early', desc: 'サーバーがリプレイ攻撃の可能性があるリクエストの処理を拒否したことを示します。' },
    { code: 426, name: 'Upgrade Required', desc: 'クライアントが別のプロトコルにアップグレードする必要があることを示します。' },
    { code: 428, name: 'Precondition Required', desc: 'サーバーがリクエストに条件付きヘッダー（If-Match等）を要求していることを示します。' },
    { code: 429, name: 'Too Many Requests', desc: 'クライアントが一定時間内に送信したリクエスト数が多すぎることを示します（レート制限）。' },
    { code: 431, name: 'Request Header Fields Too Large', desc: 'リクエストヘッダーのサイズが大きすぎることを示します。' },
    { code: 451, name: 'Unavailable For Legal Reasons', desc: '法的理由によりリソースを提供できないことを示します。検閲や著作権問題で使われます。' },
    { code: 500, name: 'Internal Server Error', desc: 'サーバー内部でエラーが発生したことを示す汎用的なエラーコードです。サーバー側のプログラムやシステムに問題がある場合に返されます。' },
    { code: 501, name: 'Not Implemented', desc: 'リクエストメソッドがサーバーでサポートされていないことを示します。' },
    { code: 502, name: 'Bad Gateway', desc: 'ゲートウェイまたはプロキシとして動作するサーバーが、上流サーバーから無効なレスポンスを受信したことを示します。' },
    { code: 503, name: 'Service Unavailable', desc: 'サーバーが一時的にリクエストを処理できない状態であることを示します。メンテナンスや過負荷が原因です。' },
    { code: 504, name: 'Gateway Timeout', desc: 'ゲートウェイまたはプロキシとして動作するサーバーが、上流サーバーからのレスポンスを時間内に受信できなかったことを示します。' },
    { code: 505, name: 'HTTP Version Not Supported', desc: 'リクエストで使用されたHTTPバージョンがサーバーでサポートされていないことを示します。' },
    { code: 506, name: 'Variant Also Negotiates', desc: 'サーバーの内部設定エラーにより、透過的コンテンツネゴシエーションが循環参照になっていることを示します。' },
    { code: 507, name: 'Insufficient Storage', desc: 'サーバーのストレージが不足しているため、リクエストを処理できないことを示します（WebDAV）。' },
    { code: 508, name: 'Loop Detected', desc: 'サーバーがリクエストの処理中に無限ループを検出したことを示します（WebDAV）。' },
    { code: 510, name: 'Not Extended', desc: 'リクエストを処理するためにサーバーへの追加の拡張が必要であることを示します。' },
    { code: 511, name: 'Network Authentication Required', desc: 'ネットワークへのアクセスに認証が必要であることを示します。キャプティブポータル（公衆Wi-Fiのログイン画面）で使われます。' }
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
