export type OccasionType = 'wedding' | 'funeral';

export type WeddingRelationship = '友人' | '同僚' | '上司' | '親族' | '兄弟姉妹';
export type FuneralRelationship = '友人' | '同僚' | '上司' | '親族' | '祖父母' | '両親';
export type Relationship = WeddingRelationship | FuneralRelationship;

export interface GiftMoneyResult {
  occasion: string;
  relationship: string;
  minAmount: number;
  maxAmount: number;
  displayAmount: string;
  notes: string[];
}

const weddingAmounts: Record<WeddingRelationship, { min: number; max: number }> = {
  '友人': { min: 30000, max: 30000 },
  '同僚': { min: 30000, max: 30000 },
  '上司': { min: 30000, max: 50000 },
  '親族': { min: 50000, max: 100000 },
  '兄弟姉妹': { min: 50000, max: 100000 },
};

const funeralAmounts: Record<FuneralRelationship, { min: number; max: number }> = {
  '友人': { min: 5000, max: 10000 },
  '同僚': { min: 5000, max: 5000 },
  '上司': { min: 5000, max: 10000 },
  '親族': { min: 10000, max: 50000 },
  '祖父母': { min: 10000, max: 30000 },
  '両親': { min: 50000, max: 100000 },
};

const weddingNotes: Record<WeddingRelationship, string[]> = {
  '友人': ['新札を用意しましょう', '偶数は避け、奇数の金額が望ましいです', '受付でふくさから出して渡しましょう'],
  '同僚': ['新札を用意しましょう', '連名の場合は1人あたり1万円〜が目安です'],
  '上司': ['新札を用意しましょう', '目上の方には相場の上限が望ましいです', '4万・9万は避けましょう'],
  '親族': ['新札を用意しましょう', '事前に家族で相談して金額を揃えると良いでしょう'],
  '兄弟姉妹': ['新札を用意しましょう', '事前に家族で相談して金額を揃えると良いでしょう'],
};

const funeralNotes: Record<FuneralRelationship, string[]> = {
  '友人': ['新札は避け、使用感のあるお札を使いましょう', '薄墨の筆ペンで表書きを書きましょう'],
  '同僚': ['香典袋は宗派に合ったものを選びましょう', '薄墨の筆ペンで表書きを書きましょう'],
  '上司': ['香典袋は宗派に合ったものを選びましょう', '金額に応じた香典袋を選びましょう'],
  '親族': ['故人との関係の深さで金額を調整しましょう', '家族で相談して金額を揃えると良いでしょう'],
  '祖父母': ['社会人になっていれば個人で包みましょう', '家族で相談して金額を揃えると良いでしょう'],
  '両親': ['最も高額になるのが一般的です', '喪主を務める場合は不要です'],
};

function formatAmount(min: number, max: number): string {
  const formatYen = (v: number) => {
    if (v >= 10000) return `${v / 10000}万円`;
    return `${v / 1000}千円`;
  };
  if (min === max) return formatYen(min);
  return `${formatYen(min)}〜${formatYen(max)}`;
}

export function getWeddingRelationships(): WeddingRelationship[] {
  return ['友人', '同僚', '上司', '親族', '兄弟姉妹'];
}

export function getFuneralRelationships(): FuneralRelationship[] {
  return ['友人', '同僚', '上司', '親族', '祖父母', '両親'];
}

export function calculateGiftMoney(
  occasion: OccasionType,
  relationship: Relationship,
): GiftMoneyResult {
  if (occasion === 'wedding') {
    const rel = relationship as WeddingRelationship;
    const amount = weddingAmounts[rel];
    if (!amount) throw new Error(`Invalid relationship for wedding: ${relationship}`);
    return {
      occasion: 'ご祝儀（結婚式）',
      relationship: rel,
      minAmount: amount.min,
      maxAmount: amount.max,
      displayAmount: formatAmount(amount.min, amount.max),
      notes: weddingNotes[rel],
    };
  } else {
    const rel = relationship as FuneralRelationship;
    const amount = funeralAmounts[rel];
    if (!amount) throw new Error(`Invalid relationship for funeral: ${relationship}`);
    return {
      occasion: '香典（葬儀）',
      relationship: rel,
      minAmount: amount.min,
      maxAmount: amount.max,
      displayAmount: formatAmount(amount.min, amount.max),
      notes: funeralNotes[rel],
    };
  }
}
