/**
 * ProductCard 組件 - 產品卡片展示組件
 *
 * 🎯 這個組件的工作：
 * 以卡片形式展示單個產品的核心信息，支援多語言顯示
 *
 * 🚫 這個組件不做什麼：
 * - 不處理產品數據獲取（由父組件提供數據）
 * - 不處理收藏狀態管理（由專門的收藏組件處理）
 * - 不處理路由跳轉邏輯（只提供點擊事件）
 *
 * ✅ 只負責：
 * - 展示產品圖片、名稱、價格（多語言）
 * - 顯示稀有度標識和顏色（多語言）
 * - 根據語言選擇顯示對應的產品名稱
 * - 提供點擊進入詳情的交互
 * - 響應式布局適配
 *
 * 💡 比喻：就像是「國際商品展示窗」，用顧客熟悉的語言展示關鍵信息
 */

'use client'

import Image from 'next/image'
import Link from 'next/link'
import type { Product } from '@/types/database'
import { useTranslation } from '@/hooks/useTranslation'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  // 🌍 【翻譯功能】獲取翻譯函數和工具
  const { translateRarity, translateReleaseStatus, formatPrice, t, currentLocale } = useTranslation()

  // 🎨 【稀有度顏色映射】根據稀有度返回對應的顏色樣式
  const getRarityColor = (rarity: string) => {
    const colors = {
      normal: 'bg-gray-100 text-gray-800 border-gray-200',
      rare: 'bg-blue-100 text-blue-800 border-blue-200',
      super_rare: 'bg-purple-100 text-purple-800 border-purple-200', 
      hidden: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      sp: 'bg-gradient-to-r from-pink-100 to-purple-100 text-purple-800 border-purple-200'
    }
    return colors[rarity as keyof typeof colors] || colors.normal
  }

  return (
    <Link 
      href={`/products/${product.id}`}
      className="group block bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
    >
      {/* 📸 【產品圖片區域】*/}
      <div className="relative aspect-square bg-gray-50">
        {product.imageUrl && product.imageUrl.trim() !== '' ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-200"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <div className="text-4xl mb-2">🐰</div>
              <p className="text-xs text-gray-500">{t('product.noImage')}</p>
            </div>
          </div>
        )}
        
        {/* 🎨 【稀有度標籤】右上角顯示稀有度 */}
        <div className="absolute top-2 right-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRarityColor(product.rarityLevel)}`}>
            {translateRarity(product.rarityLevel)}
          </span>
        </div>

        {/* 🔥【發售狀態】左下角狀態標識 */}
        {product.releaseStatus !== 'active' && (
          <div className="absolute bottom-2 left-2">
            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-red-100 text-red-800 border border-red-200">
              {translateReleaseStatus(product.releaseStatus)}
            </span>
          </div>
        )}
      </div>

      {/* 📝 【產品信息區域】 */}
      <div className="p-4">
        {/* 📚 【系列名稱】*/}
        <div className="mb-2">
          <span className="text-sm text-gray-500 font-medium">
            {product.series}
          </span>
        </div>

        {/* 🏷️ 【產品名稱】*/}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {currentLocale === 'en' && product.nameEn ? product.nameEn : product.name}
          {currentLocale === 'zh-TW' && product.nameEn && (
            <span className="block text-sm font-normal text-gray-500 mt-1">
              {product.nameEn}
            </span>
          )}
        </h3>

        {/* 💰 【價格信息】*/}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xl font-bold text-gray-900">
              {formatPrice(product.currentPrice)}
            </span>
            {product.originalPrice !== product.currentPrice && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* 🎨 【主色調圓點】*/}
          <div className="flex items-center space-x-1">
            <div 
              className="w-4 h-4 rounded-full border border-gray-200"
              style={{ backgroundColor: product.mainColor }}
              title={`${t('product.mainColor')}: ${product.mainColor}`}
            />
          </div>
        </div>

        {/* 📊 【出現率信息】（如果有的話）*/}
        {product.appearanceRate && (
          <div className="mt-2 pt-2 border-t border-gray-100">
            <span className="text-xs text-gray-500">
              {t('product.appearanceRate')}: {product.appearanceRate}
            </span>
          </div>
        )}
      </div>
    </Link>
  )
}