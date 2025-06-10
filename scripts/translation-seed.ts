import { prisma } from '../src/lib/prisma'

const translations = [
  // 공통 UI
  { key: 'login', ko: '로그인', th: 'เข้าสู่ระบบ', en: 'Login' },
  { key: 'logout', ko: '로그아웃', th: 'ออกจากระบบ', en: 'Logout' },
  { key: 'signup', ko: '회원가입', th: 'สมัครสมาชิก', en: 'Sign Up' },
  { key: 'dashboard', ko: '대시보드', th: 'แดชบอร์ด', en: 'Dashboard' },
  { key: 'search', ko: '검색', th: 'ค้นหา', en: 'Search' },
  { key: 'add', ko: '추가', th: 'เพิ่ม', en: 'Add' },
  { key: 'edit', ko: '수정', th: 'แก้ไข', en: 'Edit' },
  { key: 'delete', ko: '삭제', th: 'ลบ', en: 'Delete' },
  { key: 'save', ko: '저장', th: 'บันทึก', en: 'Save' },
  { key: 'cancel', ko: '취소', th: 'ยกเลิก', en: 'Cancel' },
  { key: 'submit', ko: '제출', th: 'ส่ง', en: 'Submit' },
  { key: 'loading', ko: '로딩 중...', th: 'กำลังโหลด...', en: 'Loading...' },
  { key: 'admin', ko: '관리자', th: 'ผู้ดูแลระบบ', en: 'Administrator' },

  // 네비게이션
  { key: 'thailand_transfer_system', ko: '태국 이관 시스템', th: 'ระบบโอนย้ายประเทศไทย', en: 'Thailand Transfer System' },
  { key: 'customer_management', ko: '고객 관리', th: 'จัดการลูกค้า', en: 'Customer Management' },
  { key: 'product_management', ko: '제품 관리', th: 'จัดการผลิตภัณฑ์', en: 'Product Management' },
  { key: 'process_management', ko: '공정 관리', th: 'จัดการกระบวนการ', en: 'Process Management' },
  { key: 'equipment_management', ko: '설비 관리', th: 'จัดการอุปกรณ์', en: 'Equipment Management' },
  { key: 'material_management', ko: '원자재 관리', th: 'จัดการวัตถุดิบ', en: 'Material Management' },
  { key: 'cost_calculation', ko: '원가 계산', th: 'คำนวณต้นทุน', en: 'Cost Calculation' },
  { key: 'admin_panel', ko: '관리자 패널', th: 'แผงผู้ดูแลระบบ', en: 'Admin Panel' },

  // 고객 관리
  { key: 'customer_list', ko: '고객 목록', th: 'รายชื่อลูกค้า', en: 'Customer List' },
  { key: 'add_new_customer', ko: '새 고객 추가', th: 'เพิ่มลูกค้าใหม่', en: 'Add New Customer' },
  { key: 'customer_name', ko: '고객명', th: 'ชื่อลูกค้า', en: 'Customer Name' },
  { key: 'total_customers', ko: '총 고객 수', th: 'จำนวนลูกค้าทั้งหมด', en: 'Total Customers' },
  { key: 'active_projects', ko: '활성 프로젝트', th: 'โครงการที่ใช้งาน', en: 'Active Projects' },
  { key: 'registration_date', ko: '등록일', th: 'วันที่ลงทะเบียน', en: 'Registration Date' },

  // 제품 관리
  { key: 'product_list', ko: '제품 목록', th: 'รายการผลิตภัณฑ์', en: 'Product List' },
  { key: 'add_new_product', ko: '새 제품 추가', th: 'เพิ่มผลิตภัณฑ์ใหม่', en: 'Add New Product' },
  { key: 'product_name', ko: '제품명', th: 'ชื่อผลิตภัณฑ์', en: 'Product Name' },
  { key: 'total_products', ko: '총 제품 수', th: 'จำนวนผลิตภัณฑ์ทั้งหมด', en: 'Total Products' },
  { key: 'shipping_status', ko: '운송 상태', th: 'สถานะการขนส่ง', en: 'Shipping Status' },
  { key: 'in_transit', ko: '운송중', th: 'กำลังขนส่ง', en: 'In Transit' },
  { key: 'preparing', ko: '준비중', th: 'กำลังเตรียม', en: 'Preparing' },
  { key: 'arrived', ko: '도착', th: 'มาถึงแล้ว', en: 'Arrived' },
  { key: 'delayed', ko: '지연', th: 'ล่าช้า', en: 'Delayed' },

  // 공정 관리
  { key: 'process_list', ko: '공정 목록', th: 'รายการกระบวนการ', en: 'Process List' },
  { key: 'add_new_process', ko: '새 공정 추가', th: 'เพิ่มกระบวนการใหม่', en: 'Add New Process' },
  { key: 'process_name', ko: '공정명', th: 'ชื่อกระบวนการ', en: 'Process Name' },
  { key: 'process_order', ko: '공정 순서', th: 'ลำดับกระบวนการ', en: 'Process Order' },
  { key: 'total_processes', ko: '총 공정 수', th: 'จำนวนกระบวนการทั้งหมด', en: 'Total Processes' },
  { key: 'production_requirements', ko: '생산 요구사항', th: 'ข้อกำหนดการผลิต', en: 'Production Requirements' },

  // 설비 관리
  { key: 'equipment_list', ko: '설비 목록', th: 'รายการอุปกรณ์', en: 'Equipment List' },
  { key: 'add_new_equipment', ko: '새 설비 추가', th: 'เพิ่มอุปกรณ์ใหม่', en: 'Add New Equipment' },
  { key: 'equipment_name', ko: '설비명', th: 'ชื่ออุปกรณ์', en: 'Equipment Name' },
  { key: 'daily_capacity', ko: '일일 생산능력', th: 'กำลังการผลิตต่อวัน', en: 'Daily Capacity' },
  { key: 'location', ko: '위치', th: 'สถานที่', en: 'Location' },
  { key: 'operation_cost', ko: '운영비용', th: 'ค่าใช้จ่ายในการดำเนินงาน', en: 'Operation Cost' },
  { key: 'total_equipment', ko: '총 설비 수', th: 'จำนวนอุปกรณ์ทั้งหมด', en: 'Total Equipment' },
  { key: 'total_capacity', ko: '총 생산능력', th: 'กำลังการผลิตรวม', en: 'Total Capacity' },
  { key: 'average_capacity', ko: '평균 생산능력', th: 'กำลังการผลิตเฉลี่ย', en: 'Average Capacity' },

  // 원자재 관리
  { key: 'material_list', ko: '원자재 목록', th: 'รายการวัตถุดิบ', en: 'Material List' },
  { key: 'add_new_material', ko: '새 원자재 추가', th: 'เพิ่มวัตถุดิบใหม่', en: 'Add New Material' },
  { key: 'material_name', ko: '원자재명', th: 'ชื่อวัตถุดิบ', en: 'Material Name' },
  { key: 'unit', ko: '단위', th: 'หน่วย', en: 'Unit' },
  { key: 'unit_price', ko: '단가', th: 'ราคาต่อหน่วย', en: 'Unit Price' },
  { key: 'supplier', ko: '공급업체', th: 'ผู้จัดจำหน่าย', en: 'Supplier' },
  { key: 'total_materials', ko: '총 원자재 수', th: 'จำนวนวัตถุดิบทั้งหมด', en: 'Total Materials' },
  { key: 'average_price', ko: '평균 단가', th: 'ราคาเฉลี่ย', en: 'Average Price' },
  { key: 'total_value', ko: '총 원자재 가치', th: 'มูลค่าวัตถุดิบรวม', en: 'Total Value' },
  { key: 'supplier_count', ko: '공급업체 수', th: 'จำนวนผู้จัดจำหน่าย', en: 'Supplier Count' },

  // 원가 계산
  { key: 'manufacturing_cost_calculator', ko: '제조원가 계산기', th: 'เครื่องคำนวณต้นทุนการผลิต', en: 'Manufacturing Cost Calculator' },
  { key: 'total_labor_cost', ko: '총 인건비', th: 'ค่าแรงงานรวม', en: 'Total Labor Cost' },
  { key: 'equipment_cost', ko: '설비 가동비', th: 'ค่าใช้จ่ายอุปกรณ์', en: 'Equipment Cost' },
  { key: 'material_cost', ko: '원자재비', th: 'ค่าวัตถุดิบ', en: 'Material Cost' },
  { key: 'daily_production', ko: '일 생산량', th: 'การผลิตต่อวัน', en: 'Daily Production' },
  { key: 'manufacturing_cost', ko: '제조원가', th: 'ต้นทุนการผลิต', en: 'Manufacturing Cost' },
  { key: 'calculate', ko: '계산하기', th: 'คำนวณ', en: 'Calculate' },

  // 관리자 패널
  { key: 'system_overview', ko: '시스템 전체 현황과 통계를 확인하세요', th: 'ตรวจสอบภาพรวมและสถิติของระบบ', en: 'Check system overview and statistics' },
  { key: 'system_status', ko: '시스템 상태', th: 'สถานะระบบ', en: 'System Status' },
  { key: 'recent_activity', ko: '최근 활동', th: 'กิจกรรมล่าสุด', en: 'Recent Activity' },
  { key: 'system_management', ko: '시스템 관리', th: 'การจัดการระบบ', en: 'System Management' },
  { key: 'database', ko: '데이터베이스', th: 'ฐานข้อมูล', en: 'Database' },
  { key: 'api_server', ko: 'API 서버', th: 'เซิร์ฟเวอร์ API', en: 'API Server' },
  { key: 'storage', ko: '저장소', th: 'ที่เก็บข้อมูล', en: 'Storage' },
  { key: 'healthy', ko: '정상', th: 'ปกติ', en: 'Healthy' },
  { key: 'warning', ko: '주의', th: 'คำเตือน', en: 'Warning' },
  { key: 'error', ko: '오류', th: 'ข้อผิดพลาด', en: 'Error' },

  // 메시지
  { key: 'no_data_found', ko: '검색 결과가 없습니다.', th: 'ไม่พบข้อมูล', en: 'No data found.' },
  { key: 'no_customers_registered', ko: '등록된 고객이 없습니다.', th: 'ไม่มีลูกค้าที่ลงทะเบียน', en: 'No customers registered.' },
  { key: 'no_products_registered', ko: '등록된 제품이 없습니다.', th: 'ไม่มีผลิตภัณฑ์ที่ลงทะเบียน', en: 'No products registered.' },
  { key: 'no_processes_registered', ko: '등록된 공정이 없습니다.', th: 'ไม่มีกระบวนการที่ลงทะเบียน', en: 'No processes registered.' },
  { key: 'no_equipment_registered', ko: '등록된 설비가 없습니다.', th: 'ไม่มีอุปกรณ์ที่ลงทะเบียน', en: 'No equipment registered.' },
  { key: 'no_materials_registered', ko: '등록된 원자재가 없습니다.', th: 'ไม่มีวัตถุดิบที่ลงทะเบียน', en: 'No materials registered.' },
  
  // 성공 메시지
  { key: 'customer_added_successfully', ko: '고객이 성공적으로 등록되었습니다.', th: 'เพิ่มลูกค้าเรียบร้อยแล้ว', en: 'Customer added successfully.' },
  { key: 'product_added_successfully', ko: '제품이 성공적으로 등록되었습니다.', th: 'เพิ่มผลิตภัณฑ์เรียบร้อยแล้ว', en: 'Product added successfully.' },
  { key: 'process_added_successfully', ko: '공정이 성공적으로 등록되었습니다.', th: 'เพิ่มกระบวนการเรียบร้อยแล้ว', en: 'Process added successfully.' },
  { key: 'equipment_added_successfully', ko: '설비가 성공적으로 등록되었습니다.', th: 'เพิ่มอุปกรณ์เรียบร้อยแล้ว', en: 'Equipment added successfully.' },
  { key: 'material_added_successfully', ko: '원자재가 성공적으로 등록되었습니다.', th: 'เพิ่มวัตถุดิบเรียบร้อยแล้ว', en: 'Material added successfully.' },

  // 에러 메시지
  { key: 'network_error', ko: '네트워크 오류가 발생했습니다.', th: 'เกิดข้อผิดพลาดเครือข่าย', en: 'Network error occurred.' },
  { key: 'server_error', ko: '서버 오류가 발생했습니다.', th: 'เกิดข้อผิดพลาดเซิร์ฟเวอร์', en: 'Server error occurred.' },
  { key: 'required_fields', ko: '필수 정보를 모두 입력해주세요.', th: 'กรุณากรอกข้อมูลที่จำเป็นทั้งหมด', en: 'Please fill in all required fields.' },
  { key: 'invalid_credentials', ko: '잘못된 로그인 정보입니다.', th: 'ข้อมูลการเข้าสู่ระบบไม่ถูกต้อง', en: 'Invalid login credentials.' },

  // 폼 라벨
  { key: 'username', ko: '사용자명', th: 'ชื่อผู้ใช้', en: 'Username' },
  { key: 'password', ko: '비밀번호', th: 'รหัสผ่าน', en: 'Password' },
  { key: 'confirm_password', ko: '비밀번호 확인', th: 'ยืนยันรหัสผ่าน', en: 'Confirm Password' },
  { key: 'select_customer', ko: '고객을 선택하세요', th: 'เลือกลูกค้า', en: 'Select Customer' },
  { key: 'select_product', ko: '제품을 선택하세요', th: 'เลือกผลิตภัณฑ์', en: 'Select Product' },

  // 단위
  { key: 'items_per_day', ko: '개/일', th: 'ชิ้น/วัน', en: 'items/day' },
  { key: 'won_per_day', ko: '원/일', th: 'วอน/วัน', en: 'KRW/day' },
  { key: 'won_per_unit', ko: '원/단위', th: 'วอน/หน่วย', en: 'KRW/unit' },
  { key: 'projects_count', ko: '개 프로젝트', th: 'โครงการ', en: 'projects' }
]

async function seedTranslations() {
  console.log('번역 데이터 시드 시작...')

  for (const translation of translations) {
    // 한국어
    await prisma.translation.upsert({
      where: {
        key_language: {
          key: translation.key,
          language: 'ko'
        }
      },
      update: {
        value: translation.ko
      },
      create: {
        key: translation.key,
        language: 'ko',
        value: translation.ko
      }
    })

    // 태국어
    await prisma.translation.upsert({
      where: {
        key_language: {
          key: translation.key,
          language: 'th'
        }
      },
      update: {
        value: translation.th
      },
      create: {
        key: translation.key,
        language: 'th',
        value: translation.th
      }
    })

    // 영어
    await prisma.translation.upsert({
      where: {
        key_language: {
          key: translation.key,
          language: 'en'
        }
      },
      update: {
        value: translation.en
      },
      create: {
        key: translation.key,
        language: 'en',
        value: translation.en
      }
    })
  }

  console.log('✅ 번역 데이터 시드 완료!')
}

async function main() {
  try {
    await seedTranslations()
  } catch (error) {
    console.error('번역 시드 오류:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main() 