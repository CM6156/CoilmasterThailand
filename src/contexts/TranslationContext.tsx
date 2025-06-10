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

  const languages: { code: Language, name: string, flag: string }[] = [
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'th', name: 'ไทย', flag: '🇹🇭' },
    { code: 'en', name: 'English', flag: '🇺🇸' }
  ]

  return (
    <select 
      value={language} 
      onChange={(e) => setLanguage(e.target.value as Language)}
      className="px-3 py-1 border border-gray-300 rounded-md text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    >
      {languages.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.flag} {lang.name}
        </option>
      ))}
    </select>
  )
} 