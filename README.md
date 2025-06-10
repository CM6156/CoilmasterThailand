# 태국 이관 시스템 (Thailand Transfer System)

태국 이관 프로젝트 관리를 위한 포괄적인 시스템으로, 고객 → 제품 → 공정 → 설비 → 원자재 워크플로우를 지원합니다.

## 🌟 주요 기능

- **실시간 추적**: 제품별 공정 현황과 해상운송 상태를 실시간으로 모니터링
- **원가 계산**: 인건비, 설비비, 원자재비를 포함한 정확한 제조원가 산출
- **통합 관리**: 고객부터 원자재까지 전 과정을 하나의 시스템으로 관리
- **실시간 알림**: LINE 연동을 통한 실시간 알림 시스템
- **관리자 패널**: 사용자, 담당자, 데이터베이스 관리 기능
- **한국어, 태국어, 영어 다국어 지원**: 다국어 기능을 통해 다양한 언어로 서비스 제공

## 🛠 기술 스택

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Animation**: Framer Motion
- **Backend**: Next.js API Routes
- **Database**: SQLite (개발) / PostgreSQL (배포)
- **ORM**: Prisma
- **Authentication**: bcryptjs (쿠키 기반 세션)
- **Notifications**: React Hot Toast, LINE Notify API
- **UI Icons**: Heroicons

## 🚀 빠른 시작

### 1. 프로젝트 클론 및 설치

\`\`\`bash
git clone <repository-url>
cd thailand-transfer-system
npm install
\`\`\`

### 2. 환경 변수 설정

\`.env\` 파일을 확인하고 필요한 경우 수정하세요:

\`\`\`env
# 개발용 SQLite 데이터베이스
DATABASE_URL="file:./dev.db"

# LINE 알림 설정 (선택사항)
LINE_NOTIFY_TOKEN="your_line_notify_token_here"

# 인증 설정
JWT_SECRET="your_super_secret_jwt_key_here_change_in_production"
BCRYPT_ROUNDS=12

# Next.js 설정
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
\`\`\`

### 3. 데이터베이스 설정

\`\`\`bash
# Prisma 클라이언트 생성
npx prisma generate

# 데이터베이스 스키마 적용
npx prisma db push

# 테스트 데이터 생성
npm run seed
\`\`\`

### 4. 개발 서버 실행

\`\`\`bash
npm run dev
\`\`\`

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 애플리케이션을 확인하세요.

## 👥 테스트 계정

시드 데이터 실행 후 다음 계정으로 로그인할 수 있습니다:

- **관리자**: \`admin\` / \`123456\`
- **일반 사용자**: \`user\` / \`123456\`

## 📱 주요 페이지

### 인트로 페이지 (\`/\`)
- 애니메이션 배경과 시스템 소개
- 로그인 및 대시보드 접근 링크

### 로그인/회원가입 (\`/login\`, \`/signup\`)
- 사용자 인증 시스템
- 비밀번호 해싱 및 세션 관리

### 대시보드 (\`/dashboard\`)
- 전체 시스템 현황 개요
- 제품, 공정, 운송 상태 통계
- 최근 알림 표시

### 관리 페이지들
- \`/customers\`: 고객 관리
- \`/products\`: 제품 관리
- \`/processes\`: 공정 관리
- \`/equipments\`: 설비 관리
- \`/materials\`: 원자재 관리
- \`/costs\`: 제조원가 계산
- \`/admin\`: 관리자 패널

## 🏗 데이터베이스 구조

### 주요 테이블

- **users**: 사용자 정보 (username, password, role)
- **customers**: 고객 정보
- **products**: 제품 정보 (고객 연결)
- **processes**: 공정 정보 (제품 연결)
- **equipments**: 설비 정보
- **raw_materials**: 원자재 정보
- **production_requirements**: 생산 요구사항 (연결 테이블)
- **shipping_status**: 해상운송 상태
- **cost_calculations**: 제조원가 계산 결과
- **notifications**: 시스템 알림
- **translations**: 다국어 번역 정보

### ERD 구조

\`\`\`
[users]──┐
         │       [managers]        [shipping_status]
[customers]──[products]──[processes]──[equipments]──[raw_materials]
                         │             │               │
                     [production_requirements] (연결 테이블)
\`\`\`

## 🔧 개발 도구

### Prisma Studio 실행

데이터베이스를 시각적으로 관리하려면:

\`\`\`bash
npx prisma studio
\`\`\`

### 데이터베이스 초기화

\`\`\`bash
# 데이터베이스 재설정 (주의: 모든 데이터 삭제)
rm -f prisma/dev.db
npx prisma db push
npm run seed
\`\`\`

## 📡 API 엔드포인트

### 인증
- \`POST /api/auth/signup\`: 회원가입
- \`POST /api/auth/login\`: 로그인

### 데이터 관리
- \`GET/POST /api/customers\`: 고객 관리
- \`GET/POST /api/products\`: 제품 관리
- \`GET/POST /api/processes\`: 공정 관리
- \`GET/POST /api/equipments\`: 설비 관리
- \`GET/POST /api/materials\`: 원자재 관리
- \`GET/POST /api/notifications\`: 알림 관리

### 기능
- \`POST /api/costs/calculate\`: 제조원가 계산
- \`POST /api/notifications/send\`: LINE 알림 전송

## 🌍 배포

### Vercel 배포

1. Vercel에 프로젝트 연결
2. 환경 변수 설정:
   - \`DATABASE_URL\`: PostgreSQL 연결 문자열
   - \`LINE_NOTIFY_TOKEN\`: LINE 알림 토큰
   - \`JWT_SECRET\`: JWT 비밀키

3. 배포 후 데이터베이스 마이그레이션:
   \`\`\`bash
   npx prisma db push
   \`\`\`

### PostgreSQL 사용시

\`.env\` 파일에서 DATABASE_URL을 PostgreSQL로 변경:

\`\`\`env
DATABASE_URL="postgresql://username:password@localhost:5432/thailand_transfer_db"
\`\`\`

Prisma 스키마에서 provider 변경:

\`\`\`prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
\`\`\`

## 🔔 LINE 알림 설정

1. [LINE Notify](https://notify-bot.line.me/my/)에서 토큰 발급
2. \`.env\`에 토큰 설정:
   \`\`\`env
   LINE_NOTIFY_TOKEN="your_actual_token_here"
   \`\`\`

3. 자동 알림 트리거:
   - 신규 사용자 등록
   - 제품/공정/설비/원자재 등록
   - 제품 상태 변경
   - 해상운송 ETA 변경

## 🤝 기여하기

1. Fork the repository
2. Create your feature branch (\`git checkout -b feature/AmazingFeature\`)
3. Commit your changes (\`git commit -m 'Add some AmazingFeature'\`)
4. Push to the branch (\`git push origin feature/AmazingFeature\`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 📞 지원

문제가 발생하거나 질문이 있으시면 이슈를 생성해 주세요.

---

**태국 이관 제품 관리 시스템** - 체계적인 제품 관리로 완벽한 이관 프로세스를 구현합니다.

## 🌍 다국어 지원

이 시스템은 아래 언어를 지원합니다:
- 한국어 (기본)
- 태국어
- 영어

다국어 기능은 Translation 테이블을 통해 관리되며, 모든 텍스트는 번역 키를 통해 표시됩니다.

## 📄 다국어 API 사용 예시

### React 컴포넌트에서 사용

```tsx
import { useTranslation } from '@/contexts/TranslationContext'

function MyComponent() {
  const { t, language, setLanguage } = useTranslation()
  
  return (
    <div>
      <h1>{t('product_management')}</h1>
      <p>{t('product_description')}</p>
      
      <button onClick={() => setLanguage('th')}>
        태국어로 변경
      </button>
    </div>
  )
}
```

### 페이지별 번역 로딩

```tsx
import { usePageTranslations } from '@/contexts/TranslationContext'

function ProductPage() {
  const keys = [
    'product_list', 
    'add_new_product', 
    'product_name'
  ]
  
  const { translations, loading } = usePageTranslations(keys)
  
  if (loading) return <div>로딩 중...</div>
  
  return (
    <div>
      <h1>{translations.product_list}</h1>
      <button>{translations.add_new_product}</button>
    </div>
  )
}
```
