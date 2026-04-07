<script setup lang="ts">
import { commonT, t, type Lang } from '~/utils/i18n'
import { useLang } from '~/composables/useLang'

const { lang } = useLang()

const tr: Record<string, Record<Lang, string>> = {
  title: { ko: '세후 급여 계산기', en: 'After-Tax Pay', ja: '手取り計算', zh: '税后工资', ru: 'Зарплата после налогов' },
  monthlySalary: { ko: '월급 (원)', en: 'Monthly Salary (KRW)', ja: '月給 (ウォン)', zh: '月薪 (韩元)', ru: 'Зарплата (вон)' },
  dependents: { ko: '부양 가족 수 (본인 포함)', en: 'Dependents (incl. self)', ja: '扶養家族数 (本人込)', zh: '赡养人数 (含本人)', ru: 'Иждивенцы (вкл. себя)' },
  netPay: { ko: '실수령액', en: 'Net Pay', ja: '手取り額', zh: '实际收入', ru: 'Чистая зарплата' },
  deductions: { ko: '공제 내역', en: 'Deductions', ja: '控除内訳', zh: '扣除明细', ru: 'Вычеты' },
  nationalPension: { ko: '국민연금', en: 'National Pension', ja: '国民年金', zh: '国民年金', ru: 'Национальная пенсия' },
  healthInsurance: { ko: '건강보험', en: 'Health Insurance', ja: '健康保険', zh: '健康保险', ru: 'Мед. страхование' },
  longTermCare: { ko: '장기요양보험', en: 'Long-term Care', ja: '介護保険', zh: '长期护理', ru: 'Долгоср. уход' },
  employment: { ko: '고용보험', en: 'Employment Ins.', ja: '雇用保険', zh: '雇佣保险', ru: 'Страх. занятости' },
  incomeTax: { ko: '소득세', en: 'Income Tax', ja: '所得税', zh: '所得税', ru: 'НДФЛ' },
  localTax: { ko: '지방소득세', en: 'Local Tax', ja: '地方税', zh: '地方税', ru: 'Местный налог' },
  total: { ko: '총 공제액', en: 'Total Deductions', ja: '控除合計', zh: '总扣除', ru: 'Итого вычеты' },
  perYear: { ko: '연간 실수령액', en: 'Annual Net Pay', ja: '年間手取り', zh: '年净收入', ru: 'Годовая чистая' },
  nonTaxable: { ko: '비과세액 (식대 등)', en: 'Non-taxable (meal etc.)', ja: '非課税額', zh: '非课税额', ru: 'Необлагаемая сумма' },
}

const salary = ref<number | null>(3000000)
const dependents = ref(1)
const nonTaxable = ref(200000)

// 2026 Korean social insurance rates (employee portion)
const RATES = {
  nationalPension: 0.0475,       // 4.75% (9.5% total, reform 2026~)
  healthInsurance: 0.03595,      // 3.595% (7.19% total)
  longTermCare: 0.1314,          // 13.14% of health insurance
  employment: 0.009,             // 0.9%
}

const result = computed(() => {
  if (!salary.value || salary.value <= 0) return null
  const s = salary.value
  const taxable = Math.max(0, s - nonTaxable.value) // 과세 기준액

  const nationalPension = Math.min(taxable * RATES.nationalPension, 280250) // cap: 5,900,000 * 4.75%
  const healthInsurance = taxable * RATES.healthInsurance
  const longTermCare = healthInsurance * RATES.longTermCare
  const employment = taxable * RATES.employment

  // Income tax based on 간이세액표 approximation
  // Step 1: 근로소득공제 (Earned Income Deduction)
  const annual = taxable * 12
  let earnedDeduction = 0
  if (annual <= 5_000_000) earnedDeduction = annual * 0.7
  else if (annual <= 15_000_000) earnedDeduction = 3_500_000 + (annual - 5_000_000) * 0.4
  else if (annual <= 45_000_000) earnedDeduction = 7_500_000 + (annual - 15_000_000) * 0.15
  else if (annual <= 100_000_000) earnedDeduction = 12_000_000 + (annual - 45_000_000) * 0.05
  else earnedDeduction = 14_750_000 + (annual - 100_000_000) * 0.02

  // Step 2: 과세표준 = 총급여 - 근로소득공제 - 인적공제(150만 x 부양가족수) - 국민연금공제 - 건강보험공제
  const personalExemption = dependents.value * 1_500_000
  const insuranceDeduction = (nationalPension + healthInsurance + longTermCare + employment) * 12
  let taxBase = annual - earnedDeduction - personalExemption - insuranceDeduction
  taxBase = Math.max(0, taxBase)

  // Step 3: Tax brackets
  let annualTax = 0
  if (taxBase <= 14_000_000) annualTax = taxBase * 0.06
  else if (taxBase <= 50_000_000) annualTax = 840_000 + (taxBase - 14_000_000) * 0.15
  else if (taxBase <= 88_000_000) annualTax = 6_240_000 + (taxBase - 50_000_000) * 0.24
  else if (taxBase <= 150_000_000) annualTax = 15_360_000 + (taxBase - 88_000_000) * 0.35
  else if (taxBase <= 300_000_000) annualTax = 37_060_000 + (taxBase - 150_000_000) * 0.38
  else if (taxBase <= 500_000_000) annualTax = 94_060_000 + (taxBase - 300_000_000) * 0.40
  else if (taxBase <= 1_000_000_000) annualTax = 174_060_000 + (taxBase - 500_000_000) * 0.42
  else annualTax = 384_060_000 + (taxBase - 1_000_000_000) * 0.45

  // Step 4: 근로소득세액공제
  let taxCredit = 0
  if (annualTax <= 1_300_000) taxCredit = annualTax * 0.55
  else taxCredit = 715_000 + (annualTax - 1_300_000) * 0.30
  // Cap
  if (annual <= 33_000_000) taxCredit = Math.min(taxCredit, 740_000)
  else if (annual <= 70_000_000) taxCredit = Math.min(taxCredit, 660_000)
  else taxCredit = Math.min(taxCredit, 500_000)

  let incomeTax = Math.max(0, (annualTax - taxCredit) / 12)

  const localTax = incomeTax * 0.1

  const totalDeduction = nationalPension + healthInsurance + longTermCare + employment + incomeTax + localTax
  const netPay = s - totalDeduction

  return {
    nationalPension: Math.round(nationalPension),
    healthInsurance: Math.round(healthInsurance),
    longTermCare: Math.round(longTermCare),
    employment: Math.round(employment),
    incomeTax: Math.round(incomeTax),
    localTax: Math.round(localTax),
    totalDeduction: Math.round(totalDeduction),
    netPay: Math.round(netPay),
    annualNet: Math.round(netPay * 12),
  }
})

function fmtKor(n: number | null): string {
  if (!n || n <= 0) return ''
  const uk = Math.floor(n / 100000000)
  const man = Math.floor((n % 100000000) / 10000)
  const rest = n % 10000
  let s = ''
  if (uk) s += uk + '억 '
  if (man) s += man.toLocaleString() + '만 '
  if (rest) s += rest.toLocaleString() + '원'
  return s.trim()
}

function fmt(n: number): string {
  return n.toLocaleString()
}
</script>

<template>
  <div>
    <NuxtLink to="/" class="back-link">← {{ t(commonT, 'home', lang) }}</NuxtLink>

    <div class="calc-container">
      <h1 class="page-title">💰 {{ t(tr, 'title', lang) }}</h1>

      <div class="calc-box">
        <div class="form-group">
          <label class="form-label">{{ t(tr, 'monthlySalary', lang) }}</label>
          <input type="number" v-model.number="salary" class="form-input" placeholder="3,000,000" min="0" step="10000" />
          <div class="quick-btns">
            <button type="button" class="quick-btn" @click="salary = (salary || 0) + 1000000">+100만</button>
            <button type="button" class="quick-btn" @click="salary = (salary || 0) + 500000">+50만</button>
            <button type="button" class="quick-btn" @click="salary = (salary || 0) + 100000">+10만</button>
            <button type="button" class="quick-btn reset" @click="salary = null">C</button>
          </div>
          <div v-if="salary" class="sum-display">= {{ fmtKor(salary) }}</div>
        </div>
        <div class="form-group">
          <label class="form-label">{{ t(tr, 'nonTaxable', lang) }}</label>
          <input type="number" v-model.number="nonTaxable" class="form-input" placeholder="200,000" min="0" step="10000" />
        </div>
        <div class="form-group">
          <label class="form-label">{{ t(tr, 'dependents', lang) }}</label>
          <input type="number" v-model.number="dependents" class="form-input" min="1" max="20" />
        </div>

        <template v-if="result">
          <div class="result-box">
            <div class="result-label">{{ t(tr, 'netPay', lang) }}</div>
            <div class="result-value">₩{{ fmt(result.netPay) }}</div>
            <div class="result-sub">{{ t(tr, 'perYear', lang) }}: ₩{{ fmt(result.annualNet) }}</div>
          </div>

          <div class="deduction-table">
            <div class="deduction-header">{{ t(tr, 'deductions', lang) }}</div>
            <div class="deduction-row">
              <span>{{ t(tr, 'nationalPension', lang) }}</span>
              <span>-₩{{ fmt(result.nationalPension) }}</span>
            </div>
            <div class="deduction-row">
              <span>{{ t(tr, 'healthInsurance', lang) }}</span>
              <span>-₩{{ fmt(result.healthInsurance) }}</span>
            </div>
            <div class="deduction-row">
              <span>{{ t(tr, 'longTermCare', lang) }}</span>
              <span>-₩{{ fmt(result.longTermCare) }}</span>
            </div>
            <div class="deduction-row">
              <span>{{ t(tr, 'employment', lang) }}</span>
              <span>-₩{{ fmt(result.employment) }}</span>
            </div>
            <div class="deduction-row">
              <span>{{ t(tr, 'incomeTax', lang) }}</span>
              <span>-₩{{ fmt(result.incomeTax) }}</span>
            </div>
            <div class="deduction-row">
              <span>{{ t(tr, 'localTax', lang) }}</span>
              <span>-₩{{ fmt(result.localTax) }}</span>
            </div>
            <div class="deduction-row total">
              <span>{{ t(tr, 'total', lang) }}</span>
              <span>-₩{{ fmt(result.totalDeduction) }}</span>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.quick-btns {
  display: flex;
  gap: 0.4rem;
  margin-top: 0.4rem;
  flex-wrap: wrap;
}
.quick-btn {
  padding: 0.3rem 0.7rem;
  font-size: 0.75rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--tag-bg);
  color: var(--text-sub);
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.quick-btn:hover {
  background: var(--accent);
  color: #fff;
  border-color: var(--accent);
}
.quick-btn.reset {
  background: transparent;
  color: #ef4444;
  border-color: #ef4444;
}
.quick-btn.reset:hover {
  background: #ef4444;
  color: #fff;
}
.sum-display {
  margin-top: 0.3rem;
  font-size: 0.85rem;
  color: var(--accent);
  font-weight: 600;
}
.deduction-table {
  margin-top: 1rem;
  background: var(--result-bg);
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
}
.deduction-header {
  padding: 0.6rem 1rem;
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--text-sub);
  border-bottom: 1px solid var(--border);
}
.deduction-row {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 1rem;
  font-size: 0.85rem;
  color: var(--text-sub);
  border-bottom: 1px solid var(--border);
}
.deduction-row:last-child { border-bottom: none; }
.deduction-row.total {
  font-weight: 700;
  color: var(--text);
  background: var(--tag-bg);
}
</style>
