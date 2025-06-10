import { prisma } from './prisma'
import { hashPassword } from './auth'

export async function seedDatabase() {
  try {
    console.log('데이터베이스 시드 시작...')

    // 기존 데이터 확인
    const existingUsers = await prisma.user.count()
    if (existingUsers > 0) {
      console.log('이미 데이터가 존재합니다.')
      return
    }

    // 사용자 생성
    const hashedPassword = await hashPassword('123456')
    
    const adminUser = await prisma.user.create({
      data: {
        username: 'admin',
        password: hashedPassword,
        role: 'admin'
      }
    })

    // 고객 생성
    const customer1 = await prisma.customer.create({
      data: { name: '삼성전자' }
    })

    const customer2 = await prisma.customer.create({
      data: { name: '현대자동차' }
    })

    // 제품 생성
    const product1 = await prisma.product.create({
      data: {
        name: '스마트폰 케이스',
        customerId: customer1.id,
        managerId: adminUser.id
      }
    })

    const product2 = await prisma.product.create({
      data: {
        name: '자동차 부품',
        customerId: customer2.id
      }
    })

    // 해상운송 상태 생성
    await prisma.shippingStatus.create({
      data: {
        productId: product1.id,
        status: '운송중'
      }
    })

    await prisma.shippingStatus.create({
      data: {
        productId: product2.id,
        status: '준비중'
      }
    })

    // 알림 생성
    await prisma.notification.create({
      data: {
        message: '🆕 admin님이 새로운 제품을 등록했습니다: 스마트폰 케이스',
        type: 'success'
      }
    })

    console.log('✅ 시드 데이터 생성 완료!')

  } catch (error) {
    console.error('시드 오류:', error)
    throw error
  }
} 