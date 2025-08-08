/**
 * ProductSchema - 產品數據結構定義
 *
 * 🎯 這個模塊的工作：
 * 定義所有產品的統一數據結構和類型
 *
 * 🚫 這個模塊不做什麼：
 * - 不處理具體的產品數據（由數據文件處理）
 * - 不處理數據驗證邏輯（由驗證器處理）
 *
 * ✅ 只負責：
 * - 定義產品接口類型
 * - 提供字段元數據信息
 * - 管理數據結構版本控制
 *
 * 💡 比喻：就像是「產品規格書」，定義每個產品必須具備的屬性
 */

// 🔧 【核心類型】產品稀有度等級
export type RarityLevel = 'normal' | 'rare' | 'sp' | 'hidden'

// 🔧 【核心類型】產品發售狀態
export type ReleaseStatus = 'active' | 'limited' | 'preorder' | 'discontinued'

// 🎯 【主要接口】產品數據結構
export interface Product {
  // 📝 【基本信息】
  id: string                    // 產品唯一標識符
  name: string                  // 中文名稱
  nameEn: string               // 英文名稱
  series: string               // 所屬系列
  
  // 🎨 【分類信息】
  rarityLevel: RarityLevel     // 稀有度等級
  mainColor: string            // 主要顏色 (HEX格式)
  
  // 💰 【價格信息】
  currentPrice: number         // 當前市場價格
  originalPrice: number        // 原始售價
  
  // 🖼️【展示信息】
  imageUrl: string             // 產品圖片URL
  
  // 📅 【發售信息】
  releaseStatus: ReleaseStatus // 發售狀態
  releaseDate: string          // 發售日期 (ISO 8601)
  appearanceRate: string       // 出現機率描述
  
  // ⏰ 【時間戳】
  createdAt: string            // 創建時間 (ISO 8601)
  updatedAt: string            // 更新時間 (ISO 8601)
}

// 📊 【字段元數據】用於數據管理工具
export interface FieldMetadata {
  name: string
  type: 'string' | 'number' | 'boolean' | 'enum'
  required: boolean
  defaultValue?: any
  enumValues?: string[]
  description: string
}

// 🔄 【Schema版本控制】
export const SCHEMA_VERSION = '1.0.0'

// 🎛️ 【字段配置】所有字段的元數據
export const PRODUCT_FIELDS: FieldMetadata[] = [
  {
    name: 'id',
    type: 'string',
    required: true,
    description: '產品唯一標識符，格式：labubu-PPMT-YYMM-NNNN'
  },
  {
    name: 'name',
    type: 'string',
    required: true,
    description: '產品中文名稱'
  },
  {
    name: 'nameEn',
    type: 'string',
    required: true,
    description: '產品英文名稱'
  },
  {
    name: 'series',
    type: 'string',
    required: true,
    description: '產品所屬系列名稱'
  },
  {
    name: 'rarityLevel',
    type: 'enum',
    required: true,
    enumValues: ['normal', 'rare', 'sp', 'hidden'],
    defaultValue: 'normal',
    description: '產品稀有度等級'
  },
  {
    name: 'currentPrice',
    type: 'number',
    required: true,
    description: '當前市場價格（新台幣）'
  },
  {
    name: 'originalPrice',
    type: 'number',
    required: true,
    description: '原始售價（新台幣）'
  },
  {
    name: 'mainColor',
    type: 'string',
    required: true,
    description: '主要顏色，HEX格式 (#RRGGBB)'
  },
  {
    name: 'imageUrl',
    type: 'string',
    required: true,
    description: '產品圖片URL'
  },
  {
    name: 'releaseStatus',
    type: 'enum',
    required: true,
    enumValues: ['active', 'limited', 'preorder', 'discontinued'],
    defaultValue: 'active',
    description: '產品發售狀態'
  },
  {
    name: 'releaseDate',
    type: 'string',
    required: true,
    description: '發售日期，ISO 8601格式'
  },
  {
    name: 'appearanceRate',
    type: 'string',
    required: true,
    description: '出現機率描述（如：1/6, 1/72, single等）'
  },
  {
    name: 'createdAt',
    type: 'string',
    required: true,
    description: '數據創建時間，ISO 8601格式'
  },
  {
    name: 'updatedAt',
    type: 'string',
    required: true,
    description: '數據更新時間，ISO 8601格式'
  }
]

// 🏷️ 【系列配置】系列元數據
export interface SeriesConfig {
  key: string                  // 文件名（無擴展名）
  name: string                 // 顯示名稱
  nameEn: string              // 英文名稱
  description: string          // 系列描述
  releaseYear: number          // 發售年份
  isActive: boolean           // 是否仍在發售
  estimatedCount: number       // 預估產品數量
}

// 📦 【系列列表】所有已知系列
export const SERIES_CONFIG: SeriesConfig[] = [
  {
    key: 'exciting-macaron',
    name: '心動馬卡龍系列',
    nameEn: 'Exciting Macaron Series',
    description: '以馬卡龍色彩為主題的可愛系列',
    releaseYear: 2023,
    isActive: true,
    estimatedCount: 7
  },
  {
    key: 'have-a-seat',
    name: '坐坐派對系列',
    nameEn: 'Have a Seat Series',
    description: '坐姿造型的趣味系列',
    releaseYear: 2024,
    isActive: true,
    estimatedCount: 7
  },
  {
    key: 'big-into-energy',
    name: '大動力系列',
    nameEn: 'Big into Energy Series',
    description: '充滿能量和正能量的系列',
    releaseYear: 2024,
    isActive: true,
    estimatedCount: 6
  },
  {
    key: 'coca-cola',
    name: 'Coca-Cola聯名系列',
    nameEn: 'Coca-Cola Series',
    description: '與可口可樂合作的限定系列',
    releaseYear: 2024,
    isActive: false,
    estimatedCount: 12
  },
  {
    key: 'original-classic',
    name: '經典原始款系列',
    nameEn: 'Original Classic Series',
    description: 'Labubu的經典原始設計',
    releaseYear: 2019,
    isActive: true,
    estimatedCount: 8
  },
  {
    key: 'fall-in-wild',
    name: '野外探險系列',
    nameEn: 'Fall in Wild Series',
    description: '野外冒險主題系列',
    releaseYear: 2024,
    isActive: true,
    estimatedCount: 2
  },
  {
    key: 'artistic-quest',
    name: '盧浮宮藝術探索系列',
    nameEn: 'Artistic Quest Series',
    description: '與盧浮宮合作的藝術主題限定系列',
    releaseYear: 2024,
    isActive: false,
    estimatedCount: 1
  }
]