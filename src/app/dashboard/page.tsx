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
  ChartBarIcon
} from '@heroicons/react/24/outline'
import toast, { Toaster } from 'react-hot-toast'

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 시뮬레이션된 로딩
    setTimeout(() => setIsLoading(false), 1000)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">대시보드를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-center" />
      
      {/* 사이드바 */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
        <div className="flex flex-col h-full">
          {/* 로고 */}
          <div className="flex items-center justify-center h-16 bg-blue-600 text-white">
            <h1 className="text-xl font-bold">태국 이관 시스템</h1>
          </div>

          {/* 메뉴 */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            <Link href="/dashboard" className="flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg">
              <HomeIcon className="w-5 h-5 mr-3" />
              대시보드
            </Link>
            <Link href="/customers" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
              <UserGroupIcon className="w-5 h-5 mr-3" />
              고객 관리
            </Link>
            <Link href="/products" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
              <CubeIcon className="w-5 h-5 mr-3" />
              제품 관리
            </Link>
            <Link href="/processes" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
              <CogIcon className="w-5 h-5 mr-3" />
              공정 관리
            </Link>
            <Link href="/equipments" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
              <BeakerIcon className="w-5 h-5 mr-3" />
              설비 관리
            </Link>
            <Link href="/materials" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
              <TruckIcon className="w-5 h-5 mr-3" />
              원자재 관리
            </Link>
            <Link href="/costs" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
              <CalculatorIcon className="w-5 h-5 mr-3" />
              원가 계산
            </Link>
            <Link href="/admin" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
              <ChartBarIcon className="w-5 h-5 mr-3" />
              관리자 패널
            </Link>
          </nav>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="ml-64 p-8">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">대시보드</h1>
          <p className="text-gray-600">태국 이관 제품 관리 시스템 전체 현황</p>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-lg shadow-sm border"
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
            className="bg-white p-6 rounded-lg shadow-sm border"
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
            className="bg-white p-6 rounded-lg shadow-sm border"
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
            className="bg-white p-6 rounded-lg shadow-sm border"
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
            className="bg-white rounded-lg shadow-sm border"
          >
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">제품 현황</h2>
                <Link
                  href="/products/create"
                  className="inline-flex items-center px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <PlusIcon className="w-4 h-4 mr-1" />
                  새 제품
                </Link>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">스마트폰 케이스</h3>
                      <p className="text-sm text-gray-500">고객: 삼성전자</p>
                      <p className="text-sm text-gray-500">공정: 3개</p>
                    </div>
                    <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                      운송중
                    </span>
                  </div>
                  <div className="mt-3">
                    <Link href="/products/1" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      상세 보기 →
                    </Link>
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">자동차 부품</h3>
                      <p className="text-sm text-gray-500">고객: 현대자동차</p>
                      <p className="text-sm text-gray-500">공정: 5개</p>
                    </div>
                    <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                      준비중
                    </span>
                  </div>
                  <div className="mt-3">
                    <Link href="/products/2" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
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
            className="bg-white rounded-lg shadow-sm border"
          >
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-900">최근 알림</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="p-1">
                    <BellIcon className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 font-medium">
                      🆕 admin님이 새로운 제품을 등록했습니다: 스마트폰 케이스
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="p-1">
                    <BellIcon className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-500">
                      📦 제품 상태 변경: 자동차 부품 → 운송중
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="p-1">
                    <BellIcon className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-500">
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
  )
} 