import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { notifyNewRegistration } from '@/lib/notifications'

// 제품 목록 조회
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        customer: {
          select: {
            id: true,
            name: true
          }
        },
        manager: {
          select: {
            id: true,
            username: true
          }
        },
        processes: {
          select: {
            id: true,
            name: true,
            processOrder: true
          },
          orderBy: {
            processOrder: 'asc'
          }
        },
        shippingStatus: {
          select: {
            status: true,
            etaDate: true,
            shippingDate: true
          }
        },
        _count: {
          select: {
            processes: true,
            productionReqs: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error('제품 목록 조회 오류:', error)
    return NextResponse.json(
      { error: '제품 목록을 불러오는데 실패했습니다.' },
      { status: 500 }
    )
  }
}

// 새 제품 등록
export async function POST(request: NextRequest) {
  try {
    const { name, customerId, managerId } = await request.json()

    // 유효성 검사
    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: '제품명을 입력해주세요.' },
        { status: 400 }
      )
    }

    if (!customerId) {
      return NextResponse.json(
        { error: '고객을 선택해주세요.' },
        { status: 400 }
      )
    }

    // 고객 존재 확인
    const customer = await prisma.customer.findUnique({
      where: { id: customerId }
    })

    if (!customer) {
      return NextResponse.json(
        { error: '존재하지 않는 고객입니다.' },
        { status: 404 }
      )
    }

    // 담당자 존재 확인 (선택사항)
    if (managerId) {
      const manager = await prisma.user.findUnique({
        where: { id: managerId }
      })

      if (!manager) {
        return NextResponse.json(
          { error: '존재하지 않는 담당자입니다.' },
          { status: 404 }
        )
      }
    }

    // 제품 생성
    const product = await prisma.product.create({
      data: {
        name: name.trim(),
        customerId,
        managerId: managerId || null
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true
          }
        },
        manager: {
          select: {
            id: true,
            username: true
          }
        }
      }
    })

    // 해상운송 상태 초기화
    await prisma.shippingStatus.create({
      data: {
        productId: product.id,
        status: '준비중'
      }
    })

    // LINE 알림 전송
    await notifyNewRegistration('제품', product.name)

    return NextResponse.json(
      { 
        message: '제품이 성공적으로 등록되었습니다.',
        product 
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('제품 등록 오류:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
} 