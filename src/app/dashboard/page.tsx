'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  HomeIcon,
  UserGroupIcon,
  CubeIcon,
  CogIcon,
  BeakerIcon,
  TruckIcon,
  CalculatorIcon,
  BellIcon,
  PlusIcon,
  ChartBarIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline'
import toast, { Toaster } from 'react-hot-toast'

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [language, setLanguage] = useState('ko') // 초기 언어 설정: 한국어
  const [isLanguageOpen, setIsLanguageOpen] = useState(false) // 언어 드롭다운 열림/닫힘 상태

  // 언어 변경 핸들러
  const handleLanguageChange = (lang: string) => {
    setLanguage(lang)
    setIsLanguageOpen(false)
    toast.success(`언어가 ${lang === 'ko' ? '한국어' : lang === 'th' ? '태국어' : '영어'}로 변경되었습니다`)
  }

  // 로그아웃 핸들러
  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault()
    // 로그아웃 로직 구현
    toast.success('로그아웃 되었습니다')
    setTimeout(() => {
      window.location.href = '/login'
    }, 1500)
  }

  useEffect(() => {
    // 시뮬레이션된 로딩
    setTimeout(() => setIsLoading(false), 1000)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="mt-4 text-white font-medium">대시보드를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <Toaster position="top-center" />
      
      {/* 사이드바 */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
        <div className="flex flex-col h-full">
          {/* 로고 */}
          <div className="flex items-center justify-center h-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
            <h1 className="text-xl font-bold">태국 이관 시스템</h1>
          </div>
          
          {/* 사용자 정보 */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-3">
                A
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">관리자</div>
                <div className="text-xs text-gray-500">admin@system.com</div>
              </div>
            </div>
          </div>

          {/* 메뉴 */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            <Link href="/dashboard" className="flex items-center px-4 py-2 bg-blue-100 text-blue-700 font-medium rounded-lg transition-all duration-200 shadow-sm">
              <HomeIcon className="w-5 h-5 mr-3" />
              대시보드
            </Link>
            <Link href="/customers" className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-200">
              <UserGroupIcon className="w-5 h-5 mr-3" />
              고객 관리
            </Link>
            <Link href="/products" className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-200">
              <CubeIcon className="w-5 h-5 mr-3" />
              제품 관리
            </Link>
            <Link href="/processes" className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-200">
              <CogIcon className="w-5 h-5 mr-3" />
              공정 관리
            </Link>
            <Link href="/equipments" className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-200">
              <BeakerIcon className="w-5 h-5 mr-3" />
              설비 관리
            </Link>
            <Link href="/materials" className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-200">
              <TruckIcon className="w-5 h-5 mr-3" />
              원자재 관리
            </Link>
            <Link href="/costs" className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-200">
              <CalculatorIcon className="w-5 h-5 mr-3" />
              원가 계산
            </Link>
            <Link href="/admin" className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-200">
              <ChartBarIcon className="w-5 h-5 mr-3" />
              관리자 패널
            </Link>
          </nav>
          
          {/* 로그아웃 버튼 */}
          <div className="px-4 py-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
              로그아웃
            </button>
          </div>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="ml-64">
        {/* 헤더 */}
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <div></div> {/* 빈 공간으로 오른쪽 정렬 유지 */}
          
          {/* 언어 선택 드롭다운 */}
          <div className="relative">
            <button 
              className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              onClick={() => setIsLanguageOpen(!isLanguageOpen)}
            >
              {language === 'ko' ? '한국어' : language === 'th' ? 'ไทย' : 'English'}
              <svg className="ml-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            
            {isLanguageOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
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
        
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-blue-900 mb-2">대시보드</h1>
            <p className="text-blue-700 font-medium">태국 이관 제품 관리 시스템 전체 현황</p>
          </div>

          {/* 통계 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white p-6 rounded-lg shadow-md border border-blue-100 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <CubeIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">총 제품</h3>
                  <p className="text-2xl font-bold text-gray-900">12</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white p-6 rounded-lg shadow-md border border-blue-100 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg">
                  <TruckIcon className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">운송 중</h3>
                  <p className="text-2xl font-bold text-gray-900">5</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white p-6 rounded-lg shadow-md border border-blue-100 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-center">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <CogIcon className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">총 공정</h3>
                  <p className="text-2xl font-bold text-gray-900">24</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white p-6 rounded-lg shadow-md border border-blue-100 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-center">
                <div className="p-3 bg-red-100 rounded-lg">
                  <BellIcon className="w-6 h-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">새 알림</h3>
                  <p className="text-2xl font-bold text-gray-900">3</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* 제품 및 알림 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 제품 현황 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-lg shadow-md border border-blue-100 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-blue-900">제품 현황</h2>
                  <Link
                    href="/products/create"
                    className="inline-flex items-center px-3 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-sm rounded-lg hover:from-blue-700 hover:to-indigo-800 transition-colors shadow-sm"
                  >
                    <PlusIcon className="w-4 h-4 mr-1" />
                    새 제품
                  </Link>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="border border-blue-100 rounded-lg p-4 hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-blue-900">스마트폰 케이스</h3>
                        <p className="text-sm text-blue-700">고객: 삼성전자</p>
                        <p className="text-sm text-blue-700">공정: 3개</p>
                      </div>
                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                        운송중
                      </span>
                    </div>
                    <div className="mt-3">
                      <Link href="/products/1" className="text-blue-600 hover:text-blue-800 text-sm font-semibold">
                        상세 보기 →
                      </Link>
                    </div>
                  </div>
                  
                  <div className="border border-blue-100 rounded-lg p-4 hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-blue-900">자동차 부품</h3>
                        <p className="text-sm text-blue-700">고객: 현대자동차</p>
                        <p className="text-sm text-blue-700">공정: 5개</p>
                      </div>
                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                        준비중
                      </span>
                    </div>
                    <div className="mt-3">
                      <Link href="/products/2" className="text-blue-600 hover:text-blue-800 text-sm font-semibold">
                        상세 보기 →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* 최근 알림 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-lg shadow-md border border-blue-100 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold text-blue-900">최근 알림</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="p-1">
                      <BellIcon className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-blue-900 font-semibold">
                        🆕 admin님이 새로운 제품을 등록했습니다: 스마트폰 케이스
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="p-1">
                      <BellIcon className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-blue-700">
                        📦 제품 상태 변경: 자동차 부품 → 운송중
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="p-1">
                      <BellIcon className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-blue-700">
                        🆕 user님이 새로운 공정을 등록했습니다: 마감 처리
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}