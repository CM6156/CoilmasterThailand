'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Layout from '@/components/Layout'
import { PlusIcon, MagnifyingGlassIcon, PencilIcon, TrashIcon, CogIcon } from '@heroicons/react/24/outline'
import toast, { Toaster } from 'react-hot-toast'

interface Process {
  id: string
  name: string
  processOrder: number
  createdAt: string
  product: {
    id: string
    name: string
    customer: {
      id: string
      name: string
    }
  }
  _count: {
    productionReqs: number
  }
}

interface Product {
  id: string
  name: string
  customer: {
    name: string
  }
}

export default function ProcessesPage() {
  const [processes, setProcesses] = useState<Process[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    productId: '',
    processOrder: 1
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [processesResponse, productsResponse] = await Promise.all([
        fetch('/api/processes'),
        fetch('/api/products')
      ])

      if (processesResponse.ok) {
        const processesData = await processesResponse.json()
        setProcesses(processesData)
      }

      if (productsResponse.ok) {
        const productsData = await productsResponse.json()
        setProducts(productsData)
      }
    } catch (error) {
      toast.error('데이터를 불러오는데 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.productId || formData.processOrder < 1) {
      toast.error('모든 필드를 올바르게 입력해주세요.')
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/processes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success('공정이 성공적으로 등록되었습니다.')
        setFormData({ name: '', productId: '', processOrder: 1 })
        setShowModal(false)
        fetchData()
      } else {
        const data = await response.json()
        toast.error(data.error || '공정 등록에 실패했습니다.')
      }
    } catch (error) {
      toast.error('네트워크 오류가 발생했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredProcesses = processes.filter(process =>
    process.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    process.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    process.product.customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // 제품별로 그룹화
  const groupedProcesses = filteredProcesses.reduce((acc, process) => {
    const productId = process.product.id
    if (!acc[productId]) {
      acc[productId] = {
        product: process.product,
        processes: []
      }
    }
    acc[productId].processes.push(process)
    return acc
  }, {} as Record<string, { product: any, processes: Process[] }>)

  if (isLoading) {
    return (
      <Layout title="공정 관리" description="제품별 공정을 관리하고 새로운 공정을 추가하세요">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout title="공정 관리" description="제품별 공정을 관리하고 새로운 공정을 추가하세요">
      <Toaster position="top-center" />
      
      <div className="space-y-6">
        {/* 액션 버튼들 */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div className="relative w-full sm:w-auto sm:min-w-80">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="공정명, 제품명 또는 고객명으로 검색..."
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
            새 공정 추가
          </motion.button>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-lg shadow-sm border"
          >
            <h3 className="text-sm font-medium text-gray-500">총 공정 수</h3>
            <p className="text-2xl font-bold text-blue-600 mt-2">{processes.length}</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-lg shadow-sm border"
          >
            <h3 className="text-sm font-medium text-gray-500">관련 제품</h3>
            <p className="text-2xl font-bold text-green-600 mt-2">
              {Object.keys(groupedProcesses).length}
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-lg shadow-sm border"
          >
            <h3 className="text-sm font-medium text-gray-500">생산 요구사항</h3>
            <p className="text-2xl font-bold text-purple-600 mt-2">
              {processes.reduce((sum, process) => sum + process._count.productionReqs, 0)}
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-6 rounded-lg shadow-sm border"
          >
            <h3 className="text-sm font-medium text-gray-500">검색 결과</h3>
            <p className="text-2xl font-bold text-orange-600 mt-2">{filteredProcesses.length}</p>
          </motion.div>
        </div>

        {/* 공정 목록 (제품별 그룹화) */}
        <div className="space-y-6">
          {Object.keys(groupedProcesses).length === 0 ? (
            <div className="bg-white shadow-sm border border-gray-200 rounded-lg">
              <div className="text-center py-12">
                <CogIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-2">
                  {searchTerm ? '검색 결과가 없습니다.' : '등록된 공정이 없습니다.'}
                </p>
                <p className="text-gray-400 text-sm">
                  새 공정을 추가하여 생산 프로세스를 관리하세요.
                </p>
              </div>
            </div>
          ) : (
            Object.values(groupedProcesses).map((group, groupIndex) => (
              <motion.div
                key={group.product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: groupIndex * 0.1 }}
                className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden"
              >
                {/* 제품 헤더 */}
                <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{group.product.name}</h3>
                      <p className="text-sm text-gray-600">고객: {group.product.customer.name}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800">
                        {group.processes.length}개 공정
                      </span>
                      <div className="text-xs text-gray-500">
                        총 {group.processes.reduce((sum, p) => sum + p._count.productionReqs, 0)}개 요구사항
                      </div>
                    </div>
                  </div>
                </div>

                {/* 공정 목록 */}
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          순서
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          공정명
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          생산 요구사항
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
                      {group.processes
                        .sort((a, b) => a.processOrder - b.processOrder)
                        .map((process, index) => (
                        <motion.tr
                          key={process.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: (groupIndex * 0.1) + (index * 0.05) }}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                                {process.processOrder}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <CogIcon className="w-5 h-5 text-gray-400 mr-3" />
                              <div>
                                <div className="text-sm font-medium text-gray-900">{process.name}</div>
                                <div className="text-xs text-gray-500">ID: {process.id.slice(-8)}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                              {process._count.productionReqs}개
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(process.createdAt).toLocaleDateString('ko-KR')}
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
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* 새 공정 추가 모달 */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
          >
            <h3 className="text-lg font-medium text-gray-900 mb-4">새 공정 추가</h3>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    공정명
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="공정명을 입력하세요"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    제품 선택
                  </label>
                  <select
                    value={formData.productId}
                    onChange={(e) => setFormData({...formData, productId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">제품을 선택하세요</option>
                    {products.map(product => (
                      <option key={product.id} value={product.id}>
                        {product.name} ({product.customer.name})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    공정 순서
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.processOrder}
                    onChange={(e) => setFormData({...formData, processOrder: parseInt(e.target.value) || 1})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="공정 순서를 입력하세요"
                    required
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    setFormData({ name: '', productId: '', processOrder: 1 })
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