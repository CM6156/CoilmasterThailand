import { NextRequest, NextResponse } from 'next/server'
import { getTranslations } from '@/lib/translations'

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