/**
 * 產品列表 API - 處理產品查詢請求
 *
 * 🎯 這個 API 的工作：
 * 處理產品列表的獲取、搜索、篩選和分頁請求
 *
 * 🚫 這個 API 不做什麼：
 * - 不處理產品的新增、修改、刪除（只讀API）
 * - 不處理用戶認證（產品信息公開可見）
 * - 不處理收藏狀態（由收藏API處理）
 *
 * ✅ 只負責：
 * - 解析查詢參數
 * - 調用產品服務獲取數據
 * - 返回標準化的響應格式
 * - 處理錯誤情況
 *
 * 💡 比喻：就像是「產品展示櫃的服務員」，根據顧客的要求展示產品
 */

import { NextRequest, NextResponse } from 'next/server'
import { ProductService } from '@/services/productService'
import type { ProductListRequest, RarityLevel } from '@/types/database'

export async function GET(request: NextRequest) {
  try {
    // 🔍 【解析查詢參數】從URL中提取搜索和篩選條件
    const { searchParams } = new URL(request.url)
    
    // 📄 【分頁參數】
    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50) // 限制最大50條
    
    // 🔍 【搜索參數】
    const search = searchParams.get('search') || ''
    
    // 🎨 【稀有度篩選】處理多選稀有度參數
    const rarityParam = searchParams.get('rarity')
    const rarity = rarityParam ? rarityParam.split(',') as RarityLevel[] : []
    
    // 📚 【系列篩選】處理多選系列參數
    const seriesParam = searchParams.get('series')
    const series = seriesParam ? seriesParam.split(',') : []
    
    // 💰 【價格篩選】處理價格區間參數
    const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined
    const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined
    
    // 📊 【排序參數】
    const sortBy = (searchParams.get('sortBy') as 'name' | 'price' | 'rarity' | 'release_date') || 'name'
    const sortOrder = (searchParams.get('sortOrder') as 'asc' | 'desc') || 'asc'

    // 🔄 【構建請求對象】
    const requestParams: ProductListRequest = {
      page,
      limit,
      search: search.trim(),
      rarity: rarity.length > 0 ? rarity : undefined,
      series: series.length > 0 ? series : undefined,
      minPrice,
      maxPrice,
      sortBy,
      sortOrder
    }

    // 🔍 【調用服務】獲取產品數據
    const result = await ProductService.getProducts(requestParams)

    // ✅ 【成功響應】返回產品列表和分頁信息
    return NextResponse.json({
      success: true,
      data: result,
      message: `成功獲取 ${result.products.length} 個產品`
    })

  } catch (error) {
    // ❌ 【錯誤處理】記錄錯誤並返回標準錯誤響應
    console.error('🚨 產品列表API錯誤:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '獲取產品列表失敗',
      data: null
    }, { 
      status: 500 
    })
  }
}

// 🔧 【支持的HTTP方法】只支持GET請求
export const dynamic = 'force-dynamic' // 確保每次都是最新數據