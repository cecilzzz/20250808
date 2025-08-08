/**
 * 收藏狀態查詢 API - 獲取單個產品的收藏狀態
 *
 * 🎯 這個 API 的工作：
 * 查詢用戶對特定產品的收藏狀態
 *
 * 🚫 這個 API 不做什麼：
 * - 不修改收藏狀態（由收藏管理API處理）
 * - 不批量查詢多個產品（保持簡單）
 * - 不返回完整的產品信息（只返回狀態）
 *
 * ✅ 只負責：
 * - 驗證用戶身份
 * - 查詢特定產品的收藏狀態
 * - 返回標準化響應
 * - 處理未登錄用戶情況
 *
 * 💡 比喻：就像是「收藏狀態查詢員」，快速告訴你某個商品是否已收藏
 */

import { NextRequest, NextResponse } from 'next/server'
import { CollectionService } from '@/services/collectionService'

export async function GET(request: NextRequest) {
  try {
    // 🔍 【解析查詢參數】獲取產品ID
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')
    
    if (!productId) {
      return NextResponse.json({
        success: false,
        error: '請提供產品ID',
        data: null
      }, { 
        status: 400 
      })
    }

    // 🔄 【UUID格式檢查】確保產品ID格式正確
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(productId)) {
      return NextResponse.json({
        success: false,
        error: '產品ID格式不正確',
        data: null
      }, { 
        status: 400 
      })
    }

    // 🔄 【調用服務】獲取收藏狀態
    const status = await CollectionService.getCollectionStatus(productId)

    // ✅ 【成功響應】返回收藏狀態
    return NextResponse.json({
      success: true,
      data: {
        productId,
        status
      },
      message: `產品收藏狀態: ${status === 'owned' ? '已擁有' : status === 'wanted' ? '想要' : '未收藏'}`
    })

  } catch (error) {
    // ❌ 【錯誤處理】記錄錯誤並返回響應
    console.error('🚨 獲取收藏狀態API錯誤:', error)
    
    const errorMessage = error instanceof Error ? error.message : '獲取收藏狀態失敗'
    
    return NextResponse.json({
      success: false,
      error: errorMessage,
      data: null
    }, { 
      status: 500 
    })
  }
}

// 🔧 【支持的HTTP方法】只支持GET請求
export const dynamic = 'force-dynamic' // 確保數據實時性