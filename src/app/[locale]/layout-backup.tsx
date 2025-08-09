/**
 * LocaleLayout - 語言路由佈局
 *
 * 🎯 這個佈局的工作：
 * 為特定語言提供佈局和翻譯上下文
 *
 * 🚫 這個佈局不做什麼：
 * - 不處理全局樣式（由根佈局處理）
 * - 不處理 HTML 基礎結構（由根佈局處理）
 *
 * ✅ 只負責：
 * - 提供語言特定的翻譯上下文
 * - 整合語言管理功能
 * - 設置語言相關的 SEO 配置
 * - 包裝所有語言路由的共同邏輯
 *
 * 💡 比喻：就像是「語言專門服務櫃檯」，為特定語言用戶提供專門服務
 */

import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { AuthProvider } from '@/contexts/AuthContext'
import { locales, type Locale } from '@/i18n/request'

// 🎛️【佈局屬性】語言佈局的屬性介面
interface LocaleLayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

// 🏗️【語言佈局】為特定語言提供佈局和上下文
export default async function LocaleLayout({
  children,
  params
}: LocaleLayoutProps) {
  // 🔄 【等待參數】Next.js 15 要求 await params
  const { locale } = await params
  
  // 🚦 【語言驗證】確保請求的語言在支援列表中
  if (!locales.includes(locale as Locale)) {
    notFound()
  }

  // 📦 【載入訊息】載入當前語言的翻譯訊息
  const messages = await getMessages()

  return (
    <NextIntlClientProvider messages={messages}>
      {/* 🌍 【語言管理】提供語言切換和管理功能 */}
      <LanguageProvider initialLocale={locale as Locale}>
        {/* 🔐 【認證管理】提供用戶認證功能 */}
        <AuthProvider>
          {children}
        </AuthProvider>
      </LanguageProvider>
    </NextIntlClientProvider>
  )
}

// 📱 【動態路由】告訴 Next.js 這是動態路由
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}