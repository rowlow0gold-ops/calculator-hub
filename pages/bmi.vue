<script setup lang="ts">
import { commonT, t, type Lang } from '~/utils/i18n'
import { useLang } from '~/composables/useLang'

const { lang } = useLang()

const tr: Record<string, Record<Lang, string>> = {
  title: { ko: 'BMI 계산기', en: 'BMI Calculator', ja: 'BMI計算', zh: 'BMI计算器', ru: 'Калькулятор ИМТ' },
  height: { ko: '키 (cm)', en: 'Height (cm)', ja: '身長 (cm)', zh: '身高 (cm)', ru: 'Рост (см)' },
  weight: { ko: '몸무게 (kg)', en: 'Weight (kg)', ja: '体重 (kg)', zh: '体重 (kg)', ru: 'Вес (кг)' },
  bmi: { ko: 'BMI', en: 'BMI', ja: 'BMI', zh: 'BMI', ru: 'ИМТ' },
  underweight: { ko: '저체중', en: 'Underweight', ja: '低体重', zh: '偏瘦', ru: 'Недостаточный вес' },
  normal: { ko: '정상', en: 'Normal', ja: '普通', zh: '正常', ru: 'Нормальный' },
  overweight: { ko: '과체중', en: 'Overweight', ja: '過体重', zh: '超重', ru: 'Избыточный вес' },
  obese: { ko: '비만', en: 'Obese', ja: '肥満', zh: '肥胖', ru: 'Ожирение' },
  severeObese: { ko: '고도비만', en: 'Severely Obese', ja: '高度肥満', zh: '重度肥胖', ru: 'Тяжёлое ожирение' },
  range: { ko: '정상 범위', en: 'Normal range', ja: '正常範囲', zh: '正常范围', ru: 'Нормальный диапазон' },
}

const height = ref<number | null>(175)
const weight = ref<number | null>(72)

const bmi = computed(() => {
  if (!height.value || !weight.value || height.value <= 0 || weight.value <= 0) return null
  const h = height.value / 100
  return Math.round((weight.value / (h * h)) * 10) / 10
})

const category = computed(() => {
  if (!bmi.value) return null
  if (bmi.value < 18.5) return { key: 'underweight', color: '#3b82f6' }
  if (bmi.value < 25) return { key: 'normal', color: '#10b981' }
  if (bmi.value < 30) return { key: 'overweight', color: '#f59e0b' }
  if (bmi.value < 35) return { key: 'obese', color: '#ef4444' }
  return { key: 'severeObese', color: '#dc2626' }
})

const normalRange = computed(() => {
  if (!height.value || height.value <= 0) return null
  const h = height.value / 100
  const low = Math.round(18.5 * h * h * 10) / 10
  const high = Math.round(24.9 * h * h * 10) / 10
  return { low, high }
})

const barPosition = computed(() => {
  if (!bmi.value) return 0
  // Scale: 15 to 40 mapped to 0% to 100%
  return Math.min(100, Math.max(0, ((bmi.value - 15) / 25) * 100))
})
</script>

<template>
  <div>
    <NuxtLink to="/" class="back-link">← {{ t(commonT, 'home', lang) }}</NuxtLink>

    <div class="calc-container">
      <h1 class="page-title">⚖️ {{ t(tr, 'title', lang) }}</h1>

      <div class="calc-box">
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">{{ t(tr, 'height', lang) }}</label>
            <input type="number" v-model.number="height" class="form-input" placeholder="170" min="1" />
          </div>
          <div class="form-group">
            <label class="form-label">{{ t(tr, 'weight', lang) }}</label>
            <input type="number" v-model.number="weight" class="form-input" placeholder="65" min="1" />
          </div>
        </div>

        <template v-if="bmi && category">
          <div class="result-box">
            <div class="result-label">{{ t(tr, 'bmi', lang) }}</div>
            <div class="result-value" :style="{ color: category.color }">{{ bmi }}</div>
            <div class="result-sub" :style="{ color: category.color }">{{ t(tr, category.key, lang) }}</div>
          </div>

          <!-- BMI bar -->
          <div class="bmi-bar-wrapper">
            <div class="bmi-bar">
              <div class="bmi-zone blue" style="width: 14%"></div>
              <div class="bmi-zone green" style="width: 26%"></div>
              <div class="bmi-zone yellow" style="width: 20%"></div>
              <div class="bmi-zone red" style="width: 40%"></div>
            </div>
            <div class="bmi-indicator" :style="{ left: barPosition + '%' }">▼</div>
            <div class="bmi-labels">
              <span>15</span><span>18.5</span><span>25</span><span>30</span><span>40</span>
            </div>
          </div>

          <div v-if="normalRange" class="result-box" style="margin-top: 0.75rem;">
            <div class="result-label">{{ t(tr, 'range', lang) }}</div>
            <div class="result-sub">{{ normalRange.low }} ~ {{ normalRange.high }} kg</div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bmi-bar-wrapper {
  margin-top: 1rem;
  position: relative;
  padding-bottom: 1.5rem;
}
.bmi-bar {
  display: flex;
  height: 10px;
  border-radius: 5px;
  overflow: hidden;
}
.bmi-zone { height: 100%; }
.bmi-zone.blue { background: #3b82f6; }
.bmi-zone.green { background: #10b981; }
.bmi-zone.yellow { background: #f59e0b; }
.bmi-zone.red { background: #ef4444; }
.bmi-indicator {
  position: absolute;
  top: -6px;
  transform: translateX(-50%);
  font-size: 0.9rem;
  color: var(--text);
  transition: left 0.3s ease;
}
.bmi-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.65rem;
  color: var(--text-muted);
  margin-top: 0.3rem;
}
</style>
