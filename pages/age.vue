<script setup lang="ts">
import { commonT, t, type Lang } from '~/utils/i18n'
import { useLang } from '~/composables/useLang'

const { lang } = useLang()

const tr: Record<string, Record<Lang, string>> = {
  title: { ko: '나이 계산기', en: 'Age Calculator', ja: '年齢計算', zh: '年龄计算器', ru: 'Калькулятор возраста' },
  birthdate: { ko: '생년월일', en: 'Date of Birth', ja: '生年月日', zh: '出生日期', ru: 'Дата рождения' },
  intlAge: { ko: '만 나이', en: 'International Age', ja: '満年齢', zh: '国际年龄', ru: 'Международный возраст' },
  koreanAge: { ko: '한국 나이', en: 'Korean Age', ja: '韓国年齢', zh: '韩国年龄', ru: 'Корейский возраст' },
  years: { ko: '세', en: 'years', ja: '歳', zh: '岁', ru: 'лет' },
  months: { ko: '개월', en: 'months', ja: 'ヶ月', zh: '个月', ru: 'мес.' },
  days: { ko: '일', en: 'days', ja: '日', zh: '天', ru: 'дн.' },
  nextBirthday: { ko: '다음 생일까지', en: 'Next birthday in', ja: '次の誕生日まで', zh: '距下次生日', ru: 'До дня рождения' },
  note: { ko: '※ 2023년부터 한국도 만 나이 사용', en: '※ Korea uses international age since 2023', ja: '※ 2023年から韓国も満年齢を使用', zh: '※ 韩国自2023年起使用国际年龄', ru: '※ С 2023 года Корея использует международный возраст' },
}

const birthdate = ref('2000-01-01')

const result = computed(() => {
  if (!birthdate.value) return null
  const birth = new Date(birthdate.value)
  const today = new Date()

  if (birth > today) return null

  // International age
  let intlAge = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  const dayDiff = today.getDate() - birth.getDate()
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) intlAge--

  // Korean age (deprecated but still used colloquially)
  const koreanAge = today.getFullYear() - birth.getFullYear() + 1

  // Detailed breakdown
  let months = today.getMonth() - birth.getMonth()
  let days = today.getDate() - birth.getDate()
  if (days < 0) {
    months--
    const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0)
    days += prevMonth.getDate()
  }
  if (months < 0) {
    months += 12
  }

  // Total days lived
  const totalDays = Math.floor((today.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24))

  // Next birthday
  let nextBday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate())
  if (nextBday <= today) {
    nextBday = new Date(today.getFullYear() + 1, birth.getMonth(), birth.getDate())
  }
  const daysUntilBday = Math.floor((nextBday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  return { intlAge, koreanAge, months, days, totalDays, daysUntilBday }
})
</script>

<template>
  <div>
    <NuxtLink to="/" class="back-link">← {{ t(commonT, 'home', lang) }}</NuxtLink>

    <div class="calc-container">
      <h1 class="page-title">🎂 {{ t(tr, 'title', lang) }}</h1>

      <div class="calc-box">
        <div class="form-group">
          <label class="form-label">{{ t(tr, 'birthdate', lang) }}</label>
          <input type="date" v-model="birthdate" class="form-input date-input" ref="dateInput" @click="($refs.dateInput as HTMLInputElement)?.showPicker?.()" />
        </div>

        <template v-if="result">
          <div class="result-box">
            <div class="result-label">{{ t(tr, 'intlAge', lang) }}</div>
            <div class="result-value">{{ result.intlAge }}<span class="result-unit">{{ t(tr, 'years', lang) }}</span></div>
            <div class="result-sub">
              {{ result.intlAge }}{{ t(tr, 'years', lang) }} {{ result.months }}{{ t(tr, 'months', lang) }} {{ result.days }}{{ t(tr, 'days', lang) }}
            </div>
          </div>

          <div class="result-box" style="margin-top: 0.75rem;">
            <div class="result-label">{{ t(tr, 'koreanAge', lang) }}</div>
            <div class="result-value">{{ result.koreanAge }}<span class="result-unit">{{ t(tr, 'years', lang) }}</span></div>
            <div class="result-sub" style="font-size: 0.7rem; color: var(--text-muted);">{{ t(tr, 'note', lang) }}</div>
          </div>

          <div class="result-box" style="margin-top: 0.75rem;">
            <div class="result-label">{{ t(tr, 'nextBirthday', lang) }}</div>
            <div class="result-value" style="font-size: 1.3rem;">{{ result.daysUntilBday }}<span class="result-unit">{{ t(tr, 'days', lang) }}</span></div>
            <div class="result-sub">{{ result.totalDays.toLocaleString() }} {{ t(tr, 'days', lang) }} lived</div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.date-input {
  cursor: pointer;
}
.date-input::-webkit-calendar-picker-indicator {
  cursor: pointer;
  width: 100%;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  opacity: 0;
}
.form-group {
  position: relative;
}
.result-unit {
  font-size: 0.9rem;
  font-weight: 500;
  margin-left: 0.25rem;
  color: var(--text-sub);
}
</style>
