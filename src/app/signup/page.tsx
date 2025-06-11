'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { EyeIcon, EyeSlashIcon, UserIcon, LockClosedIcon, UserPlusIcon } from '@heroicons/react/24/outline'
import toast, { Toaster } from 'react-hot-toast'
import { useTranslation } from '@/contexts/TranslationContext'

export default function SignupPage() {
  const { t, language, setLanguage } = useTranslation()
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isLanguageOpen, setIsLanguageOpen] = useState(false)
  const router = useRouter()
  
  useEffect(() => {
    // 페이지 로드 시 배경 애니메이션 시작
    document.body.classList.add('signup-animation-active')
    return () => document.body.classList.remove('signup-animation-active')
  }, [])

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

    // 비밀번호 확인
    if (formData.password !== formData.confirmPassword) {
      toast.error(t('password_mismatch'))
      setIsLoading(false)
      return
    }

    // 비밀번호 길이 확인
    if (formData.password.length < 6) {
      toast.error('비밀번호는 최소 6자 이상이어야 합니다.')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('회원가입이 완료되었습니다!')
        setTimeout(() => {
          router.push('/login')
        }, 1500)
      } else {
        toast.error(data.error || '회원가입에 실패했습니다.')
      }
    } catch (error) {
      toast.error('네트워크 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }
  
  // 배경 효과를 위한 파티클 생성
  const particles = Array.from({ length: 50 }).map((_, i) => (
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
          className="max-w-md w-full z-10"
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
            className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white border-opacity-20"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 아이디 입력 */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <label htmlFor="username" className="block text-sm font-medium text-white mb-2">
                  {t('username')}
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
                    className="w-full pl-12 pr-4 py-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 focus:border-transparent transition-all duration-300"
                    placeholder={t('username_min')}
                  />
                  <UserIcon className="absolute left-4 top-3.5 w-5 h-5 text-blue-200" />
                </div>
              </motion.div>

              {/* 비밀번호 입력 */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                  {t('password')}
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
                    className="w-full pl-12 pr-12 py-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 focus:border-transparent transition-all duration-300"
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
              </motion.div>

              {/* 비밀번호 확인 */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-white mb-2">
                  {t('confirm_password')}
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-12 py-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 focus:border-transparent transition-all duration-300"
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
                disabled={isLoading || !formData.username || !formData.password || !formData.confirmPassword || formData.password !== formData.confirmPassword}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  type: "spring", 
                  duration: 0.5, 
                  delay: 0.8,
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
              transition={{ duration: 0.5, delay: 0.9 }}
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
              transition={{ duration: 0.5, delay: 1 }}
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