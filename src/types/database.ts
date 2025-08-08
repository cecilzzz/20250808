/**
 * 數據庫類型定義 - TypeScript 接口和類型
 *
 * 🎯 這個文件的工作：
 * 定義所有數據庫表的 TypeScript 類型和接口
 *
 * 🚫 這個文件不做什麼：
 * - 不包含業務邏輯（純類型定義）
 * - 不處理數據驗證（由其他模塊處理）
 *
 * ✅ 只負責：
 * - 產品相關的數據類型
 * - 用戶相關的數據類型
 * - 收藏系統的數據類型
 * - API 請求響應類型
 *
 * 💡 比喻：就像是建築的「設計圖紙」，定義所有數據的結構和規格
 */

// 🎨 【產品稀有度類型】定義產品等級分類
export type RarityLevel = 'normal' | 'rare' | 'super_rare' | 'hidden' | 'sp'

// 🎨 【發售狀態類型】定義產品銷售狀態
export type ReleaseStatus = 'active' | 'discontinued' | 'preorder' | 'limited'

// 🎨 【收藏狀態類型】用戶對產品的收藏狀態
export type CollectionStatus = 'owned' | 'wanted' | 'none'

// 📦 【產品接口】完整的產品數據結構
export interface Product {
  id: string
  name: string
  nameEn?: string | null
  series: string
  rarityLevel: RarityLevel
  currentPrice: number
  originalPrice: number
  mainColor: string
  imageUrl: string
  releaseStatus: ReleaseStatus
  releaseDate: string
  appearanceRate?: string | null
  createdAt: string
  updatedAt: string
}

// 👤 【用戶接口】用戶基本信息結構
export interface User {
  id: string
  email: string
  username?: string | null
  createdAt: string
}

// 💖 【用戶收藏接口】收藏記錄數據結構
export interface UserCollection {
  id: string
  user_id: string  // 使用snake_case匹配數據庫字段
  product_id: string  // 使用snake_case匹配數據庫字段
  status: 'owned' | 'wanted'
  created_at: string  // 使用snake_case匹配數據庫字段
  updated_at: string  // 添加updated_at字段
}

// 🔍 【產品列表請求】搜索和篩選參數
export interface ProductListRequest {
  page?: number
  limit?: number
  search?: string
  rarity?: RarityLevel[]
  series?: string[]
  minPrice?: number
  maxPrice?: number
  sortBy?: 'name' | 'price' | 'rarity' | 'release_date'
  sortOrder?: 'asc' | 'desc'
}

// 📋 【產品列表響應】分頁結果數據
export interface ProductListResponse {
  products: Product[]
  total: number
  page: number
  totalPages: number
}

// 📄 【產品詳情響應】產品詳細信息和相關推薦
export interface ProductDetailResponse {
  product: Product
  relatedProducts: Product[]
}

// 💖 【收藏更新請求】用戶收藏操作參數
export interface CollectionUpdateRequest {
  productId: string
  status: CollectionStatus
}

// 📊 【用戶收藏統計】收藏數據統計信息
export interface CollectionStats {
  ownedCount: number
  wantedCount: number
  totalValue: number
  completionRate: number
}

// 👤 【用戶收藏響應】用戶的完整收藏數據
export interface UserCollectionsResponse {
  owned: Product[]
  wanted: Product[]
  stats: CollectionStats
}

// 🗄️【數據庫 Schema】Supabase 數據庫表結構定義
// 注意：混合架構中，產品數據在JSON文件中，只有用戶收藏數據在Supabase
export interface Database {
  public: {
    Tables: {
      user_collections: {
        Row: UserCollection
        Insert: Omit<UserCollection, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<UserCollection, 'id' | 'created_at' | 'updated_at'>>
      }
    }
    Views: {
      user_collection_stats: {
        Row: {
          user_id: string
          owned_count: number
          wanted_count: number
          total_collections: number
        }
      }
      product_popularity: {
        Row: {
          product_id: string
          owned_count: number
          wanted_count: number
          total_collections: number
          popularity_score: number
        }
      }
    }
  }
}