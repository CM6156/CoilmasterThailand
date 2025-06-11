'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { 
  ArrowRightIcon, 
  GlobeAsiaAustraliaIcon,
  SparklesIcon,
  CubeIcon,
  CogIcon,
  TruckIcon,
  BeakerIcon
} from '@heroicons/react/24/outline'
import toast, { Toaster } from 'react-hot-toast'

// 텍스트 타이핑 애니메이션 컴포넌트
const TypeWriter = ({ text, delay = 0 }: { text: string; delay?: number }) => {
  const [displayText, setDisplayText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentIndex < text.length) {
        setDisplayText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }
    }, delay + currentIndex * 100)

    return () => clearTimeout(timer)
  }, [currentIndex, text, delay])

  return (
    <span>
      {displayText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity }}
        className="inline-block w-0.5 h-6 bg-white ml-1"
      />
    </span>
  )
}

// 떠다니는 파티클 컴포넌트
const FloatingParticle = ({ delay }: { delay: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ 
        opacity: [0, 1, 0],
        scale: [0, 1, 0],
        y: [-20, -100],
        x: [0, Math.random() * 100 - 50]
      }}
      transition={{
        duration: 3,
        delay,
        repeat: Infinity,
        repeatDelay: Math.random() * 2
      }}
      className="absolute w-2 h-2 bg-white rounded-full"
      style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`
      }}
    />
  )
}

// 기능 카드 컴포넌트
const FeatureCard = ({ icon: Icon, title, description, delay }: {
  icon: any
  title: string
  description: string
  delay: number
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, rotateY: -15 }}
      animate={{ opacity: 1, y: 0, rotateY: 0 }}
      transition={{ duration: 0.8, delay }}
      whileHover={{ 
        scale: 1.05, 
        rotateY: 5,
        boxShadow: "0 25px 50px rgba(255,255,255,0.1)"
      }}
      className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 text-white relative overflow-hidden group"
    >
      {/* 호버 시 배경 효과 */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
        initial={false}
      />
      
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: delay + 0.2 }}
        className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-6 mx-auto"
      >
        <Icon className="w-8 h-8 text-white" />
      </motion.div>
      
      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: delay + 0.4 }}
        className="text-xl font-bold mb-4 text-center"
      >
        {title}
      </motion.h3>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: delay + 0.6 }}
        className="text-white font-medium text-center leading-relaxed"
      >
        {description}
      </motion.p>
    </motion.div>
  )
}

export default function Home() {
  const [showContent, setShowContent] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [language, setLanguage] = useState('ko') // 초기 언어 설정: 한국어
  const [isLanguageOpen, setIsLanguageOpen] = useState(false) // 언어 드롭다운 열림/닫힘 상태

  // 언어 변경 핸들러
  const handleLanguageChange = (lang: string) => {
    setLanguage(lang)
    setIsLanguageOpen(false)
    toast.success(`언어가 ${lang === 'ko' ? '한국어' : lang === 'th' ? '태국어' : '영어'}로 변경되었습니다`)
  }

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 500)
    return () => clearTimeout(timer)
  }, [])

  const steps = ['고객', '제품', '공정', '설비', '원자재']

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep(prev => (prev + 1) % steps.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 relative overflow-hidden">
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
      
      {/* 화려한 배경 애니메이션 */}
      <div className="absolute inset-0 overflow-hidden">
        {/* 메인 그라데이션 볼들 */}
        <motion.div
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(59,130,246,0.6) 0%, rgba(147,51,234,0.4) 50%, transparent 100%)'
          }}
          animate={{
            x: [0, 150, 0],
            y: [0, -100, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        
        <motion.div
          className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(236,72,153,0.6) 0%, rgba(59,130,246,0.4) 50%, transparent 100%)'
          }}
          animate={{
            x: [0, -100, 0],
            y: [0, 150, 0],
            scale: [1, 1.3, 1]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />

        <motion.div
          className="absolute top-1/2 left-1/2 w-80 h-80 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(168,85,247,0.4) 0%, rgba(59,130,246,0.3) 50%, transparent 100%)'
          }}
          animate={{
            x: [0, -80, 0],
            y: [0, 80, 0],
            rotate: [0, 360]
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />

        {/* 떠다니는 파티클들 */}
        {Array.from({ length: 20 }).map((_, i) => (
          <FloatingParticle key={i} delay={i * 0.2} />
        ))}

        {/* 격자 패턴 */}
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)',
            backgroundSize: '50px 50px'
          }} />
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <AnimatePresence>
          {showContent && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-6xl mx-auto"
            >
              {/* 로고 영역 */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  delay: 0.2 
                }}
                className="mb-12"
              >
                <motion.div 
                  className="inline-flex items-center justify-center w-32 h-32 bg-white bg-opacity-20 rounded-full backdrop-blur-sm mb-8 relative"
                  animate={{
                    boxShadow: [
                      "0 0 0 0 rgba(255,255,255,0.4)",
                      "0 0 0 30px rgba(255,255,255,0)",
                      "0 0 0 0 rgba(255,255,255,0)"
                    ]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 1
                  }}
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <GlobeAsiaAustraliaIcon className="w-16 h-16 text-white" />
                  </motion.div>
                  
                  {/* 주변 회전하는 아이콘들 */}
                  {[CubeIcon, CogIcon, TruckIcon, BeakerIcon].map((Icon, index) => (
                    <motion.div
                      key={index}
                      className="absolute w-8 h-8 text-white"
                      animate={{
                        rotate: 360,
                        x: [0, 60 * Math.cos(index * Math.PI/2), 0],
                        y: [0, 60 * Math.sin(index * Math.PI/2), 0]
                      }}
                      transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "linear",
                        delay: index * 0.5
                      }}
                    >
                      <Icon className="w-6 h-6" />
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>

              {/* 메인 제목 */}
              <motion.h1
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-6xl md:text-8xl font-bold text-white mb-8 leading-tight"
              >
                <motion.span
                  animate={{ 
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{ duration: 5, repeat: Infinity }}
                  style={{
                    background: "linear-gradient(45deg, #fff, #60a5fa, #a855f7, #fff)",
                    backgroundSize: "400% 400%",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "white",
                    color: "white",
                    backgroundClip: "text"
                  }}
                >
                  태국 이관 시스템
                </motion.span>
              </motion.h1>

              {/* 동적 워크플로우 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.0 }}
                className="text-2xl md:text-4xl text-blue-100 mb-4"
              >
                <div className="flex items-center justify-center space-x-4 flex-wrap">
                  {steps.map((step, index) => (
                    <motion.span
                      key={step}
                      className={`px-4 py-2 rounded-full transition-all duration-500 ${
                        currentStep === index 
                          ? 'bg-white text-blue-900 shadow-lg scale-110 font-bold' 
                          : 'bg-white bg-opacity-20 text-white font-semibold'
                      }`}
                      animate={currentStep === index ? {
                        scale: [1, 1.1, 1],
                        boxShadow: ["0 0 0 0 rgba(255,255,255,0.7)", "0 0 0 20px rgba(255,255,255,0)", "0 0 0 0 rgba(255,255,255,0)"]
                      } : {}}
                      transition={{ duration: 0.6 }}
                    >
                      {step}
                    </motion.span>
                  ))}
                </div>
              </motion.div>

              {/* 부제목 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                className="text-xl md:text-2xl text-white font-semibold mb-16"
              >
                <TypeWriter 
                  text="체계적인 제품 관리로 완벽한 이관 프로세스를 구현합니다" 
                  delay={1500}
                />
              </motion.div>

              {/* 기능 카드들 */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.8 }}
                className="grid md:grid-cols-3 gap-8 mb-16 max-w-5xl mx-auto"
              >
                <FeatureCard
                  icon={SparklesIcon}
                  title="실시간 추적"
                  description="제품별 공정 현황과 해상운송 상태를 실시간으로 모니터링하고 분석합니다"
                  delay={2.0}
                />
                <FeatureCard
                  icon={CubeIcon}
                  title="원가 계산"
                  description="인건비, 설비비, 원자재비를 포함한 정확한 제조원가를 자동으로 산출합니다"
                  delay={2.2}
                />
                <FeatureCard
                  icon={TruckIcon}
                  title="통합 관리"
                  description="고객부터 원자재까지 전 과정을 하나의 시스템으로 체계적으로 관리합니다"
                  delay={2.4}
                />
              </motion.div>

              {/* CTA 버튼들 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 2.6 }}
                className="space-y-4 sm:space-y-0 sm:space-x-6 sm:flex sm:justify-center"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href="/login"
                    className="inline-flex items-center justify-center px-12 py-4 text-xl font-bold text-blue-900 bg-white rounded-full hover:bg-blue-50 transition-all duration-300 shadow-2xl group relative overflow-hidden"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                      initial={false}
                    />
                    <span className="relative z-10">시작하기</span>
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="relative z-10"
                    >
                      <ArrowRightIcon className="w-6 h-6 ml-3" />
                    </motion.div>
                  </Link>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center justify-center px-12 py-4 text-xl font-bold text-white border-2 border-white border-opacity-50 rounded-full hover:bg-white hover:bg-opacity-10 transition-all duration-300 backdrop-blur-sm relative overflow-hidden group"
                  >
                    <motion.div
                      className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                      initial={false}
                    />
                    <span className="relative z-10">대시보드 보기</span>
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 하단 정보 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 3.0 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center"
        >
          <motion.p 
            className="text-white text-sm font-medium"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            © 2024 태국 이관 제품 관리 시스템. 모든 권리 보유.
          </motion.p>
        </motion.div>
      </div>
    </div>
  )
}
