export interface WesternZodiac {
  sign: string;
  symbol: string;
  japaneseName: string;
  dateRange: string;
  traits: string[];
}

export interface ChineseZodiac {
  animal: string;
  japaneseName: string;
  kanji: string;
  traits: string[];
}

export interface ZodiacResult {
  western: WesternZodiac;
  chinese: ChineseZodiac;
}

const WESTERN_ZODIACS: WesternZodiac[] = [
  { sign: 'Capricorn', symbol: '\u2651', japaneseName: 'やぎ座', dateRange: '12/22 - 1/19', traits: ['勤勉', '野心的', '忍耐強い', '実用的'] },
  { sign: 'Aquarius', symbol: '\u2652', japaneseName: 'みずがめ座', dateRange: '1/20 - 2/18', traits: ['独創的', '人道的', '自由', '知的'] },
  { sign: 'Pisces', symbol: '\u2653', japaneseName: 'うお座', dateRange: '2/19 - 3/20', traits: ['直感的', '共感力', '芸術的', '優しい'] },
  { sign: 'Aries', symbol: '\u2648', japaneseName: 'おひつじ座', dateRange: '3/21 - 4/19', traits: ['勇敢', '情熱的', 'リーダー気質', '冒険的'] },
  { sign: 'Taurus', symbol: '\u2649', japaneseName: 'おうし座', dateRange: '4/20 - 5/20', traits: ['堅実', '忍耐力', '感覚的', '信頼できる'] },
  { sign: 'Gemini', symbol: '\u264A', japaneseName: 'ふたご座', dateRange: '5/21 - 6/21', traits: ['知的好奇心', '社交的', '柔軟', '多才'] },
  { sign: 'Cancer', symbol: '\u264B', japaneseName: 'かに座', dateRange: '6/22 - 7/22', traits: ['家庭的', '直感的', '保護的', '感情豊か'] },
  { sign: 'Leo', symbol: '\u264C', japaneseName: 'しし座', dateRange: '7/23 - 8/22', traits: ['自信', '寛大', '創造的', 'カリスマ'] },
  { sign: 'Virgo', symbol: '\u264D', japaneseName: 'おとめ座', dateRange: '8/23 - 9/22', traits: ['分析的', '勤勉', '実務的', '几帳面'] },
  { sign: 'Libra', symbol: '\u264E', japaneseName: 'てんびん座', dateRange: '9/23 - 10/23', traits: ['調和', '公平', '社交的', '優雅'] },
  { sign: 'Scorpio', symbol: '\u264F', japaneseName: 'さそり座', dateRange: '10/24 - 11/22', traits: ['情熱的', '洞察力', '決断力', '神秘的'] },
  { sign: 'Sagittarius', symbol: '\u2650', japaneseName: 'いて座', dateRange: '11/23 - 12/21', traits: ['楽観的', '冒険好き', '哲学的', '自由'] },
];

const CHINESE_ZODIACS: ChineseZodiac[] = [
  { animal: 'Rat', japaneseName: 'ねずみ', kanji: '子', traits: ['機知', '順応性', '社交的'] },
  { animal: 'Ox', japaneseName: 'うし', kanji: '丑', traits: ['勤勉', '誠実', '忍耐強い'] },
  { animal: 'Tiger', japaneseName: 'とら', kanji: '寅', traits: ['勇敢', '自信', '競争力'] },
  { animal: 'Rabbit', japaneseName: 'うさぎ', kanji: '卯', traits: ['優雅', '親切', '慎重'] },
  { animal: 'Dragon', japaneseName: 'たつ', kanji: '辰', traits: ['力強い', '幸運', '才能'] },
  { animal: 'Snake', japaneseName: 'へび', kanji: '巳', traits: ['知恵', '神秘的', '直感的'] },
  { animal: 'Horse', japaneseName: 'うま', kanji: '午', traits: ['活動的', '陽気', '自由'] },
  { animal: 'Goat', japaneseName: 'ひつじ', kanji: '未', traits: ['穏やか', '芸術的', '思いやり'] },
  { animal: 'Monkey', japaneseName: 'さる', kanji: '申', traits: ['機転', '好奇心', 'ユーモア'] },
  { animal: 'Rooster', japaneseName: 'とり', kanji: '酉', traits: ['勤勉', '観察力', '勇気'] },
  { animal: 'Dog', japaneseName: 'いぬ', kanji: '戌', traits: ['忠実', '正直', '親切'] },
  { animal: 'Pig', japaneseName: 'いのしし', kanji: '亥', traits: ['誠実', '寛大', '勇気'] },
];

export function getWesternZodiac(month: number, day: number): WesternZodiac {
  // month is 1-12
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return WESTERN_ZODIACS[0];  // Capricorn
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return WESTERN_ZODIACS[1];   // Aquarius
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return WESTERN_ZODIACS[2];   // Pisces
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return WESTERN_ZODIACS[3];   // Aries
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return WESTERN_ZODIACS[4];   // Taurus
  if ((month === 5 && day >= 21) || (month === 6 && day <= 21)) return WESTERN_ZODIACS[5];   // Gemini
  if ((month === 6 && day >= 22) || (month === 7 && day <= 22)) return WESTERN_ZODIACS[6];   // Cancer
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return WESTERN_ZODIACS[7];   // Leo
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return WESTERN_ZODIACS[8];   // Virgo
  if ((month === 9 && day >= 23) || (month === 10 && day <= 23)) return WESTERN_ZODIACS[9];  // Libra
  if ((month === 10 && day >= 24) || (month === 11 && day <= 22)) return WESTERN_ZODIACS[10]; // Scorpio
  return WESTERN_ZODIACS[11]; // Sagittarius
}

export function getChineseZodiac(year: number): ChineseZodiac {
  // Base year: 2020 is Year of the Rat (index 0)
  const index = ((year - 2020) % 12 + 12) % 12;
  return CHINESE_ZODIACS[index];
}

export function getZodiac(birthDate: Date): ZodiacResult {
  const month = birthDate.getMonth() + 1;
  const day = birthDate.getDate();
  const year = birthDate.getFullYear();

  return {
    western: getWesternZodiac(month, day),
    chinese: getChineseZodiac(year),
  };
}
