/**
 * useProducts Hook - 產品數據管理自定義Hook
 *
 * 🎯 這個Hook的工作：
 * 封裝產品列表相關的所有數據管理邏輯
 *
 * 🚫 這個Hook不做什麼：
 * - 不處理UI渲染邏輯（只管理狀態）
 * - 不處理用戶交互事件（只提供回調函數）
 * - 不處理路由導航（由組件處理）
 *
 * ✅ 只負責：
 * - 管理產品列表數據狀態
 * - 管理篩選器和分頁狀態
 * - 處理API請求邏輯
 * - 提供數據操作方法
 *
 * 💡 比喻：就像是「數據管家」，專門負責管理和提供產品相關數據
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Product } from '@/types/database'
import type { SearchFiltersState } from '@/components/SearchFilters'

// 🔧 【Hook返回值接口】定義Hook提供的所有狀態和方法
export interface UseProductsReturn {
  // 📊 【數據狀態】
  products: Product[]
  loading: boolean
  error: string | null
  
  // 📄 【分頁狀態】
  currentPage: number
  totalPages: number
  totalProducts: number
  
  // 🎛️ 【篩選器狀態】
  filters: SearchFiltersState
  availableSeries: string[]
  priceRange: { min: number; max: number }
  
  // 🔧 【操作方法】
  handleFiltersChange: (newFilters: SearchFiltersState) => void
  handlePageChange: (page: number) => void
  refreshData: () => Promise<void>
}

export function useProducts(): UseProductsReturn {
  // 📊 【產品數據狀態】
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // 📄 【分頁狀態】
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalProducts, setTotalProducts] = useState(0)

  // 🎛️ 【篩選器狀態】
  const [filters, setFilters] = useState<SearchFiltersState>({
    search: '',
    rarity: [],
    series: [],
    sortBy: 'name',
    sortOrder: 'asc'
  })

  // 🔧 【輔助數據狀態】
  const [availableSeries, setAvailableSeries] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 })

  // 🔄 【獲取產品列表】處理產品數據獲取
  const fetchProducts = useCallback(async (page: number = 1, currentFilters = filters) => {
    try {
      setLoading(true)
      setError(null)
      
      // 🔧 【構建查詢參數】
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        sortBy: currentFilters.sortBy,
        sortOrder: currentFilters.sortOrder
      })

      // 🔍 【添加篩選參數】
      if (currentFilters.search) {
        params.append('search', currentFilters.search)
      }
      if (currentFilters.rarity.length > 0) {
        params.append('rarity', currentFilters.rarity.join(','))
      }
      if (currentFilters.series.length > 0) {
        params.append('series', currentFilters.series.join(','))
      }
      if (currentFilters.minPrice !== undefined) {
        params.append('minPrice', currentFilters.minPrice.toString())
      }
      if (currentFilters.maxPrice !== undefined) {
        params.append('maxPrice', currentFilters.maxPrice.toString())
      }
      
      // 🔄 【發起API請求】
      const response = await fetch(`/api/products?${params.toString()}`)
      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || '獲取產品列表失敗')
      }
      
      // ✅ 【更新狀態】
      setProducts(result.data.products)
      setCurrentPage(result.data.page)
      setTotalPages(result.data.totalPages)
      setTotalProducts(result.data.total)
      
    } catch (err) {
      console.error('🚨 載入產品失敗:', err)
      setError(err instanceof Error ? err.message : '載入產品失敗')
    } finally {
      setLoading(false)
    }
  }, [filters])

  // 🔄 【獲取系列列表】處理可用系列數據獲取
  const fetchSeries = useCallback(async () => {
    try {
      const response = await fetch('/api/products/series')
      const result = await response.json()
      
      if (result.success) {
        setAvailableSeries(result.data)
      }
    } catch (err) {
      console.error('🚨 獲取系列列表失敗:', err)
    }
  }, [])

  // 🔄 【獲取價格範圍】處理價格範圍數據獲取
  const fetchPriceRange = useCallback(async () => {
    try {
      const response = await fetch('/api/products/price-range')
      const result = await response.json()
      
      if (result.success) {
        setPriceRange(result.data)
      }
    } catch (err) {
      console.error('🚨 獲取價格範圍失敗:', err)
    }
  }, [])

  // 🔄 【初始化數據】首次加載時獲取所有必需數據
  const initializeData = useCallback(async () => {
    await Promise.all([
      fetchProducts(1, filters),
      fetchSeries(),
      fetchPriceRange()
    ])
  }, [fetchProducts, fetchSeries, fetchPriceRange, filters])

  // 🔄 【篩選器變更處理】當篩選器改變時重新獲取數據
  const handleFiltersChange = useCallback((newFilters: SearchFiltersState) => {
    setFilters(newFilters)
    // 篩選器改變時重置到第一頁
    fetchProducts(1, newFilters)
    setCurrentPage(1)
  }, [fetchProducts])

  // 📄 【分頁變更處理】處理頁碼變更
  const handlePageChange = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages) {
      fetchProducts(page, filters)
    }
  }, [totalPages, fetchProducts, filters])

  // 🔄 【手動刷新數據】提供刷新功能
  const refreshData = useCallback(async () => {
    await initializeData()
  }, [initializeData])

  // 🔄 【初始化Effect】組件掛載時初始化數據
  useEffect(() => {
    initializeData()
  }, [initializeData])

  // 🔄 【篩選器變更Effect】當篩選器改變時更新數據（由handleFiltersChange處理）
  // 移除了之前的篩選器effect，避免重複請求

  return {
    // 📊 【數據狀態】
    products,
    loading,
    error,
    
    // 📄 【分頁狀態】
    currentPage,
    totalPages,
    totalProducts,
    
    // 🎛️ 【篩選器狀態】
    filters,
    availableSeries,
    priceRange,
    
    // 🔧 【操作方法】
    handleFiltersChange,
    handlePageChange,
    refreshData
  }
}