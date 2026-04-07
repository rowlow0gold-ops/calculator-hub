import { detectLang, type Lang } from '~/utils/i18n'

const lang = ref<Lang>('en')
let initialized = false

export function useLang() {
  if (!initialized && import.meta.client) {
    const saved = localStorage.getItem('calc-lang') as Lang | null
    lang.value = saved || detectLang()
    initialized = true
  }

  function setLang(l: Lang) {
    lang.value = l
    if (import.meta.client) {
      localStorage.setItem('calc-lang', l)
    }
  }

  return { lang: readonly(lang), setLang }
}
