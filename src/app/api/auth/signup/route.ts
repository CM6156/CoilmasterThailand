import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/auth'
import { notifyNewRegistration } from '@/lib/notifications'

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

    if (username.length < 3) {
      return NextResponse.json(
        { error: '아이디는 최소 3자 이상이어야 합니다.' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: '비밀번호는 최소 6자 이상이어야 합니다.' },
        { status: 400 }
      )
    }

    // 중복 사용자 확인
    const existingUser = await prisma.user.findUnique({
      where: { username }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: '이미 존재하는 아이디입니다.' },
        { status: 409 }
      )
    }

    // 비밀번호 해시화
    const hashedPassword = await hashPassword(password)

    // 사용자 생성
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword
      },
      select: {
        id: true,
        username: true,
        role: true,
        createdAt: true
      }
    })

    // LINE 알림 전송
    await notifyNewRegistration('사용자', username)

    return NextResponse.json(
      { 
        message: '회원가입이 성공적으로 완료되었습니다.',
        user 
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('회원가입 오류:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
} 