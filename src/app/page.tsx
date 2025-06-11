'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { 
  ArrowRightIcon, 
  GlobeAsiaAustraliaIcon,
  SparklesIcon,
  CubeIcon,
  CogIcon,
  TruckIcon,
  BeakerIcon,
  CalculatorIcon
} from '@heroicons/react/24/outline'
import toast, { Toaster } from 'react-hot-toast'
import { useTranslation } from '@/contexts/TranslationContext'

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
    }, delay + currentIndex * 40) // 타이핑 속도 빠르게 조정

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

// 3D 효과 카드 컴포넌트
const Feature3DCard = ({ icon: Icon, title, description, delay }: {
  icon: any
  title: string
  description: string
  delay: number
}) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    
    const card = cardRef.current
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    
    const rotateXValue = (y - centerY) / 10
    const rotateYValue = (centerX - x) / 10
    
    setRotateX(rotateXValue)
    setRotateY(rotateYValue)
  }
  
  const handleMouseLeave = () => {
    setRotateX(0)
    setRotateY(0)
    setIsHovered(false)
  }
  
  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay }}
      style={{ 
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transformStyle: 'preserve-3d'
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 text-white relative overflow-hidden group"
    >
      {/* 호버 시 그라데이션 효과 */}
      <motion.div
        animate={{ opacity: isHovered ? 0.2 : 0 }}
        className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 transition-opacity duration-300"
      />
      
      {/* 호버 시 파티클 효과 */}
      {isHovered && (
        <>
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0, x: '50%', y: '50%' }}
              animate={{ 
                opacity: [0, 0.8, 0],
                scale: [0, 1, 0],
                x: `${50 + Math.random() * 50 * (Math.random() > 0.5 ? 1 : -1)}%`,
                y: `${50 + Math.random() * 50 * (Math.random() > 0.5 ? 1 : -1)}%`
              }}
              transition={{ duration: 1, delay: i * 0.1 }}
              className="absolute w-1 h-1 bg-white rounded-full"
            />
          ))}
        </>
      )}
      
      <motion.div
        style={{ transform: 'translateZ(20px)' }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: delay + 0.2 }}
        className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-6 mx-auto relative z-10"
      >
        <Icon className="w-8 h-8 text-white" />
      </motion.div>
      
      <motion.h3
        style={{ transform: 'translateZ(30px)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: delay + 0.4 }}
        className="text-xl font-bold mb-4 text-center relative z-10"
      >
        {title}
      </motion.h3>
      
      <motion.p
        style={{ transform: 'translateZ(20px)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: delay + 0.6 }}
        className="text-white font-medium text-center leading-relaxed relative z-10"
      >
        {description}
      </motion.p>
    </motion.div>
  )
}

export default function Home() {
  const { t, language, setLanguage } = useTranslation()
  const [showContent, setShowContent] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [isLanguageOpen, setIsLanguageOpen] = useState(false)
  
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
  
  const handleLanguageChange = (lang: 'ko' | 'th' | 'en') => {
    setLanguage(lang)
    setIsLanguageOpen(false)
    toast.success(`언어가 ${lang === 'ko' ? '한국어' : lang === 'th' ? '태국어' : '영어'}로 변경되었습니다`)
  }

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
          className="absolute top-[20%] left-[10%] w-[500px] h-[500px] rounded-full bg-blue-600 opacity-30 filter blur-[100px]"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, -20, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        
        <motion.div
          className="absolute bottom-[10%] right-[5%] w-[600px] h-[600px] rounded-full bg-purple-600 opacity-30 filter blur-[100px]"
          animate={{
            scale: [1, 1.1, 1],
            x: [0, 20, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        
        <motion.div
          className="absolute top-[50%] left-[50%] w-[400px] h-[400px] rounded-full bg-indigo-600 opacity-20 filter blur-[100px]"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, 30, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        
        {/* 떠다니는 파티클들 */}
        {Array.from({ length: 30 }).map((_, i) => (
          <FloatingParticle key={i} delay={i * 0.2} />
        ))}
        
        {/* 미세한 별빛 효과 */}
        {Array.from({ length: 100 }).map((_, i) => (
          <motion.div
            key={`star-${i}`}
            className="absolute bg-white rounded-full"
            style={{
              width: Math.random() * 2 + 1 + 'px',
              height: Math.random() * 2 + 1 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>
      
      <AnimatePresence>
        {showContent && (
          <div className="relative z-10 pt-20 pb-32 px-6 mx-auto max-w-7xl">
            {/* 헤더 및 메인 콘텐츠 */}
            <div className="text-center mb-20">
              <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <motion.h1 
                  className="text-5xl md:text-7xl font-bold text-white mb-6"
                  style={{ 
                    WebkitTextFillColor: 'white',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                  }}
                >
                  {t('app_name')}
                </motion.h1>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  className="text-xl md:text-2xl text-blue-200 max-w-3xl mx-auto mb-8"
                >
                  <TypeWriter text={t('intro_subtitle')} delay={800} />
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1, duration: 0.5 }}
                  className="mt-12 mb-6 flex flex-col md:flex-row gap-4 justify-center"
                >
                  <Link href="/login">
                    <motion.button
                      whileHover={{ scale: 1.05, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg hover:shadow-lg transform transition-all duration-300 flex items-center justify-center"
                    >
                      <span>{t('get_started')}</span>
                      <ArrowRightIcon className="w-5 h-5 ml-2" />
                    </motion.button>
                  </Link>
                  
                  <Link href="/dashboard">
                    <motion.button
                      whileHover={{ scale: 1.05, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-8 py-4 bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-20 text-white font-semibold rounded-lg hover:bg-opacity-20 transform transition-all duration-300"
                    >
                      {t('dashboard')}
                    </motion.button>
                  </Link>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5, duration: 0.8 }}
                  className="text-lg text-blue-200 max-w-2xl mx-auto"
                >
                  <span className="text-white font-semibold">{steps[currentStep]}</span>
                  <motion.span
                    key={currentStep}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    {" → "}
                  </motion.span>
                </motion.div>
              </motion.div>
            </div>
            
            {/* 주요 기능 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8, duration: 1 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              <Feature3DCard 
                icon={GlobeAsiaAustraliaIcon} 
                title={t('feature_realtime_tracking')} 
                description={t('feature_realtime_desc')} 
                delay={0}
              />
              
              <Feature3DCard 
                icon={CalculatorIcon} 
                title={t('feature_cost_calculation')} 
                description={t('feature_cost_desc')} 
                delay={0.2}
              />
              
              <Feature3DCard 
                icon={CubeIcon} 
                title={t('feature_integrated_management')} 
                description={t('feature_integrated_desc')} 
                delay={0.4}
              />
            </motion.div>
            
            {/* 하단 버튼 */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.2, duration: 0.8 }}
              className="flex justify-center mt-16"
            >
              <Link href="/login">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="bg-white bg-opacity-10 backdrop-blur-sm rounded-full p-6 border border-white border-opacity-20 shadow-xl hover:shadow-2xl transform transition-all duration-300"
                >
                  <ArrowRightIcon className="w-8 h-8 text-white" />
                </motion.button>
              </Link>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
