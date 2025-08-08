# 🎯 Labubu產品數據管理系統

這是一個專為Labubu產品數據設計的管理系統，提供了靈活的數據結構管理和批量操作功能。

## 📁 目錄結構

```
src/data/
├── products/                    # 產品數據文件（按系列分類）
│   ├── exciting-macaron.json   # 心動馬卡龍系列 (7個產品)
│   ├── coca-cola.json          # Coca-Cola聯名系列 (12個產品)
│   ├── have-a-seat.json        # 坐坐派對系列 (7個產品)
│   ├── _index.json             # 系列索引文件
│   └── ...                     # 其他15個系列文件
├── schema/
│   └── product-schema.ts       # 產品數據結構定義
├── tools/
│   ├── field-manager.ts        # 字段批量管理工具
│   └── data-splitter.ts        # 數據分割工具
├── backups/                    # 自動備份文件
└── README.md                   # 本說明文件
```

## 🚀 快速開始

### 1. 查看可用命令
```bash
pnpm run data:examples
```

### 2. 分析現有數據
```bash
pnpm run data:analyze
```

### 3. 預覽數據分割（如果還未分割）
```bash
pnpm run data:split:preview
```

## 🔧 常用操作

### 字段管理

#### 添加新字段
```bash
# 為所有產品添加布爾型字段
pnpm run data:add-field --name "limited_edition" --value false --type boolean

# 為所有產品添加字符串字段
pnpm run data:add-field --name "collection_year" --value "2024" --type string

# 為所有產品添加數字字段
pnpm run data:add-field --name "weight_grams" --value 50 --type number
```

#### 重命名字段
```bash
# 將所有產品中的字段重命名
pnpm run data:rename-field --old "currentPrice" --new "price_current"
```

#### 批量更新字段值
```bash
# 使用JavaScript表達式更新字段
pnpm run data:update-field --name "updatedAt" --function "new Date().toISOString()"

# 基於其他字段計算新值
pnpm run data:update-field --name "priceIncrease" --function "product.currentPrice - product.originalPrice"
```

#### 刪除字段
```bash
# ⚠️ 危險操作：刪除所有產品中的字段
pnpm run data:remove-field --name "deprecated_field"
```

### 數據分析
```bash
# 分析所有產品的字段使用情況
pnpm run data:analyze
```

## 📊 數據結構

每個產品包含以下標準字段：

```typescript
interface Product {
  id: string                    // 產品唯一標識符
  name: string                  // 中文名稱
  nameEn: string               // 英文名稱
  series: string               // 所屬系列
  rarityLevel: RarityLevel     // 稀有度等級
  currentPrice: number         // 當前市場價格
  originalPrice: number        // 原始售價
  mainColor: string            // 主要顏色 (HEX格式)
  imageUrl: string             // 產品圖片URL
  releaseStatus: ReleaseStatus // 發售狀態
  releaseDate: string          // 發售日期 (ISO 8601)
  appearanceRate: string       // 出現機率描述
  createdAt: string            // 創建時間 (ISO 8601)
  updatedAt: string            // 更新時間 (ISO 8601)
}
```

### 枚舉類型

```typescript
// 稀有度等級
type RarityLevel = 'normal' | 'rare' | 'sp' | 'hidden'

// 發售狀態
type ReleaseStatus = 'active' | 'limited' | 'preorder' | 'discontinued'
```

## 🛡️ 安全機制

### 自動備份
- 每次執行字段操作前都會自動創建備份
- 備份文件存儲在 `src/data/backups/` 目錄
- 備份文件名包含時間戳，便於追溯

### 數據驗證
- 所有操作都基於預定義的產品結構
- TypeScript類型檢查確保數據一致性
- 操作前會驗證數據完整性

## 🎨 使用場景

### 場景1：添加新產品屬性
當需要為所有產品添加新屬性時：
```bash
# 例如：添加產品尺寸信息
pnpm run data:add-field --name "dimensions" --value "10x10x15cm" --type string
```

### 場景2：更新產品信息
當需要批量更新產品信息時：
```bash
# 例如：更新所有產品的修改時間
pnpm run data:update-field --name "updatedAt" --function "new Date().toISOString()"
```

### 場景3：數據結構重構
當需要重命名字段時：
```bash
# 例如：統一字段命名風格
pnpm run data:rename-field --old "currentPrice" --new "current_price"
```

### 場景4：新系列發布
當有新產品系列發布時：
1. 直接創建新的JSON文件（如：`new-series.json`）
2. 按照標準格式添加產品數據
3. 系統會自動識別並包含在索引中

## 🔍 故障排除

### 問題：字段操作失敗
**解決方案**：
1. 檢查是否有語法錯誤
2. 確認所有產品文件格式正確
3. 查看備份文件恢復數據

### 問題：無法找到產品文件
**解決方案**：
1. 確認文件路徑正確
2. 檢查文件權限
3. 使用 `pnpm run data:analyze` 分析當前狀態

### 問題：數據不一致
**解決方案**：
1. 使用 `pnpm run data:analyze` 檢查字段覆蓋率
2. 從備份文件恢復
3. 重新執行標準化操作

## 📚 進階使用

### 自定義更新函數
可以使用JavaScript表達式進行複雜的數據更新：

```bash
# 根據稀有度設置價格倍數
pnpm run data:update-field --name "marketValue" --function "product.rarityLevel === 'hidden' ? product.originalPrice * 10 : product.originalPrice * 1.5"

# 根據發售日期計算產品年齡
pnpm run data:update-field --name "ageInDays" --function "Math.floor((new Date() - new Date(product.releaseDate)) / (1000 * 60 * 60 * 24))"
```

### 條件性更新
```bash
# 只更新特定條件的產品
pnpm run data:update-field --name "isVintage" --function "new Date(product.releaseDate) < new Date('2020-01-01')"
```

## ⚠️ 注意事項

1. **備份重要性**：雖然系統會自動備份，但重要操作前建議手動備份
2. **操作不可逆**：某些操作（如刪除字段）無法撤銷，請謹慎使用
3. **數據一致性**：確保所有產品文件都遵循相同的數據結構
4. **性能考量**：大量數據操作可能需要一些時間，請耐心等待

## 🤝 貢獻指南

如需添加新功能或修復問題：

1. 修改相應的工具文件（`src/data/tools/`）
2. 更新類型定義（`src/data/schema/product-schema.ts`）
3. 添加新的npm腳本到`package.json`
4. 更新此README文件

## 📖 相關文檔

- [產品Schema定義](./schema/product-schema.ts)
- [字段管理工具](./tools/field-manager.ts)
- [數據分割工具](./tools/data-splitter.ts)
- [命令行腳本](../../scripts/data-management.ts)