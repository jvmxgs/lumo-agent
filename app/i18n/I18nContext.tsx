'use client'

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'
import {
  Language,
  translations,
  getTranslation,
  Translations,
} from './translations'

interface I18nContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: Translations
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({ children }: { children: ReactNode }) {
  // start with a constant value during SSR and initial client render
  const [language, setLanguage] = useState<Language>('es')

  // read localStorage only after hydration to avoid mismatched markup
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = window.localStorage.getItem('preferredLanguage')
      if (
        (stored === 'es' || stored === 'en' || stored === 'pt') &&
        stored !== language
      ) {
        setLanguage(stored)
      }
    }
  }, [])

  // persist whenever language changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('preferredLanguage', language)
    }
  }, [language])

  const t = getTranslation(language)

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n(): I18nContextType {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider')
  }
  return context
}
