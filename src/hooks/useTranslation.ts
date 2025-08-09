/**
 * useTranslation Hook - 簡化版翻譯功能
 *
 * 🎯 這個 Hook 的工作：
 * 提供不依賴 next-intl 的翻譯功能
 *
 * ✅ 只負責：
 * - 提供簡化的翻譯函數
 * - 提供語言相關的工具函數
 * - 直接使用靜態翻譯文件
 *
 * 💡 比喻：就像是「簡化翻譯助手」，繞過複雜的 Provider 系統
 */

'use client'

// 直接導出簡化版本
export { useSimpleTranslation as useTranslation } from './useSimpleTranslation'