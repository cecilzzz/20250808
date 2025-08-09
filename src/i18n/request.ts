/**
 * i18n 配置 - 國際化設定
 *
 * 🎯 這個模組的工作：
 * 配置 next-intl 的語言設定和預設行為
 *
 * 🚫 這個模組不做什麼：
 * - 不處理具體的翻譯內容（由翻譯文件處理）
 * - 不處理組件層面的語言切換邏輯
 *
 * ✅ 只負責：
 * - 定義支援的語言列表
 * - 設定預設語言
 * - 配置語言檢測邏輯
 * - 提供翻譯訊息載入器
 *
 * 💡 比喻：就像是「語言設定中心」，管理整個應用的多語言基礎配置
 */

import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

// 🌍 【支援語言】定義應用支援的所有語言
export const locales = ['zh-TW', 'en'] as const;

// 🏠 【預設語言】當無法檢測到用戶語言偏好時使用
export const defaultLocale = 'zh-TW' as const;

// 🔧 【類型定義】支援的語言類型
export type Locale = (typeof locales)[number];

// ⚙️【next-intl 配置】載入翻譯訊息的配置函數
export default getRequestConfig(async ({ locale }) => {
  // 🚦 【語言驗證】確保請求的語言在支援列表中
  if (!locales.includes(locale as any)) {
    notFound();
  }

  return {
    // 📦 【動態載入】根據當前語言載入對應的翻譯文件
    messages: (await import(`@/../messages/${locale}.json`)).default
  };
});