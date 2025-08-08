# 📦 產品數據添加指南

## 🗂️ 數據存儲位置

產品數據存儲在：`/src/data/products.json`

## 📋 產品數據格式

每個產品必須包含以下字段：

```json
{
  "id": "labubu-013",
  "name": "產品中文名稱",
  "nameEn": "Product English Name",
  "series": "系列名稱",
  "rarityLevel": "normal",
  "currentPrice": 350,
  "originalPrice": 350,
  "mainColor": "#FF6B6B",
  "imageUrl": "https://example.com/image.jpg",
  "releaseStatus": "active",
  "releaseDate": "2024-08-08",
  "appearanceRate": "1/12",
  "createdAt": "2024-08-08T00:00:00Z",
  "updatedAt": "2024-08-08T00:00:00Z"
}
```

## 🔧 字段說明

| 字段 | 類型 | 必填 | 說明 | 範例 |
|------|------|------|------|------|
| `id` | string | ✅ | **唯一標識符**，格式：`labubu-數字` | `"labubu-013"` |
| `name` | string | ✅ | **中文產品名稱** | `"Labubu 夢幻獨角獸"` |
| `nameEn` | string | ⭕ | **英文產品名稱** | `"Dream Unicorn Labubu"` |
| `series` | string | ✅ | **系列名稱** | `"Fantasy Series"` |
| `rarityLevel` | string | ✅ | **稀有度等級** | `"rare"` |
| `currentPrice` | number | ✅ | **當前售價（台幣）** | `580` |
| `originalPrice` | number | ✅ | **原價（台幣）** | `500` |
| `mainColor` | string | ✅ | **主色調（HEX色碼）** | `"#FFB6C1"` |
| `imageUrl` | string | ✅ | **產品圖片URL** | 圖片鏈接 |
| `releaseStatus` | string | ✅ | **發售狀態** | `"active"` |
| `releaseDate` | string | ✅ | **發售日期（YYYY-MM-DD）** | `"2024-08-08"` |
| `appearanceRate` | string | ⭕ | **出現率** | `"1/24"` |
| `createdAt` | string | ✅ | **創建時間（ISO格式）** | `"2024-08-08T00:00:00Z"` |
| `updatedAt` | string | ✅ | **更新時間（ISO格式）** | `"2024-08-08T00:00:00Z"` |

## 🎨 字段值規範

### `rarityLevel` (稀有度)
```
"normal"     - 普通
"rare"       - 稀有  
"super_rare" - 超稀有
"hidden"     - 隱藏
"sp"         - SP限定
```

### `releaseStatus` (發售狀態)
```
"active"        - 正常販售
"discontinued"  - 停產
"preorder"      - 預購
"limited"       - 限量
```

### `mainColor` (主色調)
- 必須使用HEX色碼格式：`#RRGGBB`
- 範例：`#FF6B6B`、`#4ECDC4`、`#45B7D1`

### `imageUrl` (圖片鏈接)
- 建議使用 Unsplash 或其他免費圖庫
- 格式：`https://images.unsplash.com/photo-xxxx?w=400&h=400&fit=crop&crop=center`
- 建議尺寸：400x400 像素，正方形

## 📝 添加新產品步驟

### 1. 打開數據文件
```bash
vi /src/data/products.json
```

### 2. 找到最後一個產品對象

### 3. 添加逗號，然後插入新產品

### 4. 使用以下模板：

```json
{
  "id": "labubu-XXX",
  "name": "你的產品名稱",
  "nameEn": "Your Product Name",
  "series": "系列名稱",
  "rarityLevel": "選擇稀有度",
  "currentPrice": 價格數字,
  "originalPrice": 原價數字,
  "mainColor": "#顏色代碼",
  "imageUrl": "圖片鏈接",
  "releaseStatus": "active",
  "releaseDate": "YYYY-MM-DD",
  "appearanceRate": "1/12",
  "createdAt": "YYYY-MM-DDTHH:MM:SSZ",
  "updatedAt": "YYYY-MM-DDTHH:MM:SSZ"
}
```

### 5. 保存文件並重啟開發服務器

```bash
# 重啟服務器
pnpm run dev
```

## ✅ 數據驗證清單

添加新產品前請檢查：

- [ ] `id` 是唯一的，沒有重複
- [ ] `id` 格式正確：`labubu-數字`
- [ ] 價格是正整數
- [ ] `rarityLevel` 是有效值之一
- [ ] `releaseStatus` 是有效值之一  
- [ ] `mainColor` 是有效的HEX色碼
- [ ] `releaseDate` 格式正確：`YYYY-MM-DD`
- [ ] `imageUrl` 是有效的圖片鏈接
- [ ] JSON 語法正確（逗號、括號、引號）

## 🚀 自動化工具（未來增強）

可考慮建立簡單的腳本來：
1. 驗證數據格式
2. 自動生成ID
3. 批量添加產品
4. 圖片上傳到CDN

## 📊 數據備份建議

定期備份 `products.json` 文件：
- 使用版本控制（Git）追蹤變更
- 定期匯出到其他格式（CSV、Excel）
- 考慮將數據同步到雲端存儲

---

**需要幫助？** 如果添加數據時遇到問題，可以查看現有產品的格式作為參考，或請求技術支援。