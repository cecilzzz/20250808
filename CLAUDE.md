# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

這是一個 Labubu 收藏品管理系統，讓用戶可以瀏覽、搜尋和收藏各種 Labubu 產品。使用 Next.js 15 + React 19 + TypeScript，採用混合架構設計。

## Architecture

### 混合數據架構
- **產品數據**: 分系列存儲在 `src/data/products/` 目錄中，每個系列一個 JSON 文件
- **數據索引**: `src/data/products/_index.json` 管理所有系列的元數據
- **數據加載**: 使用 `src/data/productLoader.ts` 統一加載所有系列數據
- **用戶認證**: Supabase Auth
- **收藏數據**: Supabase Database (雲端同步)

### 核心目錄結構
```
src/
├── app/                 # Next.js App Router 頁面和 API routes
├── components/          # React 組件 (ProductCard, SearchFilters 等)
├── contexts/           # React Context (AuthContext)
├── data/              # 產品數據和管理工具
│   ├── schema/        # TypeScript 類型定義
│   └── tools/         # 數據管理工具類
├── lib/               # 核心工具庫 (Supabase, localStorage)
├── services/          # 業務邏輯服務層
└── types/             # TypeScript 類型定義
```

## Common Development Commands

```bash
# 開發服務器
pnpm dev                    # localhost:3000
pnpm dev:alt               # 0.0.0.0:4000 (外部訪問)
pnpm dev:debug             # localhost:8080

# 建構和部署
pnpm build
pnpm start

# 代碼品質
pnpm lint

# 數據管理 (自定義腳本)
pnpm data:analyze          # 分析產品數據
pnpm data:split           # 分割大型數據文件
pnpm data:add-field       # 添加新字段
pnpm data:rename-field    # 重命名字段
pnpm data:remove-field    # 移除字段
```

## Data Management System

這個項目使用分系列的數據管理架構：

### 數據組織結構
- **分系列存儲**: 每個系列的產品存在獨立的JSON文件中 (`src/data/products/`)
- **索引管理**: `_index.json` 記錄所有系列的元數據和統計信息
- **統一加載**: `ProductLoader` 類負責動態加載和合併所有系列數據
- **管理工具**: `scripts/data-management.ts` 提供完整的命令行數據管理功能

### 產品數據結構 
- 遵循 `src/data/schema/product-schema.ts` 中定義的 `Product` interface
- 包含完整的字段元數據和驗證規則
- 支持系列配置和稀有度分級

### 關鍵字段
```typescript
interface Product {
  id: string              // 格式：labubu-PPMT-YYMM-NNNN
  name: string           // 中文名稱
  nameEn: string        // 英文名稱  
  series: string        // 所屬系列
  rarityLevel: 'normal' | 'rare' | 'sp' | 'hidden'
  currentPrice: number  // 當前價格
  originalPrice: number // 原價
  imageUrl: string      // 產品圖片
  // ... 更多字段見 schema 文件
}
```

## Supabase Setup

使用 `SUPABASE_SETUP.md` 中的詳細指南設置：
1. 創建 Supabase 項目
2. 配置 `.env.local` 環境變量
3. 執行 `supabase-schema.sql` 創建數據表
4. 配置認證設置

## Development Notes

### 代碼風格
- 所有文件使用繁體中文注釋
- 遵循表情符號注釋規範 (🎯 功能、🚫 不做什麼、✅ 職責等)
- 組件採用 feature-first 組織方式

### 圖片處理
- **本地圖片**: 按系列分類存儲在 `public/images/series/` 中
- **舊版圖片**: 部分產品圖片在 `public/images/products/` (逐步遷移中)
- **外部圖片**: 通過 `next.config.ts` 中的 `remotePatterns` 配置支持多個圖片來源
- **路徑格式**: 本地圖片使用 `/images/series/{系列名}/{產品圖片.jpg}` 格式

### 重要開發資訊

#### 數據加載器使用
```typescript
import { ProductLoader } from '@/data/productLoader'

// 載入所有產品數據
const products = await ProductLoader.loadAllProducts()

// 獲取系列統計
const stats = await ProductLoader.getSeriesStats()

// 開發時重置緩存
ProductLoader.resetCache()
```

### API Routes
- `/api/products` - 產品相關 API
- `/api/products/[id]` - 單個產品詳情 API
- `/api/products/series` - 產品系列列表 API
- `/api/products/price-range` - 價格範圍 API
- `/api/users/collections` - 用戶收藏 API
- 支持篩選、搜尋、價格範圍查詢

你是一個資深連續創業者，對通過網頁運作的小生意有非常深厚的經驗，擅長快速捕捉市場需求，尤其擅長找到合理或低成本的方法來滿足需求變現獲利。
