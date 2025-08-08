/**
 * 產品數據服務 - 產品相關業務邏輯處理
 *
 * 🎯 這個服務的工作：
 * 處理所有與產品相關的數據操作和業務邏輯
 *
 * 🚫 這個服務不做什麼：
 * - 不處理用戶認證（由認證服務處理）
 * - 不直接操作 UI 組件（只提供數據）
 * - 不處理路由邏輯（由頁面組件處理）
 *
 * ✅ 只負責：
 * - 產品列表獲取和分頁
 * - 產品搜索和篩選
 * - 產品詳情獲取
 * - 相關產品推薦
 *
 * 💡 比喻：就像是「產品資料管理員」，負責整理、查找和提供產品信息
 */

import productsData from '@/data/products.json'
import type {
  Product,
  ProductListRequest,
  ProductListResponse,
  ProductDetailResponse,
  RarityLevel,
  ReleaseStatus
} from '@/types/database'

export class ProductService {
  
  // 🔍 【獲取產品列表】支持搜索、篩選和分頁
  static async getProducts(params: ProductListRequest = {}): Promise<ProductListResponse> {
    const {
      page = 1,
      limit = 20,
      search = '',
      rarity = [],
      series = [],
      minPrice,
      maxPrice,
      sortBy = 'name',
      sortOrder = 'asc'
    } = params

    // 🔄 【模擬API延遲】提供真實的API體驗
    await new Promise(resolve => setTimeout(resolve, 100))

    // 📋 【獲取所有產品】從JSON數據開始
    let filteredProducts = [...productsData] as Product[]

    // 🔍 【文本搜索】按產品名稱搜索（支持中英文）
    if (search.trim()) {
      const searchLower = search.toLowerCase()
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(searchLower) ||
        (product.nameEn && product.nameEn.toLowerCase().includes(searchLower))
      )
    }

    // 🎨 【稀有度篩選】按稀有度等級過濾
    if (rarity.length > 0) {
      filteredProducts = filteredProducts.filter(product =>
        rarity.includes(product.rarityLevel)
      )
    }

    // 📚 【系列篩選】按產品系列過濾
    if (series.length > 0) {
      filteredProducts = filteredProducts.filter(product =>
        series.includes(product.series)
      )
    }

    // 💰 【價格區間篩選】按價格範圍過濾
    if (minPrice !== undefined) {
      filteredProducts = filteredProducts.filter(product =>
        product.currentPrice >= minPrice
      )
    }
    if (maxPrice !== undefined) {
      filteredProducts = filteredProducts.filter(product =>
        product.currentPrice <= maxPrice
      )
    }

    // 📊 【排序處理】按指定字段和順序排序
    filteredProducts.sort((a, b) => {
      let aValue: string | number, bValue: string | number

      switch (sortBy) {
        case 'price':
          aValue = a.currentPrice
          bValue = b.currentPrice
          break
        case 'rarity':
          // 稀有度排序：normal < rare < super_rare < hidden < sp
          const rarityOrder = { normal: 1, rare: 2, super_rare: 3, hidden: 4, sp: 5 }
          aValue = rarityOrder[a.rarityLevel] || 0
          bValue = rarityOrder[b.rarityLevel] || 0
          break
        case 'release_date':
          aValue = new Date(a.releaseDate).getTime()
          bValue = new Date(b.releaseDate).getTime()
          break
        default: // name
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
          break
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1
      return 0
    })

    // 📊 【分頁計算】
    const total = filteredProducts.length
    const totalPages = Math.ceil(total / limit)
    const offset = (page - 1) * limit
    const paginatedProducts = filteredProducts.slice(offset, offset + limit)

    return {
      products: paginatedProducts,
      total,
      page,
      totalPages
    }
  }

  // 📄 【獲取產品詳情】獲取單個產品的完整信息
  static async getProductById(id: string): Promise<ProductDetailResponse> {
    // 🔄 【模擬API延遲】提供真實的API體驗
    await new Promise(resolve => setTimeout(resolve, 50))

    // 🔍 【查找產品】根據 ID 查找產品
    const product = productsData.find(p => p.id === id) as Product | undefined

    if (!product) {
      throw new Error('找不到指定的產品')
    }

    // 🔄 【獲取相關產品】同系列的其他產品（排除當前產品）
    const relatedProducts = productsData
      .filter(p => p.series === product.series && p.id !== id)
      .slice(0, 4) as Product[]

    return {
      product,
      relatedProducts
    }
  }

  // 📚 【獲取所有系列】獲取系統中所有產品系列列表
  static async getSeries(): Promise<string[]> {
    // 🔄 【模擬API延遲】
    await new Promise(resolve => setTimeout(resolve, 20))

    // 🔄 【去重處理】移除重複的系列名稱
    const uniqueSeries = Array.from(new Set(productsData.map(product => product.series)))
    return uniqueSeries.sort()
  }

  // 💰 【獲取價格範圍】獲取產品的最低和最高價格
  static async getPriceRange(): Promise<{ min: number; max: number }> {
    // 🔄 【模擬API延遲】
    await new Promise(resolve => setTimeout(resolve, 20))

    const prices = productsData.map(product => product.currentPrice)
    
    if (prices.length === 0) {
      return { min: 0, max: 1000 }
    }

    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    }
  }

  // 📊 【獲取統計信息】獲取產品的統計數據
  static async getStats() {
    // 🔄 【模擬API延遲】
    await new Promise(resolve => setTimeout(resolve, 30))

    // 🔄 【統計處理】按稀有度和狀態分組統計
    const stats = {
      total: productsData.length,
      byRarity: {} as Record<RarityLevel, number>,
      byStatus: {} as Record<ReleaseStatus, number>
    }

    productsData.forEach(product => {
      // 按稀有度統計
      stats.byRarity[product.rarityLevel as RarityLevel] = (stats.byRarity[product.rarityLevel as RarityLevel] || 0) + 1
      // 按狀態統計
      stats.byStatus[product.releaseStatus as ReleaseStatus] = (stats.byStatus[product.releaseStatus as ReleaseStatus] || 0) + 1
    })

    return stats
  }
}