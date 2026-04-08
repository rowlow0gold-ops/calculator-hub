<script setup lang="ts">
import { LANGS, commonT, t } from '~/utils/i18n'
import { useLang } from '~/composables/useLang'
import { useTheme } from '~/composables/useTheme'

const { lang, setLang } = useLang()
const { isDark, toggle } = useTheme()

// Log visitor to Supabase (once per session)
onMounted(() => {
  if (window.location.hostname !== 'calc-hub.minhojan-world.site') return
  if (sessionStorage.getItem('visited')) return
  sessionStorage.setItem('visited', '1')

  const SUPABASE_URL = 'https://xxzveiasemaspdonppgf.supabase.co'
  const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4enZlaWFzZW1hc3Bkb25wcGdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1MTcyMTYsImV4cCI6MjA5MTA5MzIxNn0.lKo4N6xPM9XHcMIPMPr5KgL81VKglMUgYMmEpsFXCfc'

  fetch('https://ipapi.co/json/')
    .then(r => r.json())
    .then(geo => {
      fetch(SUPABASE_URL + '/rest/v1/visits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_KEY,
          'Authorization': 'Bearer ' + SUPABASE_KEY,
        },
        body: JSON.stringify({
          ip: geo.ip,
          country: geo.country_name,
          region: geo.region,
          city: geo.city,
          isp: geo.org || '',
          page: 'calculator-hub',
        }),
      })
    })
    .catch(() => {})
})
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

    <div class="layout-body">
      <!-- Left ad (desktop only) -->
      <aside class="ad-sidebar ad-left">
        <div class="ad-placeholder">
          <span class="ad-label">Ad</span>
        </div>
      </aside>

      <main class="page">
        <slot />
      </main>

      <!-- Right ad (desktop only) -->
      <aside class="ad-sidebar ad-right">
        <div class="ad-placeholder">
          <span class="ad-label">Ad</span>
        </div>
      </aside>
    </div>

    <!-- Mobile bottom ad -->
    <div class="ad-mobile">
      <div class="ad-placeholder-mobile">
        <span class="ad-label">Ad</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.layout-body {
  display: flex;
  justify-content: center;
  gap: 1rem;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem;
}

.ad-sidebar {
  width: 160px;
  flex-shrink: 0;
  display: none;
  padding-top: 2rem;
}

.ad-placeholder {
  position: sticky;
  top: 80px;
  width: 160px;
  height: 600px;
  border: 1px dashed var(--border);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--card-bg);
}

.ad-label {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.ad-mobile {
  display: block;
  padding: 0.75rem 1rem;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 50;
}

.ad-placeholder-mobile {
  width: 100%;
  height: 60px;
  border: 1px dashed var(--border);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--card-bg);
  backdrop-filter: blur(12px);
}

@media (min-width: 1200px) {
  .ad-sidebar {
    display: block;
  }
  .ad-mobile {
    display: none;
  }
}
</style>
