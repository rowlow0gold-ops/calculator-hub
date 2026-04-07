const isDark = ref(true)
let initialized = false

export function useTheme() {
  if (!initialized && import.meta.client) {
    const saved = localStorage.getItem('calc-theme')
    if (saved === 'light') {
      isDark.value = false
    } else if (!saved) {
      isDark.value = !window.matchMedia('(prefers-color-scheme: light)').matches
    }
    initialized = true
    applyTheme()
  }

  function toggle() {
    isDark.value = !isDark.value
    if (import.meta.client) {
      localStorage.setItem('calc-theme', isDark.value ? 'dark' : 'light')
    }
    applyTheme()
  }

  function applyTheme() {
    if (import.meta.client) {
      document.documentElement.classList.toggle('dark', isDark.value)
      document.documentElement.classList.toggle('light', !isDark.value)
    }
  }

  return { isDark: readonly(isDark), toggle }
}
