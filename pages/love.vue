<script setup lang="ts">
import { commonT, t, type Lang } from '~/utils/i18n'
import { useLang } from '~/composables/useLang'

const { lang } = useLang()

const tr: Record<string, Record<Lang, string>> = {
  title: { ko: '궁합 계산기', en: 'Love Calculator', ja: '相性占い', zh: '爱情计算器', ru: 'Калькулятор любви' },
  name1: { ko: '이름 1', en: 'Name 1', ja: '名前 1', zh: '姓名 1', ru: 'Имя 1' },
  name2: { ko: '이름 2', en: 'Name 2', ja: '名前 2', zh: '姓名 2', ru: 'Имя 2' },
  result: { ko: '궁합 결과', en: 'Compatibility', ja: '相性結果', zh: '匹配结果', ru: 'Совместимость' },
  perfect: { ko: '운명적인 만남! 💕', en: 'Soulmates! 💕', ja: '運命の出会い！💕', zh: '命中注定！💕', ru: 'Родственные души! 💕' },
  great: { ko: '환상의 커플! 💖', en: 'Great match! 💖', ja: '最高のカップル！💖', zh: '绝配！💖', ru: 'Отличная пара! 💖' },
  good: { ko: '좋은 궁합이에요 💗', en: 'Good match 💗', ja: '相性いいですね 💗', zh: '不错的搭配 💗', ru: 'Хорошая пара 💗' },
  okay: { ko: '나쁘지 않아요 💛', en: 'Not bad 💛', ja: '悪くないです 💛', zh: '还不错 💛', ru: 'Неплохо 💛' },
  tryHarder: { ko: '노력이 필요해요 😅', en: 'Needs work 😅', ja: '努力が必要 😅', zh: '需要努力 😅', ru: 'Нужно постараться 😅' },
  note: { ko: '※ 재미로만 봐주세요!', en: '※ Just for fun!', ja: '※ お遊びとしてご覧ください！', zh: '※ 仅供娱乐！', ru: '※ Только для развлечения!' },
}

const name1 = ref('')
const name2 = ref('')
const score = ref<number | null>(null)
const calculated = ref(false)

function calculate() {
  if (!name1.value.trim() || !name2.value.trim()) return

  // Hash-based score for consistency
  const combined = (name1.value.trim() + '❤️' + name2.value.trim()).toLowerCase()
  let hash = 0
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash |= 0
  }
  score.value = Math.abs(hash % 101) // 0-100
  calculated.value = true
}

const message = computed(() => {
  if (score.value === null) return ''
  if (score.value >= 90) return t(tr, 'perfect', lang)
  if (score.value >= 70) return t(tr, 'great', lang)
  if (score.value >= 50) return t(tr, 'good', lang)
  if (score.value >= 30) return t(tr, 'okay', lang)
  return t(tr, 'tryHarder', lang)
})

const heartColor = computed(() => {
  if (score.value === null) return '#ef4444'
  if (score.value >= 70) return '#ef4444'
  if (score.value >= 50) return '#f472b6'
  if (score.value >= 30) return '#fbbf24'
  return '#9ca3af'
})

function reset() {
  name1.value = ''
  name2.value = ''
  score.value = null
  calculated.value = false
}
</script>

<template>
  <div>
    <NuxtLink to="/" class="back-link">← {{ t(commonT, 'home', lang) }}</NuxtLink>

    <div class="calc-container">
      <h1 class="page-title">💕 {{ t(tr, 'title', lang) }}</h1>

      <div class="calc-box love-box">
        <div class="form-group">
          <label class="form-label">{{ t(tr, 'name1', lang) }}</label>
          <input type="text" v-model="name1" class="form-input" @keyup.enter="calculate" />
        </div>

        <div class="heart-divider">💕</div>

        <div class="form-group">
          <label class="form-label">{{ t(tr, 'name2', lang) }}</label>
          <input type="text" v-model="name2" class="form-input" @keyup.enter="calculate" />
        </div>

        <button class="btn btn-primary btn-block" @click="calculate" style="margin-top: 0.5rem;">
          {{ t(commonT, 'calculate', lang) }}
        </button>

        <template v-if="calculated && score !== null">
          <div class="love-result">
            <div class="love-score" :style="{ color: heartColor }">{{ score }}%</div>
            <div class="love-bar-wrapper">
              <div class="love-bar">
                <div class="love-bar-fill" :style="{ width: score + '%', background: heartColor }"></div>
              </div>
            </div>
            <div class="love-message">{{ message }}</div>
          </div>

          <button class="btn btn-secondary btn-block" @click="reset" style="margin-top: 0.75rem;">
            {{ t(commonT, 'reset', lang) }}
          </button>
        </template>

        <div class="note">{{ t(tr, 'note', lang) }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.love-box {
  text-align: center;
}
.heart-divider {
  font-size: 1.5rem;
  margin: 0.25rem 0;
}
.love-result {
  margin-top: 1.25rem;
  padding: 1.25rem;
  background: var(--result-bg);
  border-radius: 12px;
  border: 1px solid var(--border);
}
.love-score {
  font-size: 3rem;
  font-weight: 800;
  line-height: 1;
  margin-bottom: 0.75rem;
}
.love-bar-wrapper {
  margin-bottom: 0.75rem;
}
.love-bar {
  height: 8px;
  background: var(--bg-input);
  border-radius: 4px;
  overflow: hidden;
}
.love-bar-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.8s ease;
}
.love-message {
  font-size: 1.1rem;
  font-weight: 600;
}
.note {
  margin-top: 1rem;
  font-size: 0.7rem;
  color: var(--text-muted);
}
</style>
