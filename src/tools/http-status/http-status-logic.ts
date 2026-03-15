export interface HttpStatus {
  code: number;
  name: string;
  description: string;
  category: string;
}

export const HTTP_STATUS_CODES: HttpStatus[] = [
  // 1xx Informational
  { code: 100, name: 'Continue', description: 'リクエストの最初の部分が受け取られ、クライアントは残りを送信できる', category: '1xx' },
  { code: 101, name: 'Switching Protocols', description: 'サーバーがプロトコルの切り替えに同意', category: '1xx' },
  { code: 102, name: 'Processing', description: 'サーバーがリクエストを処理中', category: '1xx' },
  { code: 103, name: 'Early Hints', description: '最終レスポンスの前にヘッダーを返す', category: '1xx' },

  // 2xx Success
  { code: 200, name: 'OK', description: 'リクエスト成功', category: '2xx' },
  { code: 201, name: 'Created', description: 'リソースが作成された', category: '2xx' },
  { code: 202, name: 'Accepted', description: 'リクエストが受け付けられたが、処理は未完了', category: '2xx' },
  { code: 203, name: 'Non-Authoritative Information', description: '変換プロキシからの情報', category: '2xx' },
  { code: 204, name: 'No Content', description: '成功したが返すコンテンツなし', category: '2xx' },
  { code: 205, name: 'Reset Content', description: 'ドキュメントビューをリセット', category: '2xx' },
  { code: 206, name: 'Partial Content', description: '部分的なリソースを返す', category: '2xx' },
  { code: 207, name: 'Multi-Status', description: '複数のステータスコードを含む', category: '2xx' },

  // 3xx Redirection
  { code: 300, name: 'Multiple Choices', description: '複数のリダイレクト先がある', category: '3xx' },
  { code: 301, name: 'Moved Permanently', description: 'リソースが恒久的に移動', category: '3xx' },
  { code: 302, name: 'Found', description: 'リソースが一時的に移動', category: '3xx' },
  { code: 303, name: 'See Other', description: '別のURIを参照', category: '3xx' },
  { code: 304, name: 'Not Modified', description: 'リソースは変更されていない', category: '3xx' },
  { code: 307, name: 'Temporary Redirect', description: '一時的なリダイレクト（メソッド変更不可）', category: '3xx' },
  { code: 308, name: 'Permanent Redirect', description: '恒久的なリダイレクト（メソッド変更不可）', category: '3xx' },

  // 4xx Client Error
  { code: 400, name: 'Bad Request', description: 'リクエストが不正', category: '4xx' },
  { code: 401, name: 'Unauthorized', description: '認証が必要', category: '4xx' },
  { code: 402, name: 'Payment Required', description: '支払いが必要', category: '4xx' },
  { code: 403, name: 'Forbidden', description: 'アクセスが禁止されている', category: '4xx' },
  { code: 404, name: 'Not Found', description: 'リソースが見つからない', category: '4xx' },
  { code: 405, name: 'Method Not Allowed', description: '許可されていないHTTPメソッド', category: '4xx' },
  { code: 406, name: 'Not Acceptable', description: '受け入れ可能なレスポンスがない', category: '4xx' },
  { code: 407, name: 'Proxy Authentication Required', description: 'プロキシ認証が必要', category: '4xx' },
  { code: 408, name: 'Request Timeout', description: 'リクエストタイムアウト', category: '4xx' },
  { code: 409, name: 'Conflict', description: 'リソースの競合', category: '4xx' },
  { code: 410, name: 'Gone', description: 'リソースが永久に削除された', category: '4xx' },
  { code: 411, name: 'Length Required', description: 'Content-Lengthヘッダーが必要', category: '4xx' },
  { code: 412, name: 'Precondition Failed', description: '前提条件が満たされていない', category: '4xx' },
  { code: 413, name: 'Payload Too Large', description: 'リクエストボディが大きすぎる', category: '4xx' },
  { code: 414, name: 'URI Too Long', description: 'URIが長すぎる', category: '4xx' },
  { code: 415, name: 'Unsupported Media Type', description: 'サポートされていないメディアタイプ', category: '4xx' },
  { code: 416, name: 'Range Not Satisfiable', description: '範囲指定が不正', category: '4xx' },
  { code: 418, name: "I'm a teapot", description: 'サーバーはティーポットである', category: '4xx' },
  { code: 422, name: 'Unprocessable Entity', description: '処理できないエンティティ', category: '4xx' },
  { code: 429, name: 'Too Many Requests', description: 'リクエストが多すぎる', category: '4xx' },
  { code: 451, name: 'Unavailable For Legal Reasons', description: '法的理由により利用不可', category: '4xx' },

  // 5xx Server Error
  { code: 500, name: 'Internal Server Error', description: 'サーバー内部エラー', category: '5xx' },
  { code: 501, name: 'Not Implemented', description: '未実装の機能', category: '5xx' },
  { code: 502, name: 'Bad Gateway', description: '不正なゲートウェイ', category: '5xx' },
  { code: 503, name: 'Service Unavailable', description: 'サービス利用不可', category: '5xx' },
  { code: 504, name: 'Gateway Timeout', description: 'ゲートウェイタイムアウト', category: '5xx' },
  { code: 505, name: 'HTTP Version Not Supported', description: 'HTTPバージョンがサポートされていない', category: '5xx' },
  { code: 511, name: 'Network Authentication Required', description: 'ネットワーク認証が必要', category: '5xx' },
];

export const CATEGORIES = ['すべて', '1xx', '2xx', '3xx', '4xx', '5xx'] as const;

export function filterStatusCodes(search: string, category: string): HttpStatus[] {
  return HTTP_STATUS_CODES.filter((status) => {
    const matchesCategory = category === 'すべて' || status.category === category;
    if (!matchesCategory) return false;

    if (!search) return true;
    const query = search.toLowerCase();
    return (
      status.code.toString().includes(query) ||
      status.name.toLowerCase().includes(query) ||
      status.description.toLowerCase().includes(query)
    );
  });
}

export function getStatusByCode(code: number): HttpStatus | undefined {
  return HTTP_STATUS_CODES.find((s) => s.code === code);
}
