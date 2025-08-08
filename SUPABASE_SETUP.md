# 🗄️ Supabase 設置指南

## 📋 前置準備

1. **註冊Supabase帳號**
   - 前往 https://supabase.com
   - 使用GitHub或Email註冊

2. **創建新專案**
   - 點擊 "New Project"
   - 選擇組織 (或創建新組織)
   - 輸入專案名稱：`labubu-collection`
   - 選擇資料庫密碼 (請記住！)
   - 選擇地區：建議選擇離你最近的地區

## ⚙️ 配置步驟

### 1. 獲取API密鑰

專案創建完成後：
1. 進入專案Dashboard
2. 點擊左側的 "Settings" → "API"
3. 複製以下兩個值：
   - `Project URL`
   - `anon/public` key

### 2. 更新環境變量

將你的API密鑰填入 `.env.local` 文件：

```bash
# 替換為你的實際值
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. 創建資料庫表

1. 在Supabase Dashboard中，點擊左側的 "SQL Editor"
2. 點擊 "New Query"
3. 複製 `supabase-schema.sql` 文件中的所有內容
4. 貼上到SQL編輯器中
5. 點擊 "Run" 執行

### 4. 配置認證設置

1. 點擊左側的 "Authentication" → "Settings"
2. 在 "Site URL" 中填入：`http://localhost:3000`
3. 在 "Redirect URLs" 中添加：`http://localhost:3000`
4. 確保 "Enable email confirmations" 關閉（開發階段）

## ✅ 驗證設置

設置完成後，啟動開發服務器：

```bash
pnpm run dev
```

如果一切正常，你應該能夠：
1. ✅ 註冊新帳號
2. ✅ 登錄/登出
3. ✅ 收藏產品（數據保存到雲端）
4. ✅ 跨設備同步收藏

## 🚨 常見問題

### 1. "Invalid API key" 錯誤
- 檢查 `.env.local` 文件中的API密鑰是否正確
- 確保重啟了開發服務器

### 2. "Table doesn't exist" 錯誤
- 確保已執行 `supabase-schema.sql` 中的SQL語句
- 檢查Supabase Dashboard中是否已創建 `user_collections` 表

### 3. 認證問題
- 檢查Authentication設置中的URL配置
- 確保Site URL設置為 `http://localhost:3000`

### 4. RLS (Row Level Security) 錯誤
- 資料庫架構已包含適當的安全策略
- 確保已執行完整的SQL文件

## 📊 數據查看

你可以在Supabase Dashboard中查看數據：
1. 點擊左側的 "Table Editor"
2. 選擇 `user_collections` 表
3. 查看用戶的收藏記錄

## 🎯 混合架構說明

我們使用的是混合架構：
- **產品數據**: 存儲在 `src/data/products.json` (方便你更新)
- **用戶認證**: 使用 Supabase Auth
- **收藏數據**: 存儲在 Supabase 資料庫 (雲端同步)

這樣既保持了產品數據更新的簡單性，又提供了用戶數據的雲端同步功能。