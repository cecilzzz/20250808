/**
 * 簡化版翻譯 Hook - 不依賴 next-intl
 */

'use client'

import { getMessagesForLocale } from '@/lib/messages'
import { usePathname } from 'next/navigation'

export function useSimpleTranslation() {
  // 從 URL 路徑中提取語言
  const pathname = usePathname()
  const locale = pathname.split('/')[1] || 'zh-TW'
  
  // 獲取翻譯訊息
  const messages = getMessagesForLocale(locale)
  
  // 翻譯函數
  const t = (key: string, params?: Record<string, any>): string => {
    const keys = key.split('.')
    let value: any = messages
    
    for (const k of keys) {
      value = value?.[k]
      if (value === undefined) {
        return key // 如果找不到翻譯，返回原始 key
      }
    }
    
    if (typeof value !== 'string') {
      return key
    }
    
    // 簡單的字符串插值處理
    if (params) {
      return value.replace(/\{\{(\w+)\}\}/g, (match, paramKey) => {
        return params[paramKey] !== undefined ? String(params[paramKey]) : match
      })
    }
    
    return value
  }

  // 格式化價格
  const formatPrice = (price: number): string => {
    const format = locale === 'en' ? '$' : 'NT$ '
    return `${format}${price.toLocaleString(locale)}`
  }

  // 翻譯稀有度
  const translateRarity = (rarity: string): string => {
    return t(`rarity.${rarity}`)
  }

  // 翻譯發售狀態
  const translateReleaseStatus = (status: string): string => {
    return t(`releaseStatus.${status}`)
  }

  return {
    t,
    formatPrice,
    translateRarity,
    translateReleaseStatus,
    currentLocale: locale,
    languageInfo: {
      name: locale === 'zh-TW' ? '繁體中文' : 'English',
      nativeName: locale === 'zh-TW' ? '繁體中文' : 'English',
      flag: locale === 'zh-TW' ? '🇹🇼' : '🇺🇸'
    }
  }
}