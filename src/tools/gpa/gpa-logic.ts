export interface Course {
  name: string;
  grade: string;
  credits: number;
}

export interface GpaResult {
  gpa: number;
  totalCredits: number;
  totalPoints: number;
}

const letterGradeMap: Record<string, number> = {
  'A+': 4.0,
  'A': 4.0,
  'A-': 3.7,
  'B+': 3.3,
  'B': 3.0,
  'B-': 2.7,
  'C+': 2.3,
  'C': 2.0,
  'C-': 1.7,
  'D+': 1.3,
  'D': 1.0,
  'D-': 0.7,
  'F': 0.0,
};

const japaneseGradeMap: Record<string, number> = {
  '秀': 4.0,
  '優': 3.0,
  '良': 2.0,
  '可': 1.0,
  '不可': 0.0,
};

export function gradeToPoints(grade: string): number | null {
  const upper = grade.toUpperCase().trim();
  if (upper in letterGradeMap) return letterGradeMap[upper];
  const trimmed = grade.trim();
  if (trimmed in japaneseGradeMap) return japaneseGradeMap[trimmed];
  return null;
}

export function calculateGpa(courses: Course[]): GpaResult {
  let totalPoints = 0;
  let totalCredits = 0;

  for (const course of courses) {
    const points = gradeToPoints(course.grade);
    if (points === null) continue;
    totalPoints += points * course.credits;
    totalCredits += course.credits;
  }

  const gpa = totalCredits > 0 ? totalPoints / totalCredits : 0;
  return { gpa, totalCredits, totalPoints };
}

export function getAllGrades(): string[] {
  return ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'F', '秀', '優', '良', '可', '不可'];
}
