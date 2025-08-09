/**
 * LanguageSwitcher 組件 - 語言切換器
 *
 * 🎯 這個組件的工作：
 * 提供用戶友好的語言切換介面
 *
 * 🚫 這個組件不做什麼：
 * - 不處理語言切換的業務邏輯（由 LanguageContext 處理）
 * - 不管理翻譯內容（由翻譯系統處理）
 *
 * ✅ 只負責：
 * - 顯示當前選擇的語言
 * - 提供語言選擇下拉選單
 * - 顯示語言國旗和名稱
 * - 處理語言切換的用戶交互
 *
 * 💡 比喻：就像是「語言選擇遙控器」，讓用戶輕鬆切換語言頻道
 */

'use client'

import { useState } from 'react'
import { ChevronDownIcon, GlobeAltIcon } from '@heroicons/react/24/outline'
import { useLanguage } from '@/contexts/LanguageContext'
import { useTranslation } from '@/hooks/useTranslation'

// 🎛️【組件屬性】語言切換器的屬性介面
interface LanguageSwitcherProps {
  variant?: 'compact' | 'full' // 顯示模式：緊湊或完整
  showFlag?: boolean           // 是否顯示國旗
  showName?: boolean          // 是否顯示語言名稱
  className?: string          // 自定義樣式類名
}

// 🌍 【語言切換器組件】
export default function LanguageSwitcher({
  variant = 'full',
  showFlag = true,
  showName = true,
  className = ''
}: LanguageSwitcherProps) {
  // 🌍 【語言管理】獲取語言管理功能
  const { 
    currentLocale, 
    availableLocales, 
    switchLanguage, 
    isLoading, 
    languageInfo 
  } = useLanguage()
  
  // 🔤 【翻譯功能】獲取翻譯功能
  const { t } = useTranslation()
  
  // 📱 【下拉狀態】管理下拉選單的開關狀態
  const [isOpen, setIsOpen] = useState(false)

  // 📱 【當前語言資訊】獲取當前語言的詳細資訊
  const currentLanguage = languageInfo[currentLocale]

  // 🔄 【切換處理】處理語言切換
  const handleLanguageSwitch = async (locale: string) => {
    setIsOpen(false)
    await switchLanguage(locale as any)
  }

  // 🎨 【樣式計算】根據變體計算樣式
  const baseClasses = variant === 'compact' 
    ? 'relative inline-block text-left'
    : 'relative inline-block text-left min-w-[120px]'

  return (
    <div className={`${baseClasses} ${className}`}>
      {/* 🎯 【觸發按鈕】語言切換的觸發按鈕 */}
      <button
        type="button"
        className="inline-flex w-full justify-center items-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        aria-expanded={isOpen}
        aria-haspopup={true}
      >
        {/* 🌐 【全球圖示】當沒有國旗時顯示 */}
        {!showFlag && <GlobeAltIcon className="h-4 w-4" />}
        
        {/* 🏳️ 【語言國旗】顯示當前語言的國旗 */}
        {showFlag && (
          <span className="text-lg" role="img" aria-label={currentLanguage?.name}>
            {currentLanguage?.flag}
          </span>
        )}
        
        {/* 🔤 【語言名稱】顯示當前語言名稱 */}
        {showName && variant !== 'compact' && (
          <span className="truncate">
            {currentLanguage?.name}
          </span>
        )}
        
        {/* ⬇️ 【下拉箭頭】*/}
        <ChevronDownIcon 
          className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* 📋 【下拉選單】語言選擇選單 */}
      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {availableLocales.map((locale) => {
              const language = languageInfo[locale]
              const isSelected = locale === currentLocale
              
              return (
                <button
                  key={locale}
                  type="button"
                  className={`group flex w-full items-center gap-3 px-4 py-2 text-sm transition-colors ${
                    isSelected
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  onClick={() => handleLanguageSwitch(locale)}
                >
                  {/* 🏳️ 【語言國旗】*/}
                  <span className="text-lg" role="img" aria-label={language.name}>
                    {language.flag}
                  </span>
                  
                  {/* 📝 【語言資訊】*/}
                  <div className="flex flex-col items-start">
                    <span className="font-medium">
                      {language.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {language.nativeName}
                    </span>
                  </div>
                  
                  {/* ✅ 【選中標識】*/}
                  {isSelected && (
                    <span className="ml-auto text-blue-600 text-xs">
                      ✓
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}
      
      {/* 🌐 【點擊遮罩】點擊外部關閉下拉選單 */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-0"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}