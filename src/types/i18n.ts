/**
 * i18n 類型定義 - 國際化相關類型
 *
 * 🎯 這個模組的工作：
 * 提供多語言功能相關的 TypeScript 類型定義
 *
 * 🚫 這個模組不做什麼：
 * - 不包含具體的翻譯邏輯
 * - 不處理語言切換的業務邏輯
 *
 * ✅ 只負責：
 * - 定義語言相關的類型
 * - 提供翻譯 key 的類型安全
 * - 定義語言偏好設定類型
 *
 * 💡 比喻：就像是「多語言類型規範書」，確保所有語言相關代碼的類型安全
 */

// 🔧 【基礎類型】從 i18n 配置導入支援的語言類型
import type { Locale } from '../i18n/request';

// 🌍 【語言偏好】用戶的語言偏好設定
export interface LanguagePreference {
  locale: Locale;
  autoDetect: boolean; // 是否自動檢測瀏覽器語言
}

// 📱 【語言資訊】單個語言的完整資訊
export interface LanguageInfo {
  code: Locale;
  name: string;        // 語言顯示名稱（本地化）
  nativeName: string;  // 語言原生名稱
  flag: string;        // 國旗 emoji 或圖示
  isRTL?: boolean;     // 是否為從右到左的文字方向
}

// 🔄 【語言切換】語言切換相關的回調函數類型
export interface LanguageSwitcher {
  currentLocale: Locale;
  availableLocales: Locale[];
  switchLanguage: (locale: Locale) => void;
  isLoading?: boolean;
}

// 📝 【翻譯 key】用於類型安全的翻譯鍵值
export type TranslationKeys = 
  | 'ui.loading'
  | 'ui.search' 
  | 'ui.filter'
  | 'ui.reset'
  | 'ui.showMore'
  | 'ui.showLess'
  | 'rarity.normal'
  | 'rarity.rare'
  | 'rarity.super_rare'
  | 'rarity.hidden'
  | 'rarity.sp'
  | 'releaseStatus.active'
  | 'releaseStatus.discontinued'
  | 'releaseStatus.preorder'
  | 'releaseStatus.limited'
  | 'product.price'
  | 'product.currentPrice'
  | 'product.originalPrice'
  | 'product.appearanceRate'
  | 'product.mainColor'
  | 'product.series'
  | 'product.addToCollection'
  | 'product.removeFromCollection'
  | 'product.viewDetails'
  | 'collection.title'
  | 'collection.owned'
  | 'collection.wanted'
  | 'collection.empty'
  | 'collection.startCollecting'
  | 'navigation.home'
  | 'navigation.products'
  | 'navigation.collections'
  | 'navigation.login'
  | 'navigation.logout'
  | 'navigation.profile';

// 📦 【翻譯命名空間】用於組織翻譯內容的命名空間
export type TranslationNamespace = 
  | 'ui'
  | 'rarity'
  | 'releaseStatus'
  | 'product'
  | 'collection'
  | 'navigation';

// 🎛️【翻譯選項】翻譯函數的可選參數
export interface TranslationOptions {
  defaultValue?: string;
  interpolation?: Record<string, string | number>;
  count?: number;
}