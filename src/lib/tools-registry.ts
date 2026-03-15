import { ToolDefinition, ToolCategory } from './types';

export const categories: { id: ToolCategory | 'all' | 'favorites'; label: string }[] = [
  { id: 'all', label: 'すべて' },
  { id: 'favorites', label: 'お気に入り' },
  { id: 'life', label: '生活' },
  { id: 'health', label: '健康' },
  { id: 'money', label: 'お金' },
  { id: 'datetime', label: '時間・日付' },
  { id: 'developer', label: '開発者' },
  { id: 'text', label: 'テキスト' },
];

export const tools: ToolDefinition[] = [
  // --- 健康 ---
  { id: 'bmi', name: 'BMI計算・適正体重チェック', description: '身長と体重からBMI値を計算し、肥満度や適正体重を確認できます。', category: 'health', icon: 'user', implemented: true },
  { id: 'body-fat', name: '体脂肪率計算', description: '身長・体重・年齢・性別から体脂肪率を推定。判定表示付き。', category: 'health', icon: 'user-plus', implemented: false },
  { id: 'calorie', name: '消費カロリー計算', description: '運動や日常活動で消費するカロリーを計算します。ダイエットの参考に。', category: 'health', icon: 'flame', implemented: false },
  { id: 'pet-age', name: 'ペット年齢換算', description: '犬・猫の年齢を人間の年齢に換算。サイズ別の換算にも対応。', category: 'health', icon: 'paw', implemented: false },
  { id: 'pregnancy', name: '妊娠週数・出産予定日計算', description: '最終月経日から妊娠週数と出産予定日を自動計算。', category: 'health', icon: 'clock', implemented: false },
  { id: 'sleep', name: '睡眠時間計算', description: '睡眠サイクル（90分周期）に基づく最適な就寝・起床時間を計算。', category: 'health', icon: 'moon', implemented: false },
  { id: 'bmr', name: '基礎代謝（BMR）計算', description: '年齢・身長・体重・性別から基礎代謝量と1日の消費カロリーを計算。', category: 'health', icon: 'flame', implemented: false },
  { id: 'alcohol', name: 'アルコール分解時間計算', description: '飲酒量・体重からアルコール分解時間と運転可能時刻の目安を計算。', category: 'health', icon: 'wine', implemented: false },
  { id: 'ideal-weight', name: '理想体重・ダイエット計算', description: '身長から理想体重を算出し、目標達成に必要なカロリー制限を提案。', category: 'health', icon: 'scale', implemented: false },
  { id: 'nutrition', name: '栄養素・カロリー計算', description: '食品の栄養素とカロリーを計算。38種類の食品データベース搭載。', category: 'health', icon: 'cup', implemented: false },

  // --- 生活 ---
  { id: 'tax', name: '消費税計算（税込・税抜）', description: '税込価格と税抜価格を瞬時に変換。軽減税率8%にも対応。', category: 'life', icon: 'table', implemented: true },
  { id: 'warikan', name: '割り勘計算', description: '飲み会やお食事の会計をかんたんに割り勘。端数処理もおまかせ。', category: 'life', icon: 'dollar', implemented: false },
  { id: 'electricity', name: '電気代計算', description: '家電の消費電力から月間・年間の電気代を計算。節電の参考に。', category: 'life', icon: 'zap', implemented: false },
  { id: 'unit', name: '単位変換', description: '長さ・重さ・温度・面積の単位を簡単に変換。坪↔平米にも対応。', category: 'life', icon: 'arrows', implemented: false },
  { id: 'discount', name: '割引計算', description: '割引率や割引額から割引後の価格を計算。二重割引にも対応。', category: 'life', icon: 'percent', implemented: false },
  { id: 'area', name: '面積計算', description: '各種図形の面積を計算。坪・畳・ヘクタールへの換算にも対応。', category: 'life', icon: 'grid', implemented: false },
  { id: 'speed', name: '速度・距離・時間計算', description: '速度・距離・時間の関係を計算。マラソンペース計算にも対応。', category: 'life', icon: 'layers', implemented: false },
  { id: 'random', name: '乱数生成器', description: '指定範囲のランダムな数値を生成。抽選やくじ引きに便利。', category: 'life', icon: 'dice', implemented: false },
  { id: 'currency', name: '通貨換算', description: '主要10通貨間のレート換算。JPY・USD・EUR・GBPなど対応。', category: 'life', icon: 'dollar', implemented: true },

  // --- お金 ---
  { id: 'loan', name: 'ローン計算', description: '住宅ローンや自動車ローンの月々の返済額・総支払額をシミュレーション。', category: 'money', icon: 'chart', implemented: true },
  { id: 'salary', name: '給与手取り計算', description: '額面年収・月収から手取り額を概算。社会保険料・税金の内訳も表示。', category: 'money', icon: 'card', implemented: true },
  { id: 'compound-interest', name: '複利計算・資産シミュレーション', description: '複利で資産がどれだけ増えるかシミュレーション。積立投資にも対応。', category: 'money', icon: 'trending-up', implemented: false },
  { id: 'furusato-tax', name: 'ふるさと納税控除額計算', description: '年収と家族構成からふるさと納税の控除上限額を簡単シミュレーション。', category: 'money', icon: 'home', implemented: false },
  { id: 'housing-deduction', name: '住宅ローン控除額計算', description: '住宅ローン減税の控除額を年間・合計でシミュレーション。', category: 'money', icon: 'home', implemented: false },
  { id: 'part-time-pay', name: 'バイト代・シフト給料計算', description: '時給・勤務時間から日給・月給・年収を試算。103万円の壁も確認。', category: 'money', icon: 'briefcase', implemented: false },
  { id: 'point-reward', name: 'ポイント還元率計算', description: 'ポイント還元率から獲得ポイント・実質割引額を計算。', category: 'money', icon: 'plus-circle', implemented: false },
  { id: 'pension', name: '年金受給額シミュレーション', description: '年収と加入期間から将来の年金受給額を試算。', category: 'money', icon: 'users', implemented: false },
  { id: 'loan-compare', name: 'ローン比較計算', description: '最大3つのローン条件を並べて比較。最適プランが一目瞭然。', category: 'money', icon: 'chart', implemented: false },

  // --- 時間・日付 ---
  { id: 'days', name: '日数計算（日付間の日数）', description: '2つの日付の間が何日あるかを計算します。期間の把握に便利です。', category: 'datetime', icon: 'calendar', implemented: false },
  { id: 'age', name: '年齢計算（生年月日から）', description: '生年月日から現在の年齢を計算。指定日時点の年齢も確認できます。', category: 'datetime', icon: 'clock', implemented: false },
  { id: 'time', name: '時間計算', description: '時間の足し算・引き算、分変換、時給計算がまとめてできます。', category: 'datetime', icon: 'clock', implemented: false },
  { id: 'wareki', name: '和暦西暦変換', description: '令和・平成・昭和・大正・明治の和暦と西暦を相互変換。', category: 'datetime', icon: 'calendar', implemented: false },
  { id: 'timezone', name: 'タイムゾーン変換', description: '世界主要都市の現在時刻を表示。時差計算に便利。', category: 'datetime', icon: 'globe', implemented: false },
  { id: 'countdown', name: 'カウントダウンタイマー', description: '目標の日時までのカウントダウンをリアルタイム表示。', category: 'datetime', icon: 'alarm', implemented: false },
  { id: 'stopwatch', name: 'ストップウォッチ', description: '精密なストップウォッチ。ラップタイム記録機能付き。', category: 'datetime', icon: 'timer', implemented: false },
  { id: 'age-table', name: '年齢早見表', description: '西暦・和暦・年齢・干支の一覧表。検索フィルター付き。', category: 'datetime', icon: 'file-text', implemented: false },
  { id: 'timestamp', name: 'Unixタイムスタンプ変換', description: 'Unix時刻と日時の双方向変換。現在のタイムスタンプもリアルタイム表示。', category: 'developer', icon: 'clock', implemented: true },

  // --- 開発者 ---
  { id: 'password', name: 'パスワード生成', description: '安全なパスワードをワンクリックで生成。強度メーター付き。', category: 'developer', icon: 'lock', implemented: true },
  { id: 'hash', name: 'ハッシュ生成（SHA-256等）', description: 'テキストからSHA-1/SHA-256/SHA-512ハッシュを生成。', category: 'developer', icon: 'hash', implemented: true },
  { id: 'uuid', name: 'UUID生成ツール', description: 'v4 UUIDをワンクリック生成。バルク生成・バリデーション機能付き。', category: 'developer', icon: 'grid', implemented: true },
  { id: 'markdown', name: 'マークダウンプレビュー', description: 'マークダウンをリアルタイムプレビュー。HTMLコピー対応。', category: 'developer', icon: 'file-text', implemented: true },
  { id: 'base-converter', name: '進数変換', description: '2進数・8進数・10進数・16進数を相互変換。', category: 'developer', icon: 'binary', implemented: false },
  { id: 'color-converter', name: '色変換（カラーコード）', description: 'HEX・RGB・HSLを相互変換。カラーピッカーとプレビュー付き。', category: 'developer', icon: 'palette', implemented: false },
  { id: 'json-formatter', name: 'JSON整形ツール', description: 'JSONの整形・圧縮・バリデーション。開発者の必須ツール。', category: 'developer', icon: 'code', implemented: false },
  { id: 'qr-generator', name: 'QRコード生成', description: 'テキストやURLからQRコードを即座に生成。', category: 'developer', icon: 'qr', implemented: false },
  { id: 'encode', name: 'エンコード・デコード', description: 'Base64・URL・HTMLのエンコード/デコードをワンクリックで。', category: 'developer', icon: 'code', implemented: false },
  { id: 'regex', name: '正規表現テスター', description: '正規表現パターンをリアルタイムテスト。マッチ箇所をハイライト。', category: 'developer', icon: 'search', implemented: false },
  { id: 'ip-calc', name: 'IPアドレス・サブネット計算', description: 'CIDR表記からネットワークアドレス・ブロードキャスト・ホスト範囲を計算。', category: 'developer', icon: 'server', implemented: false },
  { id: 'gradient', name: 'CSSグラデーション生成', description: 'Linear/Radialグラデーションをビジュアルに生成。', category: 'developer', icon: 'palette', implemented: false },
  { id: 'jwt', name: 'JWTデコーダー', description: 'JWTトークンのヘッダー・ペイロードを解析。有効期限チェック付き。', category: 'developer', icon: 'lock', implemented: false },
  { id: 'cron', name: 'Cron式パーサー', description: 'cron式を人間が読める形で解説。次回実行時刻の表示付き。', category: 'developer', icon: 'alarm', implemented: false },
  { id: 'chmod', name: 'chmodパーミッション計算', description: 'チェックボックスUIで直感的にファイルパーミッションを設定。', category: 'developer', icon: 'shield', implemented: false },
  { id: 'csv-json', name: 'CSV⇔JSON変換', description: 'CSVとJSONの双方向変換。区切り文字選択・プレビュー付き。', category: 'developer', icon: 'arrows', implemented: false },
  { id: 'sql-formatter', name: 'SQLフォーマッター', description: 'SQLクエリを自動整形。複雑なクエリも見やすく。', category: 'developer', icon: 'database', implemented: false },
  { id: 'byte-converter', name: 'バイト単位変換', description: 'B/KB/MB/GB/TBを相互変換。', category: 'developer', icon: 'hard-drive', implemented: false },
  { id: 'http-status', name: 'HTTPステータスコード一覧', description: 'HTTPステータスコードの意味と使い方を一覧表示。', category: 'developer', icon: 'globe', implemented: false },
  { id: 'lorem', name: 'Lorem Ipsum生成', description: 'ダミーテキストを段落・文・単語単位で生成。', category: 'developer', icon: 'type', implemented: false },

  // --- テキスト ---
  { id: 'character-count', name: '文字数カウント', description: 'リアルタイムで文字数・行数・バイト数をカウント。', category: 'text', icon: 'file-text', implemented: false },
  { id: 'statistics', name: '平均・標準偏差計算', description: '数値データの平均・中央値・標準偏差・分散を一括計算。', category: 'text', icon: 'bar-chart', implemented: false },
  { id: 'probability', name: '確率・組み合わせ計算', description: '順列(nPr)・組み合わせ(nCr)・階乗の計算。', category: 'text', icon: 'dice', implemented: false },
  { id: 'diff', name: 'テキスト差分比較', description: '2つのテキストの差分をカラーハイライトで表示。', category: 'text', icon: 'diff', implemented: false },
];

export function getToolById(id: string): ToolDefinition | undefined {
  return tools.find(t => t.id === id);
}

export function getToolsByCategory(category: ToolCategory): ToolDefinition[] {
  return tools.filter(t => t.category === category);
}
