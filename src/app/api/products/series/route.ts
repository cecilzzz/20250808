/**
 * 產品系列 API - 獲取所有可用系列列表
 *
 * 🎯 這個 API 的工作：
 * 提供系統中所有產品系列的列表供篩選使用
 *
 * 🚫 這個 API 不做什麼：
 * - 不處理產品詳情（只返回系列名稱）
 * - 不處理分頁（一次返回所有系列）
 * - 不處理搜索（系列列表相對固定）
 *
 * ✅ 只負責：
 * - 獲取所有唯一的產品系列名稱
 * - 返回排序後的系列列表
 * - 處理錯誤情況
 *
 * 💡 比喻：就像是「商店的分類標籤櫃」，提供所有可用的產品分類
 */

import { NextResponse } from 'next/server'
import { ProductService } from '@/services/productService'

export async function GET() {
  try {
    // 🔍 【獲取系列列表】調用產品服務獲取所有系列
    const series = await ProductService.getSeries()

    // ✅ 【成功響應】返回系列列表
    return NextResponse.json({
      success: true,
      data: series,
      message: `成功獲取 ${series.length} 個產品系列`
    })

  } catch (error) {
    // ❌ 【錯誤處理】記錄錯誤並返回標準錯誤響應
    console.error('🚨 產品系列API錯誤:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '獲取產品系列失敗',
      data: null
    }, { 
      status: 500 
    })
  }
}

// 🔧 【支持的HTTP方法】只支持GET請求
export const dynamic = 'force-dynamic' // 確保每次都是最新數據