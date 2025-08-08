/**
 * 產品詳情 API - 處理單個產品的詳細信息請求
 *
 * 🎯 這個 API 的工作：
 * 根據產品ID獲取完整的產品信息和相關推薦
 *
 * 🚫 這個 API 不做什麼：
 * - 不處理產品的修改操作（只讀API）
 * - 不處理用戶收藏狀態（由收藏API處理）
 * - 不處理批量查詢（每次只處理一個產品）
 *
 * ✅ 只負責：
 * - 驗證產品ID格式
 * - 獲取產品詳細信息
 * - 獲取相關產品推薦
 * - 處理產品不存在的情況
 *
 * 💡 比喻：就像是「產品介紹員」，專門為顧客詳細介紹特定產品
 */

import { NextRequest, NextResponse } from 'next/server'
import { ProductService } from '@/services/productService'

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    // 🔍 【參數驗證】檢查產品ID是否有效
    const { id } = await params
    
    if (!id || typeof id !== 'string') {
      return NextResponse.json({
        success: false,
        error: '無效的產品ID',
        data: null
      }, { 
        status: 400 
      })
    }

    // 🔄 【ID格式檢查】確保ID格式合理（允許字母、數字、連字符）
    const idRegex = /^[a-zA-Z0-9-_]+$/
    if (!idRegex.test(id) || id.length > 50) {
      return NextResponse.json({
        success: false,
        error: '產品ID格式不正確',
        data: null
      }, { 
        status: 400 
      })
    }

    // 🔍 【獲取產品數據】調用服務獲取產品詳情和相關推薦
    const result = await ProductService.getProductById(id)

    // ✅ 【成功響應】返回產品詳情和相關產品
    return NextResponse.json({
      success: true,
      data: result,
      message: `成功獲取產品 "${result.product.name}" 的詳細信息`
    })

  } catch (error) {
    // ❌ 【錯誤處理】區分不同類型的錯誤
    console.error('🚨 產品詳情API錯誤:', error)
    
    const errorMessage = error instanceof Error ? error.message : '獲取產品詳情失敗'
    
    // 🚦 【404處理】產品不存在的情況
    if (errorMessage.includes('找不到') || errorMessage.includes('not found')) {
      return NextResponse.json({
        success: false,
        error: '找不到指定的產品',
        data: null
      }, { 
        status: 404 
      })
    }
    
    // 🚦 【500處理】其他服務器錯誤
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