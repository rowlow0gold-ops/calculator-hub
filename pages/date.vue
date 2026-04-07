<script setup lang="ts">
import { commonT, t, type Lang } from '~/utils/i18n'
import { useLang } from '~/composables/useLang'

const { lang } = useLang()

const tr: Record<string, Record<Lang, string>> = {
  title: { ko: '날짜 계산기', en: 'Date Calculator', ja: '日付計算', zh: '日期计算器', ru: 'Калькулятор дат' },
  mode1: { ko: '두 날짜 사이', en: 'Between Dates', ja: '日付の差', zh: '两日期之间', ru: 'Между датами' },
  mode2: { ko: '날짜 더하기/빼기', en: 'Add/Subtract Days', ja: '日数加減', zh: '加减天数', ru: 'Прибавить/вычесть' },
  startDate: { ko: '시작일', en: 'Start Date', ja: '開始日', zh: '开始日期', ru: 'Начальная дата' },
  endDate: { ko: '종료일', en: 'End Date', ja: '終了日', zh: '结束日期', ru: 'Конечная дата' },
  days: { ko: '일', en: 'days', ja: '日', zh: '天', ru: 'дн.' },
  weeks: { ko: '주', en: 'weeks', ja: '週', zh: '周', ru: 'нед.' },
  months: { ko: '개월', en: 'months', ja: 'ヶ月', zh: '个月', ru: 'мес.' },
  years: { ko: '년', en: 'years', ja: '年', zh: '年', ru: 'лет' },
  difference: { ko: '차이', en: 'Difference', ja: '差', zh: '差值', ru: 'Разница' },
  addDays: { ko: '더할 일수', en: 'Days to Add', ja: '加算日数', zh: '加减天数', ru: 'Дней' },
  resultDate: { ko: '결과 날짜', en: 'Result Date', ja: '結果日', zh: '结果日期', ru: 'Результат' },
  dday: { ko: 'D-Day', en: 'D-Day', ja: 'D-Day', zh: 'D-Day', ru: 'D-Day' },
  today: { ko: '오늘부터', en: 'From today', ja: '今日から', zh: '从今天起', ru: 'От сегодня' },
}

const mode = ref<'between' | 'add'>('between')
const today = new Date().toISOString().slice(0, 10)
const startDate = ref(today)
const endDate = ref(today)
const addDays = ref<number>(0)

const betweenResult = computed(() => {
  if (!startDate.value || !endDate.value) return null
  const start = new Date(startDate.value)
  const end = new Date(endDate.value)
  const diffMs = end.getTime() - start.getTime()
  const totalDays = Math.round(diffMs / (1000 * 60 * 60 * 24))
  const absDays = Math.abs(totalDays)
  const weeks = Math.floor(absDays / 7)
  const remainDays = absDays % 7

  let years = end.getFullYear() - start.getFullYear()
  let months = end.getMonth() - start.getMonth()
  let days = end.getDate() - start.getDate()
  if (days < 0) {
    months--
    const prev = new Date(end.getFullYear(), end.getMonth(), 0)
    days += prev.getDate()
  }
  if (months < 0) {
    years--
    months += 12
  }

  return { totalDays, absDays, weeks, remainDays, years: Math.abs(years), months: Math.abs(months), days: Math.abs(days) }
})

const addResult = computed(() => {
  if (!startDate.value) return null
  const start = new Date(startDate.value)
  start.setDate(start.getDate() + addDays.value)
  return start.toISOString().slice(0, 10)
})

const dday = computed(() => {
  if (!endDate.value) return null
  const end = new Date(endDate.value)
  const now = new Date(today)
  const diff = Math.round((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  if (diff === 0) return 'D-Day'
  return diff > 0 ? `D-${diff}` : `D+${Math.abs(diff)}`
})

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  const dayNames: Record<Lang, string[]> = {
    ko: ['일', '월', '화', '수', '목', '금', '토'],
    en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    ja: ['日', '月', '火', '水', '木', '金', '土'],
    zh: ['日', '一', '二', '三', '四', '五', '六'],
    ru: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
  }
  return `${dateStr} (${dayNames[lang.value][d.getDay()]})`
}
</script>

<template>
  <div>
    <NuxtLink to="/" class="back-link">← {{ t(commonT, 'home', lang) }}</NuxtLink>

    <div class="calc-container">
      <h1 class="page-title">📅 {{ t(tr, 'title', lang) }}</h1>

      <div class="calc-box">
        <!-- Mode tabs -->
        <div class="mode-tabs">
          <button class="mode-tab" :class="{ active: mode === 'between' }" @click="mode = 'between'">{{ t(tr, 'mode1', lang) }}</button>
          <button class="mode-tab" :class="{ active: mode === 'add' }" @click="mode = 'add'">{{ t(tr, 'mode2', lang) }}</button>
        </div>

        <!-- Between dates -->
        <template v-if="mode === 'between'">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">{{ t(tr, 'startDate', lang) }}</label>
              <input type="date" v-model="startDate" class="form-input" />
            </div>
            <div class="form-group">
              <label class="form-label">{{ t(tr, 'endDate', lang) }}</label>
              <input type="date" v-model="endDate" class="form-input" />
            </div>
          </div>

          <template v-if="betweenResult">
            <div class="result-box">
              <div class="result-label">{{ t(tr, 'difference', lang) }}</div>
              <div class="result-value">{{ betweenResult.absDays }} <span style="font-size: 0.9rem; color: var(--text-sub);">{{ t(tr, 'days', lang) }}</span></div>
              <div class="result-sub">
                {{ betweenResult.weeks }} {{ t(tr, 'weeks', lang) }} {{ betweenResult.remainDays }} {{ t(tr, 'days', lang) }}
              </div>
              <div class="result-sub" v-if="betweenResult.years || betweenResult.months">
                {{ betweenResult.years }}{{ t(tr, 'years', lang) }} {{ betweenResult.months }}{{ t(tr, 'months', lang) }} {{ betweenResult.days }}{{ t(tr, 'days', lang) }}
              </div>
            </div>
            <div class="result-box" style="margin-top: 0.75rem;">
              <div class="result-label">{{ t(tr, 'dday', lang) }} ({{ t(tr, 'today', lang) }})</div>
              <div class="result-value" style="font-size: 1.3rem;">{{ dday }}</div>
            </div>
          </template>
        </template>

        <!-- Add days -->
        <template v-else>
          <div class="form-group">
            <label class="form-label">{{ t(tr, 'startDate', lang) }}</label>
            <input type="date" v-model="startDate" class="form-input" />
          </div>
          <div class="form-group">
            <label class="form-label">{{ t(tr, 'addDays', lang) }}</label>
            <input type="number" v-model.number="addDays" class="form-input" />
          </div>

          <div v-if="addResult" class="result-box">
            <div class="result-label">{{ t(tr, 'resultDate', lang) }}</div>
            <div class="result-value" style="font-size: 1.3rem;">{{ formatDate(addResult) }}</div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mode-tabs {
  display: flex;
  gap: 4px;
  background: var(--bg-input);
  border-radius: 10px;
  padding: 3px;
  margin-bottom: 1rem;
}
.mode-tab {
  flex: 1;
  padding: 0.5rem;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: var(--text-muted);
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}
.mode-tab.active {
  background: var(--bg-card);
  color: var(--text);
  box-shadow: 0 1px 3px var(--shadow);
}
</style>
