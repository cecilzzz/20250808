/**
 * AuthModal 組件 - 用戶登錄註冊模態框
 *
 * 🎯 這個組件的工作：
 * 提供用戶登錄和註冊的界面和交互
 *
 * 🚫 這個組件不做什麼：
 * - 不管理全局認證狀態（由 AuthContext 處理）
 * - 不處理複雜的表單驗證邏輯（保持簡潔）
 * - 不處理社交登錄（暫時只支持 Email）
 *
 * ✅ 只負責：
 * - 顯示登錄/註冊表單
 * - 處理表單提交和驗證
 * - 顯示錯誤和成功消息
 * - 模態框的開關控制
 *
 * 💡 比喻：就像是「會員服務窗口」，處理用戶的登錄註冊需求
 */

'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  defaultMode?: 'signin' | 'signup'
}

export default function AuthModal({ isOpen, onClose, defaultMode = 'signin' }: AuthModalProps) {
  // 🔄 【狀態管理】模態框相關狀態
  const [mode, setMode] = useState<'signin' | 'signup' | 'reset'>(defaultMode)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    confirmPassword: ''
  })
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 🔧 【認證 Hook】
  const { signIn, signUp, resetPassword, loading } = useAuth()

  // 🔄 【重置表單】當模態框關閉時重置狀態
  useEffect(() => {
    if (!isOpen) {
      setFormData({ email: '', password: '', username: '', confirmPassword: '' })
      setError(null)
      setSuccess(null)
      setMode(defaultMode)
    }
  }, [isOpen, defaultMode])

  // 🔧 【表單變更處理】
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // 清除錯誤信息
    if (error) setError(null)
  }

  // ✅ 【表單驗證】基本的表單驗證
  const validateForm = () => {
    const { email, password, username, confirmPassword } = formData

    if (!email || !email.includes('@')) {
      setError('請輸入有效的 Email 地址')
      return false
    }

    if (mode !== 'reset' && (!password || password.length < 6)) {
      setError('密碼至少需要 6 個字符')
      return false
    }

    if (mode === 'signup') {
      if (!username || username.trim().length < 2) {
        setError('用戶名至少需要 2 個字符')
        return false
      }
      
      if (password !== confirmPassword) {
        setError('兩次輸入的密碼不一致')
        return false
      }
    }

    return true
  }

  // 🔄 【表單提交處理】
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)
    setError(null)
    setSuccess(null)

    try {
      const { email, password, username } = formData

      if (mode === 'signin') {
        // 🔐 【登錄處理】
        const { error } = await signIn(email, password)
        
        if (error) {
          setError(error === 'Invalid login credentials' 
            ? 'Email 或密碼錯誤' 
            : error)
        } else {
          setSuccess('登錄成功！')
          setTimeout(onClose, 1000)
        }

      } else if (mode === 'signup') {
        // 📝 【註冊處理】
        const { error } = await signUp(email, password, username)
        
        if (error) {
          if (error.includes('already registered')) {
            setError('此 Email 已被註冊，請使用其他 Email 或嘗試登錄')
          } else {
            setError(error)
          }
        } else {
          setSuccess('註冊成功！請檢查您的 Email 完成驗證')
          setTimeout(() => {
            onClose()
          }, 2000)
        }

      } else if (mode === 'reset') {
        // 🔄 【密碼重置處理】
        const { error } = await resetPassword(email)
        
        if (error) {
          setError(error)
        } else {
          setSuccess('密碼重置連結已發送到您的 Email')
          setTimeout(() => {
            setMode('signin')
            setSuccess(null)
          }, 2000)
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '操作失敗，請重試')
    } finally {
      setIsSubmitting(false)
    }
  }

  // 🚫 【模態框關閉】
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* 📋 【模態框標題】*/}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {mode === 'signin' && '登錄'}
            {mode === 'signup' && '註冊'}
            {mode === 'reset' && '重置密碼'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 📝 【表單內容】*/}
        <div className="p-6">
          {/* ⚠️ 【錯誤提示】*/}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          {/* ✅ 【成功提示】*/}
          {success && (
            <div className="mb-4 p-3 bg-green-100 border border-green-300 text-green-700 rounded-md text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email 輸入 */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email 地址
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="請輸入您的 Email"
                required
              />
            </div>

            {/* 用戶名輸入（僅註冊時顯示）*/}
            {mode === 'signup' && (
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  用戶名 (可選)
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="請輸入用戶名"
                />
              </div>
            )}

            {/* 密碼輸入（重置密碼時不顯示）*/}
            {mode !== 'reset' && (
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  密碼
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="請輸入密碼"
                  minLength={6}
                  required
                />
              </div>
            )}

            {/* 確認密碼（僅註冊時顯示）*/}
            {mode === 'signup' && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  確認密碼
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="請再次輸入密碼"
                  required
                />
              </div>
            )}

            {/* 提交按鈕 */}
            <button
              type="submit"
              disabled={isSubmitting || loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting || loading ? '處理中...' : 
               mode === 'signin' ? '登錄' :
               mode === 'signup' ? '註冊' : '發送重置連結'}
            </button>
          </form>

          {/* 🔄 【模式切換】*/}
          <div className="mt-6 pt-4 border-t border-gray-200 text-center space-y-2">
            {mode === 'signin' && (
              <>
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className="text-blue-600 hover:text-blue-800 text-sm transition-colors"
                >
                  沒有帳號？點擊註冊
                </button>
                <br />
                <button
                  type="button"
                  onClick={() => setMode('reset')}
                  className="text-gray-600 hover:text-gray-800 text-sm transition-colors"
                >
                  忘記密碼？
                </button>
              </>
            )}

            {mode === 'signup' && (
              <button
                type="button"
                onClick={() => setMode('signin')}
                className="text-blue-600 hover:text-blue-800 text-sm transition-colors"
              >
                已有帳號？點擊登錄
              </button>
            )}

            {mode === 'reset' && (
              <button
                type="button"
                onClick={() => setMode('signin')}
                className="text-blue-600 hover:text-blue-800 text-sm transition-colors"
              >
                返回登錄
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}