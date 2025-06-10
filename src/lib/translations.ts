import { prisma } from './prisma'

export type Language = 'ko' | 'th' | 'en'

// 번역 캐시
const translationCache: Record<string, Record<Language, string>> = {}

// 번역 키 가져오기
export async function getTranslation(key: string, language: Language = 'ko'): Promise<string> {
  // 캐시에서 먼저 확인
  if (translationCache[key] && translationCache[key][language]) {
    return translationCache[key][language]
  }

  try {
    const translation = await prisma.translation.findUnique({
      where: {
        key_language: {
          key,
          language
        }
      }
    })

    if (translation) {
      // 캐시에 저장
      if (!translationCache[key]) {
        translationCache[key] = {} as Record<Language, string>
      }
      translationCache[key][language] = translation.value
      return translation.value
    }

    // 번역이 없으면 키를 반환
    console.warn(`Translation not found for key: ${key}, language: ${language}`)
    return key

  } catch (error) {
    console.error('Translation error:', error)
    return key
  }
}

// 여러 번역 키 한번에 가져오기
export async function getTranslations(keys: string[], language: Language = 'ko'): Promise<Record<string, string>> {
  const translations: Record<string, string> = {}

  for (const key of keys) {
    translations[key] = await getTranslation(key, language)
  }

  return translations
}

// 번역 추가/업데이트
export async function setTranslation(key: string, value: string, language: Language) {
  try {
    await prisma.translation.upsert({
      where: {
        key_language: {
          key,
          language
        }
      },
      update: {
        value
      },
      create: {
        key,
        language,
        value
      }
    })

    // 캐시 업데이트
    if (!translationCache[key]) {
      translationCache[key] = {} as Record<Language, string>
    }
    translationCache[key][language] = value

  } catch (error) {
    console.error('Error setting translation:', error)
  }
}

// 번역 캐시 초기화
export function clearTranslationCache() {
  Object.keys(translationCache).forEach(key => delete translationCache[key])
}

// React Hook용 번역 함수
export function useTranslation(language: Language = 'ko') {
  return {
    t: (key: string) => getTranslation(key, language),
    language,
    setLanguage: (newLanguage: Language) => {
      // 언어 변경 로직
      if (typeof window !== 'undefined') {
        localStorage.setItem('language', newLanguage)
      }
    }
  }
} 