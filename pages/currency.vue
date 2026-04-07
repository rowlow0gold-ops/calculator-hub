<script setup lang="ts">
import { commonT, t, type Lang } from '~/utils/i18n'
import { useLang } from '~/composables/useLang'

const { lang } = useLang()

const tr: Record<string, Record<Lang, string>> = {
  title: { ko: '환율 계산기', en: 'Currency Converter', ja: '為替計算', zh: '汇率计算器', ru: 'Конвертер валют' },
  from: { ko: '변환 전', en: 'From', ja: '変換元', zh: '从', ru: 'Из' },
  to: { ko: '변환 후', en: 'To', ja: '変換先', zh: '到', ru: 'В' },
  amount: { ko: '금액', en: 'Amount', ja: '金額', zh: '金额', ru: 'Сумма' },
  rate: { ko: '환율', en: 'Rate', ja: 'レート', zh: '汇率', ru: 'Курс' },
  loading: { ko: '환율 로딩 중...', en: 'Loading rates...', ja: 'レート読み込み中...', zh: '加载汇率中...', ru: 'Загрузка курсов...' },
  error: { ko: '환율을 불러올 수 없습니다', en: 'Failed to load rates', ja: 'レートを読み込めません', zh: '无法加载汇率', ru: 'Не удалось загрузить курсы' },
  swap: { ko: '↕ 전환', en: '↕ Swap', ja: '↕ 入替', zh: '↕ 交换', ru: '↕ Поменять' },
}

const currencies = [
  { code: 'USD', name: '🇺🇸 USD', symbol: '$' },
  { code: 'KRW', name: '🇰🇷 KRW', symbol: '₩' },
  { code: 'JPY', name: '🇯🇵 JPY', symbol: '¥' },
  { code: 'CNY', name: '🇨🇳 CNY', symbol: '¥' },
  { code: 'RUB', name: '🇷🇺 RUB', symbol: '₽' },
  { code: 'EUR', name: '🇪🇺 EUR', symbol: '€' },
  { code: 'GBP', name: '🇬🇧 GBP', symbol: '£' },
  { code: 'CAD', name: '🇨🇦 CAD', symbol: 'C$' },
  { code: 'AUD', name: '🇦🇺 AUD', symbol: 'A$' },
  { code: 'CHF', name: '🇨🇭 CHF', symbol: 'Fr' },
]

const fromCurrency = ref('USD')
const toCurrency = ref('KRW')
const amount = ref<number>(1)
const rates = ref<Record<string, number>>({})
const loading = ref(true)
const error = ref(false)

async function fetchRates() {
  loading.value = true
  error.value = false
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/USD')
    const data = await res.json()
    if (data.result === 'success') {
      rates.value = data.rates
    } else {
      error.value = true
    }
  } catch {
    error.value = true
  }
  loading.value = false
}

onMounted(fetchRates)

const result = computed(() => {
  if (!rates.value[fromCurrency.value] || !rates.value[toCurrency.value]) return null
  const fromRate = rates.value[fromCurrency.value]
  const toRate = rates.value[toCurrency.value]
  return (amount.value / fromRate) * toRate
})

const exchangeRate = computed(() => {
  if (!rates.value[fromCurrency.value] || !rates.value[toCurrency.value]) return null
  return rates.value[toCurrency.value] / rates.value[fromCurrency.value]
})

function swap() {
  const temp = fromCurrency.value
  fromCurrency.value = toCurrency.value
  toCurrency.value = temp
}

function formatNumber(n: number): string {
  if (Math.abs(n) >= 1) return n.toLocaleString(undefined, { maximumFractionDigits: 2 })
  return n.toFixed(6)
}
</script>

<template>
  <div>
    <NuxtLink to="/" class="back-link">← {{ t(commonT, 'home', lang) }}</NuxtLink>

    <div class="calc-container">
      <h1 class="page-title">💱 {{ t(tr, 'title', lang) }}</h1>

      <div class="calc-box">
        <div v-if="loading" class="loading-text">{{ t(tr, 'loading', lang) }}</div>
        <div v-else-if="error" class="error-text">{{ t(tr, 'error', lang) }}</div>
        <template v-else>
          <div class="form-group">
            <label class="form-label">{{ t(tr, 'amount', lang) }}</label>
            <input type="number" v-model.number="amount" class="form-input" min="0" step="any" />
          </div>

          <div class="form-group">
            <label class="form-label">{{ t(tr, 'from', lang) }}</label>
            <select v-model="fromCurrency" class="form-select">
              <option v-for="c in currencies" :key="c.code" :value="c.code">{{ c.name }}</option>
            </select>
          </div>

          <button class="btn btn-secondary btn-block swap-btn" @click="swap">
            {{ t(tr, 'swap', lang) }}
          </button>

          <div class="form-group">
            <label class="form-label">{{ t(tr, 'to', lang) }}</label>
            <select v-model="toCurrency" class="form-select">
              <option v-for="c in currencies" :key="c.code" :value="c.code">{{ c.name }}</option>
            </select>
          </div>

          <div v-if="result !== null" class="result-box">
            <div class="result-label">{{ t(tr, 'to', lang) }}</div>
            <div class="result-value">{{ formatNumber(result) }} <span class="currency-code">{{ toCurrency }}</span></div>
            <div class="result-sub" v-if="exchangeRate">
              1 {{ fromCurrency }} = {{ formatNumber(exchangeRate) }} {{ toCurrency }}
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.loading-text, .error-text {
  text-align: center;
  padding: 2rem;
  color: var(--text-muted);
}
.error-text { color: #ef4444; }
.swap-btn {
  margin: 0.5rem 0;
}
.currency-code {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-sub);
}
</style>
