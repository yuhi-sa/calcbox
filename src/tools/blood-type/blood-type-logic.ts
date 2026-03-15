export type BloodType = 'A' | 'B' | 'O' | 'AB';

export interface PersonalityTraits {
  type: BloodType;
  traits: string[];
  description: string;
}

export interface CompatibilityResult {
  type1: BloodType;
  type2: BloodType;
  score: number;
  comment: string;
  advice: string;
}

export const PERSONALITIES: Record<BloodType, PersonalityTraits> = {
  A: {
    type: 'A',
    traits: ['几帳面', '真面目', '気配り上手', '繊細'],
    description: '真面目で几帳面な性格。周囲への気配りができ、協調性が高い。やや心配性な面も。',
  },
  B: {
    type: 'B',
    traits: ['マイペース', '好奇心旺盛', '自由奔放', '独創的'],
    description: 'マイペースで自由奔放。好奇心旺盛で独創的なアイデアを持つ。こだわりが強い一面も。',
  },
  O: {
    type: 'O',
    traits: ['おおらか', 'リーダーシップ', '社交的', '情熱的'],
    description: 'おおらかでリーダーシップがある。社交的で仲間を大切にする。大雑把な面もあるが情熱的。',
  },
  AB: {
    type: 'AB',
    traits: ['天才肌', '二面性', '冷静', 'クリエイティブ'],
    description: '冷静で合理的な思考の持ち主。クリエイティブで多才。二面性があり、ミステリアスな魅力。',
  },
};

const COMPATIBILITY_MAP: Record<string, { score: number; comment: string; advice: string }> = {
  'A-A': { score: 75, comment: '似た者同士で安定感あり', advice: 'お互いの几帳面さを理解し合いましょう。たまには力を抜いてリラックスすることが大切です。' },
  'A-B': { score: 55, comment: '正反対だからこそ惹かれ合う', advice: 'A型の計画性とB型の自由さのバランスがカギ。お互いの違いを楽しむ心の余裕を持ちましょう。' },
  'A-O': { score: 90, comment: '最高の相性！支え合える関係', advice: 'O型のおおらかさがA型の不安を和らげます。自然体でいられる最高のパートナーです。' },
  'A-AB': { score: 70, comment: '知的な会話が楽しめる', advice: 'AB型の合理性をA型が受け入れることで、深い信頼関係が築けます。' },
  'B-B': { score: 65, comment: '自由同士で楽しいが衝突も', advice: 'お互いのこだわりを尊重し、適度な距離感を保つことがポイントです。' },
  'B-O': { score: 85, comment: 'B型の個性をO型が包み込む', advice: 'O型の包容力がB型の自由さを受け止めます。一緒にいて楽しい組み合わせ。' },
  'B-AB': { score: 80, comment: '独創的なコンビ', advice: 'お互いの独自性を認め合える関係。クリエイティブな活動を一緒にすると絆が深まります。' },
  'O-O': { score: 70, comment: 'パワフルだがリーダー争いに注意', advice: '両方リーダーシップが強いので、役割分担を明確にすると上手くいきます。' },
  'O-AB': { score: 60, comment: 'O型の情熱とAB型の冷静さ', advice: 'テンポの違いを理解することが大切。O型が少し引いて、AB型のペースを尊重しましょう。' },
  'AB-AB': { score: 75, comment: '理解し合える希少な組み合わせ', advice: 'お互いの二面性を理解できる貴重な存在。深い精神的なつながりが生まれます。' },
};

function getKey(type1: BloodType, type2: BloodType): string {
  const sorted = [type1, type2].sort();
  return `${sorted[0]}-${sorted[1]}`;
}

export function getCompatibility(type1: BloodType, type2: BloodType): CompatibilityResult {
  const key = getKey(type1, type2);
  const data = COMPATIBILITY_MAP[key];
  return {
    type1,
    type2,
    score: data.score,
    comment: data.comment,
    advice: data.advice,
  };
}

export function getPersonality(type: BloodType): PersonalityTraits {
  return PERSONALITIES[type];
}
