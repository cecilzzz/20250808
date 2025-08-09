/**
 * RootLayout - 應用根佈局
 *
 * 🎯 這個佈局的工作：
 * 提供整個應用的基礎結構和全局配置
 *
 * 🚫 這個佈局不做什麼：
 * - 不處理具體的頁面邏輯（由頁面組件處理）
 * - 不處理特定的業務功能（只提供基礎架構）
 *
 * ✅ 只負責：
 * - 設置 HTML 基礎結構
 * - 提供全局樣式和字體
 * - 包裝認證狀態管理
 * - 設置頁面 SEO 元數據
 *
 * 💡 比喻：就像是「建築的地基和框架」，為所有內容提供基礎支撐
 */

import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
})

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Labubu Collection - Labubu 產品收藏系統",
  description: "發現並收藏你喜愛的 Labubu 產品。瀏覽各種系列、稀有度的 Labubu 商品，管理你的收藏清單。",
  keywords: ["Labubu", "收藏", "玩具", "盲盒", "收藏品"],
  authors: [{ name: "Labubu Collection Team" }],
  robots: "index, follow",
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-TW" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  )
}
