import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { notifyNewRegistration } from '@/lib/notifications'

// 원자재 목록 조회
export async function GET() {
  try {
    const materials = await prisma.rawMaterial.findMany({
      include: {
        _count: {
          select: {
            productionReqs: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json(materials)
  } catch (error) {
    console.error('원자재 목록 조회 오류:', error)
    return NextResponse.json(
      { error: '원자재 목록을 불러오는데 실패했습니다.' },
      { status: 500 }
    )
  }
}

// 새 원자재 등록
export async function POST(request: NextRequest) {
  try {
    const { name, unit, cost, supplier } = await request.json()

    // 유효성 검사
    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: '원자재명을 입력해주세요.' },
        { status: 400 }
      )
    }

    if (!unit || unit.trim().length === 0) {
      return NextResponse.json(
        { error: '단위를 입력해주세요.' },
        { status: 400 }
      )
    }

    if (!cost || cost <= 0) {
      return NextResponse.json(
        { error: '올바른 단가를 입력해주세요.' },
        { status: 400 }
      )
    }

    // 원자재명 중복 확인
    const existingMaterial = await prisma.rawMaterial.findFirst({
      where: {
        name: name.trim()
      }
    })

    if (existingMaterial) {
      return NextResponse.json(
        { error: '이미 존재하는 원자재명입니다.' },
        { status: 409 }
      )
    }

    // 원자재 생성
    const material = await prisma.rawMaterial.create({
      data: {
        name: name.trim(),
        unit: unit.trim(),
        cost: parseFloat(cost),
        supplier: supplier?.trim() || null
      }
    })

    // LINE 알림 전송
    await notifyNewRegistration('원자재', material.name)

    return NextResponse.json(
      { 
        message: '원자재가 성공적으로 등록되었습니다.',
        material 
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('원자재 등록 오류:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
} 