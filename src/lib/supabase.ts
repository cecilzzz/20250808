/**
 * Supabase 客戶端配置 - 數據庫連接和配置
 *
 * 🎯 這個配置文件的工作：
 * 初始化和配置 Supabase 客戶端連接
 *
 * 🚫 這個配置不做什麼：
 * - 不處理具體的數據操作（由各service處理）
 * - 不管理認證邏輯（由auth context處理）
 * - 不處理錯誤邏輯（由調用方處理）
 *
 * ✅ 只負責：
 * - 創建和導出 Supabase 客戶端實例
 * - 管理連接配置
 * - 提供統一的數據庫訪問入口
 * - 環境變量驗證
 *
 * 💡 比喻：就像是「數據庫鑰匙」，為整個應用提供數據庫訪問權限
 */

import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

// 🔐 【環境變量驗證】確保必要的配置存在
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    '❌ Supabase 配置缺失：請在 .env.local 文件中設置 NEXT_PUBLIC_SUPABASE_URL 和 NEXT_PUBLIC_SUPABASE_ANON_KEY'
  )
}

// 🔧 【創建 Supabase 客戶端】統一的數據庫訪問實例
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    // 🔄 【認證配置】自動刷新token和持久化session
    autoRefreshToken: true,
    persistSession: true,
    // 🔐 【Session存儲】使用localStorage保存用戶session
    storage: typeof window !== 'undefined' ? window.localStorage : undefined
  }
})

// 🔧 【導出類型】方便其他文件使用
export type { Database } from '@/types/database'