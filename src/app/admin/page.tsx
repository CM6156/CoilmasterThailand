'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Layout from '@/components/Layout'
import { 
  ChartBarIcon, 
  UserGroupIcon, 
  CubeIcon, 
  CogIcon, 
  TruckIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

interface SystemStats {
  totalCustomers: number
  totalProducts: number
  totalProcesses: number
  totalShipments: number
  recentActivities: Array<{
    id: string
    type: string
    message: string
    timestamp: string
  }>
  systemHealth: {
    database: 'healthy' | 'warning' | 'error'
    api: 'healthy' | 'warning' | 'error'
    storage: 'healthy' | 'warning' | 'error'
  }
}

export default function AdminPage() {
  const [stats, setStats] = useState<SystemStats>({
    totalCustomers: 0,
    totalProducts: 0,
    totalProcesses: 0,
    totalShipments: 0,
    recentActivities: [],
    systemHealth: {
      database: 'healthy',
      api: 'healthy',
      storage: 'healthy'
    }
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 실제 환경에서는 API를 호출하여 통계 데이터를 가져옵니다
    setTimeout(() => {
      setStats({
        totalCustomers: 15,
        totalProducts: 42,
        totalProcesses: 128,
        totalShipments: 23,
        recentActivities: [
          { id: '1', type: 'customer', message: '새 고객 "LG전자"가 등록되었습니다', timestamp: '2024-01-15T10:30:00Z' },
          { id: '2', type: 'product', message: '제품 "스마트폰 케이스"가 추가되었습니다', timestamp: '2024-01-15T09:15:00Z' },
          { id: '3', type: 'shipment', message: '운송 상태가 "도착"으로 업데이트되었습니다', timestamp: '2024-01-15T08:45:00Z' },
          { id: '4', type: 'process', message: '새 공정 "품질검사"가 등록되었습니다', timestamp: '2024-01-15T08:20:00Z' },
          { id: '5', type: 'system', message: 'LINE 알림 서비스가 활성화되었습니다', timestamp: '2024-01-15T07:30:00Z' }
        ],
        systemHealth: {
          database: 'healthy',
          api: 'healthy',
          storage: 'warning'
        }
      })
      setIsLoading(false)
    }, 1000)
  }, [])

  const getHealthIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />
      case 'warning':
        return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />
      case 'error':
        return <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
      default:
        return <ClockIcon className="w-5 h-5 text-gray-500" />
    }
  }

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600'
      case 'warning':
        return 'text-yellow-600'
      case 'error':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'customer':
        return <UserGroupIcon className="w-4 h-4 text-blue-500" />
      case 'product':
        return <CubeIcon className="w-4 h-4 text-green-500" />
      case 'process':
        return <CogIcon className="w-4 h-4 text-purple-500" />
      case 'shipment':
        return <TruckIcon className="w-4 h-4 text-orange-500" />
      default:
        return <ChartBarIcon className="w-4 h-4 text-gray-500" />
    }
  }

  if (isLoading) {
    return (
      <Layout title="관리자 패널" description="시스템 전체 현황과 통계를 확인하세요">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout title="관리자 패널" description="시스템 전체 현황과 통계를 확인하세요">
      <div className="space-y-8">
        {/* 시스템 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-lg shadow-sm border"
          >
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <UserGroupIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">총 고객</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalCustomers}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-lg shadow-sm border"
          >
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CubeIcon className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">총 제품</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalProducts}</p>
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
              <div className="p-2 bg-purple-100 rounded-lg">
                <CogIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">총 공정</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalProcesses}</p>
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
              <div className="p-2 bg-orange-100 rounded-lg">
                <TruckIcon className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">운송 건수</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalShipments}</p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 시스템 상태 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-lg shadow-sm border"
          >
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">시스템 상태</h3>
            </div>
            <div className="p-6 space-y-4">
              {Object.entries(stats.systemHealth).map(([component, status], index) => (
                <div key={component} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getHealthIcon(status)}
                    <span className="text-sm font-medium text-gray-900 capitalize">
                      {component === 'database' ? '데이터베이스' : 
                       component === 'api' ? 'API 서버' : '저장소'}
                    </span>
                  </div>
                  <span className={`text-sm font-medium ${getHealthColor(status)} capitalize`}>
                    {status === 'healthy' ? '정상' : 
                     status === 'warning' ? '주의' : '오류'}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* 최근 활동 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-lg shadow-sm border"
          >
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">최근 활동</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {stats.recentActivities.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="flex items-start space-x-3"
                  >
                    <div className="flex-shrink-0 mt-1">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(activity.timestamp).toLocaleString('ko-KR')}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* 시스템 관리 도구 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white rounded-lg shadow-sm border"
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">시스템 관리</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <ChartBarIcon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-blue-900">보고서 생성</p>
                <p className="text-xs text-blue-600 mt-1">시스템 운영 보고서</p>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
              >
                <UserGroupIcon className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-green-900">사용자 관리</p>
                <p className="text-xs text-green-600 mt-1">권한 및 계정 관리</p>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
              >
                <CogIcon className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-purple-900">시스템 설정</p>
                <p className="text-xs text-purple-600 mt-1">환경 설정 관리</p>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  )
} 