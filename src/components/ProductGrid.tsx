/**
 * ProductGrid 組件 - 產品網格展示容器
 *
 * 🎯 這個組件的工作：
 * 以響應式網格形式展示產品列表
 *
 * 🚫 這個組件不做什麼：
 * - 不處理產品數據獲取（由父組件提供）
 * - 不處理分頁邏輯（由父組件控制）
 * - 不處理搜索篩選（專門的篩選組件處理）
 *
 * ✅ 只負責：
 * - 響應式網格布局
 * - 產品卡片的統一展示
 * - 載入狀態的顯示
 * - 空狀態的處理
 *
 * 💡 比喻：就像是「商品展示架」，整齊排列所有商品卡片
 */

import ProductCard from './ProductCard'
import type { Product } from '@/types/database'

interface ProductGridProps {
  products: Product[]
  loading?: boolean
  error?: string | null
}

export default function ProductGrid({ products, loading = false, error = null }: ProductGridProps) {
  // ⚠️ 【錯誤狀態】顯示錯誤信息
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-center">
          <div className="text-6xl mb-4">😔</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">載入失敗</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            重新載入
          </button>
        </div>
      </div>
    )
  }

  // ⏳ 【載入狀態】顯示骨架屏
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* 🔄 【骨架屏卡片】模擬實際卡片的布局 */}
        {Array.from({ length: 12 }).map((_, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
            {/* 圖片區域骨架 */}
            <div className="aspect-square bg-gray-200 animate-pulse" />
            
            {/* 內容區域骨架 */}
            <div className="p-4 space-y-3">
              {/* 系列名稱骨架 */}
              <div className="h-4 bg-gray-200 rounded animate-pulse w-20" />
              
              {/* 產品名稱骨架 */}
              <div className="space-y-2">
                <div className="h-6 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
              </div>
              
              {/* 價格骨架 */}
              <div className="flex justify-between items-center">
                <div className="h-8 bg-gray-200 rounded animate-pulse w-24" />
                <div className="h-4 w-4 bg-gray-200 rounded-full animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  // 📭 【空狀態】沒有產品時的顯示
  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">沒有找到產品</h3>
          <p className="text-gray-500 mb-4">
            嘗試調整篩選條件或搜索關鍵字
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            查看所有產品
          </button>
        </div>
      </div>
    )
  }

  // ✅ 【正常狀態】顯示產品網格
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}