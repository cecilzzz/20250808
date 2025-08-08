/**
 * LocalStorage 工具函數 - 瀏覽器本地存儲管理
 *
 * 🎯 這個工具庫的工作：
 * 提供安全的 LocalStorage 操作和數據序列化
 *
 * 🚫 這個工具庫不做什麼：
 * - 不處理複雜的數據關係（保持簡單）
 * - 不提供數據同步功能（純本地存儲）
 * - 不處理數據加密（明文存儲）
 *
 * ✅ 只負責：
 * - 安全的讀寫 LocalStorage
 * - JSON 數據序列化和反序列化
 * - 錯誤處理和類型安全
 * - 統一的存儲鍵名管理
 *
 * 💡 比喻：就像是「本地文件櫃」，安全地存取用戶的本地數據
 */

// 🔑 【存儲鍵名常量】統一管理所有 LocalStorage 鍵名
export const STORAGE_KEYS = {
  USER: 'labubu_user',
  COLLECTIONS: 'labubu_collections',
  AUTH_TOKEN: 'labubu_auth_token',
  PREFERENCES: 'labubu_preferences'
} as const

// 🔧 【通用存儲函數】安全地存儲數據到 LocalStorage
export function setLocalStorage<T>(key: string, value: T): boolean {
  try {
    // 🔄 【序列化】將數據轉換為 JSON 字符串
    const serializedValue = JSON.stringify(value)
    localStorage.setItem(key, serializedValue)
    return true
  } catch (error) {
    console.error('❌ LocalStorage 存儲失敗:', key, error)
    return false
  }
}

// 🔍 【通用讀取函數】安全地從 LocalStorage 讀取數據
export function getLocalStorage<T>(key: string, defaultValue: T): T {
  try {
    // 🔍 【檢查存在性】確保在瀏覽器環境中
    if (typeof window === 'undefined') {
      return defaultValue
    }

    // 🔄 【讀取數據】從 LocalStorage 獲取字符串
    const item = localStorage.getItem(key)
    
    if (item === null) {
      return defaultValue
    }

    // 🔄 【反序列化】將 JSON 字符串轉換為對象
    return JSON.parse(item) as T
  } catch (error) {
    console.error('❌ LocalStorage 讀取失敗:', key, error)
    return defaultValue
  }
}

// 🗑️ 【刪除函數】移除指定的 LocalStorage 項目
export function removeLocalStorage(key: string): boolean {
  try {
    localStorage.removeItem(key)
    return true
  } catch (error) {
    console.error('❌ LocalStorage 刪除失敗:', key, error)
    return false
  }
}

// 🧹 【清空函數】清空所有 Labubu 相關的 LocalStorage 數據
export function clearLabubuStorage(): boolean {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      removeLocalStorage(key)
    })
    return true
  } catch (error) {
    console.error('❌ 清空 LocalStorage 失敗:', error)
    return false
  }
}

// ✅ 【檢查函數】檢查 LocalStorage 是否可用
export function isLocalStorageAvailable(): boolean {
  try {
    if (typeof window === 'undefined') {
      return false
    }
    
    const testKey = '__labubu_test__'
    localStorage.setItem(testKey, 'test')
    localStorage.removeItem(testKey)
    return true
  } catch (error) {
    console.warn('⚠️ LocalStorage 不可用:', error)
    return false
  }
}

// 📊 【統計函數】獲取 LocalStorage 使用情況
export function getStorageInfo() {
  if (!isLocalStorageAvailable()) {
    return {
      available: false,
      used: 0,
      remaining: 0,
      keys: []
    }
  }

  try {
    // 🔄 【計算使用量】統計當前存儲使用情況
    let used = 0
    const keys: string[] = []

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith('labubu_')) {
        keys.push(key)
        const value = localStorage.getItem(key) || ''
        used += key.length + value.length
      }
    }

    return {
      available: true,
      used,
      keys,
      remaining: 5242880 - used // 假設 5MB 限制
    }
  } catch (error) {
    console.error('❌ 獲取存儲信息失敗:', error)
    return {
      available: false,
      used: 0,
      remaining: 0,
      keys: []
    }
  }
}