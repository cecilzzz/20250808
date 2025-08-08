/**
 * 產品價格範圍 API - 獲取產品的價格區間信息
 *
 * 🎯 這個 API 的工作：
 * 提供系統中所有產品的最低和最高價格信息
 *
 * 🚫 這個 API 不做什麼：
 * - 不處理產品詳情（只返回價格範圍）
 * - 不處理分頁或篩選（統計全部產品）
 * - 不處理貨幣轉換（使用原始價格數據）
 *
 * ✅ 只負責：
 * - 計算所有產品的最低價格
 * - 計算所有產品的最高價格
 * - 返回價格範圍對象
 * - 處理錯誤情況
 *
 * 💡 比喻：就像是「商店的價格牌指南」，告訴顧客價格的範圍區間
 */

import { NextResponse } from 'next/server'
import { ProductService } from '@/services/productService'

export async function GET() {
  try {
    // 💰 【獲取價格範圍】調用產品服務獲取最低和最高價格
    const priceRange = await ProductService.getPriceRange()

    // ✅ 【成功響應】返回價格範圍信息
    return NextResponse.json({
      success: true,
      data: priceRange,
      message: `價格範圍：$${priceRange.min} - $${priceRange.max}`
    })

  } catch (error) {
    // ❌ 【錯誤處理】記錄錯誤並返回標準錯誤響應
    console.error('🚨 價格範圍API錯誤:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '獲取價格範圍失敗',
      data: { min: 0, max: 1000 } // 提供默認範圍
    }, { 
      status: 500 
    })
  }
}

// 🔧 【支持的HTTP方法】只支持GET請求
export const dynamic = 'force-dynamic' // 確保每次都是最新數據