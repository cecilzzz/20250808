/**
 * 搜索篩選組件 - 產品搜索和篩選界面
 *
 * 🎯 這個組件的工作：
 * 提供實時搜索和多維度篩選功能
 *
 * 🚫 這個組件不做什麼：
 * - 不處理產品數據獲取（由父組件處理）
 * - 不處理產品顯示邏輯（只負責篩選界面）
 * - 不處理路由跳轉（只觸發回調事件）
 *
 * ✅ 只負責：
 * - 渲染搜索輸入框
 * - 渲染篩選選項（稀有度、系列、價格區間）
 * - 渲染排序選項
 * - 觸發篩選變更回調
 *
 * 💡 比喻：就像是「商店的篩選器」，幫顧客找到想要的商品
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import { ChevronDownIcon, MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline'
import type { RarityLevel } from '@/types/database'

// 🔧 【篩選參數類型】定義所有篩選選項的類型
export interface SearchFiltersState {
  search: string
  rarity: RarityLevel[]
  series: string[]
  minPrice?: number
  maxPrice?: number
  sortBy: 'name' | 'price' | 'rarity' | 'release_date'
  sortOrder: 'asc' | 'desc'
}

// 🔧 【組件props類型】
interface SearchFiltersProps {
  filters: SearchFiltersState
  onFiltersChange: (filters: SearchFiltersState) => void
  availableSeries: string[]
  priceRange: { min: number; max: number }
}

// 🎨 【稀有度選項】稀有度配置
const RARITY_OPTIONS = [
  { value: 'normal' as const, label: '普通', color: 'text-gray-600' },
  { value: 'rare' as const, label: '稀有', color: 'text-blue-600' },
  { value: 'super_rare' as const, label: '超稀有', color: 'text-purple-600' },
  { value: 'hidden' as const, label: '隱藏', color: 'text-orange-600' },
  { value: 'sp' as const, label: 'SP限定', color: 'text-red-600' }
]

// 📊 【排序選項】排序方式配置
const SORT_OPTIONS = [
  { value: 'name', label: '按名稱' },
  { value: 'price', label: '按價格' },
  { value: 'rarity', label: '按稀有度' },
  { value: 'release_date', label: '按發售日期' }
]

export default function SearchFilters({
  filters,
  onFiltersChange,
  availableSeries,
  priceRange
}: SearchFiltersProps) {
  
  // 🔄 【本地狀態】UI狀態管理
  const [isExpanded, setIsExpanded] = useState(false)
  const [searchInput, setSearchInput] = useState(filters.search)

  // 🔍 【防抖搜索】避免頻繁觸發搜索請求
  const [searchTimer, setSearchTimer] = useState<NodeJS.Timeout | null>(null)

  // 🔄 【搜索處理】處理搜索輸入變化（帶防抖）
  const handleSearchChange = (value: string) => {
    setSearchInput(value)
    
    // 清除之前的定時器
    if (searchTimer) {
      clearTimeout(searchTimer)
    }
    
    // 設置新的定時器
    const timer = setTimeout(() => {
      onFiltersChange({ ...filters, search: value })
    }, 300)
    
    setSearchTimer(timer)
  }

  // 🧹 【清理定時器】組件卸載時清理
  useEffect(() => {
    return () => {
      if (searchTimer) {
        clearTimeout(searchTimer)
      }
    }
  }, [searchTimer])

  // 🎨 【稀有度切換】處理稀有度多選
  const toggleRarity = (rarity: RarityLevel) => {
    const newRarity = filters.rarity.includes(rarity)
      ? filters.rarity.filter(r => r !== rarity)
      : [...filters.rarity, rarity]
    
    onFiltersChange({ ...filters, rarity: newRarity })
  }

  // 📚 【系列切換】處理系列多選
  const toggleSeries = (series: string) => {
    const newSeries = filters.series.includes(series)
      ? filters.series.filter(s => s !== series)
      : [...filters.series, series]
    
    onFiltersChange({ ...filters, series: newSeries })
  }

  // 💰 【價格處理】處理價格區間變化
  const handlePriceChange = (type: 'min' | 'max', value: string) => {
    const numValue = value === '' ? undefined : parseFloat(value)
    
    if (type === 'min') {
      onFiltersChange({ ...filters, minPrice: numValue })
    } else {
      onFiltersChange({ ...filters, maxPrice: numValue })
    }
  }

  // 📊 【排序處理】處理排序變化
  const handleSortChange = (sortBy: string) => {
    onFiltersChange({ 
      ...filters, 
      sortBy: sortBy as SearchFiltersState['sortBy']
    })
  }

  // 🔄 【排序順序切換】
  const toggleSortOrder = () => {
    onFiltersChange({ 
      ...filters, 
      sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc'
    })
  }

  // 🧹 【清除篩選】重置所有篩選條件
  const clearFilters = () => {
    setSearchInput('')
    onFiltersChange({
      search: '',
      rarity: [],
      series: [],
      minPrice: undefined,
      maxPrice: undefined,
      sortBy: 'name',
      sortOrder: 'asc'
    })
  }

  // 📊 【計算活躍篩選數量】
  const activeFiltersCount = filters.rarity.length + filters.series.length + 
    (filters.minPrice ? 1 : 0) + (filters.maxPrice ? 1 : 0) + 
    (filters.search ? 1 : 0)

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
      {/* 🔍 【搜索欄】主搜索輸入框 */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex gap-4">
          {/* 文本搜索 */}
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索產品名稱..."
              value={searchInput}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* 排序選擇 */}
          <div className="flex gap-2">
            <select
              value={filters.sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {SORT_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <button
              onClick={toggleSortOrder}
              className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              title={filters.sortOrder === 'asc' ? '升序' : '降序'}
            >
              {filters.sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>

          {/* 篩選展開按鈕 */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <FunnelIcon className="h-5 w-5" />
            篩選
            {activeFiltersCount > 0 && (
              <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-0.5 ml-1">
                {activeFiltersCount}
              </span>
            )}
            <ChevronDownIcon 
              className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
            />
          </button>
        </div>
      </div>

      {/* 🎨 【高級篩選】展開的篩選選項 */}
      {isExpanded && (
        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* 稀有度篩選 */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">稀有度</h4>
              <div className="space-y-2">
                {RARITY_OPTIONS.map(option => (
                  <label key={option.value} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.rarity.includes(option.value)}
                      onChange={() => toggleRarity(option.value)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className={`ml-2 text-sm ${option.color}`}>
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* 系列篩選 */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">系列</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {availableSeries.map(series => (
                  <label key={series} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.series.includes(series)}
                      onChange={() => toggleSeries(series)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 truncate">
                      {series}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* 價格區間 */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">價格區間</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">最低價</label>
                  <input
                    type="number"
                    placeholder={priceRange.min.toString()}
                    value={filters.minPrice?.toString() || ''}
                    onChange={(e) => handlePriceChange('min', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">最高價</label>
                  <input
                    type="number"
                    placeholder={priceRange.max.toString()}
                    value={filters.maxPrice?.toString() || ''}
                    onChange={(e) => handlePriceChange('max', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 篩選操作按鈕 */}
          <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
            >
              清除篩選
            </button>
          </div>
        </div>
      )}
    </div>
  )
}