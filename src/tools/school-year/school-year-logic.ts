export interface SchoolMilestone {
  label: string;
  entryYear: number;
  entryMonth: number;
  graduationYear: number;
  graduationMonth: number;
  display: string;
}

export interface SchoolYearResult {
  birthDate: string;
  schoolStartYear: number;
  milestones: SchoolMilestone[];
}

/**
 * Japanese school year cutoff: children born April 2 to April 1 of the next year
 * belong to the same school year. A child enters elementary school in April
 * of the year they turn 6 (for those born April 2 - March 31), or the next year
 * (for those born April 1, who are considered part of the previous year's cohort).
 */
export function getSchoolStartYear(birthYear: number, birthMonth: number, birthDay: number): number {
  // Born on April 2 or later: enter school in the year they turn 6
  // Born on April 1 or earlier (Jan 1 - April 1): enter school in the year they turn 6 as well,
  // but they are grouped with the previous academic year
  if (birthMonth < 4 || (birthMonth === 4 && birthDay === 1)) {
    // Born Jan 1 - April 1: enters elementary in birthYear + 6, but as part of the cohort
    // that started the previous April
    return birthYear + 6;
  }
  // Born April 2 - December 31
  return birthYear + 7;
}

export function calculateSchoolYears(birthYear: number, birthMonth: number, birthDay: number): SchoolYearResult {
  const startYear = getSchoolStartYear(birthYear, birthMonth, birthDay);

  const milestones: SchoolMilestone[] = [
    {
      label: '小学校',
      entryYear: startYear,
      entryMonth: 4,
      graduationYear: startYear + 6,
      graduationMonth: 3,
      display: `${startYear}年4月入学 - ${startYear + 6}年3月卒業`,
    },
    {
      label: '中学校',
      entryYear: startYear + 6,
      entryMonth: 4,
      graduationYear: startYear + 9,
      graduationMonth: 3,
      display: `${startYear + 6}年4月入学 - ${startYear + 9}年3月卒業`,
    },
    {
      label: '高校',
      entryYear: startYear + 9,
      entryMonth: 4,
      graduationYear: startYear + 12,
      graduationMonth: 3,
      display: `${startYear + 9}年4月入学 - ${startYear + 12}年3月卒業`,
    },
    {
      label: '大学（4年制）',
      entryYear: startYear + 12,
      entryMonth: 4,
      graduationYear: startYear + 16,
      graduationMonth: 3,
      display: `${startYear + 12}年4月入学 - ${startYear + 16}年3月卒業`,
    },
  ];

  const pad = (n: number) => String(n).padStart(2, '0');
  const birthDate = `${birthYear}年${pad(birthMonth)}月${pad(birthDay)}日`;

  return { birthDate, schoolStartYear: startYear, milestones };
}
