import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 알림 목록 조회
export async function GET() {
  try {
    const notifications = await prisma.notification.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      take: 20 // 최근 20개만
    })

    return NextResponse.json(notifications)
  } catch (error) {
    console.error('알림 목록 조회 오류:', error)
    return NextResponse.json(
      { error: '알림 목록을 불러오는데 실패했습니다.' },
      { status: 500 }
    )
  }
}

// 새 알림 생성
export async function POST(request: NextRequest) {
  try {
    const { message, type = 'info' } = await request.json()

    // 유효성 검사
    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { error: '알림 메시지를 입력해주세요.' },
        { status: 400 }
      )
    }

    // 알림 생성
    const notification = await prisma.notification.create({
      data: {
        message: message.trim(),
        type
      }
    })

    return NextResponse.json(
      { 
        message: '알림이 성공적으로 생성되었습니다.',
        notification 
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('알림 생성 오류:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
} 