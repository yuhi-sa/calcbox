'use client';

import { useState } from 'react';
import { Course, calculateGpa, getAllGrades, GpaResult } from './gpa-logic';

export default function GpaCalculator() {
  const [courses, setCourses] = useState<Course[]>([
    { name: '', grade: 'A', credits: 2 },
  ]);
  const [result, setResult] = useState<GpaResult | null>(null);

  const grades = getAllGrades();

  const addCourse = () => {
    setCourses([...courses, { name: '', grade: 'A', credits: 2 }]);
  };

  const removeCourse = (index: number) => {
    if (courses.length <= 1) return;
    setCourses(courses.filter((_, i) => i !== index));
  };

  const updateCourse = (index: number, field: keyof Course, value: string | number) => {
    const updated = [...courses];
    updated[index] = { ...updated[index], [field]: value };
    setCourses(updated);
  };

  const calculate = () => {
    setResult(calculateGpa(courses));
  };

  const reset = () => {
    setCourses([{ name: '', grade: 'A', credits: 2 }]);
    setResult(null);
  };

  return (
    <div>
      <div className="space-y-3">
        {courses.map((course, i) => (
          <div key={i} className="flex gap-2 items-center flex-wrap">
            <input
              type="text"
              value={course.name}
              onChange={(e) => updateCourse(i, 'name', e.target.value)}
              placeholder={`科目${i + 1}`}
              className="flex-1 min-w-[100px] px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
            />
            <select
              value={course.grade}
              onChange={(e) => updateCourse(i, 'grade', e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
            >
              {grades.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
            <input
              type="number"
              value={course.credits}
              onChange={(e) => updateCourse(i, 'credits', parseInt(e.target.value) || 0)}
              min="1"
              max="10"
              className="w-16 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-center"
              placeholder="単位"
            />
            <button
              onClick={() => removeCourse(i)}
              className="px-2 py-2 text-red-500 hover:text-red-700 text-sm"
              disabled={courses.length <= 1}
            >
              &times;
            </button>
          </div>
        ))}
        <button onClick={addCourse} className="text-sm text-[var(--color-primary)] hover:opacity-80">+ 科目を追加</button>
      </div>

      <div className="flex gap-3 mt-4">
        <button onClick={calculate} className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:opacity-90">計算する</button>
        <button onClick={reset} className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:opacity-90">リセット</button>
      </div>

      {result && (
        <div className="mt-6 space-y-4">
          <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">GPA</p>
            <p className="text-4xl font-bold">{result.gpa.toFixed(2)}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">/ 4.00</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">総単位数</p>
              <p className="text-lg font-semibold">{result.totalCredits}</p>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">総ポイント</p>
              <p className="text-lg font-semibold">{result.totalPoints.toFixed(1)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
