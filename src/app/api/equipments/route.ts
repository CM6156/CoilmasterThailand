import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { notifyNewRegistration } from '@/lib/notifications'

// 설비 목록 조회
export async function GET() {
  try {
    const equipments = await prisma.equipment.findMany({
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

    return NextResponse.json(equipments)
  } catch (error) {
    console.error('설비 목록 조회 오류:', error)
    return NextResponse.json(
      { error: '설비 목록을 불러오는데 실패했습니다.' },
      { status: 500 }
    )
  }
}

// 새 설비 등록
export async function POST(request: NextRequest) {
  try {
    const { name, maxCapaPerDay, location, operationCost } = await request.json()

    // 유효성 검사
    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: '설비명을 입력해주세요.' },
        { status: 400 }
      )
    }

    if (!maxCapaPerDay || maxCapaPerDay <= 0) {
      return NextResponse.json(
        { error: '올바른 일일 최대 생산능력을 입력해주세요.' },
        { status: 400 }
      )
    }

    // 설비명 중복 확인
    const existingEquipment = await prisma.equipment.findFirst({
      where: {
        name: name.trim()
      }
    })

    if (existingEquipment) {
      return NextResponse.json(
        { error: '이미 존재하는 설비명입니다.' },
        { status: 409 }
      )
    }

    // 설비 생성
    const equipment = await prisma.equipment.create({
      data: {
        name: name.trim(),
        maxCapaPerDay: parseInt(maxCapaPerDay),
        location: location?.trim() || '',
        operationCost: operationCost ? parseFloat(operationCost) : null
      }
    })

    // LINE 알림 전송
    await notifyNewRegistration('설비', equipment.name)

    return NextResponse.json(
      { 
        message: '설비가 성공적으로 등록되었습니다.',
        equipment 
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('설비 등록 오류:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
} 