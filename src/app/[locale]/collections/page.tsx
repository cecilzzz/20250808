/**
 * 個人收藏頁面 - 用戶收藏管理和統計展示
 *
 * 🎯 這個頁面的工作：
 * 展示用戶的收藏產品和相關統計信息
 *
 * 🚫 這個頁面不做什麼：
 * - 不處理產品的詳細信息編輯（由產品詳情頁處理）
 * - 不處理用戶認證邏輯（由 AuthContext 處理）
 * - 不顯示其他用戶的收藏（隱私保護）
 *
 * ✅ 只負責：
 * - 載入並展示用戶收藏列表
 * - 顯示收藏統計和完成度
 * - 提供收藏分類標籤切換
 * - 處理未登錄用戶的引導
 *
 * 💡 比喻：就像是「個人收藏展示室」，展示用戶的所有珍藏品和統計資料
 */

'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import Header from '@/components/Header'
import ProductGrid from '@/components/ProductGrid'
import AuthModal from '@/components/AuthModal'
import type { UserCollectionsResponse } from '@/types/database'

export default function CollectionsPage() {
  // 🔄 【狀態管理】收藏頁面相關狀態
  const [collectionsData, setCollectionsData] = useState<UserCollectionsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'owned' | 'wanted'>('owned')
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  // 🔧 【認證 Hook】
  const { user } = useAuth()

  // 🔍 【獲取收藏數據】從 API 載入用戶收藏信息
  const fetchCollections = async () => {
    if (!user) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      // 🔄 【API 調用】請求用戶收藏數據
      const response = await fetch('/api/users/collections')
      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || '獲取收藏列表失敗')
      }
      
      // ✅ 【數據設置】更新收藏狀態
      setCollectionsData(result.data)
      
    } catch (err) {
      // ❌ 【錯誤處理】設置錯誤狀態
      console.error('載入收藏列表失敗:', err)
      setError(err instanceof Error ? err.message : '載入收藏列表失敗')
    } finally {
      setLoading(false)
    }
  }

  // 🔄 【初始載入和用戶變化監聽】
  useEffect(() => {
    if (user) {
      fetchCollections()
    } else {
      setLoading(false)
      setCollectionsData(null)
    }
  }, [user])

  // 💰 【價格格式化】格式化價格顯示
  const formatPrice = (price: number) => {
    return `NT$ ${price.toLocaleString()}`
  }

  // 📊 【完成度計算】計算收藏完成度
  const getCompletionColor = (rate: number) => {
    if (rate >= 80) return 'text-green-600 bg-green-100'
    if (rate >= 50) return 'text-yellow-600 bg-yellow-100'
    return 'text-blue-600 bg-blue-100'
  }

  // 🚫 【未登錄狀態】引導用戶登錄
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <div className="text-6xl mb-6">💖</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              歡迎來到收藏頁面
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              登錄後您可以收藏喜愛的 Labubu 產品，管理收藏清單，追蹤收藏進度和統計信息。
            </p>
            <div className="space-y-4">
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                立即登錄
              </button>
              <div className="text-sm text-gray-500">
                還沒有帳號？
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="text-blue-600 hover:text-blue-800 ml-1"
                >
                  立即註冊
                </button>
              </div>
            </div>
          </div>
        </main>
        
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          defaultMode="signin"
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 🎨 【頁面頭部】導航欄 */}
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 🎯 【頁面標題】*/}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            我的收藏
          </h1>
          <p className="text-gray-600">
            管理和查看你收藏的 Labubu 產品
          </p>
        </div>

        {/* 📊 【統計卡片】*/}
        {collectionsData && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">已擁有</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {collectionsData.stats.ownedCount}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.682l-1.318-1.364a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">想要</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {collectionsData.stats.wantedCount}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">總價值</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatPrice(collectionsData.stats.totalValue)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className={`p-2 rounded-lg ${getCompletionColor(collectionsData.stats.completionRate)}`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">完成度</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {collectionsData.stats.completionRate}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 🏷️ 【標籤切換】*/}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('owned')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'owned'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                已擁有 ({collectionsData?.stats.ownedCount || 0})
              </button>
              <button
                onClick={() => setActiveTab('wanted')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'wanted'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                願望清單 ({collectionsData?.stats.wantedCount || 0})
              </button>
            </nav>
          </div>
        </div>

        {/* 🎨 【產品網格】*/}
        <ProductGrid 
          products={collectionsData ? collectionsData[activeTab] : []}
          loading={loading}
          error={error}
        />

        {/* 🔄 【刷新按鈕】*/}
        {collectionsData && (
          <div className="mt-8 text-center">
            <button
              onClick={fetchCollections}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {loading ? '刷新中...' : '刷新收藏'}
            </button>
          </div>
        )}
      </main>
    </div>
  )
}