import { ToolDefinition, ToolCategory } from '@/domain/types';

export const categories: { id: ToolCategory | 'all' | 'favorites'; label: string }[] = [
  { id: 'all', label: 'すべて' },
  { id: 'favorites', label: 'お気に入り' },
  { id: 'life', label: '生活' },
  { id: 'health', label: '健康' },
  { id: 'money', label: 'お金' },
  { id: 'datetime', label: '時間・日付' },
  { id: 'text', label: 'テキスト' },
];

export const tools: ToolDefinition[] = [
  // --- 健康 ---
  { id: 'bmi', name: 'BMI計算・適正体重チェック', description: '身長と体重からBMI値を計算し、肥満度や適正体重を確認できます。', category: 'health', icon: 'user', implemented: true },
  { id: 'body-fat', name: '体脂肪率計算', description: '身長・体重・年齢・性別から体脂肪率を推定。判定表示付き。', category: 'health', icon: 'user-plus', implemented: true },
  { id: 'calorie', name: '消費カロリー計算', description: '運動や日常活動で消費するカロリーを計算します。ダイエットの参考に。', category: 'health', icon: 'flame', implemented: true },
  { id: 'pet-age', name: 'ペット年齢換算', description: '犬・猫の年齢を人間の年齢に換算。サイズ別の換算にも対応。', category: 'health', icon: 'paw', implemented: true },
  { id: 'pregnancy', name: '妊娠週数・出産予定日計算', description: '最終月経日から妊娠週数と出産予定日を自動計算。', category: 'health', icon: 'clock', implemented: true },
  { id: 'sleep', name: '睡眠時間計算', description: '睡眠サイクル（90分周期）に基づく最適な就寝・起床時間を計算。', category: 'health', icon: 'moon', implemented: true },
  { id: 'bmr', name: '基礎代謝（BMR）計算', description: '年齢・身長・体重・性別から基礎代謝量と1日の消費カロリーを計算。', category: 'health', icon: 'flame', implemented: true },
  { id: 'alcohol', name: 'アルコール分解時間計算', description: '飲酒量・体重からアルコール分解時間と運転可能時刻の目安を計算。', category: 'health', icon: 'wine', implemented: true },
  { id: 'ideal-weight', name: '理想体重・ダイエット計算', description: '身長から理想体重を算出し、目標達成に必要なカロリー制限を提案。', category: 'health', icon: 'scale', implemented: true },
  { id: 'nutrition', name: '栄養素・カロリー計算', description: '食品の栄養素とカロリーを計算。38種類の食品データベース搭載。', category: 'health', icon: 'cup', implemented: true },

  // --- 生活 ---
  { id: 'tax', name: '消費税計算（税込・税抜）', description: '税込価格と税抜価格を瞬時に変換。軽減税率8%にも対応。', category: 'life', icon: 'table', implemented: true },
  { id: 'warikan', name: '割り勘計算', description: '飲み会やお食事の会計をかんたんに割り勘。端数処理もおまかせ。', category: 'life', icon: 'dollar', implemented: true },
  { id: 'electricity', name: '電気代計算', description: '家電の消費電力から月間・年間の電気代を計算。節電の参考に。', category: 'life', icon: 'zap', implemented: true },
  { id: 'unit', name: '単位変換', description: '長さ・重さ・温度・面積の単位を簡単に変換。坪↔平米にも対応。', category: 'life', icon: 'arrows', implemented: true },
  { id: 'discount', name: '割引計算', description: '割引率や割引額から割引後の価格を計算。二重割引にも対応。', category: 'life', icon: 'percent', implemented: true },
  { id: 'area', name: '面積計算', description: '各種図形の面積を計算。坪・畳・ヘクタールへの換算にも対応。', category: 'life', icon: 'grid', implemented: true },
  { id: 'speed', name: '速度・距離・時間計算', description: '速度・距離・時間の関係を計算。マラソンペース計算にも対応。', category: 'life', icon: 'layers', implemented: true },
  { id: 'random', name: '乱数生成器', description: '指定範囲のランダムな数値を生成。抽選やくじ引きに便利。', category: 'life', icon: 'dice', implemented: true },
  { id: 'currency', name: '通貨換算', description: '主要10通貨間のレート換算。JPY・USD・EUR・GBPなど対応。', category: 'life', icon: 'dollar', implemented: true },

  // --- お金 ---
  { id: 'loan', name: 'ローン計算', description: '住宅ローンや自動車ローンの月々の返済額・総支払額をシミュレーション。', category: 'money', icon: 'chart', implemented: true },
  { id: 'salary', name: '給与手取り計算', description: '額面年収・月収から手取り額を概算。社会保険料・税金の内訳も表示。', category: 'money', icon: 'card', implemented: true },
  { id: 'compound-interest', name: '複利計算・資産シミュレーション', description: '複利で資産がどれだけ増えるかシミュレーション。積立投資にも対応。', category: 'money', icon: 'trending-up', implemented: true },
  { id: 'furusato-tax', name: 'ふるさと納税控除額計算', description: '年収と家族構成からふるさと納税の控除上限額を簡単シミュレーション。', category: 'money', icon: 'home', implemented: true },
  { id: 'housing-deduction', name: '住宅ローン控除額計算', description: '住宅ローン減税の控除額を年間・合計でシミュレーション。', category: 'money', icon: 'home', implemented: true },
  { id: 'part-time-pay', name: 'バイト代・シフト給料計算', description: '時給・勤務時間から日給・月給・年収を試算。103万円の壁も確認。', category: 'money', icon: 'briefcase', implemented: true },
  { id: 'point-reward', name: 'ポイント還元率計算', description: 'ポイント還元率から獲得ポイント・実質割引額を計算。', category: 'money', icon: 'plus-circle', implemented: true },
  { id: 'pension', name: '年金受給額シミュレーション', description: '年収と加入期間から将来の年金受給額を試算。', category: 'money', icon: 'users', implemented: true },
  { id: 'loan-compare', name: 'ローン比較計算', description: '最大3つのローン条件を並べて比較。最適プランが一目瞭然。', category: 'money', icon: 'chart', implemented: true },

  // --- 時間・日付 ---
  { id: 'days', name: '日数計算（日付間の日数）', description: '2つの日付の間が何日あるかを計算します。期間の把握に便利です。', category: 'datetime', icon: 'calendar', implemented: true },
  { id: 'age', name: '年齢計算（生年月日から）', description: '生年月日から現在の年齢を計算。指定日時点の年齢も確認できます。', category: 'datetime', icon: 'clock', implemented: true },
  { id: 'time', name: '時間計算', description: '時間の足し算・引き算、分変換、時給計算がまとめてできます。', category: 'datetime', icon: 'clock', implemented: true },
  { id: 'wareki', name: '和暦西暦変換', description: '令和・平成・昭和・大正・明治の和暦と西暦を相互変換。', category: 'datetime', icon: 'calendar', implemented: true },
  { id: 'timezone', name: 'タイムゾーン変換', description: '世界主要都市の現在時刻を表示。時差計算に便利。', category: 'datetime', icon: 'globe', implemented: true },
  { id: 'countdown', name: 'カウントダウンタイマー', description: '目標の日時までのカウントダウンをリアルタイム表示。', category: 'datetime', icon: 'alarm', implemented: true },
  { id: 'stopwatch', name: 'ストップウォッチ', description: '精密なストップウォッチ。ラップタイム記録機能付き。', category: 'datetime', icon: 'timer', implemented: true },
  { id: 'age-table', name: '年齢早見表', description: '西暦・和暦・年齢・干支の一覧表。検索フィルター付き。', category: 'datetime', icon: 'file-text', implemented: true },
  { id: 'timestamp', name: 'Unixタイムスタンプ変換', description: 'Unix時刻と日時の双方向変換。現在のタイムスタンプもリアルタイム表示。', category: 'datetime', icon: 'clock', implemented: true },

  // --- テキスト ---
  { id: 'character-count', name: '文字数カウント', description: 'リアルタイムで文字数・行数・バイト数をカウント。', category: 'text', icon: 'file-text', implemented: true },
  { id: 'statistics', name: '平均・標準偏差計算', description: '数値データの平均・中央値・標準偏差・分散を一括計算。', category: 'text', icon: 'bar-chart', implemented: true },
  { id: 'probability', name: '確率・組み合わせ計算', description: '順列(nPr)・組み合わせ(nCr)・階乗の計算。', category: 'text', icon: 'dice', implemented: true },
  { id: 'diff', name: 'テキスト差分比較', description: '2つのテキストの差分をカラーハイライトで表示。', category: 'text', icon: 'diff', implemented: true },

  // --- 追加ツール ---
  { id: 'percentage', name: 'パーセント計算', description: '割合・構成比・変化率などパーセントに関する計算をまとめて。', category: 'life', icon: 'percent', implemented: true },
  { id: 'tip', name: 'チップ計算', description: 'チップ金額と一人あたりの支払額を計算。', category: 'life', icon: 'dollar', implemented: true },
  { id: 'gpa', name: 'GPA計算', description: '成績と単位数から加重GPAを計算。日本式(秀優良可)対応。', category: 'text', icon: 'bar-chart', implemented: true },
  { id: 'date-format', name: '日付フォーマット変換', description: '日付を多数のフォーマットで一覧表示。ISO 8601, RFC 2822対応。', category: 'datetime', icon: 'calendar', implemented: true },
  { id: 'overtime', name: '残業代計算', description: '時間外・深夜・休日の残業代を日本の労働基準法に基づいて計算。', category: 'money', icon: 'briefcase', implemented: true },
  { id: 'water-intake', name: '水分摂取量計算', description: '体重・活動量・気候から1日の推奨水分摂取量を計算。', category: 'health', icon: 'cup', implemented: true },
  { id: 'heart-rate', name: '心拍数ゾーン計算', description: '年齢から最大心拍数と5つのトレーニングゾーンを計算。', category: 'health', icon: 'flame', implemented: true },
  { id: 'shoe-size', name: '靴サイズ変換', description: '日本(cm)・US・UK・EUの靴サイズを相互変換。', category: 'life', icon: 'arrows', implemented: true },
  { id: 'cooking', name: '料理単位変換', description: '大さじ・小さじ・カップ・mL・gを食材別に変換。', category: 'life', icon: 'cup', implemented: true },
  { id: 'savings-goal', name: '貯金目標計算', description: '目標金額までの期間と利息をシミュレーション。', category: 'money', icon: 'trending-up', implemented: true },
];

export function getToolById(id: string): ToolDefinition | undefined {
  return tools.find(t => t.id === id);
}

export function getToolsByCategory(category: ToolCategory): ToolDefinition[] {
  return tools.filter(t => t.category === category);
}
