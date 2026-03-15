export interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  daysUntilNextBirthday: number;
}

export function calculateAge(birthday: Date, referenceDate: Date = new Date()): AgeResult {
  const ref = new Date(referenceDate);
  const birth = new Date(birthday);

  let years = ref.getFullYear() - birth.getFullYear();
  let months = ref.getMonth() - birth.getMonth();
  let days = ref.getDate() - birth.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(ref.getFullYear(), ref.getMonth(), 0);
    days += prevMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  const totalDays = Math.floor(
    (ref.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24)
  );

  const daysUntilNextBirthday = calcDaysUntilNextBirthday(birth, ref);

  return { years, months, days, totalDays, daysUntilNextBirthday };
}

export function calcDaysUntilNextBirthday(birthday: Date, referenceDate: Date): number {
  const ref = new Date(referenceDate);
  let nextBirthday = new Date(ref.getFullYear(), birthday.getMonth(), birthday.getDate());

  if (nextBirthday.getTime() <= ref.getTime()) {
    nextBirthday = new Date(ref.getFullYear() + 1, birthday.getMonth(), birthday.getDate());
  }

  return Math.ceil((nextBirthday.getTime() - ref.getTime()) / (1000 * 60 * 60 * 24));
}
