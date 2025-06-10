'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Layout from '@/components/Layout'
import { 
  PlusIcon, 
  MagnifyingGlassIcon, 
  PencilIcon, 
  TrashIcon, 
  BeakerIcon,
  WrenchScrewdriverIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'
import toast, { Toaster } from 'react-hot-toast'

interface Equipment {
  id: string
  name: string
  maxCapaPerDay: number
  location: string | null
  operationCost: number | null
  createdAt: string
  _count: {
    productionReqs: number
  }
}

export default function EquipmentsPage() {
  const [equipments, setEquipments] = useState<Equipment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    maxCapaPerDay: '',
    location: '',
    operationCost: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchEquipments()
  }, [])

  const fetchEquipments = async () => {
    try {
      const response = await fetch('/api/equipments')
      if (response.ok) {
        const data = await response.json()
        setEquipments(data)
      } else {
        toast.error('설비 목록을 불러오는데 실패했습니다.')
      }
    } catch (error) {
      toast.error('네트워크 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.maxCapaPerDay) {
      toast.error('필수 정보를 모두 입력해주세요.')
      return
    }

    const capacity = parseInt(formData.maxCapaPerDay)
    if (capacity <= 0) {
      toast.error('올바른 생산 능력을 입력해주세요.')
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/equipments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          maxCapaPerDay: capacity,
          location: formData.location.trim() || null,
          operationCost: formData.operationCost ? parseFloat(formData.operationCost) : null
        }),
      })

      if (response.ok) {
        toast.success('설비가 성공적으로 등록되었습니다.')
        setFormData({ name: '', maxCapaPerDay: '', location: '', operationCost: '' })
        setShowModal(false)
        fetchEquipments()
      } else {
        const data = await response.json()
        toast.error(data.error || '설비 등록에 실패했습니다.')
      }
    } catch (error) {
      toast.error('네트워크 오류가 발생했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getCapacityColor = (capacity: number) => {
    if (capacity >= 1000) return 'text-green-600 bg-green-100'
    if (capacity >= 500) return 'text-blue-600 bg-blue-100'
    if (capacity >= 100) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const filteredEquipments = equipments.filter(equipment =>
    equipment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (equipment.location && equipment.location.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const totalCapacity = equipments.reduce((sum, eq) => sum + eq.maxCapaPerDay, 0)
  const avgCapacity = equipments.length > 0 ? Math.round(totalCapacity / equipments.length) : 0
  const totalOperationCost = equipments.reduce((sum, eq) => sum + (eq.operationCost ? parseFloat(eq.operationCost.toString()) : 0), 0)

  if (isLoading) {
    return (
      <Layout title="설비 관리" description="생산 설비를 관리하고 새로운 설비를 추가하세요">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout title="설비 관리" description="생산 설비를 관리하고 새로운 설비를 추가하세요">
      <Toaster position="top-center" />
      
      <div className="space-y-6">
        {/* 액션 버튼들 */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div className="relative w-full sm:w-auto sm:min-w-80">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="설비명 또는 위치로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowModal(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            새 설비 추가
          </motion.button>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-lg shadow-sm border"
          >
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BeakerIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">총 설비 수</p>
                <p className="text-2xl font-semibold text-gray-900">{equipments.length}</p>
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
                <ChartBarIcon className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">총 생산능력</p>
                <p className="text-2xl font-semibold text-gray-900">{totalCapacity.toLocaleString()}</p>
                <p className="text-xs text-gray-500">개/일</p>
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
                <WrenchScrewdriverIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">평균 생산능력</p>
                <p className="text-2xl font-semibold text-gray-900">{avgCapacity.toLocaleString()}</p>
                <p className="text-xs text-gray-500">개/일</p>
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
                <CurrencyDollarIcon className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">총 운영비용</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {totalOperationCost.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">원/일</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* 설비 목록 */}
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">설비 목록</h3>
          </div>
          
          {filteredEquipments.length === 0 ? (
            <div className="text-center py-12">
              <BeakerIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-2">
                {searchTerm ? '검색 결과가 없습니다.' : '등록된 설비가 없습니다.'}
              </p>
              <p className="text-gray-400 text-sm">
                새 설비를 추가하여 생산 시설을 관리하세요.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      설비명
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      생산능력
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      위치
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      운영비용
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      사용 현황
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      등록일
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      액션
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredEquipments.map((equipment, index) => (
                    <motion.tr
                      key={equipment.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <BeakerIcon className="w-5 h-5 text-gray-400 mr-3" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{equipment.name}</div>
                            <div className="text-xs text-gray-500">ID: {equipment.id.slice(-8)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCapacityColor(equipment.maxCapaPerDay)}`}>
                          {equipment.maxCapaPerDay.toLocaleString()}개/일
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPinIcon className="w-4 h-4 mr-1" />
                          {equipment.location || '미지정'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {equipment.operationCost ? 
                            `${parseFloat(equipment.operationCost.toString()).toLocaleString()}원/일` : 
                            '미설정'
                          }
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            {equipment._count.productionReqs}개 프로젝트
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(equipment.createdAt).toLocaleDateString('ko-KR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-1 text-blue-600 hover:text-blue-900 transition-colors"
                            title="수정"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-1 text-red-600 hover:text-red-900 transition-colors"
                            title="삭제"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* 새 설비 추가 모달 */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
          >
            <h3 className="text-lg font-medium text-gray-900 mb-4">새 설비 추가</h3>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    설비명 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="설비명을 입력하세요"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    일일 최대 생산능력 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.maxCapaPerDay}
                    onChange={(e) => setFormData({...formData, maxCapaPerDay: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="일일 최대 생산 가능 수량"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">개/일 단위로 입력</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    설치 위치
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="설비 설치 위치 (선택사항)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    일일 운영비용
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.operationCost}
                    onChange={(e) => setFormData({...formData, operationCost: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="일일 운영비용 (선택사항)"
                  />
                  <p className="text-xs text-gray-500 mt-1">원/일 단위로 입력</p>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    setFormData({ name: '', maxCapaPerDay: '', location: '', operationCost: '' })
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? '등록 중...' : '등록'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </Layout>
  )
} 