/**
 * 用戶收藏服務 - 收藏管理業務邏輯處理
 *
 * 🎯 這個服務的工作：
 * 處理用戶收藏相關的所有數據操作和業務邏輯
 *
 * 🚫 這個服務不做什麼：
 * - 不處理產品數據（由產品服務處理）
 * - 不直接操作 UI 組件（只提供數據）
 * - 不處理用戶註冊登錄（由認證服務處理）
 *
 * ✅ 只負責：
 * - 收藏狀態的增刪改查
 * - 收藏統計數據計算
 * - 用戶收藏列表管理
 * - 收藏相關的業務規則
 *
 * 💡 比喻：就像是「收藏管理員」，負責記錄和管理用戶的心願清單
 */

import { ProductLoader } from '@/data/productLoader'
import { supabase } from '@/lib/supabase'
import type {
  Product,
  UserCollection,
  CollectionUpdateRequest,
  UserCollectionsResponse,
  CollectionStats,
  CollectionStatus
} from '@/types/database'

export class CollectionService {

  // 💖 【更新收藏狀態】添加、修改或刪除用戶的收藏記錄
  static async updateCollection(request: CollectionUpdateRequest): Promise<void> {
    const { productId, status } = request

    // 🔐 【用戶身份檢查】確保用戶已登錄
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('請先登錄才能管理收藏')
    }

    try {
      if (status === 'none') {
        // ❌ 【刪除收藏】移除收藏記錄
        const { error } = await supabase
          .from('user_collections')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', productId)
        
        if (error) {
          throw error
        }
      } else {
        // 💖 【添加或更新收藏】使用 upsert 操作
        const { error } = await supabase
          .from('user_collections')
          .upsert({
            user_id: user.id,
            product_id: productId,
            status: status
          })
        
        if (error) {
          throw error
        }
      }
    } catch (error) {
      console.error('❌ 更新收藏狀態失敗:', error)
      throw new Error('保存收藏狀態失敗，請稍後重試')
    }
  }

  // 📋 【獲取用戶收藏】獲取用戶的完整收藏列表和統計
  static async getUserCollections(): Promise<UserCollectionsResponse> {
    // 🔐 【用戶身份檢查】確保用戶已登錄
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('請先登錄才能查看收藏')
    }

    try {
      // 🔍 【獲取收藏數據】從 Supabase 讀取收藏記錄
      const { data: collections, error } = await supabase
        .from('user_collections')
        .select('*')
        .eq('user_id', user.id)
      
      if (error) {
        throw error
      }

      // 🔄 【數據分組】按收藏狀態分組並獲取產品詳情
      const owned: Product[] = []
      const wanted: Product[] = []
      let totalValue = 0

      // 📋 【載入產品數據】使用新的數據加載器
      const allProducts = await ProductLoader.loadAllProducts()

      collections?.forEach(collection => {
        // 🔍 【查找產品】從產品數據中找到對應產品
        const product = allProducts.find(p => p.id === collection.product_id)
        
        if (product) {
          if (collection.status === 'owned') {
            owned.push(product)
            totalValue += product.currentPrice
          } else if (collection.status === 'wanted') {
            wanted.push(product)
          }
        }
      })

      // 📊 【計算統計數據】
      const stats: CollectionStats = {
        ownedCount: owned.length,
        wantedCount: wanted.length,
        totalValue,
        completionRate: this.calculateCompletionRate(owned.length, wanted.length)
      }

      return {
        owned,
        wanted,
        stats
      }
    } catch (error) {
      console.error('❌ 獲取用戶收藏失敗:', error)
      throw new Error('獲取收藏數據失敗，請稍後重試')
    }
  }

  // 🔍 【獲取收藏狀態】檢查用戶對特定產品的收藏狀態
  static async getCollectionStatus(productId: string): Promise<CollectionStatus> {
    // 🔐 【用戶身份檢查】確保用戶已登錄
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return 'none' // 未登錄用戶默認為無收藏
    }

    try {
      // 🔍 【查詢收藏記錄】從 Supabase 讀取
      const { data: collection, error } = await supabase
        .from('user_collections')
        .select('status')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .maybeSingle()
      
      if (error) {
        console.error('❌ 獲取收藏狀態失敗:', error)
        return 'none'
      }
      
      return collection?.status || 'none'
    } catch (error) {
      console.error('❌ 獲取收藏狀態失敗:', error)
      return 'none'
    }
  }

  // 📋 【批量獲取收藏狀態】獲取多個產品的收藏狀態（優化性能）
  static async getCollectionStatuses(productIds: string[]): Promise<Record<string, CollectionStatus>> {
    // 🔐 【用戶身份檢查】確保用戶已登錄
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      // 🔄 【未登錄處理】為所有產品返回 'none' 狀態
      return productIds.reduce((acc, id) => {
        acc[id] = 'none'
        return acc
      }, {} as Record<string, CollectionStatus>)
    }

    try {
      // 🔍 【批量查詢】從 Supabase 獲取收藏狀態
      const { data: collections, error } = await supabase
        .from('user_collections')
        .select('product_id, status')
        .eq('user_id', user.id)
        .in('product_id', productIds)
      
      if (error) {
        console.error('❌ 批量獲取收藏狀態失敗:', error)
        // 發生錯誤時返回默認狀態
        return productIds.reduce((acc, id) => {
          acc[id] = 'none'
          return acc
        }, {} as Record<string, CollectionStatus>)
      }

      // 🔄 【數據轉換】構建狀態映射對象
      const statusMap: Record<string, CollectionStatus> = {}
      
      productIds.forEach(id => {
        const collection = collections?.find(c => c.product_id === id)
        statusMap[id] = collection?.status || 'none'
      })

      return statusMap
    } catch (error) {
      console.error('❌ 批量獲取收藏狀態失敗:', error)
      // 發生錯誤時返回默認狀態
      return productIds.reduce((acc, id) => {
        acc[id] = 'none'
        return acc
      }, {} as Record<string, CollectionStatus>)
    }
  }

  // 📊 【計算完成度】根據擁有和想要的數量計算收集完成度
  private static calculateCompletionRate(ownedCount: number, wantedCount: number): number {
    const totalCount = ownedCount + wantedCount
    if (totalCount === 0) return 0
    return Math.round((ownedCount / totalCount) * 100)
  }

  // 🏆 【獲取收藏排行榜】獲取收藏數最多的產品（可用於熱門推薦）
  static async getPopularProducts(limit: number = 10): Promise<Product[]> {
    try {
      // 🔄 【使用視圖獲取產品熱門度】從 Supabase 獲取統計數據
      const { data: popularityData, error } = await supabase
        .from('product_popularity')
        .select('*')
        .order('popularity_score', { ascending: false })
        .limit(limit)
      
      if (error) {
        console.error('❌ 獲取產品熱門度數據失敗:', error)
        return []
      }
      
      // 📦 【獲取產品詳情】根據ID獲取完整產品信息
      const allProducts = await ProductLoader.loadAllProducts()
      const products: Product[] = []
      for (const item of popularityData || []) {
        const product = allProducts.find(p => p.id === item.product_id)
        if (product) {
          products.push(product)
        }
      }
      
      return products
    } catch (error) {
      console.error('❌ 獲取熱門產品失敗:', error)
      return []
    }
  }
}