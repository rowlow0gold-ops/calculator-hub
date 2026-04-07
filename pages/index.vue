<script setup lang="ts">
import { calculators, commonT, t } from '~/utils/i18n'
import { useLang } from '~/composables/useLang'

const { lang } = useLang()
</script>

<template>
  <div>
    <h1 class="page-title">{{ t(commonT, 'calculators', lang) }}</h1>
    <p class="page-subtitle">{{ calculators.length }} calculators</p>

    <div class="calc-grid">
      <NuxtLink
        v-for="calc in calculators"
        :key="calc.id"
        :to="`/${calc.id}`"
        class="calc-card"
        :style="{ '--card-color': calc.color }"
      >
        <div class="calc-card-icon">{{ calc.icon }}</div>
        <div class="calc-card-info">
          <div class="calc-card-name">{{ calc.name[lang] }}</div>
          <div class="calc-card-desc">{{ calc.description[lang] }}</div>
        </div>
        <div class="calc-card-arrow">→</div>
      </NuxtLink>
    </div>
  </div>
</template>
