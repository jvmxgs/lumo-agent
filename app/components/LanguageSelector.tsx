'use client'

import { useI18n } from '@/app/i18n/I18nContext'
import { Language } from '@/app/i18n/translations'

export function LanguageSelector() {
  const { language, setLanguage } = useI18n()

  const languages: { code: Language; label: string }[] = [
    { code: 'es', label: 'ES' },
    { code: 'en', label: 'EN' },
    { code: 'pt', label: 'PT' },
  ]

  return (
    <div className="flex gap-2 items-center">
      <span className="text-xs text-neutral-500">Idioma:</span>
      <div className="flex gap-1 bg-neutral-900 rounded px-2 py-1 border border-neutral-800">
        {languages.map(({ code, label }) => (
          <button
            key={code}
            onClick={() => setLanguage(code)}
            className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
              language === code
                ? 'bg-blue-600 text-white'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
            aria-label={`Cambiar a ${label}`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
