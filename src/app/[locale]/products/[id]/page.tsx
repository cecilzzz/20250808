/**
 * 產品詳情頁面 - 單個產品的完整信息展示
 *
 * 🎯 這個頁面的工作：
 * 展示單個產品的詳細信息和相關產品推薦
 *
 * 🚫 這個頁面不做什麼：
 * - 不處理產品列表（由首頁處理）
 * - 不處理用戶認證（由專門的認證頁面處理）
 * - 不處理收藏功能的復雜邏輯（由收藏組件處理）
 *
 * ✅ 只負責：
 * - 根據 ID 載入產品詳情
 * - 展示產品的完整信息
 * - 顯示相關產品推薦
 * - 提供收藏功能入口
 * - SEO 友好的頁面結構
 *
 * 💡 比喻：就像是「產品專門展示間」，詳細介紹單個商品的所有特色
 */

'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/Header'
import ProductCard from '@/components/ProductCard'
import CollectionButton from '@/components/CollectionButton'
import { useAuth } from '@/contexts/AuthContext'
import { useTranslation } from '@/hooks/useTranslation'
import type { Product, ProductDetailResponse } from '@/types/database'

export default function ProductDetailPage() {
  const params = useParams()
  const productId = params.id as string

  // 🔄 【狀態管理】產品詳情相關狀態
  const [productData, setProductData] = useState<ProductDetailResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAuthPrompt, setShowAuthPrompt] = useState(false)

  // 🔧 【認證 Hook】
  const { user } = useAuth()
  
  // 🌍 【翻譯 Hook】
  const { t } = useTranslation()

  // 🔍 【獲取產品詳情】從 API 載入產品詳細信息
  const fetchProductDetail = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // 🔄 【API 調用】請求產品詳情數據
      const response = await fetch(`/api/products/${productId}`)
      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || '獲取產品詳情失敗')
      }
      
      // ✅ 【數據設置】更新產品詳情狀態
      setProductData(result.data)
      
    } catch (err) {
      // ❌ 【錯誤處理】設置錯誤狀態
      console.error('載入產品詳情失敗:', err)
      setError(err instanceof Error ? err.message : '載入產品詳情失敗')
    } finally {
      setLoading(false)
    }
  }

  // 🔄 【初始載入】頁面載入時獲取產品詳情
  useEffect(() => {
    if (productId) {
      fetchProductDetail()
    }
  }, [productId])

  // 🎨 【稀有度樣式】獲取稀有度對應的樣式
  const getRarityStyle = (rarity: string) => {
    const styles = {
      normal: 'bg-gray-100 text-gray-800 border-gray-300',
      rare: 'bg-blue-100 text-blue-800 border-blue-300',
      super_rare: 'bg-purple-100 text-purple-800 border-purple-300',
      hidden: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      sp: 'bg-gradient-to-r from-pink-100 to-purple-100 text-purple-800 border-purple-300'
    }
    return styles[rarity as keyof typeof styles] || styles.normal
  }

  // 📝 【稀有度標籤】獲取稀有度中文名稱
  const getRarityLabel = (rarity: string) => {
    const labels = {
      normal: '普通',
      rare: '稀有',
      super_rare: '超稀有',
      hidden: '隱藏',
      sp: 'SP'
    }
    return labels[rarity as keyof typeof labels] || '未知'
  }

  // 💰 【價格格式化】格式化價格顯示
  const formatPrice = (price: number) => {
    return `NT$ ${price.toLocaleString()}`
  }

  // ⏳ 【載入狀態】
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="aspect-square bg-gray-300 rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-300 rounded w-3/4"></div>
                <div className="h-6 bg-gray-300 rounded w-1/2"></div>
                <div className="h-12 bg-gray-300 rounded w-1/3"></div>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // ❌ 【錯誤狀態】
  if (error || !productData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">😔</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">產品載入失敗</h2>
            <p className="text-gray-600 mb-6">{error || '找不到指定的產品'}</p>
            <Link 
              href="/"
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              返回首頁
            </Link>
          </div>
        </main>
      </div>
    )
  }

  const { product, relatedProducts } = productData

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 🎨 【頁面頭部】導航欄 */}
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 🔙 【返回按鈕】*/}
        <div className="mb-6">
          <Link 
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            返回產品列表
          </Link>
        </div>

        {/* 📋 【產品詳情主區域】*/}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            
            {/* 📸 【產品圖片】*/}
            <div className="relative">
              <div className="aspect-square relative bg-gray-100 rounded-lg overflow-hidden">
                {product.imageUrl && product.imageUrl.trim() !== '' ? (
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-8xl mb-4">🐰</div>
                      <p className="text-lg text-gray-500">{t('product.noProductImage')}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 📝 【產品信息】*/}
            <div className="space-y-6">
              {/* 系列信息 */}
              <div>
                <span className="text-sm text-blue-600 font-medium">{product.series}</span>
              </div>

              {/* 產品名稱 */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h1>
                {product.nameEn && (
                  <p className="text-lg text-gray-600">{product.nameEn}</p>
                )}
              </div>

              {/* 稀有度標籤 */}
              <div>
                <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${getRarityStyle(product.rarityLevel)}`}>
                  {getRarityLabel(product.rarityLevel)}
                </span>
              </div>

              {/* 價格信息 */}
              <div className="space-y-2">
                <div className="text-3xl font-bold text-gray-900">
                  {formatPrice(product.currentPrice)}
                </div>
                {product.originalPrice !== product.currentPrice && (
                  <div className="text-lg text-gray-500 line-through">
                    原價: {formatPrice(product.originalPrice)}
                  </div>
                )}
              </div>

              {/* 產品詳細信息 */}
              <div className="space-y-4 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-900">發售狀態:</span>
                    <div className="mt-1">
                      <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                        product.releaseStatus === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.releaseStatus === 'active' && '正常販售'}
                        {product.releaseStatus === 'discontinued' && '停產'}
                        {product.releaseStatus === 'preorder' && '預購'}
                        {product.releaseStatus === 'limited' && '限量'}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <span className="font-medium text-gray-900">主色調:</span>
                    <div className="mt-1 flex items-center">
                      <div 
                        className="w-6 h-6 rounded-full border border-gray-300 mr-2"
                        style={{ backgroundColor: product.mainColor }}
                      />
                      <span className="text-gray-600">{product.mainColor}</span>
                    </div>
                  </div>

                  <div>
                    <span className="font-medium text-gray-900">發售日期:</span>
                    <div className="mt-1 text-gray-600">
                      {new Date(product.releaseDate).toLocaleDateString('zh-TW')}
                    </div>
                  </div>

                  {product.appearanceRate && (
                    <div>
                      <span className="font-medium text-gray-900">出現率:</span>
                      <div className="mt-1 text-gray-600">{product.appearanceRate}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* 💖 【收藏按鈕區域】*/}
              <div className="pt-6">
                <div className="mb-4">
                  {!user && (
                    <p className="text-sm text-gray-500 mb-3">
                      🔒 登錄後即可收藏產品和管理收藏清單
                    </p>
                  )}
                  <CollectionButton
                    productId={productId}
                    variant="detailed"
                    size="lg"
                    onAuthRequired={() => setShowAuthPrompt(true)}
                  />
                </div>
                
                {showAuthPrompt && !user && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-800">需要登錄</h3>
                        <div className="mt-2 text-sm text-blue-700">
                          <p>登錄後您可以：</p>
                          <ul className="list-disc list-inside mt-1 space-y-1">
                            <li>收藏喜愛的產品</li>
                            <li>管理收藏清單</li>
                            <li>查看收藏統計</li>
                          </ul>
                        </div>
                        <div className="mt-3">
                          <button
                            onClick={() => setShowAuthPrompt(false)}
                            className="text-blue-800 hover:text-blue-900 text-sm font-medium"
                          >
                            知道了
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 🔄 【相關產品推薦】*/}
        {relatedProducts && relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {product.series} 系列其他產品
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}