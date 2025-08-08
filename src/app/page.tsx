/**
 * 首頁組件 - Labubu 收藏系統主頁面
 *
 * 🎯 這個頁面的工作：
 * 組織和布局產品瀏覽相關的所有UI組件
 *
 * 🚫 這個頁面不做什麼：
 * - 不處理數據獲取和管理（由 useProducts Hook 處理）
 * - 不處理業務邏輯（由 Hook 和 Service 處理）
 * - 不處理複雜狀態（委託給專門的 Hook）
 *
 * ✅ 只負責：
 * - 組件佈局和結構
 * - UI組件的組合和協調
 * - 將Hook數據傳遞給子組件
 * - 提供頁面級別的視覺結構
 *
 * 💡 比喻：就像是「展廳設計師」，只負責安排展品的佈局和展示方式
 */

'use client'

import Header from '@/components/Header'
import ProductGrid from '@/components/ProductGrid'
import SearchFilters from '@/components/SearchFilters'
import { useProducts } from '@/hooks/useProducts'

export default function HomePage() {
  // 🔧 【使用產品數據Hook】獲取所有產品相關數據和操作方法
  const {
    // 📊 數據狀態
    products,
    loading,
    error,
    
    // 📄 分頁狀態
    currentPage,
    totalPages,
    totalProducts,
    
    // 🎛️ 篩選器狀態
    filters,
    availableSeries,
    priceRange,
    
    // 🔧 操作方法
    handleFiltersChange,
    handlePageChange
  } = useProducts()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 🎯 【頁面頭部】導航和用戶功能 */}
      <Header />
      
      {/* 📄 【主要內容區域】產品瀏覽和篩選功能 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* 🏷️ 【頁面標題區域】 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Labubu 收藏品
          </h1>
          <p className="text-gray-600">
            發現並收藏你喜愛的 Labubu 產品
            {!loading && totalProducts > 0 && (
              <span className="ml-2 text-sm text-gray-500">
                共 {totalProducts} 個產品
              </span>
            )}
          </p>
        </div>

        {/* 🎛️ 【篩選器區域】搜索和篩選控制 */}
        <SearchFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          availableSeries={availableSeries}
          priceRange={priceRange}
        />

        {/* 📋 【產品列表區域】產品網格展示 */}
        <ProductGrid 
          products={products}
          loading={loading}
          error={error}
        />

        {/* 📄 【分頁導航區域】頁碼控制 */}
        {!loading && !error && totalPages > 1 && (
          <div className="mt-12 flex justify-center">
            <nav className="inline-flex rounded-md shadow-sm" aria-label="分頁導航">
              
              {/* ⬅️ 【上一頁按鈕】 */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                上一頁
              </button>
              
              {/* 🔢 【頁碼按鈕組】顯示最多5個頁碼 */}
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const page = i + 1
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      page === currentPage
                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                )
              })}
              
              {/* ➡️ 【下一頁按鈕】 */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                下一頁
              </button>
              
            </nav>
          </div>
        )}
        
      </main>
    </div>
  )
}