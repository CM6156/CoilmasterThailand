import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 시드 데이터 추가 중...')

  // 번역 데이터 추가
  const translations = [
    // 공통
    { key: 'app_name', ko: '태국 이관 시스템', en: 'Thailand Transfer System', th: 'ระบบการถ่ายโอนไทย' },
    { key: 'home', ko: '홈', en: 'Home', th: 'หน้าแรก' },
    { key: 'login', ko: '로그인', en: 'Login', th: 'เข้าสู่ระบบ' },
    { key: 'signup', ko: '회원가입', en: 'Sign Up', th: 'สมัครสมาชิก' },
    { key: 'logout', ko: '로그아웃', en: 'Logout', th: 'ออกจากระบบ' },
    { key: 'back_to_home', ko: '홈으로 돌아가기', en: 'Back to Home', th: 'กลับไปหน้าแรก' },
    
    // 인트로 페이지
    { key: 'intro_subtitle', ko: '체계적인 제품 관리로 완벽한 이관 프로세스를 구현합니다', en: 'Implement a perfect transfer process with systematic product management', th: 'ดำเนินการถ่ายโอนที่สมบูรณ์แบบด้วยการจัดการผลิตภัณฑ์อย่างเป็นระบบ' },
    { key: 'get_started', ko: '시작하기', en: 'Get Started', th: 'เริ่มต้นใช้งาน' },
    { key: 'dashboard', ko: '대시보드 보기', en: 'View Dashboard', th: 'ดูแดชบอร์ด' },
    { key: 'feature_realtime_tracking', ko: '실시간 추적', en: 'Real-time Tracking', th: 'การติดตามแบบเรียลไทม์' },
    { key: 'feature_realtime_desc', ko: '제품별 공정 현황과 해상운송 상태를 실시간으로 모니터링하고 분석합니다', en: 'Monitor and analyze the process status and maritime transport status in real-time', th: 'ตรวจสอบและวิเคราะห์สถานะกระบวนการและการขนส่งทางทะเลแบบเรียลไทม์' },
    { key: 'feature_cost_calculation', ko: '원가 계산', en: 'Cost Calculation', th: 'การคำนวณต้นทุน' },
    { key: 'feature_cost_desc', ko: '인건비, 설비비, 원자재비를 포함한 정확한 제조원가를 자동으로 산출합니다', en: 'Automatically calculate accurate manufacturing costs including labor, equipment, and raw material costs', th: 'คำนวณต้นทุนการผลิตที่ถูกต้องโดยอัตโนมัติรวมถึงต้นทุนแรงงาน อุปกรณ์ และวัตถุดิบ' },
    { key: 'feature_integrated_management', ko: '통합 관리', en: 'Integrated Management', th: 'การจัดการแบบบูรณาการ' },
    { key: 'feature_integrated_desc', ko: '고객부터 원자재까지 전 과정을 하나의 시스템으로 체계적으로 관리합니다', en: 'Systematically manage the entire process from customers to raw materials in one system', th: 'จัดการกระบวนการทั้งหมดตั้งแต่ลูกค้าถึงวัตถุดิบอย่างเป็นระบบในระบบเดียว' },
    
    // 메뉴
    { key: 'dashboard', ko: '대시보드', en: 'Dashboard', th: 'แดชบอร์ด' },
    { key: 'customer_management', ko: '고객 관리', en: 'Customer Management', th: 'การจัดการลูกค้า' },
    { key: 'product_management', ko: '제품 관리', en: 'Product Management', th: 'การจัดการผลิตภัณฑ์' },
    { key: 'process_management', ko: '공정 관리', en: 'Process Management', th: 'การจัดการกระบวนการ' },
    { key: 'equipment_management', ko: '설비 관리', en: 'Equipment Management', th: 'การจัดการอุปกรณ์' },
    { key: 'material_management', ko: '원자재 관리', en: 'Material Management', th: 'การจัดการวัตถุดิบ' },
    { key: 'cost_calculation', ko: '원가 계산', en: 'Cost Calculation', th: 'การคำนวณต้นทุน' },
    { key: 'admin_panel', ko: '관리자 패널', en: 'Admin Panel', th: 'แผงควบคุมผู้ดูแลระบบ' },
    
    // 로그인 페이지
    { key: 'login_title', ko: '로그인', en: 'Login', th: 'เข้าสู่ระบบ' },
    { key: 'login_subtitle', ko: '태국 이관 제품 관리 시스템에 접속하세요', en: 'Access the Thailand Transfer System', th: 'เข้าถึงระบบการถ่ายโอนไทย' },
    { key: 'username', ko: '아이디', en: 'Username', th: 'ชื่อผู้ใช้' },
    { key: 'password', ko: '비밀번호', en: 'Password', th: 'รหัสผ่าน' },
    { key: 'username_placeholder', ko: '아이디를 입력하세요', en: 'Enter your username', th: 'ป้อนชื่อผู้ใช้ของคุณ' },
    { key: 'password_placeholder', ko: '비밀번호를 입력하세요', en: 'Enter your password', th: 'ป้อนรหัสผ่านของคุณ' },
    { key: 'login_button', ko: '로그인', en: 'Login', th: 'เข้าสู่ระบบ' },
    { key: 'login_loading', ko: '로그인 중...', en: 'Logging in...', th: 'กำลังเข้าสู่ระบบ...' },
    { key: 'no_account', ko: '계정이 없으신가요?', en: 'Don\'t have an account?', th: 'ยังไม่มีบัญชีใช่ไหม?' },
    
    // 회원가입 페이지
    { key: 'signup_title', ko: '회원가입', en: 'Sign Up', th: 'สมัครสมาชิก' },
    { key: 'signup_subtitle', ko: '태국 이관 제품 관리 시스템 계정을 생성하세요', en: 'Create an account for Thailand Transfer System', th: 'สร้างบัญชีสำหรับระบบการถ่ายโอนไทย' },
    { key: 'username_min', ko: '아이디를 입력하세요 (3자 이상)', en: 'Enter your username (min. 3 characters)', th: 'ป้อนชื่อผู้ใช้ของคุณ (อย่างน้อย 3 ตัวอักษร)' },
    { key: 'password_min', ko: '비밀번호를 입력하세요 (6자 이상)', en: 'Enter your password (min. 6 characters)', th: 'ป้อนรหัสผ่านของคุณ (อย่างน้อย 6 ตัวอักษร)' },
    { key: 'confirm_password', ko: '비밀번호 확인', en: 'Confirm Password', th: 'ยืนยันรหัสผ่าน' },
    { key: 'confirm_password_placeholder', ko: '비밀번호를 다시 입력하세요', en: 'Re-enter your password', th: 'ป้อนรหัสผ่านของคุณอีกครั้ง' },
    { key: 'password_mismatch', ko: '비밀번호가 일치하지 않습니다.', en: 'Passwords do not match.', th: 'รหัสผ่านไม่ตรงกัน' },
    { key: 'signup_button', ko: '회원가입', en: 'Sign Up', th: 'สมัครสมาชิก' },
    { key: 'signup_loading', ko: '가입 중...', en: 'Signing up...', th: 'กำลังสมัคร...' },
    { key: 'have_account', ko: '이미 계정이 있으신가요?', en: 'Already have an account?', th: 'มีบัญชีอยู่แล้วใช่ไหม?' },
  ]

  console.log('번역 데이터 추가 중...')
  
  // 한 번에 많은 데이터를 추가하면 타임아웃이 발생할 수 있으므로
  // 번역 키별로 각 언어 버전을 추가
  for (const translation of translations) {
    const { key, ko, en, th } = translation
    
    // 한국어 번역
    await prisma.translation.upsert({
      where: { key_language: { key, language: 'ko' } },
      update: { value: ko },
      create: { key, language: 'ko', value: ko }
    })
    
    // 영어 번역
    await prisma.translation.upsert({
      where: { key_language: { key, language: 'en' } },
      update: { value: en },
      create: { key, language: 'en', value: en }
    })
    
    // 태국어 번역
    await prisma.translation.upsert({
      where: { key_language: { key, language: 'th' } },
      update: { value: th },
      create: { key, language: 'th', value: th }
    })

    console.log(`번역 키 추가됨: ${key}`)
  }

  console.log('✅ 시드 데이터 추가 완료')
}

main()
  .catch((e) => {
    console.error('시드 데이터 추가 중 오류 발생:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 