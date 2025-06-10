'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { useTranslation, LanguageSelector } from '@/contexts/TranslationContext'
import {
  HomeIcon,
  UserGroupIcon,
  CubeIcon,
  CogIcon,
  BeakerIcon,
  TruckIcon,
  CalculatorIcon,
  BellIcon,
  ChartBarIcon,
  UserIcon
} from '@heroicons/react/24/outline'

interface LayoutProps {
  children: React.ReactNode
  title: string
  description?: string
}

const menuItems = [
  { href: '/dashboard', icon: HomeIcon, labelKey: 'dashboard' },
  { href: '/customers', icon: UserGroupIcon, labelKey: 'customer_management' },
  { href: '/products', icon: CubeIcon, labelKey: 'product_management' },
  { href: '/processes', icon: CogIcon, labelKey: 'process_management' },
  { href: '/equipments', icon: BeakerIcon, labelKey: 'equipment_management' },
  { href: '/materials', icon: TruckIcon, labelKey: 'material_management' },
  { href: '/costs', icon: CalculatorIcon, labelKey: 'cost_calculation' },
  { href: '/admin', icon: ChartBarIcon, labelKey: 'admin_panel' },
]

export default function Layout({ children, title, description }: LayoutProps) {
  const pathname = usePathname()
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 사이드바 */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
        <div className="flex flex-col h-full">
          {/* 로고 */}
          <Link href="/" className="flex items-center justify-center h-16 bg-blue-600 text-white hover:bg-blue-700 transition-colors">
            <h1 className="text-xl font-bold">{t('thailand_transfer_system')}</h1>
          </Link>

          {/* 메뉴 */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon className={`w-5 h-5 mr-3 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                  <span className="font-medium">{t(item.labelKey)}</span>
                </Link>
              )
            })}
          </nav>

          {/* 언어 선택기 추가 */}
          <div className="p-4 border-t border-gray-200">
            <div className="mb-3">
              <LanguageSelector />
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <UserIcon className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{t('admin')}</p>
                <p className="text-xs text-gray-500 truncate">admin@system.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="ml-64">
        {/* 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-sm border-b border-gray-200 px-8 py-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              {description && (
                <p className="text-gray-600 mt-1">{description}</p>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <BellIcon className="w-6 h-6" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* 페이지 컨텐츠 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="p-8"
        >
          {children}
        </motion.div>
      </div>
    </div>
  )
} 