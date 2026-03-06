'use client'

import { useI18n } from '@/app/i18n/I18nContext'
import { Language } from '@/app/i18n/translations'
import { useState } from 'react'

export function LanguageSelector() {
  const { language, setLanguage, t } = useI18n()
  const [open, setOpen] = useState(false)

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'es', label: 'ES', flag: '🇪🇸' },
    { code: 'en', label: 'EN', flag: '🇬🇧' },
    { code: 'pt', label: 'PT', flag: '🇵🇹' },
  ]

  const current = languages.find((l) => l.code === language)

  return (
    <div className="relative">
      {/* toggle button always shown */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1 bg-neutral-900 rounded px-2 py-1 text-xs font-medium"
        aria-label={t.language}
      >
        <span aria-hidden>{current?.flag}</span>
        <span className="hidden sm:inline">{t.language}</span>
      </button>

      {/* dropdown menu */}
      {open && (
        <div className="absolute right-0 mt-1 flex flex-col gap-1 bg-neutral-900 rounded border border-neutral-800 shadow-lg z-30 p-2">
          {languages.map(({ code, label, flag }) => (
            <button
              key={code}
              onClick={() => {
                setLanguage(code)
                setOpen(false)
              }}
              className={`flex items-center gap-1 px-2 py-1 text-xs font-medium rounded transition-colors w-full justify-start ${
                language === code
                  ? 'bg-blue-600 text-white'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
              aria-label={`${t.language}: ${label}`}
            >
              <span aria-hidden>{flag}</span>
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
