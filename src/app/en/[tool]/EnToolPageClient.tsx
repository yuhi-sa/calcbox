'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { toolTranslations } from '@/application/i18n';

const toolComponents: Record<string, React.ComponentType> = {
  bmi: dynamic(() => import('@/tools/bmi/BmiCalculator')),
  'body-fat': dynamic(() => import('@/tools/body-fat/BodyFatCalculator')),
  calorie: dynamic(() => import('@/tools/calorie/CalorieCalculator')),
  'pet-age': dynamic(() => import('@/tools/pet-age/PetAgeCalculator')),
  pregnancy: dynamic(() => import('@/tools/pregnancy/PregnancyCalculator')),
  sleep: dynamic(() => import('@/tools/sleep/SleepCalculator')),
  bmr: dynamic(() => import('@/tools/bmr/BmrCalculator')),
  alcohol: dynamic(() => import('@/tools/alcohol/AlcoholCalculator')),
  'ideal-weight': dynamic(() => import('@/tools/ideal-weight/IdealWeightCalculator')),
  nutrition: dynamic(() => import('@/tools/nutrition/NutritionCalculator')),
  tax: dynamic(() => import('@/tools/tax/TaxCalculator')),
  warikan: dynamic(() => import('@/tools/warikan/WarikanCalculator')),
  electricity: dynamic(() => import('@/tools/electricity/ElectricityCalculator')),
  unit: dynamic(() => import('@/tools/unit/UnitConverter')),
  discount: dynamic(() => import('@/tools/discount/DiscountCalculator')),
  area: dynamic(() => import('@/tools/area/AreaCalculator')),
  speed: dynamic(() => import('@/tools/speed/SpeedCalculator')),
  random: dynamic(() => import('@/tools/random/RandomGenerator')),
  currency: dynamic(() => import('@/tools/currency/CurrencyCalculator')),
  loan: dynamic(() => import('@/tools/loan/LoanCalculator')),
  salary: dynamic(() => import('@/tools/salary/SalaryCalculator')),
  'compound-interest': dynamic(() => import('@/tools/compound-interest/CompoundInterestCalculator')),
  'furusato-tax': dynamic(() => import('@/tools/furusato-tax/FurusatoTaxCalculator')),
  'housing-deduction': dynamic(() => import('@/tools/housing-deduction/HousingDeductionCalculator')),
  'part-time-pay': dynamic(() => import('@/tools/part-time-pay/PartTimePayCalculator')),
  'point-reward': dynamic(() => import('@/tools/point-reward/PointRewardCalculator')),
  pension: dynamic(() => import('@/tools/pension/PensionCalculator')),
  'loan-compare': dynamic(() => import('@/tools/loan-compare/LoanCompareCalculator')),
  days: dynamic(() => import('@/tools/days/DaysCalculator')),
  age: dynamic(() => import('@/tools/age/AgeCalculator')),
  time: dynamic(() => import('@/tools/time/TimeCalculator')),
  wareki: dynamic(() => import('@/tools/wareki/WarekiConverter')),
  timezone: dynamic(() => import('@/tools/timezone/TimezoneConverter')),
  countdown: dynamic(() => import('@/tools/countdown/CountdownTimer')),
  stopwatch: dynamic(() => import('@/tools/stopwatch/Stopwatch')),
  'age-table': dynamic(() => import('@/tools/age-table/AgeTable')),
  timestamp: dynamic(() => import('@/tools/timestamp/TimestampConverter')),
  'character-count': dynamic(() => import('@/tools/character-count/CharacterCounter')),
  statistics: dynamic(() => import('@/tools/statistics/StatisticsCalculator')),
  probability: dynamic(() => import('@/tools/probability/ProbabilityCalculator')),
  diff: dynamic(() => import('@/tools/diff/DiffChecker')),
  percentage: dynamic(() => import('@/tools/percentage/PercentageCalculator')),
  tip: dynamic(() => import('@/tools/tip/TipCalculator')),
  gpa: dynamic(() => import('@/tools/gpa/GpaCalculator')),
  'date-format': dynamic(() => import('@/tools/date-format/DateFormatConverter')),
  overtime: dynamic(() => import('@/tools/overtime/OvertimeCalculator')),
  'water-intake': dynamic(() => import('@/tools/water-intake/WaterIntakeCalculator')),
  'heart-rate': dynamic(() => import('@/tools/heart-rate/HeartRateCalculator')),
  'shoe-size': dynamic(() => import('@/tools/shoe-size/ShoeSizeConverter')),
  cooking: dynamic(() => import('@/tools/cooking/CookingConverter')),
  'savings-goal': dynamic(() => import('@/tools/savings-goal/SavingsGoalCalculator')),
  'fuel-cost': dynamic(() => import('@/tools/fuel-cost/FuelCostCalculator')),
  'moving-cost': dynamic(() => import('@/tools/moving-cost/MovingCostEstimator')),
  'rent-budget': dynamic(() => import('@/tools/rent-budget/RentBudgetCalculator')),
  'paper-size': dynamic(() => import('@/tools/paper-size/PaperSizeReference')),
  'aspect-ratio': dynamic(() => import('@/tools/aspect-ratio/AspectRatioCalculator')),
  'menstrual-cycle': dynamic(() => import('@/tools/menstrual-cycle/MenstrualCycleCalculator')),
  'blood-type': dynamic(() => import('@/tools/blood-type/BloodTypeCompatibility')),
  zodiac: dynamic(() => import('@/tools/zodiac/ZodiacCalculator')),
  'gift-money': dynamic(() => import('@/tools/gift-money/GiftMoneyReference')),
  'school-year': dynamic(() => import('@/tools/school-year/SchoolYearCalculator')),
  'car-tax': dynamic(() => import('@/tools/car-tax/CarTaxCalculator')),
  'retirement-pay': dynamic(() => import('@/tools/retirement-pay/RetirementPayEstimator')),
  'car-inspection': dynamic(() => import('@/tools/car-inspection/CarInspectionCalculator')),
  'paint-calc': dynamic(() => import('@/tools/paint-calc/PaintCalculator')),
  wbgt: dynamic(() => import('@/tools/wbgt/WbgtCalculator')),
  'wind-chill': dynamic(() => import('@/tools/wind-chill/WindChillCalculator')),
  // Developer
  password: dynamic(() => import('@/tools/password/PasswordGenerator')),
  hash: dynamic(() => import('@/tools/hash/HashGenerator')),
  uuid: dynamic(() => import('@/tools/uuid/UuidGenerator')),
  'base-converter': dynamic(() => import('@/tools/base-converter/BaseConverter')),
  'color-converter': dynamic(() => import('@/tools/color-converter/ColorConverter')),
  'json-formatter': dynamic(() => import('@/tools/json-formatter/JsonFormatter')),
  encode: dynamic(() => import('@/tools/encode/EncodeTool')),
  regex: dynamic(() => import('@/tools/regex/RegexTester')),
  'ip-calc': dynamic(() => import('@/tools/ip-calc/IpCalculator')),
  cron: dynamic(() => import('@/tools/cron/CronParser')),
  chmod: dynamic(() => import('@/tools/chmod/ChmodCalculator')),
  jwt: dynamic(() => import('@/tools/jwt/JwtDecoder')),
  'csv-json': dynamic(() => import('@/tools/csv-json/CsvJsonConverter')),
  'sql-formatter': dynamic(() => import('@/tools/sql-formatter/SqlFormatter')),
  'byte-converter': dynamic(() => import('@/tools/byte-converter/ByteConverter')),
  'http-status': dynamic(() => import('@/tools/http-status/HttpStatusReference')),
  markdown: dynamic(() => import('@/tools/markdown/MarkdownPreview')),
  gradient: dynamic(() => import('@/tools/gradient/GradientGenerator')),
  'qr-generator': dynamic(() => import('@/tools/qr-generator/QrGenerator')),
  lorem: dynamic(() => import('@/tools/lorem/LoremGenerator')),
};

interface EnToolPageClientProps {
  toolId: string;
  toolName: string;
  toolDescription: string;
}

export default function EnToolPageClient({ toolId, toolName, toolDescription }: EnToolPageClientProps) {
  const Component = toolComponents[toolId];
  const en = toolTranslations[toolId];

  return (
    <div>
      <div className="mb-6">
        <Link href="/en" className="text-sm text-[var(--color-primary)] hover:underline">&larr; Back to all tools</Link>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h1 className="text-2xl font-bold mb-1">{en?.name || toolName}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{en?.description || toolDescription}</p>
        {Component ? <Component /> : <p>This tool is coming soon.</p>}
      </div>
    </div>
  );
}
