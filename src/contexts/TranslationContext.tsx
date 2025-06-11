'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { Language } from '@/lib/translations'

interface TranslationContextType {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string) => string
  isLoading: boolean
  loadTranslations: (keys: string[]) => Promise<void>
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined)

// 번역 캐시
const translationCache: Record<string, Record<Language, string>> = {}

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('ko')
  const [isLoading, setIsLoading] = useState(true)

  // 초기 언어 설정 로드
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('language') as Language
      if (savedLanguage && ['ko', 'th', 'en'].includes(savedLanguage)) {
        setLanguageState(savedLanguage)
      }
    }
    setIsLoading(false)
  }, [])

  // 언어 변경 함수
  const setLanguage = useCallback((newLanguage: Language) => {
    setLanguageState(newLanguage)
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', newLanguage)
    }
  }, [])

  // 번역 데이터를 서버에서 로드
  const loadTranslations = useCallback(async (keys: string[]) => {
    const missingKeys = keys.filter(key => 
      !translationCache[key] || !translationCache[key][language]
    )

    if (missingKeys.length === 0) return

    try {
      const response = await fetch('/api/translations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ keys: missingKeys, language }),
      })

      if (response.ok) {
        const translations = await response.json()
        
        // 캐시에 저장
        Object.entries(translations).forEach(([key, value]) => {
          if (!translationCache[key]) {
            translationCache[key] = {} as Record<Language, string>
          }
          translationCache[key][language] = value as string
        })
      }
    } catch (error) {
      console.error('번역 로드 오류:', error)
    }
  }, [language])

  // 번역 함수
  const t = useCallback((key: string): string => {
    // 캐시에서 먼저 확인
    if (translationCache[key] && translationCache[key][language]) {
      return translationCache[key][language]
    }

    // 캐시에 없으면 서버에서 로드 시도
    loadTranslations([key])

    // 로딩 중에는 키 자체를 반환
    return key
  }, [language, loadTranslations])

  const value = {
    language,
    setLanguage,
    t,
    isLoading,
    loadTranslations
  }

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  )
}

export function useTranslation() {
  const context = useContext(TranslationContext)
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider')
  }
  return context
}

// 페이지별 번역 Hook
export function usePageTranslations(keys: string[]) {
  const { t, loadTranslations, language } = useTranslation()
  const [translations, setTranslations] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPageTranslations = async () => {
      setLoading(true)
      await loadTranslations(keys)
      
      const newTranslations: Record<string, string> = {}
      keys.forEach(key => {
        newTranslations[key] = t(key)
      })
      setTranslations(newTranslations)
      setLoading(false)
    }

    loadPageTranslations()
  }, [keys, language, loadTranslations, t])

  return { translations, loading, t }
}

// 언어 선택기 컴포넌트
export function LanguageSelector() {
  const { language, setLanguage } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)

  const languages: { code: Language, name: string, flag: string, localName: string }[] = [
    { code: 'ko', name: '한국어', localName: '한국어', flag: '🇰🇷' },
    { code: 'th', name: '태국어', localName: 'ไทย', flag: '🇹🇭' },
    { code: 'en', name: '영어', localName: 'English', flag: '🇺🇸' }
  ]

  const currentLanguage = languages.find(lang => lang.code === language) || languages[0]

  const handleSelectLanguage = (code: Language) => {
    setLanguage(code)
    setIsOpen(false)
  }

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          className="inline-flex items-center justify-center w-full px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="mr-1">{currentLanguage.flag}</span>
          <span className="mr-1">{currentLanguage.localName}</span>
          <svg className="w-4 h-4 ml-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1" role="menu" aria-orientation="vertical">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleSelectLanguage(lang.code)}
                className={`flex items-center w-full px-4 py-2 text-sm text-left ${
                  language === lang.code 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                role="menuitem"
              >
                <span className="mr-2">{lang.flag}</span>
                <span>{lang.localName}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 