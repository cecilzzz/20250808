/**
 * AuthContext - 用戶認證狀態管理
 *
 * 🎯 這個 Context 的工作：
 * 管理全局的用戶認證狀態和相關操作
 *
 * 🚫 這個 Context 不做什麼：
 * - 不處理 UI 組件渲染（只管理狀態）
 * - 不處理業務邏輯（只處理認證相關）
 * - 不直接操作數據庫（通過 Supabase 客戶端）
 *
 * ✅ 只負責：
 * - 監聽用戶登錄狀態變化
 * - 提供登錄、註冊、登出功能
 * - 管理用戶信息狀態
 * - 為子組件提供認證狀態
 *
 * 💡 比喻：就像是「門禁管理系統」，控制誰可以進出和訪問什麼功能
 */

'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

interface AuthContextType {
  // 🔄 【狀態屬性】
  user: User | null
  loading: boolean
  
  // 🔧 【操作方法】
  signUp: (email: string, password: string, username: string) => Promise<{ error?: string }>
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signOut: () => Promise<{ error?: string }>
  resetPassword: (email: string) => Promise<{ error?: string }>
}

// 🔧 【創建 Context】
const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  // 🔄 【狀態管理】用戶認證相關狀態
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // 🔄 【初始化】檢查用戶登錄狀態和設置認證監聽
  useEffect(() => {
    // 🔍 【獲取當前用戶會話】檢查是否已登錄
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setUser(session?.user ?? null)
      } catch (error) {
        console.error('認證初始化失敗:', error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    initAuth()

    // 🔄 【認證狀態監聽】監聽用戶登錄/登出事件
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // 🧹 【清理監聽】組件卸載時清理事件監聽
    return () => subscription.unsubscribe()
  }, [])

  // 📝 【用戶註冊】處理新用戶註冊
  const signUp = async (email: string, password: string, username: string) => {
    try {
      setLoading(true)
      
      // 🔐 【Supabase註冊】使用Supabase Auth進行註冊
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username // 將用戶名存儲在user_metadata中
          }
        }
      })
      
      if (error) {
        return { error: error.message }
      }
      
      // ✅ 【註冊成功】用戶狀態會通過onAuthStateChange自動更新
      return {}
    } catch (error) {
      console.error('註冊失敗:', error)
      return { error: '註冊過程中發生錯誤' }
    } finally {
      setLoading(false)
    }
  }

  // 🔐 【用戶登錄】處理用戶登錄
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      
      // 🔐 【Supabase登錄】使用Supabase Auth進行登錄
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) {
        return { error: error.message }
      }
      
      // ✅ 【登錄成功】用戶狀態會通過onAuthStateChange自動更新
      return {}
    } catch (error) {
      console.error('登錄失敗:', error)
      return { error: '登錄過程中發生錯誤' }
    } finally {
      setLoading(false)
    }
  }

  // 🚪 【用戶登出】處理用戶登出
  const signOut = async () => {
    try {
      setLoading(true)
      
      // 🚪 【Supabase登出】使用Supabase Auth進行登出
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        return { error: error.message }
      }
      
      // ✅ 【登出成功】用戶狀態會通過onAuthStateChange自動更新
      return {}
    } catch (error) {
      console.error('登出失敗:', error)
      return { error: '登出過程中發生錯誤' }
    } finally {
      setLoading(false)
    }
  }

  // 🔄 【重置密碼】處理密碼重置
  const resetPassword = async (email: string) => {
    try {
      // 🔄 【Supabase密碼重置】發送密碼重置郵件
      const { error } = await supabase.auth.resetPasswordForEmail(email)
      
      if (error) {
        return { error: error.message }
      }
      
      return {}
    } catch (error) {
      console.error('重置密碼失敗:', error)
      return { error: '重置密碼過程中發生錯誤' }
    }
  }

  // ✅ 【提供 Context 值】
  const value: AuthContextType = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// 🔧 【自定義 Hook】方便組件使用認證狀態
export function useAuth() {
  const context = useContext(AuthContext)
  
  if (context === undefined) {
    throw new Error('useAuth 必須在 AuthProvider 內部使用')
  }
  
  return context
}