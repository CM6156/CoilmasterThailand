import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { notifyNewRegistration } from '@/lib/notifications'

// 고객 목록 조회
export async function GET() {
  try {
    const customers = await prisma.customer.findMany({
      include: {
        products: {
          select: {
            id: true,
            name: true
          }
        },
        _count: {
          select: {
            products: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(customers)
  } catch (error) {
    console.error('고객 목록 조회 오류:', error)
    return NextResponse.json(
      { error: '고객 목록을 불러오는데 실패했습니다.' },
      { status: 500 }
    )
  }
}

// 새 고객 등록
export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json()

    // 유효성 검사
    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: '고객명을 입력해주세요.' },
        { status: 400 }
      )
    }

    // 중복 고객명 확인
    const existingCustomer = await prisma.customer.findFirst({
      where: { name: name.trim() }
    })

    if (existingCustomer) {
      return NextResponse.json(
        { error: '이미 존재하는 고객명입니다.' },
        { status: 409 }
      )
    }

    // 고객 생성
    const customer = await prisma.customer.create({
      data: {
        name: name.trim()
      }
    })

    // LINE 알림 전송
    await notifyNewRegistration('고객', customer.name)

    return NextResponse.json(
      { 
        message: '고객이 성공적으로 등록되었습니다.',
        customer 
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('고객 등록 오류:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
} 