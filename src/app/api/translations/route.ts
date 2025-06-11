import { NextRequest, NextResponse } from 'next/server'
import { getTranslations, setTranslation } from '@/lib/translations'

export async function POST(request: NextRequest) {
  try {
    const { keys, language } = await request.json()

    if (!keys || !Array.isArray(keys)) {
      return NextResponse.json(
        { error: '번역 키 배열이 필요합니다.' },
        { status: 400 }
      )
    }

    if (!language || !['ko', 'th', 'en'].includes(language)) {
      return NextResponse.json(
        { error: '올바른 언어 코드가 필요합니다.' },
        { status: 400 }
      )
    }

    const translations = await getTranslations(keys, language)
    return NextResponse.json(translations)

  } catch (error) {
    console.error('번역 API 오류:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { key, values } = await request.json()

    if (!key || typeof key !== 'string') {
      return NextResponse.json(
        { error: '유효한 번역 키가 필요합니다.' },
        { status: 400 }
      )
    }

    if (!values || typeof values !== 'object') {
      return NextResponse.json(
        { error: '유효한 번역 값 객체가 필요합니다.' },
        { status: 400 }
      )
    }

    // 각 언어별로 번역 추가/업데이트
    const results = await Promise.all(
      Object.entries(values).map(async ([language, value]) => {
        if (!['ko', 'th', 'en'].includes(language)) {
          return { language, success: false, error: '지원하지 않는 언어입니다.' }
        }

        try {
          await setTranslation(key, value as string, language as 'ko' | 'th' | 'en')
          return { language, success: true }
        } catch (error) {
          console.error(`Error setting translation for ${language}:`, error)
          return { language, success: false, error: '번역 설정 중 오류가 발생했습니다.' }
        }
      })
    )

    return NextResponse.json({
      key,
      results
    })

  } catch (error) {
    console.error('번역 추가 API 오류:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
} 