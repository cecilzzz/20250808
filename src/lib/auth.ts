/**
 * 本地認證系統 - 基於 LocalStorage 的用戶認證
 *
 * 🎯 這個認證系統的工作：
 * 提供簡單的用戶註冊、登錄和會話管理
 *
 * 🚫 這個認證系統不做什麼：
 * - 不提供真正的安全性（僅演示用）
 * - 不支持密碼加密（明文存儲）
 * - 不支持服務器端驗證
 *
 * ✅ 只負責：
 * - 用戶註冊和登錄邏輯
 * - 本地會話管理
 * - 用戶信息存儲
 * - 基本的數據驗證
 *
 * 💡 比喻：就像是「會員卡系統」，管理用戶身份和權限
 */

import { getLocalStorage, setLocalStorage, removeLocalStorage, STORAGE_KEYS } from './localStorage'

// 👤 【用戶接口】本地用戶數據結構
export interface LocalUser {
  id: string
  email: string
  username: string
  createdAt: string
  lastLoginAt: string
}

// 🔐 【認證響應接口】統一的認證操作響應格式
export interface AuthResponse {
  success: boolean
  user?: LocalUser
  error?: string
}

// 📋 【用戶數據庫】模擬的本地用戶存儲
interface UserDatabase {
  [email: string]: {
    id: string
    email: string
    username: string
    password: string // 注意：實際項目中不應明文存儲密碼
    createdAt: string
    lastLoginAt: string
  }
}

// 🔧 【獲取用戶數據庫】從 LocalStorage 讀取用戶數據
function getUserDatabase(): UserDatabase {
  return getLocalStorage('labubu_users_db', {})
}

// 💾 【保存用戶數據庫】將用戶數據保存到 LocalStorage
function saveUserDatabase(db: UserDatabase): boolean {
  return setLocalStorage('labubu_users_db', db)
}

// 🆔 【生成用戶ID】創建唯一的用戶標識符
function generateUserId(): string {
  return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
}

// ✅【郵箱驗證】檢查郵箱格式是否有效
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// 📝 【用戶註冊】創建新用戶帳號
export async function signUp(email: string, password: string, username: string): Promise<AuthResponse> {
  try {
    // 🔄 【輸入驗證】檢查必要欄位
    if (!email || !password || !username) {
      return {
        success: false,
        error: '請填寫所有必要信息'
      }
    }

    if (!isValidEmail(email)) {
      return {
        success: false,
        error: '請輸入有效的郵箱地址'
      }
    }

    if (password.length < 6) {
      return {
        success: false,
        error: '密碼長度至少需要6個字符'
      }
    }

    if (username.trim().length < 2) {
      return {
        success: false,
        error: '用戶名至少需要2個字符'
      }
    }

    // 🔍 【檢查重複】確保郵箱未被使用
    const userDb = getUserDatabase()
    if (userDb[email]) {
      return {
        success: false,
        error: '此郵箱已被註冊，請使用其他郵箱或嘗試登錄'
      }
    }

    // 🔄 【創建用戶】生成新用戶記錄
    const now = new Date().toISOString()
    const userId = generateUserId()

    const newUser = {
      id: userId,
      email: email.toLowerCase(),
      username: username.trim(),
      password, // 實際項目中應該加密
      createdAt: now,
      lastLoginAt: now
    }

    // 💾 【保存用戶】添加到用戶數據庫
    userDb[email.toLowerCase()] = newUser
    if (!saveUserDatabase(userDb)) {
      return {
        success: false,
        error: '註冊失敗，請稍後重試'
      }
    }

    // ✅【自動登錄】註冊成功後自動登錄
    const user: LocalUser = {
      id: newUser.id,
      email: newUser.email,
      username: newUser.username,
      createdAt: newUser.createdAt,
      lastLoginAt: newUser.lastLoginAt
    }

    // 💾 【保存會話】設置當前用戶
    setLocalStorage(STORAGE_KEYS.USER, user)
    setLocalStorage(STORAGE_KEYS.AUTH_TOKEN, userId)

    return {
      success: true,
      user
    }

  } catch (error) {
    console.error('❌ 註冊失敗:', error)
    return {
      success: false,
      error: '註冊過程中發生錯誤，請稍後重試'
    }
  }
}

// 🔐 【用戶登錄】驗證用戶身份並建立會話
export async function signIn(email: string, password: string): Promise<AuthResponse> {
  try {
    // 🔄 【輸入驗證】檢查必要欄位
    if (!email || !password) {
      return {
        success: false,
        error: '請輸入郵箱和密碼'
      }
    }

    if (!isValidEmail(email)) {
      return {
        success: false,
        error: '請輸入有效的郵箱地址'
      }
    }

    // 🔍 【查找用戶】從數據庫中查找用戶
    const userDb = getUserDatabase()
    const userRecord = userDb[email.toLowerCase()]

    if (!userRecord) {
      return {
        success: false,
        error: '郵箱或密碼錯誤'
      }
    }

    // 🔐 【密碼驗證】檢查密碼是否正確
    if (userRecord.password !== password) {
      return {
        success: false,
        error: '郵箱或密碼錯誤'
      }
    }

    // 🔄 【更新登錄時間】記錄最後登錄時間
    const now = new Date().toISOString()
    userRecord.lastLoginAt = now
    saveUserDatabase(userDb)

    // ✅ 【建立會話】創建用戶會話
    const user: LocalUser = {
      id: userRecord.id,
      email: userRecord.email,
      username: userRecord.username,
      createdAt: userRecord.createdAt,
      lastLoginAt: userRecord.lastLoginAt
    }

    // 💾 【保存會話】設置當前用戶
    setLocalStorage(STORAGE_KEYS.USER, user)
    setLocalStorage(STORAGE_KEYS.AUTH_TOKEN, userRecord.id)

    return {
      success: true,
      user
    }

  } catch (error) {
    console.error('❌ 登錄失敗:', error)
    return {
      success: false,
      error: '登錄過程中發生錯誤，請稍後重試'
    }
  }
}

// 🚪 【用戶登出】清除會話信息
export async function signOut(): Promise<AuthResponse> {
  try {
    // 🧹 【清除會話】移除用戶相關的本地數據
    removeLocalStorage(STORAGE_KEYS.USER)
    removeLocalStorage(STORAGE_KEYS.AUTH_TOKEN)

    return {
      success: true
    }
  } catch (error) {
    console.error('❌ 登出失敗:', error)
    return {
      success: false,
      error: '登出過程中發生錯誤'
    }
  }
}

// 👤 【獲取當前用戶】讀取當前登錄的用戶信息
export function getCurrentUser(): LocalUser | null {
  try {
    // 🚫 【服務器端檢查】在服務器端返回 null
    if (typeof window === 'undefined') {
      return null
    }
    
    const user = getLocalStorage<LocalUser | null>(STORAGE_KEYS.USER, null)
    const token = getLocalStorage<string | null>(STORAGE_KEYS.AUTH_TOKEN, null)

    // 🔐 【會話驗證】檢查會話是否有效
    if (!user || !token || user.id !== token) {
      return null
    }

    return user
  } catch (error) {
    console.error('❌ 獲取用戶信息失敗:', error)
    return null
  }
}

// ✅ 【檢查登錄狀態】判斷用戶是否已登錄
export function isAuthenticated(): boolean {
  // 🚫 【服務器端檢查】在服務器端返回 false
  if (typeof window === 'undefined') {
    return false
  }
  
  return getCurrentUser() !== null
}

// 🔄 【重置密碼】模擬的密碼重置功能
export async function resetPassword(email: string): Promise<AuthResponse> {
  try {
    if (!email || !isValidEmail(email)) {
      return {
        success: false,
        error: '請輸入有效的郵箱地址'
      }
    }

    // 🔍 【檢查用戶】確認用戶存在
    const userDb = getUserDatabase()
    if (!userDb[email.toLowerCase()]) {
      return {
        success: false,
        error: '找不到該郵箱對應的帳號'
      }
    }

    // 🎯 【模擬發送】在實際項目中這裡會發送重置郵件
    console.log('🔄 模擬發送密碼重置郵件至:', email)

    return {
      success: true
    }
  } catch (error) {
    console.error('❌ 重置密碼失敗:', error)
    return {
      success: false,
      error: '重置密碼過程中發生錯誤'
    }
  }
}