/**
 * ProductLoader - 產品數據加載器
 *
 * 🎯 這個模塊的工作：
 * 統一加載和管理分系列的產品JSON數據
 *
 * 🚫 這個模塊不做什麼：
 * - 不處理數據驗證（由schema處理）
 * - 不處理業務邏輯（由service處理）
 * - 不處理緩存機制（保持簡單直接）
 *
 * ✅ 只負責：
 * - 動態加載所有系列的產品數據
 * - 合併多個JSON文件為統一數據結構
 * - 提供統一的數據訪問接口
 * - 處理數據加載錯誤
 *
 * 💡 比喻：就像是「圖書館管理員」，負責整理分散在不同書架的書籍
 */

import type { Product } from '@/data/schema/product-schema'

// 🔧 【數據加載器類】
export class ProductLoader {
  private static allProducts: Product[] | null = null
  private static loadPromise: Promise<Product[]> | null = null

  // 🔄 【主要加載方法】異步加載所有產品數據
  static async loadAllProducts(): Promise<Product[]> {
    // 🚦 【防重複加載】如果已加載，直接返回緩存數據
    if (this.allProducts !== null) {
      return this.allProducts
    }

    // 🚦 【防並發加載】如果正在加載，等待現有加載完成
    if (this.loadPromise !== null) {
      return this.loadPromise
    }

    // 🔄 【開始加載流程】
    this.loadPromise = this.performLoad()
    
    try {
      this.allProducts = await this.loadPromise
      return this.allProducts
    } finally {
      this.loadPromise = null
    }
  }

  // 🔧 【核心加載邏輯】執行實際的數據加載
  private static async performLoad(): Promise<Product[]> {
    try {
      // 📋 【加載索引文件】獲取所有系列的元數據
      const indexModule = await import('@/data/products/_index.json')
      const index = indexModule.default

      // 🔄 【並行加載所有系列】同時載入所有系列數據提高效能
      const seriesPromises = index.series.map(async (seriesInfo: any) => {
        try {
          // 🔍 【動態導入】根據文件名動態加載JSON
          const seriesModule = await import(`@/data/products/${seriesInfo.fileName}`)
          return seriesModule.default as Product[]
        } catch (error) {
          console.warn(`⚠️ 無法加載系列 ${seriesInfo.key}:`, error)
          return [] as Product[]
        }
      })

      // ⏱️ 【等待所有加載完成】
      const seriesResults = await Promise.all(seriesPromises)

      // 📦 【合併數據】將所有系列的產品合併為單一陣列
      const allProducts = seriesResults.flat()

      console.log(`✅ 成功加載 ${allProducts.length} 個產品，來自 ${index.totalSeries} 個系列`)
      
      return allProducts

    } catch (error) {
      console.error('❌ 產品數據加載失敗:', error)
      throw new Error('無法加載產品數據')
    }
  }

  // 🧹 【重置緩存】強制重新加載數據（開發時用）
  static resetCache(): void {
    this.allProducts = null
    this.loadPromise = null
  }

  // 📊 【獲取系列統計】獲取各系列的產品數量統計
  static async getSeriesStats(): Promise<Record<string, number>> {
    const products = await this.loadAllProducts()
    const stats: Record<string, number> = {}

    products.forEach(product => {
      stats[product.series] = (stats[product.series] || 0) + 1
    })

    return stats
  }

  // 📚 【獲取所有系列名稱】返回去重後的系列列表
  static async getAllSeries(): Promise<string[]> {
    const products = await this.loadAllProducts()
    const uniqueSeries = Array.from(new Set(products.map(p => p.series)))
    return uniqueSeries.sort()
  }
}

// 🔄 【便捷導出】提供簡單的函數接口
export const loadAllProducts = () => ProductLoader.loadAllProducts()
export const resetProductCache = () => ProductLoader.resetCache()
export const getSeriesStats = () => ProductLoader.getSeriesStats()
export const getAllSeries = () => ProductLoader.getAllSeries()