'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Layout from '@/components/Layout'
import { 
  PlusIcon, 
  MagnifyingGlassIcon, 
  PencilIcon, 
  TrashIcon, 
  TruckIcon,
  CurrencyDollarIcon,
  BuildingOfficeIcon,
  ScaleIcon,
  TagIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'
import toast, { Toaster } from 'react-hot-toast'

interface Material {
  id: string
  name: string
  unit: string
  cost: number
  supplier: string | null
  createdAt: string
  _count: {
    productionReqs: number
  }
}

export default function MaterialsPage() {
  const [materials, setMaterials] = useState<Material[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    unit: '',
    cost: '',
    supplier: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchMaterials()
  }, [])

  const fetchMaterials = async () => {
    try {
      const response = await fetch('/api/materials')
      if (response.ok) {
        const data = await response.json()
        setMaterials(data)
      } else {
        toast.error('원자재 목록을 불러오는데 실패했습니다.')
      }
    } catch (error) {
      toast.error('네트워크 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.unit.trim() || !formData.cost) {
      toast.error('필수 정보를 모두 입력해주세요.')
      return
    }

    const cost = parseFloat(formData.cost)
    if (cost <= 0) {
      toast.error('올바른 단가를 입력해주세요.')
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/materials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          unit: formData.unit.trim(),
          cost: cost,
          supplier: formData.supplier.trim() || null
        }),
      })

      if (response.ok) {
        toast.success('원자재가 성공적으로 등록되었습니다.')
        setFormData({ name: '', unit: '', cost: '', supplier: '' })
        setShowModal(false)
        fetchMaterials()
      } else {
        const data = await response.json()
        toast.error(data.error || '원자재 등록에 실패했습니다.')
      }
    } catch (error) {
      toast.error('네트워크 오류가 발생했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getCostColor = (cost: number) => {
    if (cost >= 10000) return 'text-red-600 bg-red-100'
    if (cost >= 5000) return 'text-orange-600 bg-orange-100'
    if (cost >= 1000) return 'text-yellow-600 bg-yellow-100'
    return 'text-green-600 bg-green-100'
  }

  const filteredMaterials = materials.filter(material =>
    material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (material.supplier && material.supplier.toLowerCase().includes(searchTerm.toLowerCase())) ||
    material.unit.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // 통계 계산
  const totalMaterials = materials.length
  const avgCost = materials.length > 0 ? 
    Math.round(materials.reduce((sum, m) => sum + parseFloat(m.cost.toString()), 0) / materials.length) : 0
  const totalValue = materials.reduce((sum, m) => sum + parseFloat(m.cost.toString()), 0)
  const uniqueSuppliers = new Set(materials.filter(m => m.supplier).map(m => m.supplier)).size

  if (isLoading) {
    return (
      <Layout title="원자재 관리" description="생산에 필요한 원자재를 관리하고 새로운 원자재를 추가하세요">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout title="원자재 관리" description="생산에 필요한 원자재를 관리하고 새로운 원자재를 추가하세요">
      <Toaster position="top-center" />
      
      <div className="space-y-6">
        {/* 액션 버튼들 */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div className="relative w-full sm:w-auto sm:min-w-80">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="원자재명, 공급업체 또는 단위로 검색..."
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
            새 원자재 추가
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
                <TruckIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">총 원자재 수</p>
                <p className="text-2xl font-semibold text-gray-900">{totalMaterials}</p>
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
                <CurrencyDollarIcon className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">평균 단가</p>
                <p className="text-2xl font-semibold text-gray-900">{avgCost.toLocaleString()}</p>
                <p className="text-xs text-gray-500">원/단위</p>
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
                <ChartBarIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">총 원자재 가치</p>
                <p className="text-2xl font-semibold text-gray-900">{totalValue.toLocaleString()}</p>
                <p className="text-xs text-gray-500">원</p>
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
                <BuildingOfficeIcon className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">공급업체 수</p>
                <p className="text-2xl font-semibold text-gray-900">{uniqueSuppliers}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* 원자재 목록 */}
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">원자재 목록</h3>
          </div>
          
          {filteredMaterials.length === 0 ? (
            <div className="text-center py-12">
              <TruckIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-2">
                {searchTerm ? '검색 결과가 없습니다.' : '등록된 원자재가 없습니다.'}
              </p>
              <p className="text-gray-400 text-sm">
                새 원자재를 추가하여 생산 자재를 관리하세요.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      원자재명
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      단위
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      단가
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      공급업체
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
                  {filteredMaterials.map((material, index) => (
                    <motion.tr
                      key={material.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <TruckIcon className="w-5 h-5 text-gray-400 mr-3" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{material.name}</div>
                            <div className="text-xs text-gray-500">ID: {material.id.slice(-8)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <ScaleIcon className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                            {material.unit}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCostColor(parseFloat(material.cost.toString()))}`}>
                          {parseFloat(material.cost.toString()).toLocaleString()}원
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500">
                          <BuildingOfficeIcon className="w-4 h-4 mr-1" />
                          {material.supplier || '미지정'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            {material._count.productionReqs}개 프로젝트
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(material.createdAt).toLocaleDateString('ko-KR')}
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

        {/* 가격대별 원자재 분포 */}
        {materials.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white shadow-sm border border-gray-200 rounded-lg p-6"
          >
            <h3 className="text-lg font-medium text-gray-900 mb-4">가격대별 원자재 분포</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { label: '고가 (10,000원 이상)', min: 10000, color: 'bg-red-500' },
                { label: '중상급 (5,000-9,999원)', min: 5000, max: 9999, color: 'bg-orange-500' },
                { label: '중급 (1,000-4,999원)', min: 1000, max: 4999, color: 'bg-yellow-500' },
                { label: '저가 (1,000원 미만)', max: 999, color: 'bg-green-500' }
              ].map((range, index) => {
                const count = materials.filter(m => {
                  const cost = parseFloat(m.cost.toString())
                  if (range.max !== undefined && range.min !== undefined) {
                    return cost >= range.min && cost <= range.max
                  } else if (range.min !== undefined) {
                    return cost >= range.min
                  } else {
                    return cost <= (range.max || 0)
                  }
                }).length
                
                const percentage = materials.length > 0 ? (count / materials.length) * 100 : 0
                
                return (
                  <div key={index} className="text-center">
                    <div className="mb-2">
                      <div className="text-2xl font-bold text-gray-900">{count}</div>
                      <div className="text-xs text-gray-500">{range.label}</div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                        className={`h-2 rounded-full ${range.color}`}
                      />
                    </div>
                    <div className="text-xs text-gray-600 mt-1">{percentage.toFixed(1)}%</div>
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}
      </div>

      {/* 새 원자재 추가 모달 */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
          >
            <h3 className="text-lg font-medium text-gray-900 mb-4">새 원자재 추가</h3>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    원자재명 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="원자재명을 입력하세요"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    단위 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={(e) => setFormData({...formData, unit: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="예: kg, 개, L, m² 등"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    단가 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.cost}
                    onChange={(e) => setFormData({...formData, cost: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="단위당 가격을 입력하세요"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">원/단위</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    공급업체
                  </label>
                  <input
                    type="text"
                    value={formData.supplier}
                    onChange={(e) => setFormData({...formData, supplier: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="공급업체명 (선택사항)"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    setFormData({ name: '', unit: '', cost: '', supplier: '' })
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