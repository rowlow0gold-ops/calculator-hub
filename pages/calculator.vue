<script setup lang="ts">
import { commonT, t, type Lang } from '~/utils/i18n'
import { useLang } from '~/composables/useLang'

const { lang } = useLang()

const tr: Record<string, Record<Lang, string>> = {
  title: { ko: '일반 계산기', en: 'Calculator', ja: '電卓', zh: '计算器', ru: 'Калькулятор' },
  scientific: { ko: '공학용', en: 'Scientific', ja: '関数', zh: '科学', ru: 'Научный' },
  basic: { ko: '기본', en: 'Basic', ja: '基本', zh: '基本', ru: 'Обычный' },
  deg: { ko: 'DEG', en: 'DEG', ja: 'DEG', zh: 'DEG', ru: 'DEG' },
  rad: { ko: 'RAD', en: 'RAD', ja: 'RAD', zh: 'RAD', ru: 'RAD' },
}

const display = ref('0')
const history = ref('')
const isScientific = ref(false)
const useDeg = ref(true)
let shouldReset = false

function input(val: string) {
  if (shouldReset) {
    display.value = val
    shouldReset = false
  } else {
    display.value = display.value === '0' ? val : display.value + val
  }
}

function operator(op: string) {
  shouldReset = false
  const last = display.value.slice(-1)
  if (['+', '-', '×', '÷'].includes(last)) {
    display.value = display.value.slice(0, -1) + op
  } else {
    display.value += op
  }
}

function calculate() {
  try {
    let expr = display.value
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/π/g, `${Math.PI}`)
      .replace(/e(?![x])/g, `${Math.E}`)

    // Handle scientific functions
    expr = expr.replace(/sin\(([^)]+)\)/g, (_, v) => {
      const n = eval(v)
      return String(Math.sin(useDeg.value ? n * Math.PI / 180 : n))
    })
    expr = expr.replace(/cos\(([^)]+)\)/g, (_, v) => {
      const n = eval(v)
      return String(Math.cos(useDeg.value ? n * Math.PI / 180 : n))
    })
    expr = expr.replace(/tan\(([^)]+)\)/g, (_, v) => {
      const n = eval(v)
      return String(Math.tan(useDeg.value ? n * Math.PI / 180 : n))
    })
    expr = expr.replace(/log\(([^)]+)\)/g, (_, v) => String(Math.log10(eval(v))))
    expr = expr.replace(/ln\(([^)]+)\)/g, (_, v) => String(Math.log(eval(v))))
    expr = expr.replace(/√\(([^)]+)\)/g, (_, v) => String(Math.sqrt(eval(v))))
    expr = expr.replace(/(\d+(?:\.\d+)?)!/g, (_, v) => String(factorial(Number(v))))

    history.value = display.value + ' ='
    const result = eval(expr)
    display.value = Number.isFinite(result) ? String(Math.round(result * 1e10) / 1e10) : 'Error'
    shouldReset = true
  } catch {
    history.value = display.value
    display.value = 'Error'
    shouldReset = true
  }
}

function factorial(n: number): number {
  if (n < 0) return NaN
  if (n <= 1) return 1
  let r = 1
  for (let i = 2; i <= n; i++) r *= i
  return r
}

function clear() {
  display.value = '0'
  history.value = ''
  shouldReset = false
}

function backspace() {
  if (display.value.length <= 1 || shouldReset) {
    display.value = '0'
    shouldReset = false
  } else {
    display.value = display.value.slice(0, -1)
  }
}

function percent() {
  try {
    display.value = String(eval(display.value.replace(/×/g, '*').replace(/÷/g, '/')) / 100)
    shouldReset = true
  } catch {
    display.value = 'Error'
    shouldReset = true
  }
}

function sciFunc(fn: string) {
  display.value += `${fn}(`
}

function insertPi() { input('π') }
function insertE() { input('e') }
function openParen() { input('(') }
function closeParen() { input(')') }
function power() { operator('^'); display.value = display.value.replace('^', '**') }

const basicButtons = [
  ['C', '⌫', '%', '÷'],
  ['7', '8', '9', '×'],
  ['4', '5', '6', '-'],
  ['1', '2', '3', '+'],
  ['±', '0', '.', '='],
]

function handleBtn(btn: string) {
  switch (btn) {
    case 'C': clear(); break
    case '⌫': backspace(); break
    case '%': percent(); break
    case '=': calculate(); break
    case '±':
      if (display.value !== '0') {
        display.value = display.value.startsWith('-')
          ? display.value.slice(1)
          : '-' + display.value
      }
      break
    case '÷': case '×': case '-': case '+':
      operator(btn); break
    default:
      input(btn)
  }
}

function btnClass(btn: string): string {
  if (btn === '=') return 'calc-btn equals'
  if (['÷', '×', '-', '+'].includes(btn)) return 'calc-btn op'
  if (['C', '⌫', '%'].includes(btn)) return 'calc-btn func'
  return 'calc-btn'
}
</script>

<template>
  <div>
    <NuxtLink to="/" class="back-link">← {{ t(commonT, 'home', lang) }}</NuxtLink>

    <div class="calc-container">
      <div class="calc-box calculator-box">
        <!-- Mode toggle -->
        <div class="calc-mode-bar">
          <button class="mode-toggle" @click="isScientific = !isScientific">
            {{ isScientific ? t(tr, 'basic', lang) : t(tr, 'scientific', lang) }}
          </button>
          <button v-if="isScientific" class="mode-toggle" @click="useDeg = !useDeg">
            {{ useDeg ? 'DEG' : 'RAD' }}
          </button>
        </div>

        <!-- Display -->
        <div class="calc-display">
          <div class="calc-history">{{ history }}</div>
          <div class="calc-value">{{ display }}</div>
        </div>

        <!-- Scientific buttons -->
        <div v-if="isScientific" class="sci-buttons">
          <button class="calc-btn sci" @click="sciFunc('sin')">sin</button>
          <button class="calc-btn sci" @click="sciFunc('cos')">cos</button>
          <button class="calc-btn sci" @click="sciFunc('tan')">tan</button>
          <button class="calc-btn sci" @click="sciFunc('log')">log</button>
          <button class="calc-btn sci" @click="sciFunc('ln')">ln</button>
          <button class="calc-btn sci" @click="sciFunc('√')">√</button>
          <button class="calc-btn sci" @click="power()">x²</button>
          <button class="calc-btn sci" @click="input('!')">n!</button>
          <button class="calc-btn sci" @click="insertPi()">π</button>
          <button class="calc-btn sci" @click="insertE()">e</button>
          <button class="calc-btn sci" @click="openParen()">(</button>
          <button class="calc-btn sci" @click="closeParen()">)</button>
        </div>

        <!-- Basic buttons -->
        <div class="calc-buttons">
          <template v-for="(row, ri) in basicButtons" :key="ri">
            <button
              v-for="btn in row"
              :key="btn"
              :class="btnClass(btn)"
              @click="handleBtn(btn)"
            >
              {{ btn }}
            </button>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.calculator-box {
  padding: 1rem;
}

.calc-mode-bar {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.mode-toggle {
  padding: 0.3rem 0.7rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--bg-input);
  color: var(--text-sub);
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.mode-toggle:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.calc-display {
  background: var(--result-bg);
  border-radius: 12px;
  padding: 1rem 1.25rem;
  margin-bottom: 0.75rem;
  text-align: right;
  min-height: 80px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.calc-history {
  font-size: 0.8rem;
  color: var(--text-muted);
  min-height: 1.2em;
  word-break: break-all;
}

.calc-value {
  font-size: 2rem;
  font-weight: 700;
  word-break: break-all;
  line-height: 1.2;
}

.sci-buttons {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 6px;
  margin-bottom: 6px;
}

.calc-buttons {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
}

.calc-btn {
  padding: 0.85rem;
  border: none;
  border-radius: 10px;
  font-size: 1.15rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
  background: var(--btn-bg);
  color: var(--btn-text);
}

.calc-btn:hover {
  background: var(--btn-hover);
}

.calc-btn:active {
  transform: scale(0.95);
}

.calc-btn.op {
  background: var(--accent);
  color: #fff;
}

.calc-btn.op:hover {
  background: var(--accent-hover);
}

.calc-btn.equals {
  background: var(--accent);
  color: #fff;
}

.calc-btn.equals:hover {
  background: var(--accent-hover);
}

.calc-btn.func {
  color: var(--accent);
}

.calc-btn.sci {
  font-size: 0.8rem;
  padding: 0.55rem 0.3rem;
  color: var(--text-sub);
}

.calc-btn.sci:hover {
  color: var(--accent);
}

@media (max-width: 480px) {
  .sci-buttons {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
