/**
 * LanguageContext - 語言管理 Context
 *
 * 🎯 這個 Context 的工作：
 * 管理整個應用的語言狀態和切換邏輯
 *
 * 🚫 這個 Context 不做什麼：
 * - 不處理具體的翻譯內容（由 next-intl 處理）
 * - 不處理路由層面的語言切換（由 middleware 處理）
 *
 * ✅ 只負責：
 * - 提供當前語言狀態
 * - 管理語言切換邏輯
 * - 持久化語言偏好設定
 * - 提供語言相關的工具函數
 *
 * 💡 比喻：就像是「語言控制中心」，統一管理所有組件的語言需求
 */

'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import type { Locale } from '@/i18n/request'
import type { LanguagePreference, LanguageInfo, LanguageSwitcher } from '@/types/i18n'

// 🌍 【語言資訊】支援的語言完整資訊
const LANGUAGE_INFO: Record<Locale, LanguageInfo> = {
  'zh-TW': {
    code: 'zh-TW',
    name: '繁體中文',
    nativeName: '繁體中文',
    flag: '🇹🇼'
  },
  'en': {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸'
  }
}

// 🔧 【Context 類型】語言 Context 的介面定義
interface LanguageContextType extends LanguageSwitcher {
  preference: LanguagePreference
  languageInfo: Record<Locale, LanguageInfo>
  updatePreference: (preference: Partial<LanguagePreference>) => void
}

// 📦 【Context 創建】創建語言管理 Context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// 🎛️【Provider 屬性】語言 Provider 的屬性介面
interface LanguageProviderProps {
  children: ReactNode
  initialLocale: Locale
}

// 🔄 【本地儲存 Key】用於持久化語言偏好的儲存鍵值
const LANGUAGE_PREFERENCE_KEY = 'labubu_language_preference'

// 🏗️【Provider 組件】語言管理 Provider
export function LanguageProvider({ children, initialLocale }: LanguageProviderProps) {
  const router = useRouter()
  const pathname = usePathname()
  
  // 📱 【當前語言】當前選擇的語言
  const [currentLocale, setCurrentLocale] = useState<Locale>(initialLocale)
  
  // ⚙️【語言偏好】用戶的語言偏好設定
  const [preference, setPreference] = useState<LanguagePreference>({
    locale: initialLocale,
    autoDetect: false
  })
  
  // ⏳【載入狀態】語言切換時的載入狀態
  const [isLoading, setIsLoading] = useState(false)

  // 💾 【載入偏好設定】從本地儲存載入語言偏好
  useEffect(() => {
    const savedPreference = localStorage.getItem(LANGUAGE_PREFERENCE_KEY)
    if (savedPreference) {
      try {
        const parsed = JSON.parse(savedPreference) as LanguagePreference
        setPreference(parsed)
        if (parsed.locale !== initialLocale) {
          setCurrentLocale(parsed.locale)
        }
      } catch (error) {
        console.warn('Failed to parse saved language preference:', error)
      }
    }
  }, [initialLocale])

  // 💾 【儲存偏好設定】將語言偏好儲存到本地
  const updatePreference = (newPreference: Partial<LanguagePreference>) => {
    const updatedPreference = { ...preference, ...newPreference }
    setPreference(updatedPreference)
    localStorage.setItem(LANGUAGE_PREFERENCE_KEY, JSON.stringify(updatedPreference))
  }

  // 🔄 【語言切換】切換應用語言的主要函數
  const switchLanguage = async (locale: Locale) => {
    if (locale === currentLocale) return
    
    setIsLoading(true)
    
    try {
      // 📝 【更新狀態】更新當前語言和偏好設定
      setCurrentLocale(locale)
      updatePreference({ locale })
      
      // 🔄 【路由切換】切換到新語言的路由
      const newPathname = pathname.replace(`/${currentLocale}`, `/${locale}`)
      router.push(newPathname)
      
    } catch (error) {
      console.error('Failed to switch language:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // 🎯 【Context 值】提供給子組件的 Context 值
  const contextValue: LanguageContextType = {
    currentLocale,
    availableLocales: Object.keys(LANGUAGE_INFO) as Locale[],
    switchLanguage,
    isLoading,
    preference,
    languageInfo: LANGUAGE_INFO,
    updatePreference
  }

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  )
}

// 🪝 【Hook】使用語言 Context 的 Hook
export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext)
  
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  
  return context
}