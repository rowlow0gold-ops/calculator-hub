export type Lang = 'ko' | 'en' | 'ja' | 'zh' | 'ru'

export const LANGS: { code: Lang; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'zh', label: '中' },
  { code: 'ko', label: '한' },
  { code: 'ja', label: '日' },
  { code: 'ru', label: 'RU' },
]

export function detectLang(): Lang {
  if (typeof navigator === 'undefined') return 'en'
  const raw = navigator.language.slice(0, 2)
  const map: Record<string, Lang> = { ko: 'ko', en: 'en', ja: 'ja', zh: 'zh', ru: 'ru' }
  return map[raw] || 'en'
}

type Translations = Record<string, Record<Lang, string>>

export function t(translations: Translations, key: string, lang: Lang): string {
  return translations[key]?.[lang] || translations[key]?.['en'] || key
}

// Common UI translations
export const commonT: Translations = {
  home: { ko: '홈', en: 'Home', ja: 'ホーム', zh: '首页', ru: 'Главная' },
  calculators: { ko: '계산기 모음', en: 'Calculator Hub', ja: '計算機コレクション', zh: '计算器合集', ru: 'Набор калькуляторов' },
  back: { ko: '뒤로', en: 'Back', ja: '戻る', zh: '返回', ru: 'Назад' },
  result: { ko: '결과', en: 'Result', ja: '結果', zh: '结果', ru: 'Результат' },
  calculate: { ko: '계산', en: 'Calculate', ja: '計算', zh: '计算', ru: 'Рассчитать' },
  reset: { ko: '초기화', en: 'Reset', ja: 'リセット', zh: '重置', ru: 'Сброс' },
  darkMode: { ko: '다크 모드', en: 'Dark Mode', ja: 'ダークモード', zh: '暗色模式', ru: 'Тёмный режим' },
  lightMode: { ko: '라이트 모드', en: 'Light Mode', ja: 'ライトモード', zh: '浅色模式', ru: 'Светлый режим' },
}

// Calculator definitions
export interface CalcDef {
  id: string
  icon: string
  color: string
  name: Record<Lang, string>
  description: Record<Lang, string>
}

export const calculators: CalcDef[] = [
  {
    id: 'calculator',
    icon: '🔢',
    color: '#6b7280',
    name: { ko: '일반 계산기', en: 'Calculator', ja: '電卓', zh: '计算器', ru: 'Калькулятор' },
    description: {
      ko: '기본 사칙연산 및 공학용 계산기',
      en: 'Standard & scientific calculator',
      ja: '基本・関数電卓',
      zh: '标准和科学计算器',
      ru: 'Обычный и научный калькулятор',
    },
  },
  {
    id: 'age',
    icon: '🎂',
    color: '#8b5cf6',
    name: { ko: '나이 계산기', en: 'Age Calculator', ja: '年齢計算', zh: '年龄计算器', ru: 'Калькулятор возраста' },
    description: {
      ko: '만 나이, 한국 나이 계산',
      en: 'International & Korean age',
      ja: '満年齢・韓国年齢',
      zh: '国际年龄和韩国年龄',
      ru: 'Международный и корейский возраст',
    },
  },
  {
    id: 'currency',
    icon: '💱',
    color: '#10b981',
    name: { ko: '환율 계산기', en: 'Currency Converter', ja: '為替計算', zh: '汇率计算器', ru: 'Конвертер валют' },
    description: {
      ko: '실시간 환율 변환',
      en: 'Live exchange rate conversion',
      ja: 'リアルタイム為替変換',
      zh: '实时汇率转换',
      ru: 'Конвертация валют в реальном времени',
    },
  },
  {
    id: 'bmi',
    icon: '⚖️',
    color: '#f97316',
    name: { ko: 'BMI 계산기', en: 'BMI Calculator', ja: 'BMI計算', zh: 'BMI计算器', ru: 'Калькулятор ИМТ' },
    description: {
      ko: '체질량 지수 계산',
      en: 'Body Mass Index calculator',
      ja: '体格指数の計算',
      zh: '体重指数计算',
      ru: 'Индекс массы тела',
    },
  },
  {
    id: 'salary',
    icon: '💰',
    color: '#3b82f6',
    name: { ko: '세후 급여 계산기', en: 'After-Tax Pay', ja: '手取り計算', zh: '税后工资', ru: 'Зарплата после налогов' },
    description: {
      ko: '4대 보험 공제 후 실수령액',
      en: 'Net pay after deductions',
      ja: '控除後の手取り額',
      zh: '扣除后实际收入',
      ru: 'Чистая зарплата после вычетов',
    },
  },
  {
    id: 'loan',
    icon: '🏦',
    color: '#14b8a6',
    name: { ko: '대출 이자 계산기', en: 'Loan Calculator', ja: 'ローン計算', zh: '贷款计算器', ru: 'Кредитный калькулятор' },
    description: {
      ko: '원리금 균등/원금 균등 상환',
      en: 'Equal payment / equal principal',
      ja: '元利均等・元金均等返済',
      zh: '等额本息/等额本金',
      ru: 'Аннуитетный / дифференцированный',
    },
  },
  {
    id: 'unit',
    icon: '📏',
    color: '#ec4899',
    name: { ko: '단위 변환기', en: 'Unit Converter', ja: '単位変換', zh: '单位转换器', ru: 'Конвертер единиц' },
    description: {
      ko: '길이, 무게, 온도 등 단위 변환',
      en: 'Length, weight, temperature & more',
      ja: '長さ・重さ・温度の変換',
      zh: '长度、重量、温度等转换',
      ru: 'Длина, вес, температура и др.',
    },
  },
  {
    id: 'date',
    icon: '📅',
    color: '#eab308',
    name: { ko: '날짜 계산기', en: 'Date Calculator', ja: '日付計算', zh: '日期计算器', ru: 'Калькулятор дат' },
    description: {
      ko: 'D-day, 날짜 차이 계산',
      en: 'D-day & date difference',
      ja: 'D-day・日数計算',
      zh: 'D-day和日期差计算',
      ru: 'D-day и разница дат',
    },
  },
  {
    id: 'love',
    icon: '💕',
    color: '#f472b6',
    name: { ko: '궁합 계산기', en: 'Love Calculator', ja: '相性占い', zh: '爱情计算器', ru: 'Калькулятор любви' },
    description: {
      ko: '이름으로 보는 궁합 테스트',
      en: 'Name compatibility test',
      ja: '名前で相性チェック',
      zh: '姓名配对测试',
      ru: 'Тест совместимости по имени',
    },
  },
]
