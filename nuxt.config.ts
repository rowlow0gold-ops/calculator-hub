export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: true },
  ssr: false,
  app: {
    head: {
      htmlAttrs: { lang: 'ko' },
      title: '계산기 모음 | Calculator Hub - 나이, 환율, BMI, 급여 계산기',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '나이 계산기, 환율 계산기, BMI 계산기, 세후 급여 계산기, 대출 이자 계산기, 단위 변환, D-day 계산 등 다양한 온라인 계산기 모음. Age calculator, currency converter, BMI, salary, loan calculator and more.' },
        { name: 'keywords', content: '계산기, 나이 계산기, 환율 계산기, BMI 계산기, 세후 급여 계산기, 대출 이자 계산기, 단위 변환, D-day, calculator, age calculator, currency converter, salary calculator, loan calculator, 計算機, калькулятор' },
        { name: 'robots', content: 'index, follow' },
        { property: 'og:title', content: '계산기 모음 | Calculator Hub' },
        { property: 'og:description', content: '나이, 환율, BMI, 세후 급여, 대출 이자 등 다양한 온라인 계산기 모음' },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://calc-hub.minhojan-world.site' },
        { property: 'og:site_name', content: 'Calculator Hub' },
        { property: 'og:locale', content: 'ko_KR' },
        { name: 'twitter:card', content: 'summary' },
        { name: 'twitter:title', content: '계산기 모음 | Calculator Hub' },
        { name: 'twitter:description', content: '나이, 환율, BMI, 세후 급여 등 다양한 온라인 계산기 모음' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'canonical', href: 'https://calc-hub.minhojan-world.site' },
      ],
      script: [
        {
          async: true,
          src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9779896074298699',
          crossorigin: 'anonymous',
        },
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: '계산기 모음 | Calculator Hub',
            url: 'https://calc-hub.minhojan-world.site',
            applicationCategory: 'UtilityApplication',
            operatingSystem: 'All',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'KRW' },
            inLanguage: ['ko', 'en', 'ja', 'zh', 'ru'],
          }),
        },
      ],
    },
  },
  css: ['~/assets/css/main.css'],
})
