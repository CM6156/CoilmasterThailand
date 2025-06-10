import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPassword, generateSessionToken } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    // 유효성 검사
    if (!username || !password) {
      return NextResponse.json(
        { error: '아이디와 비밀번호를 입력해주세요.' },
        { status: 400 }
      )
    }

    // 사용자 조회
    const user = await prisma.user.findUnique({
      where: { username }
    })

    if (!user) {
      return NextResponse.json(
        { error: '존재하지 않는 사용자입니다.' },
        { status: 401 }
      )
    }

    // 비밀번호 확인
    const isPasswordValid = await verifyPassword(password, user.password)

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: '비밀번호가 올바르지 않습니다.' },
        { status: 401 }
      )
    }

    // 세션 토큰 생성
    const sessionToken = generateSessionToken()

    // 응답용 사용자 정보 (비밀번호 제외)
    const userResponse = {
      id: user.id,
      username: user.username,
      role: user.role,
      createdAt: user.createdAt
    }

    // 쿠키에 세션 토큰 설정
    const response = NextResponse.json(
      { 
        message: '로그인이 성공적으로 완료되었습니다.',
        user: userResponse 
      },
      { status: 200 }
    )

    // HTTP-only 쿠키로 세션 토큰 설정 (7일 만료)
    response.cookies.set('session-token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7일
    })

    // 사용자 ID도 쿠키에 저장 (클라이언트에서 접근 가능)
    response.cookies.set('user-id', user.id, {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7일
    })

    return response

  } catch (error) {
    console.error('로그인 오류:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
} 