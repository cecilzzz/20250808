/**
 * CollectionButton 組件 - 產品收藏狀態控制按鈕
 *
 * 🎯 這個組件的工作：
 * 提供產品收藏狀態的切換和顯示功能
 *
 * 🚫 這個組件不做什麼：
 * - 不處理用戶認證邏輯（由 AuthContext 處理）
 * - 不處理產品數據獲取（由父組件提供）
 * - 不直接操作數據庫（通過 API 調用）
 *
 * ✅ 只負責：
 * - 顯示當前收藏狀態
 * - 處理收藏狀態切換
 * - 提供視覺反饋和動畫
 * - 處理未登錄用戶的提示
 *
 * 💡 比喻：就像是「收藏夾按鈕」，讓用戶輕鬆管理喜愛的商品
 */

'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import type { CollectionStatus } from '@/types/database'

interface CollectionButtonProps {
  productId: string
  variant?: 'icon' | 'button' | 'detailed'
  size?: 'sm' | 'md' | 'lg'
  onAuthRequired?: () => void
}

export default function CollectionButton({ 
  productId, 
  variant = 'button',
  size = 'md',
  onAuthRequired
}: CollectionButtonProps) {
  // 🔄 【狀態管理】收藏狀態相關
  const [status, setStatus] = useState<CollectionStatus>('none')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 🔧 【認證 Hook】
  const { user } = useAuth()

  // 🔍 【獲取收藏狀態】載入當前產品的收藏狀態
  const fetchCollectionStatus = async () => {
    if (!user) {
      setStatus('none')
      return
    }

    try {
      // 🔄 【調用 API】獲取收藏狀態（這裡簡化，實際應該批量獲取）
      const response = await fetch(`/api/users/collections/status?productId=${productId}`)
      const result = await response.json()
      
      if (result.success) {
        setStatus(result.data.status || 'none')
      }
    } catch (err) {
      console.error('獲取收藏狀態失敗:', err)
    }
  }

  // 🔄 【初始載入】用戶狀態變化時重新載入
  useEffect(() => {
    fetchCollectionStatus()
  }, [user, productId])

  // 💖 【更新收藏狀態】處理收藏狀態切換
  const updateCollectionStatus = async (newStatus: CollectionStatus) => {
    // 🔐 【認證檢查】未登錄用戶處理
    if (!user) {
      onAuthRequired?.()
      return
    }

    setLoading(true)
    setError(null)

    try {
      // 🔄 【API 調用】更新收藏狀態
      const response = await fetch('/api/users/collections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          status: newStatus
        })
      })

      const result = await response.json()

      if (result.success) {
        setStatus(newStatus)
        
        // 🎉 【成功反饋】簡單的成功提示
        if (newStatus === 'owned') {
          console.log('已標記為擁有')
        } else if (newStatus === 'wanted') {
          console.log('已加入願望清單')
        } else {
          console.log('已移除收藏')
        }
      } else {
        throw new Error(result.error || '操作失敗')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '操作失敗')
      console.error('更新收藏狀態失敗:', err)
    } finally {
      setLoading(false)
    }
  }

  // 🎨 【樣式配置】根據變體和大小返回樣式
  const getStyles = () => {
    const baseStyles = "transition-all duration-200 disabled:opacity-50"
    
    const sizeStyles = {
      sm: "px-2 py-1 text-xs",
      md: "px-3 py-2 text-sm", 
      lg: "px-4 py-3 text-base"
    }

    const variantStyles = {
      icon: "p-2 rounded-full hover:bg-gray-100",
      button: `${sizeStyles[size]} rounded-md font-medium`,
      detailed: `${sizeStyles[size]} rounded-lg font-medium`
    }

    return `${baseStyles} ${variantStyles[variant]}`
  }

  // 🎨 【狀態樣式】根據收藏狀態返回對應顏色
  const getStatusStyles = (buttonStatus: CollectionStatus) => {
    if (status === buttonStatus) {
      const activeStyles = {
        owned: "bg-green-100 text-green-800 border-green-300 hover:bg-green-200",
        wanted: "bg-red-100 text-red-800 border-red-300 hover:bg-red-200",
        none: "bg-gray-100 text-gray-600 border-gray-300"
      }
      return `border ${activeStyles[buttonStatus]}`
    }
    
    return "border border-gray-300 text-gray-600 bg-white hover:bg-gray-50"
  }

  // 📱 【圖標變體】只顯示圖標的簡潔版本
  if (variant === 'icon') {
    return (
      <button
        onClick={() => updateCollectionStatus(status === 'wanted' ? 'none' : 'wanted')}
        disabled={loading}
        className={`${getStyles()} ${status === 'wanted' ? 'text-red-500 hover:text-red-600' : 'text-gray-400 hover:text-red-500'}`}
        title={status === 'wanted' ? '移除收藏' : '加入收藏'}
      >
        <svg className="w-5 h-5" fill={status === 'wanted' ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.682l-1.318-1.364a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>
    )
  }

  // 🎯 【詳細變體】顯示兩個分離的按鈕
  if (variant === 'detailed') {
    return (
      <div className="flex space-x-2">
        {/* 想要按鈕 */}
        <button
          onClick={() => updateCollectionStatus(status === 'wanted' ? 'none' : 'wanted')}
          disabled={loading}
          className={`${getStyles()} ${getStatusStyles('wanted')}`}
        >
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill={status === 'wanted' ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.682l-1.318-1.364a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {status === 'wanted' ? '已想要' : '想要'}
          </span>
        </button>

        {/* 擁有按鈕 */}
        <button
          onClick={() => updateCollectionStatus(status === 'owned' ? 'none' : 'owned')}
          disabled={loading}
          className={`${getStyles()} ${getStatusStyles('owned')}`}
        >
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill={status === 'owned' ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {status === 'owned' ? '已擁有' : '擁有'}
          </span>
        </button>
      </div>
    )
  }

  // 🔄 【按鈕變體】單個切換按鈕
  return (
    <button
      onClick={() => {
        if (status === 'none') {
          updateCollectionStatus('wanted')
        } else if (status === 'wanted') {
          updateCollectionStatus('owned')
        } else {
          updateCollectionStatus('none')
        }
      }}
      disabled={loading}
      className={`${getStyles()} ${getStatusStyles(status)}`}
    >
      {loading ? '處理中...' : 
       status === 'none' ? '加入收藏' :
       status === 'wanted' ? '❤️ 想要' : '✅ 擁有'}
    </button>
  )
}