export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: true },
  ssr: false,
  app: {
    head: {
      htmlAttrs: { lang: 'ko' },
      title: '계산기 모음 | Calculator Hub',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '나이, 환율, BMI, 세후 급여 등 다양한 계산기 모음' },
        { property: 'og:title', content: '계산기 모음 | Calculator Hub' },
        { property: 'og:description', content: '나이, 환율, BMI, 세후 급여 등 다양한 계산기 모음' },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://calc-hub.minhojan-world.site' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'canonical', href: 'https://calc-hub.minhojan-world.site' },
      ],
    },
  },
  css: ['~/assets/css/main.css'],
})
