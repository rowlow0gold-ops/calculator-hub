<script setup lang="ts">
import { commonT, t, type Lang } from '~/utils/i18n'
import { useLang } from '~/composables/useLang'

const { lang } = useLang()

const tr: Record<string, Record<Lang, string>> = {
  title: { ko: '대출 이자 계산기', en: 'Loan Calculator', ja: 'ローン計算', zh: '贷款计算器', ru: 'Кредитный калькулятор' },
  principal: { ko: '대출금액 (원)', en: 'Loan Amount', ja: '借入額', zh: '贷款金额', ru: 'Сумма кредита' },
  rate: { ko: '연이율 (%)', en: 'Annual Rate (%)', ja: '年利率 (%)', zh: '年利率 (%)', ru: 'Годовая ставка (%)' },
  term: { ko: '대출기간 (개월)', en: 'Term (months)', ja: '期間 (月)', zh: '贷款期限 (月)', ru: 'Срок (месяцев)' },
  method: { ko: '상환 방식', en: 'Repayment Method', ja: '返済方法', zh: '还款方式', ru: 'Способ погашения' },
  equalPayment: { ko: '원리금 균등', en: 'Equal Payment', ja: '元利均等', zh: '等额本息', ru: 'Аннуитетный' },
  equalPrincipal: { ko: '원금 균등', en: 'Equal Principal', ja: '元金均等', zh: '等额本金', ru: 'Дифференцированный' },
  monthlyPayment: { ko: '월 상환액', en: 'Monthly Payment', ja: '月返済額', zh: '每月还款', ru: 'Ежемесячный платёж' },
  totalInterest: { ko: '총 이자', en: 'Total Interest', ja: '利息合計', zh: '总利息', ru: 'Общие проценты' },
  totalPayment: { ko: '총 상환액', en: 'Total Payment', ja: '返済総額', zh: '总还款额', ru: 'Общая выплата' },
  first: { ko: '첫 달', en: 'First month', ja: '初月', zh: '第一个月', ru: 'Первый месяц' },
  last: { ko: '마지막 달', en: 'Last month', ja: '最終月', zh: '最后一月', ru: 'Последний месяц' },
}

const principal = ref<number | null>(500000000)
const annualRate = ref<number | null>(3)
const termMonths = ref<number | null>(360)
const method = ref<'equal-payment' | 'equal-principal'>('equal-payment')

const result = computed(() => {
  if (!principal.value || !annualRate.value || !termMonths.value) return null
  if (principal.value <= 0 || annualRate.value <= 0 || termMonths.value <= 0) return null

  const P = principal.value
  const r = annualRate.value / 100 / 12
  const n = termMonths.value

  if (method.value === 'equal-payment') {
    const monthly = P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1)
    const totalPayment = monthly * n
    const totalInterest = totalPayment - P
    return {
      monthlyFirst: Math.round(monthly),
      monthlyLast: Math.round(monthly),
      totalInterest: Math.round(totalInterest),
      totalPayment: Math.round(totalPayment),
    }
  } else {
    const principalPart = P / n
    const firstInterest = P * r
    const lastInterest = principalPart * r
    const firstPayment = principalPart + firstInterest
    const lastPayment = principalPart + lastInterest
    let totalInterest = 0
    for (let i = 0; i < n; i++) {
      totalInterest += (P - principalPart * i) * r
    }
    return {
      monthlyFirst: Math.round(firstPayment),
      monthlyLast: Math.round(lastPayment),
      totalInterest: Math.round(totalInterest),
      totalPayment: Math.round(P + totalInterest),
    }
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

function fmt(n: number): string { return n.toLocaleString() }
</script>

<template>
  <div>
    <NuxtLink to="/" class="back-link">← {{ t(commonT, 'home', lang) }}</NuxtLink>

    <div class="calc-container">
      <h1 class="page-title">🏦 {{ t(tr, 'title', lang) }}</h1>

      <div class="calc-box">
        <div class="form-group">
          <label class="form-label">{{ t(tr, 'principal', lang) }}</label>
          <input type="number" v-model.number="principal" class="form-input" placeholder="100,000,000" min="0" />
          <div class="quick-btns">
            <button type="button" class="quick-btn" @click="principal = (principal || 0) + 1000000000">+10억</button>
            <button type="button" class="quick-btn" @click="principal = (principal || 0) + 100000000">+1억</button>
            <button type="button" class="quick-btn" @click="principal = (principal || 0) + 10000000">+1000만</button>
            <button type="button" class="quick-btn reset" @click="principal = null">C</button>
          </div>
          <div v-if="principal" class="sum-display">= {{ fmtKor(principal) }}</div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">{{ t(tr, 'rate', lang) }}</label>
            <input type="number" v-model.number="annualRate" class="form-input" placeholder="4.5" min="0" step="0.1" />
          </div>
          <div class="form-group">
            <label class="form-label">{{ t(tr, 'term', lang) }}</label>
            <input type="number" v-model.number="termMonths" class="form-input" placeholder="360" min="1" />
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">{{ t(tr, 'method', lang) }}</label>
          <select v-model="method" class="form-select">
            <option value="equal-payment">{{ t(tr, 'equalPayment', lang) }}</option>
            <option value="equal-principal">{{ t(tr, 'equalPrincipal', lang) }}</option>
          </select>
        </div>

        <template v-if="result">
          <div class="result-box">
            <div class="result-label">{{ t(tr, 'monthlyPayment', lang) }}</div>
            <div class="result-value">₩{{ fmt(result.monthlyFirst) }}</div>
            <div v-if="result.monthlyFirst !== result.monthlyLast" class="result-sub">
              {{ t(tr, 'first', lang) }}: ₩{{ fmt(result.monthlyFirst) }} → {{ t(tr, 'last', lang) }}: ₩{{ fmt(result.monthlyLast) }}
            </div>
          </div>
          <div class="result-box" style="margin-top: 0.75rem;">
            <div class="result-label">{{ t(tr, 'totalInterest', lang) }}</div>
            <div class="result-value" style="font-size: 1.3rem; color: #ef4444;">₩{{ fmt(result.totalInterest) }}</div>
            <div class="result-sub">{{ t(tr, 'totalPayment', lang) }}: ₩{{ fmt(result.totalPayment) }}</div>
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
</style>
