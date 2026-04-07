<script setup lang="ts">
import { LANGS, commonT, t } from '~/utils/i18n'
import { useLang } from '~/composables/useLang'
import { useTheme } from '~/composables/useTheme'

const { lang, setLang } = useLang()
const { isDark, toggle } = useTheme()
</script>

<template>
  <div>
    <nav class="navbar">
      <NuxtLink to="/" class="navbar-brand">
        <span class="icon">🧮</span>
        <span>{{ t(commonT, 'calculators', lang) }}</span>
      </NuxtLink>

      <div class="navbar-actions">
        <div class="lang-switcher">
          <button
            v-for="l in LANGS"
            :key="l.code"
            class="lang-btn"
            :class="{ active: lang === l.code }"
            @click="setLang(l.code)"
          >
            {{ l.label }}
          </button>
        </div>
        <button class="theme-btn" @click="toggle" :aria-label="isDark ? 'Switch to light' : 'Switch to dark'">
          {{ isDark ? '☀️' : '🌙' }}
        </button>
      </div>
    </nav>

    <main class="page">
      <slot />
    </main>
  </div>
</template>
