-- 🗄️ Labubu Collection 數據庫架構
-- 混合架構：用戶和收藏數據存儲在Supabase，產品數據保持JSON格式

-- 🔐 【啟用Row Level Security】確保數據安全
-- Supabase會自動處理auth.users表，我們只需要創建業務表

-- 📋 【用戶收藏表】存儲用戶對產品的收藏狀態
CREATE TABLE user_collections (
  -- 🆔 主鍵ID
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- 👤 用戶ID，關聯到auth.users表
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- 📦 產品ID（對應JSON文件中的產品ID）
  product_id TEXT NOT NULL,
  
  -- 💖 收藏狀態：'owned' | 'wanted' | 'none'
  status TEXT NOT NULL CHECK (status IN ('owned', 'wanted')),
  
  -- ⏰ 時間戳
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- 🔑 【唯一約束】每個用戶對每個產品只能有一個收藏記錄
  UNIQUE(user_id, product_id)
);

-- 📊 【創建索引】優化查詢性能
CREATE INDEX idx_user_collections_user_id ON user_collections(user_id);
CREATE INDEX idx_user_collections_product_id ON user_collections(product_id);
CREATE INDEX idx_user_collections_status ON user_collections(status);
CREATE INDEX idx_user_collections_created_at ON user_collections(created_at);

-- 🔐 【Row Level Security 策略】
ALTER TABLE user_collections ENABLE ROW LEVEL SECURITY;

-- ✅ 【用戶只能查看自己的收藏】
CREATE POLICY "用戶只能查看自己的收藏記錄"
ON user_collections FOR SELECT
USING (auth.uid() = user_id);

-- ✅ 【用戶只能創建自己的收藏】
CREATE POLICY "用戶只能創建自己的收藏記錄"
ON user_collections FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- ✅ 【用戶只能更新自己的收藏】
CREATE POLICY "用戶只能更新自己的收藏記錄"
ON user_collections FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- ✅ 【用戶只能删除自己的收藏】
CREATE POLICY "用戶只能刪除自己的收藏記錄"
ON user_collections FOR DELETE
USING (auth.uid() = user_id);

-- 🔄 【自動更新 updated_at 字段的觸發器】
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_collections_updated_at
  BEFORE UPDATE ON user_collections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 📈 【統計視圖】用於快速獲取收藏統計數據
CREATE VIEW user_collection_stats AS
SELECT 
  user_id,
  COUNT(*) FILTER (WHERE status = 'owned') as owned_count,
  COUNT(*) FILTER (WHERE status = 'wanted') as wanted_count,
  COUNT(*) as total_collections
FROM user_collections 
GROUP BY user_id;

-- 🔍 【產品熱門度視圖】統計產品被收藏的次數
CREATE VIEW product_popularity AS
SELECT 
  product_id,
  COUNT(*) FILTER (WHERE status = 'owned') as owned_count,
  COUNT(*) FILTER (WHERE status = 'wanted') as wanted_count,
  COUNT(*) as total_collections,
  -- 計算熱門度評分（擁有權重更高）
  (COUNT(*) FILTER (WHERE status = 'owned') * 2 + 
   COUNT(*) FILTER (WHERE status = 'wanted') * 1) as popularity_score
FROM user_collections 
GROUP BY product_id
ORDER BY popularity_score DESC;

-- ✅ 【測試數據插入】(開發時可用，生產環境請刪除)
-- INSERT INTO user_collections (user_id, product_id, status) VALUES
-- ('00000000-0000-0000-0000-000000000001', 'labubu-001', 'owned'),
-- ('00000000-0000-0000-0000-000000000001', 'labubu-002', 'wanted');