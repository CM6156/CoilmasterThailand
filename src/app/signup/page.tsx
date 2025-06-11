'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  EyeIcon, 
  EyeSlashIcon, 
  UserIcon, 
  LockClosedIcon, 
  UserPlusIcon,
  EnvelopeIcon,
  IdentificationIcon
} from '@heroicons/react/24/outline'
import toast, { Toaster } from 'react-hot-toast'
import { useTranslation } from '@/contexts/TranslationContext'
import { useAuth } from '@/contexts/AuthContext'

// 비밀번호 강도 측정 함수
const measurePasswordStrength = (password: string): number => {
  if (!password) return 0;
  
  let strength = 0;
  
  // 길이 점수
  if (password.length >= 8) strength += 1;
  if (password.length >= 12) strength += 1;
  
  // 복잡성 점수
  if (/[A-Z]/.test(password)) strength += 1; // 대문자
  if (/[a-z]/.test(password)) strength += 1; // 소문자
  if (/[0-9]/.test(password)) strength += 1; // 숫자
  if (/[^A-Za-z0-9]/.test(password)) strength += 1; // 특수문자
  
  // 0-5 범위로 정규화
  return Math.min(5, strength);
};

// 비밀번호 강도에 따른 색상
const strengthColors = [
  'bg-red-500',       // 매우 약함 (0)
  'bg-orange-500',    // 약함 (1)
  'bg-yellow-500',    // 보통 (2)
  'bg-lime-500',      // 강함 (3)
  'bg-green-500',     // 매우 강함 (4)
  'bg-emerald-500'    // 최상 (5)
];

// 비밀번호 강도에 따른 텍스트
const strengthTexts = [
  '매우 약함',
  '약함',
  '보통',
  '강함',
  '매우 강함',
  '최상'
];

export default function SignupPage() {
  const { t, language, setLanguage } = useTranslation()
  const { register } = useAuth()
  const [formData, setFormData] = useState({
    username: '',
    nickname: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isLanguageOpen, setIsLanguageOpen] = useState(false)
  const [particles, setParticles] = useState<React.ReactNode[]>([])
  const [passwordStrength, setPasswordStrength] = useState(0)
  const router = useRouter()
  
  useEffect(() => {
    // 페이지 로드 시 배경 애니메이션 시작
    document.body.classList.add('signup-animation-active')
    
    // 파티클 생성 - 클라이언트에서만 실행
    const generateParticles = Array.from({ length: 50 }).map((_, i) => (
      <motion.div
        key={i}
        className="absolute bg-white rounded-full opacity-0"
        initial={{ 
          x: Math.random() * window.innerWidth, 
          y: Math.random() * window.innerHeight,
          scale: 0 
        }}
        animate={{ 
          scale: [0, Math.random() * 0.5 + 0.5, 0],
          opacity: [0, Math.random() * 0.5, 0],
          x: `calc(${Math.random() * 100}vw)`,
          y: `calc(${Math.random() * 100}vh)`,
        }}
        transition={{
          duration: Math.random() * 10 + 10,
          repeat: Infinity,
          delay: Math.random() * 5,
        }}
        style={{ 
          width: `${Math.random() * 10 + 2}px`, 
          height: `${Math.random() * 10 + 2}px` 
        }}
      />
    ))
    
    setParticles(generateParticles)
    
    return () => document.body.classList.remove('signup-animation-active')
  }, [])

  // 비밀번호 변경 시 강도 측정
  useEffect(() => {
    setPasswordStrength(measurePasswordStrength(formData.password));
  }, [formData.password]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }
  
  const handleLanguageChange = (lang: 'ko' | 'th' | 'en') => {
    setLanguage(lang)
    setIsLanguageOpen(false)
    toast.success(`언어가 ${lang === 'ko' ? '한국어' : lang === 'th' ? '태국어' : '영어'}로 변경되었습니다`)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // 필수 필드 확인
    if (!formData.username || !formData.nickname || !formData.email || !formData.password) {
      toast.error('모든 필수 항목을 입력해주세요.')
      setIsLoading(false)
      return
    }

    // 이메일 형식 확인
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      toast.error('유효한 이메일 주소를 입력해주세요.')
      setIsLoading(false)
      return
    }

    // 비밀번호 확인
    if (formData.password !== formData.confirmPassword) {
      toast.error(t('password_mismatch'))
      setIsLoading(false)
      return
    }

    // 비밀번호 길이 및 강도 확인
    if (formData.password.length < 6) {
      toast.error('비밀번호는 최소 6자 이상이어야 합니다.')
      setIsLoading(false)
      return
    }

    if (passwordStrength < 2) {
      toast.error('더 강력한 비밀번호를 사용해주세요.')
      setIsLoading(false)
      return
    }

    try {
      // AuthContext의 register 함수 사용
      const success = await register({
        username: formData.username,
        nickname: formData.nickname,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password
      })

      if (success) {
        toast.success('회원가입이 완료되었습니다!')
        setTimeout(() => {
          router.push('/login')
        }, 1500)
      } else {
        toast.error('회원가입에 실패했습니다.')
      }
    } catch (error) {
      toast.error('네트워크 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-800 to-indigo-900 flex items-center justify-center px-4 relative overflow-hidden">
      <Toaster position="top-center" />
      
      {/* 언어 선택 드롭다운 (오른쪽 상단 고정) */}
      <div className="absolute top-4 right-4 z-50">
        <div className="relative">
          <button 
            className="flex items-center px-3 py-2 border border-white border-opacity-30 rounded-md text-sm font-medium text-white bg-black bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm"
            onClick={() => setIsLanguageOpen(!isLanguageOpen)}
          >
            {language === 'ko' ? '한국어' : language === 'th' ? 'ไทย' : 'English'}
            <svg className="ml-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          
          {isLanguageOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 backdrop-blur-md">
              <div className="py-1" role="menu" aria-orientation="vertical">
                <button
                  className={`block w-full text-left px-4 py-2 text-sm ${language === 'ko' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
                  onClick={() => handleLanguageChange('ko')}
                >
                  한국어
                </button>
                <button
                  className={`block w-full text-left px-4 py-2 text-sm ${language === 'th' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
                  onClick={() => handleLanguageChange('th')}
                >
                  ไทย (태국어)
                </button>
                <button
                  className={`block w-full text-left px-4 py-2 text-sm ${language === 'en' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
                  onClick={() => handleLanguageChange('en')}
                >
                  English (영어)
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* 배경 애니메이션 */}
      <div className="absolute inset-0 z-0">
        {/* 그라데이션 원형 효과들 */}
        <motion.div
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-purple-600 opacity-30 blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, -30, 0] 
          }}
          transition={{ 
            duration: 15,
            repeat: Infinity,
            repeatType: "mirror"
          }}
        />
        
        <motion.div
          className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-indigo-600 opacity-30 blur-3xl"
          animate={{ 
            scale: [1, 1.3, 1],
            x: [0, -30, 0],
            y: [0, 50, 0] 
          }}
          transition={{ 
            duration: 18,
            repeat: Infinity,
            repeatType: "mirror"
          }}
        />
        
        {/* 파티클 효과 */}
        {particles}
      </div>
      
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.8 }}
          className="max-w-xl w-full z-10"
        >
          {/* 로고 영역 */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.2 
              }}
              className="inline-flex items-center justify-center w-20 h-20 bg-white bg-opacity-20 rounded-full backdrop-blur-sm mb-4 relative overflow-hidden"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-24 h-24 absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 opacity-70"
              />
              <UserPlusIcon className="w-10 h-10 text-white relative z-10" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-4xl font-bold text-white mb-2"
            >
              {t('signup_title')}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-blue-200"
            >
              {t('signup_subtitle')}
            </motion.p>
          </div>

          {/* 회원가입 폼 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-purple-900 bg-opacity-50 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-purple-400 border-opacity-30"
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* 아이디 입력 */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <label htmlFor="username" className="block text-sm font-medium text-white mb-2">
                  아이디 <span className="text-red-300">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    minLength={3}
                    className="w-full pl-12 pr-4 py-3 bg-purple-800 bg-opacity-50 border border-purple-300 border-opacity-50 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50 focus:border-transparent transition-all duration-300"
                    placeholder="로그인에 사용할 아이디"
                  />
                  <UserIcon className="absolute left-4 top-3.5 w-5 h-5 text-blue-200" />
                </div>
              </motion.div>

              {/* 닉네임 입력 */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.55 }}
              >
                <label htmlFor="nickname" className="block text-sm font-medium text-white mb-2">
                  닉네임 <span className="text-red-300">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="nickname"
                    name="nickname"
                    value={formData.nickname}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-3 bg-purple-800 bg-opacity-50 border border-purple-300 border-opacity-50 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50 focus:border-transparent transition-all duration-300"
                    placeholder="대시보드에 표시될 닉네임"
                  />
                  <IdentificationIcon className="absolute left-4 top-3.5 w-5 h-5 text-blue-200" />
                </div>
              </motion.div>

              {/* 이름과 성 - 2열 배치 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <label htmlFor="firstName" className="block text-sm font-medium text-white mb-2">
                    이름
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full pl-4 pr-4 py-3 bg-purple-800 bg-opacity-50 border border-purple-300 border-opacity-50 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50 focus:border-transparent transition-all duration-300"
                      placeholder="이름"
                    />
                  </div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.65 }}
                >
                  <label htmlFor="lastName" className="block text-sm font-medium text-white mb-2">
                    성
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full pl-4 pr-4 py-3 bg-purple-800 bg-opacity-50 border border-purple-300 border-opacity-50 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50 focus:border-transparent transition-all duration-300"
                      placeholder="성"
                    />
                  </div>
                </motion.div>
              </div>

              {/* 이메일 입력 */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                  이메일 <span className="text-red-300">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-3 bg-purple-800 bg-opacity-50 border border-purple-300 border-opacity-50 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50 focus:border-transparent transition-all duration-300"
                    placeholder="example@email.com"
                  />
                  <EnvelopeIcon className="absolute left-4 top-3.5 w-5 h-5 text-blue-200" />
                </div>
              </motion.div>

              {/* 비밀번호 입력 */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.75 }}
              >
                <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                  비밀번호 <span className="text-red-300">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                    className="w-full pl-12 pr-12 py-3 bg-purple-800 bg-opacity-50 border border-purple-300 border-opacity-50 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50 focus:border-transparent transition-all duration-300"
                    placeholder={t('password_min')}
                  />
                  <LockClosedIcon className="absolute left-4 top-3.5 w-5 h-5 text-blue-200" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-3.5 text-blue-200 hover:text-white transition-colors"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>
                
                {/* 비밀번호 강도 표시기 */}
                {formData.password && (
                  <div className="mt-2">
                    <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${strengthColors[passwordStrength]} transition-all duration-300`} 
                        style={{ width: `${(passwordStrength / 5) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-blue-200 mt-1">
                      비밀번호 강도: {strengthTexts[passwordStrength]}
                    </p>
                  </div>
                )}
              </motion.div>

              {/* 비밀번호 확인 */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-white mb-2">
                  비밀번호 확인 <span className="text-red-300">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-12 py-3 bg-purple-800 bg-opacity-50 border border-purple-300 border-opacity-50 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50 focus:border-transparent transition-all duration-300"
                    placeholder={t('confirm_password_placeholder')}
                  />
                  <LockClosedIcon className="absolute left-4 top-3.5 w-5 h-5 text-blue-200" />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-3.5 text-blue-200 hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="text-red-300 text-sm mt-2">{t('password_mismatch')}</p>
                )}
              </motion.div>

              {/* 회원가입 버튼 */}
              <motion.button
                type="submit"
                disabled={isLoading || !formData.username || !formData.nickname || !formData.email || !formData.password || !formData.confirmPassword || formData.password !== formData.confirmPassword}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  type: "spring", 
                  duration: 0.5, 
                  delay: 0.9,
                  stiffness: 500,
                  damping: 15
                }}
                className="w-full py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-indigo-700 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform"
              >
                <span className="flex items-center justify-center">
                  {isLoading && (
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  {isLoading ? t('signup_loading') : t('signup_button')}
                </span>
              </motion.button>
            </form>

            {/* 로그인 링크 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1 }}
              className="mt-6 text-center"
            >
              <p className="text-blue-200">
                {t('have_account')}{' '}
                <Link
                  href="/login"
                  className="text-white font-semibold hover:underline transition-all duration-300"
                >
                  {t('login')}
                </Link>
              </p>
            </motion.div>

            {/* 홈으로 돌아가기 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.1 }}
              className="mt-4 text-center"
            >
              <Link
                href="/"
                className="text-blue-200 hover:text-white transition-colors text-sm flex items-center justify-center space-x-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>{t('back_to_home')}</span>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
} 