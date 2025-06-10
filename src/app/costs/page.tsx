'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Layout from '@/components/Layout'
import { CalculatorIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline'

export default function CostsPage() {
  const [formData, setFormData] = useState({
    productName: '',
    totalLaborCost: '',
    equipmentCost: '',
    materialCost: '',
    dailyProduction: ''
  })
  const [result, setResult] = useState<number | null>(null)

  const handleCalculate = () => {
    const laborCost = parseFloat(formData.totalLaborCost) || 0
    const equipCost = parseFloat(formData.equipmentCost) || 0
    const matCost = parseFloat(formData.materialCost) || 0
    const production = parseInt(formData.dailyProduction) || 1

    const manufacturingCost = (laborCost + equipCost + matCost) / production
    setResult(manufacturingCost)
  }

  return (
    <Layout title="제조원가 계산" description="인건비, 설비비, 원자재비를 포함한 제조원가를 계산하세요">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* 계산기 카드 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border p-8"
        >
          <div className="flex items-center mb-6">
            <CalculatorIcon className="w-8 h-8 text-blue-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">제조원가 계산기</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 입력 필드들 */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  제품명
                </label>
                <input
                  type="text"
                  value={formData.productName}
                  onChange={(e) => setFormData({...formData, productName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="제품명을 입력하세요"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  총 인건비 (원/일)
                </label>
                <input
                  type="number"
                  value={formData.totalLaborCost}
                  onChange={(e) => setFormData({...formData, totalLaborCost: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="일일 총 인건비"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  설비 가동비 (원/일)
                </label>
                <input
                  type="number"
                  value={formData.equipmentCost}
                  onChange={(e) => setFormData({...formData, equipmentCost: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="일일 설비 가동비"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  원자재비 (원/일)
                </label>
                <input
                  type="number"
                  value={formData.materialCost}
                  onChange={(e) => setFormData({...formData, materialCost: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="일일 원자재비"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  일 생산량 (개)
                </label>
                <input
                  type="number"
                  value={formData.dailyProduction}
                  onChange={(e) => setFormData({...formData, dailyProduction: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="하루 생산 가능 수량"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCalculate}
                className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                제조원가 계산하기
              </motion.button>
            </div>

            {/* 결과 표시 */}
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">계산식</h3>
                <div className="text-sm text-gray-600 space-y-2">
                  <div>제조원가 = (총 인건비 + 설비가동비 + 원자재비) ÷ 일 생산량</div>
                  <div className="pt-2 border-t border-gray-200">
                    <div>총 인건비: {parseInt(formData.totalLaborCost || '0').toLocaleString()}원</div>
                    <div>설비가동비: {parseInt(formData.equipmentCost || '0').toLocaleString()}원</div>
                    <div>원자재비: {parseInt(formData.materialCost || '0').toLocaleString()}원</div>
                    <div>일 생산량: {parseInt(formData.dailyProduction || '0').toLocaleString()}개</div>
                  </div>
                </div>
              </div>

              {result !== null && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-blue-50 rounded-lg p-6 border border-blue-200"
                >
                  <div className="flex items-center mb-3">
                    <CurrencyDollarIcon className="w-6 h-6 text-blue-600 mr-2" />
                    <h3 className="text-lg font-semibold text-blue-900">계산 결과</h3>
                  </div>
                  <div className="text-3xl font-bold text-blue-900 mb-2">
                    {result.toLocaleString()}원
                  </div>
                  <div className="text-sm text-blue-700">
                    개당 제조원가
                  </div>
                </motion.div>
              )}

              {/* 비용 구성 차트 (시각적 표현) */}
              {result !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-50 rounded-lg p-6"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">비용 구성</h3>
                  <div className="space-y-3">
                    {[
                      { label: '인건비', value: parseFloat(formData.totalLaborCost || '0'), color: 'bg-blue-500' },
                      { label: '설비비', value: parseFloat(formData.equipmentCost || '0'), color: 'bg-green-500' },
                      { label: '원자재비', value: parseFloat(formData.materialCost || '0'), color: 'bg-purple-500' }
                    ].map((item, index) => {
                      const total = parseFloat(formData.totalLaborCost || '0') + 
                                   parseFloat(formData.equipmentCost || '0') + 
                                   parseFloat(formData.materialCost || '0')
                      const percentage = total > 0 ? (item.value / total) * 100 : 0
                      
                      return (
                        <div key={index} className="flex items-center space-x-3">
                          <div className="w-20 text-sm text-gray-600">{item.label}</div>
                          <div className="flex-1 bg-gray-200 rounded-full h-3">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                              className={`h-3 rounded-full ${item.color}`}
                            />
                          </div>
                          <div className="w-16 text-sm text-gray-600 text-right">
                            {percentage.toFixed(1)}%
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  )
} 