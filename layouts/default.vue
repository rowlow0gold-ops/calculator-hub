<script setup lang="ts">
import { LANGS, commonT, t } from '~/utils/i18n'
import { useLang } from '~/composables/useLang'
import { useTheme } from '~/composables/useTheme'

const { lang, setLang } = useLang()
const { isDark, toggle } = useTheme()

// Log visitor to Supabase (once per session)
onMounted(() => {
  if (sessionStorage.getItem('visited')) return
  sessionStorage.setItem('visited', '1')

  const SUPABASE_URL = 'https://xxzveiasemaspdonppgf.supabase.co'
  const SUPABASE_KEY = 'sb_publishable_EMv1OEZ9LUtFJ1krDPjzPw_p-pmbJrB'

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

    <main class="page">
      <slot />
    </main>
  </div>
</template>
