import { createI18n } from 'vue-i18n'

import en from './locales/en.json'
import zh from './locales/zh.json'

const getUserLanguage = () => {
  const savedLang = localStorage.getItem('WES-lang')

  if (savedLang) {
    return savedLang
  } else {
    const browserLang = navigator.language
    if (browserLang.includes('zh')) {
      return 'zh'
    }

    return 'en'
  }
}

const i18n = createI18n({
  legacy: false,
  locale: getUserLanguage(),
  // locale: 'en',
  fallbackLocale: 'en',
  globalInjection: true,
  messages: { en, zh },
})

export default i18n
