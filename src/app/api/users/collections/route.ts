/**
 * 用戶收藏 API - 處理用戶收藏管理請求
 *
 * 🎯 這個 API 的工作：
 * 處理用戶收藏的查詢、添加、修改和刪除操作
 *
 * 🚫 這個 API 不做什麼：
 * - 不處理產品信息修改（只處理收藏關係）
 * - 不處理其他用戶的收藏（僅限當前用戶）
 * - 不提供收藏排行榜（由專門的API處理）
 *
 * ✅ 只負責：
 * - 獲取用戶收藏列表和統計
 * - 更新用戶收藏狀態
 * - 處理用戶認證檢查
 * - 返回標準化響應
 *
 * 💡 比喻：就像是「私人收藏管家」，專門管理用戶的收藏清單
 */

import { NextRequest, NextResponse } from 'next/server'
import { CollectionService } from '@/services/collectionService'
import type { CollectionUpdateRequest } from '@/types/database'

// 🔍 【獲取用戶收藏】處理GET請求 - 獲取用戶的收藏列表和統計
export async function GET(request: NextRequest) {
  try {
    // 🔄 【調用服務】獲取用戶收藏數據
    const result = await CollectionService.getUserCollections()

    // ✅ 【成功響應】返回收藏列表和統計信息
    return NextResponse.json({
      success: true,
      data: result,
      message: `成功獲取收藏列表 (擁有: ${result.stats.ownedCount}, 想要: ${result.stats.wantedCount})`
    })

  } catch (error) {
    // ❌ 【錯誤處理】記錄錯誤並返回響應
    console.error('🚨 獲取收藏列表API錯誤:', error)
    
    const errorMessage = error instanceof Error ? error.message : '獲取收藏列表失敗'
    
    // 🚦 【401處理】用戶未登錄
    if (errorMessage.includes('登錄')) {
      return NextResponse.json({
        success: false,
        error: errorMessage,
        data: null
      }, { 
        status: 401 
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

// 💖 【更新收藏狀態】處理POST請求 - 添加、修改或刪除收藏
export async function POST(request: NextRequest) {
  try {
    // 🔍 【解析請求體】獲取收藏更新參數
    const body: CollectionUpdateRequest = await request.json()
    
    // 🔄 【參數驗證】檢查必要字段
    if (!body.productId || !body.status) {
      return NextResponse.json({
        success: false,
        error: '請提供產品ID和收藏狀態',
        data: null
      }, { 
        status: 400 
      })
    }

    // 🚦 【狀態驗證】檢查狀態值是否有效
    if (!['owned', 'wanted', 'none'].includes(body.status)) {
      return NextResponse.json({
        success: false,
        error: '無效的收藏狀態，只能是 owned、wanted 或 none',
        data: null
      }, { 
        status: 400 
      })
    }

    // 🔄 【UUID格式檢查】確保產品ID格式正確
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(body.productId)) {
      return NextResponse.json({
        success: false,
        error: '產品ID格式不正確',
        data: null
      }, { 
        status: 400 
      })
    }

    // 🔄 【調用服務】更新收藏狀態
    await CollectionService.updateCollection(body)

    // ✅ 【成功響應】返回操作結果
    const actionMessage = body.status === 'none' ? '移除收藏' : 
                         body.status === 'owned' ? '標記為擁有' : '加入願望清單'

    return NextResponse.json({
      success: true,
      data: { productId: body.productId, status: body.status },
      message: `成功${actionMessage}`
    })

  } catch (error) {
    // ❌ 【錯誤處理】記錄錯誤並返回響應
    console.error('🚨 更新收藏API錯誤:', error)
    
    const errorMessage = error instanceof Error ? error.message : '更新收藏狀態失敗'
    
    // 🚦 【401處理】用戶未登錄
    if (errorMessage.includes('登錄')) {
      return NextResponse.json({
        success: false,
        error: errorMessage,
        data: null
      }, { 
        status: 401 
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

// 🔧 【支持的HTTP方法】支持GET和POST請求
export const dynamic = 'force-dynamic' // 確保數據實時性