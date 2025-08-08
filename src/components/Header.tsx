/**
 * Header 組件 - 頁面頂部導航欄
 *
 * 🎯 這個組件的工作：
 * 提供網站的頂部導航和品牌標識
 *
 * 🚫 這個組件不做什麼：
 * - 不處理用戶認證邏輯（由認證組件處理）
 * - 不處理搜索功能（由搜索組件處理）
 * - 不處理移動端菜單狀態（暫時簡化）
 *
 * ✅ 只負責：
 * - 顯示 Labubu 品牌標誌
 * - 提供主要導航連結
 * - 響應式佈局適配
 * - 用戶登錄狀態顯示
 *
 * 💡 比喻：就像是「店面招牌」，讓顧客知道這是什麼店和如何導航
 */

'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import AuthModal from './AuthModal'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin')
  
  // 🔧 【認證 Hook】
  const { user, signOut, loading } = useAuth()

  // 🔄 【登出處理】
  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('登出失敗:', error)
    }
  }

  // 🔄 【認證模態框控制】
  const openAuthModal = (mode: 'signin' | 'signup') => {
    setAuthMode(mode)
    setIsAuthModalOpen(true)
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* 🎨 【品牌標誌】左側品牌區域 */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="text-2xl">🐰</div>
              <span className="text-xl font-bold text-gray-900">
                Labubu Collection
              </span>
            </Link>
          </div>

          {/* 🔍 【桌面版導航】中間導航區域 */}
          <nav className="hidden md:flex space-x-8">
            <Link 
              href="/" 
              className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
            >
              所有產品
            </Link>
            <Link 
              href="/collections" 
              className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
            >
              我的收藏
            </Link>
            <Link 
              href="/series" 
              className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
            >
              系列分類
            </Link>
          </nav>

          {/* 👤 【用戶區域】右側用戶操作 */}
          <div className="flex items-center space-x-4">
            {/* 🔍 【搜索按鈕】*/}
            <button className="text-gray-500 hover:text-gray-700 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* 💖 【收藏按鈕】*/}
            <button className="text-gray-500 hover:text-red-500 transition-colors relative">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.682l-1.318-1.364a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {/* 收藏數量徽章（暫時隱藏，待實現）*/}
              {/* <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span> */}
            </button>

            {/* 👤 【用戶區域】根據登錄狀態顯示不同內容 */}
            {user ? (
              // 已登錄用戶
              <div className="relative group">
                <button className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="hidden sm:block text-sm">
                    {user.user_metadata?.username || user.email?.split('@')[0] || '用戶'}
                  </span>
                </button>
                
                {/* 用戶下拉菜單 */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                  <div className="py-1">
                    <Link 
                      href="/collections"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      我的收藏
                    </Link>
                    <Link 
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      個人資料
                    </Link>
                    <hr className="my-1 border-gray-200" />
                    <button
                      onClick={handleSignOut}
                      disabled={loading}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                    >
                      {loading ? '登出中...' : '登出'}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              // 未登錄用戶
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => openAuthModal('signin')}
                  className="text-gray-700 hover:text-blue-600 px-3 py-1 text-sm font-medium transition-colors"
                >
                  登錄
                </button>
                <button
                  onClick={() => openAuthModal('signup')}
                  className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  註冊
                </button>
              </div>
            )}

            {/* 📱 【移動端菜單按鈕】*/}
            <button 
              className="md:hidden text-gray-500 hover:text-gray-700 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* 📱 【移動端導航菜單】*/}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-2">
              <Link 
                href="/" 
                className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                所有產品
              </Link>
              <Link 
                href="/collections" 
                className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                我的收藏
              </Link>
              <Link 
                href="/series" 
                className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                系列分類
              </Link>
            </nav>
          </div>
        )}
      </div>

      {/* 🔐 【認證模態框】*/}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultMode={authMode}
      />
    </header>
  )
}