<script setup lang="ts">
import { commonT, t, type Lang } from '~/utils/i18n'
import { useLang } from '~/composables/useLang'

const { lang } = useLang()

const tr: Record<string, Record<Lang, string>> = {
  title: { ko: '단위 변환기', en: 'Unit Converter', ja: '単位変換', zh: '单位转换器', ru: 'Конвертер единиц' },
  category: { ko: '카테고리', en: 'Category', ja: 'カテゴリ', zh: '类别', ru: 'Категория' },
  from: { ko: '변환 전', en: 'From', ja: '変換元', zh: '从', ru: 'Из' },
  to: { ko: '변환 후', en: 'To', ja: '変換先', zh: '到', ru: 'В' },
  value: { ko: '값', en: 'Value', ja: '値', zh: '值', ru: 'Значение' },
  length: { ko: '길이', en: 'Length', ja: '長さ', zh: '长度', ru: 'Длина' },
  weight: { ko: '무게', en: 'Weight', ja: '重さ', zh: '重量', ru: 'Вес' },
  temperature: { ko: '온도', en: 'Temperature', ja: '温度', zh: '温度', ru: 'Температура' },
  area: { ko: '면적', en: 'Area', ja: '面積', zh: '面积', ru: 'Площадь' },
  volume: { ko: '부피', en: 'Volume', ja: '体積', zh: '体积', ru: 'Объём' },
  speed: { ko: '속도', en: 'Speed', ja: '速度', zh: '速度', ru: 'Скорость' },
  data: { ko: '데이터', en: 'Data', ja: 'データ', zh: '数据', ru: 'Данные' },
}

interface UnitDef {
  id: string
  name: string
  toBase: (v: number) => number
  fromBase: (v: number) => number
}

interface CategoryDef {
  id: string
  nameKey: string
  units: UnitDef[]
}

const categories: CategoryDef[] = [
  {
    id: 'length', nameKey: 'length',
    units: [
      { id: 'mm', name: 'mm', toBase: v => v / 1000, fromBase: v => v * 1000 },
      { id: 'cm', name: 'cm', toBase: v => v / 100, fromBase: v => v * 100 },
      { id: 'm', name: 'm', toBase: v => v, fromBase: v => v },
      { id: 'km', name: 'km', toBase: v => v * 1000, fromBase: v => v / 1000 },
      { id: 'in', name: 'inch', toBase: v => v * 0.0254, fromBase: v => v / 0.0254 },
      { id: 'ft', name: 'feet', toBase: v => v * 0.3048, fromBase: v => v / 0.3048 },
      { id: 'yd', name: 'yard', toBase: v => v * 0.9144, fromBase: v => v / 0.9144 },
      { id: 'mi', name: 'mile', toBase: v => v * 1609.344, fromBase: v => v / 1609.344 },
    ],
  },
  {
    id: 'weight', nameKey: 'weight',
    units: [
      { id: 'mg', name: 'mg', toBase: v => v / 1_000_000, fromBase: v => v * 1_000_000 },
      { id: 'g', name: 'g', toBase: v => v / 1000, fromBase: v => v * 1000 },
      { id: 'kg', name: 'kg', toBase: v => v, fromBase: v => v },
      { id: 'ton', name: 'ton', toBase: v => v * 1000, fromBase: v => v / 1000 },
      { id: 'oz', name: 'oz', toBase: v => v * 0.0283495, fromBase: v => v / 0.0283495 },
      { id: 'lb', name: 'lb', toBase: v => v * 0.453592, fromBase: v => v / 0.453592 },
    ],
  },
  {
    id: 'temperature', nameKey: 'temperature',
    units: [
      { id: 'c', name: '°C', toBase: v => v, fromBase: v => v },
      { id: 'f', name: '°F', toBase: v => (v - 32) * 5 / 9, fromBase: v => v * 9 / 5 + 32 },
      { id: 'k', name: 'K', toBase: v => v - 273.15, fromBase: v => v + 273.15 },
    ],
  },
  {
    id: 'area', nameKey: 'area',
    units: [
      { id: 'sqm', name: 'm²', toBase: v => v, fromBase: v => v },
      { id: 'sqkm', name: 'km²', toBase: v => v * 1_000_000, fromBase: v => v / 1_000_000 },
      { id: 'sqft', name: 'ft²', toBase: v => v * 0.092903, fromBase: v => v / 0.092903 },
      { id: 'ac', name: 'acre', toBase: v => v * 4046.86, fromBase: v => v / 4046.86 },
      { id: 'ha', name: 'ha', toBase: v => v * 10000, fromBase: v => v / 10000 },
      { id: 'pyeong', name: '평', toBase: v => v * 3.305785, fromBase: v => v / 3.305785 },
    ],
  },
  {
    id: 'volume', nameKey: 'volume',
    units: [
      { id: 'ml', name: 'mL', toBase: v => v / 1000, fromBase: v => v * 1000 },
      { id: 'l', name: 'L', toBase: v => v, fromBase: v => v },
      { id: 'gal', name: 'gallon', toBase: v => v * 3.78541, fromBase: v => v / 3.78541 },
      { id: 'cup', name: 'cup', toBase: v => v * 0.236588, fromBase: v => v / 0.236588 },
    ],
  },
  {
    id: 'speed', nameKey: 'speed',
    units: [
      { id: 'ms', name: 'm/s', toBase: v => v, fromBase: v => v },
      { id: 'kmh', name: 'km/h', toBase: v => v / 3.6, fromBase: v => v * 3.6 },
      { id: 'mph', name: 'mph', toBase: v => v * 0.44704, fromBase: v => v / 0.44704 },
      { id: 'knot', name: 'knot', toBase: v => v * 0.514444, fromBase: v => v / 0.514444 },
    ],
  },
  {
    id: 'data', nameKey: 'data',
    units: [
      { id: 'b', name: 'B', toBase: v => v, fromBase: v => v },
      { id: 'kb', name: 'KB', toBase: v => v * 1024, fromBase: v => v / 1024 },
      { id: 'mb', name: 'MB', toBase: v => v * 1024 ** 2, fromBase: v => v / 1024 ** 2 },
      { id: 'gb', name: 'GB', toBase: v => v * 1024 ** 3, fromBase: v => v / 1024 ** 3 },
      { id: 'tb', name: 'TB', toBase: v => v * 1024 ** 4, fromBase: v => v / 1024 ** 4 },
    ],
  },
]

const selectedCategory = ref('length')
const fromUnit = ref('m')
const toUnit = ref('km')
const inputValue = ref<number | null>(1)

const currentCategory = computed(() => categories.find(c => c.id === selectedCategory.value)!)

watch(selectedCategory, () => {
  const units = currentCategory.value.units
  fromUnit.value = units[0].id
  toUnit.value = units.length > 1 ? units[1].id : units[0].id
})

const result = computed(() => {
  if (inputValue.value === null) return null
  const cat = currentCategory.value
  const from = cat.units.find(u => u.id === fromUnit.value)
  const to = cat.units.find(u => u.id === toUnit.value)
  if (!from || !to) return null
  const base = from.toBase(inputValue.value)
  const converted = to.fromBase(base)
  return converted
})

function formatResult(n: number): string {
  if (Math.abs(n) >= 1) return n.toLocaleString(undefined, { maximumFractionDigits: 6 })
  return n.toPrecision(6)
}
</script>

<template>
  <div>
    <NuxtLink to="/" class="back-link">← {{ t(commonT, 'home', lang) }}</NuxtLink>

    <div class="calc-container">
      <h1 class="page-title">📏 {{ t(tr, 'title', lang) }}</h1>

      <div class="calc-box">
        <div class="form-group">
          <label class="form-label">{{ t(tr, 'category', lang) }}</label>
          <div class="category-tabs">
            <button
              v-for="cat in categories"
              :key="cat.id"
              class="cat-tab"
              :class="{ active: selectedCategory === cat.id }"
              @click="selectedCategory = cat.id"
            >
              {{ t(tr, cat.nameKey, lang) }}
            </button>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">{{ t(tr, 'value', lang) }}</label>
          <input type="number" v-model.number="inputValue" class="form-input" step="any" />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">{{ t(tr, 'from', lang) }}</label>
            <select v-model="fromUnit" class="form-select">
              <option v-for="u in currentCategory.units" :key="u.id" :value="u.id">{{ u.name }}</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">{{ t(tr, 'to', lang) }}</label>
            <select v-model="toUnit" class="form-select">
              <option v-for="u in currentCategory.units" :key="u.id" :value="u.id">{{ u.name }}</option>
            </select>
          </div>
        </div>

        <div v-if="result !== null" class="result-box">
          <div class="result-label">{{ t(tr, 'to', lang) }}</div>
          <div class="result-value">{{ formatResult(result) }} <span style="font-size: 0.9rem; color: var(--text-sub);">{{ currentCategory.units.find(u => u.id === toUnit)?.name }}</span></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.category-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}
.cat-tab {
  padding: 0.35rem 0.65rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: transparent;
  color: var(--text-sub);
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;
}
.cat-tab.active {
  background: var(--accent);
  color: #fff;
  border-color: var(--accent);
}
.cat-tab:hover:not(.active) {
  border-color: var(--border-hover);
}
</style>
