/**
 * Next.js Middleware - 多語言路由中介軟體
 *
 * 🎯 這個 Middleware 的工作：
 * 處理多語言路由的自動重導向和語言檢測
 *
 * 🚫 這個 Middleware 不做什麼：
 * - 不處理具體的翻譯內容
 * - 不處理業務邏輯或認證
 *
 * ✅ 只負責：
 * - 自動檢測用戶首選語言
 * - 處理語言路由重導向
 * - 確保所有路由都有語言前綴
 * - 處理根路徑的語言選擇
 *
 * 💡 比喻：就像是「語言交通指揮員」，將用戶引導到正確的語言版本
 */

import createIntlMiddleware from 'next-intl/middleware'
import { locales, defaultLocale } from './i18n/request'

// 🔧 【中介軟體配置】配置 next-intl 的路由處理
export default createIntlMiddleware({
  // 🌍 【支援語言】應用支援的所有語言
  locales,
  
  // 🏠 【預設語言】當無法檢測到語言時的預設選擇
  defaultLocale
})

// ⚙️【匹配配置】定義哪些路徑需要經過此 middleware
export const config = {
  // 🛤️ 【路徑匹配】匹配除了靜態資源和API路由外的所有路徑
  matcher: [
    // 📄 【包含路徑】匹配所有路徑但排除靜態資源
    '/((?!api|_next|_vercel|favicon.ico|.*\\..*).*)'
  ]
}