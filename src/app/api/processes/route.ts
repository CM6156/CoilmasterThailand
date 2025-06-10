import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { notifyNewRegistration } from '@/lib/notifications'

// 공정 목록 조회
export async function GET() {
  try {
    const processes = await prisma.process.findMany({
      include: {
        product: {
          include: {
            customer: {
              select: {
                id: true,
                name: true
              }
            }
          }
        },
        _count: {
          select: {
            productionReqs: true
          }
        }
      },
      orderBy: [
        { product: { name: 'asc' } },
        { processOrder: 'asc' }
      ]
    })

    return NextResponse.json(processes)
  } catch (error) {
    console.error('공정 목록 조회 오류:', error)
    return NextResponse.json(
      { error: '공정 목록을 불러오는데 실패했습니다.' },
      { status: 500 }
    )
  }
}

// 새 공정 등록
export async function POST(request: NextRequest) {
  try {
    const { name, productId, processOrder } = await request.json()

    // 유효성 검사
    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: '공정명을 입력해주세요.' },
        { status: 400 }
      )
    }

    if (!productId) {
      return NextResponse.json(
        { error: '제품을 선택해주세요.' },
        { status: 400 }
      )
    }

    if (!processOrder || processOrder < 1) {
      return NextResponse.json(
        { error: '올바른 공정 순서를 입력해주세요.' },
        { status: 400 }
      )
    }

    // 제품 존재 확인
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { customer: true }
    })

    if (!product) {
      return NextResponse.json(
        { error: '존재하지 않는 제품입니다.' },
        { status: 404 }
      )
    }

    // 동일한 제품의 동일한 순서 공정이 있는지 확인
    const existingProcess = await prisma.process.findFirst({
      where: {
        productId,
        processOrder
      }
    })

    if (existingProcess) {
      return NextResponse.json(
        { error: '해당 제품에 동일한 순서의 공정이 이미 존재합니다.' },
        { status: 409 }
      )
    }

    // 공정 생성
    const process = await prisma.process.create({
      data: {
        name: name.trim(),
        productId,
        processOrder
      },
      include: {
        product: {
          include: {
            customer: true
          }
        }
      }
    })

    // LINE 알림 전송
    await notifyNewRegistration('공정', `${process.name} (${product.name})`)

    return NextResponse.json(
      { 
        message: '공정이 성공적으로 등록되었습니다.',
        process 
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('공정 등록 오류:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
} 