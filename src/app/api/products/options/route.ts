/**
 * 產品篩選選項 API - 提供搜索篩選所需的選項數據
 *
 * 🎯 這個 API 的工作：
 * 提供前端搜索篩選組件所需的所有選項數據
 *
 * 🚫 這個 API 不做什麼：
 * - 不處理具體的產品查詢（由產品列表API處理）
 * - 不處理用戶相關數據（純產品元數據）
 * - 不處理複雜的統計分析（只提供基本選項）
 *
 * ✅ 只負責：
 * - 獲取所有可用的產品系列
 * - 獲取價格範圍信息
 * - 提供稀有度選項說明
 * - 提供發售狀態選項
 *
 * 💡 比喻：就像是「篩選工具箱」，提供搜索時需要的所有選項
 */

import { NextRequest, NextResponse } from 'next/server'
import { ProductService } from '@/services/productService'
import type { RarityLevel, ReleaseStatus } from '@/types/database'

export async function GET(request: NextRequest) {
  try {
    // 🔄 【並行獲取數據】同時獲取系列和價格範圍信息
    const [series, priceRange] = await Promise.all([
      ProductService.getSeries(),
      ProductService.getPriceRange()
    ])

    // 🎨 【稀有度選項】定義稀有度等級和顏色標識
    const rarityOptions: Array<{
      value: RarityLevel
      label: string
      color: string
      description: string
    }> = [
      {
        value: 'normal',
        label: '普通',
        color: 'gray',
        description: '常見款式'
      },
      {
        value: 'rare',
        label: '稀有',
        color: 'blue',
        description: '較難獲得'
      },
      {
        value: 'super_rare',
        label: '超稀有',
        color: 'purple',
        description: '非常罕見'
      },
      {
        value: 'hidden',
        label: '隱藏',
        color: 'gold',
        description: '神秘款式'
      },
      {
        value: 'sp',
        label: 'SP',
        color: 'rainbow',
        description: '特別版'
      }
    ]

    // 🎨 【發售狀態選項】定義產品狀態選項
    const statusOptions: Array<{
      value: ReleaseStatus
      label: string
      description: string
    }> = [
      {
        value: 'active',
        label: '正常販售',
        description: '目前可購買'
      },
      {
        value: 'discontinued',
        label: '停產',
        description: '已停止生產'
      },
      {
        value: 'preorder',
        label: '預購',
        description: '尚未正式發售'
      },
      {
        value: 'limited',
        label: '限量',
        description: '限量發售'
      }
    ]

    // 📊 【排序選項】定義可用的排序方式
    const sortOptions = [
      {
        value: 'name',
        label: '名稱',
        description: '按產品名稱排序'
      },
      {
        value: 'price',
        label: '價格',
        description: '按當前價格排序'
      },
      {
        value: 'rarity',
        label: '稀有度',
        description: '按稀有程度排序'
      },
      {
        value: 'release_date',
        label: '發售時間',
        description: '按發售日期排序'
      }
    ]

    // 📚 【系列選項】轉換系列數據為選項格式
    const seriesOptions = series.map(seriesName => ({
      value: seriesName,
      label: seriesName,
      description: `${seriesName} 系列產品`
    }))

    // ✅ 【成功響應】返回所有篩選選項
    return NextResponse.json({
      success: true,
      data: {
        series: seriesOptions,
        rarity: rarityOptions,
        status: statusOptions,
        sort: sortOptions,
        priceRange: {
          min: priceRange.min,
          max: priceRange.max,
          step: 10, // 價格篩選的步進值
          currency: 'NT$'
        }
      },
      message: `成功獲取篩選選項 (${seriesOptions.length} 個系列)`
    })

  } catch (error) {
    // ❌ 【錯誤處理】記錄錯誤並返回響應
    console.error('🚨 獲取篩選選項API錯誤:', error)
    
    const errorMessage = error instanceof Error ? error.message : '獲取篩選選項失敗'
    
    // 🚦 【降級處理】提供默認選項以確保前端不會崩潰
    return NextResponse.json({
      success: false,
      error: errorMessage,
      data: {
        series: [],
        rarity: [
          { value: 'normal', label: '普通', color: 'gray', description: '常見款式' },
          { value: 'rare', label: '稀有', color: 'blue', description: '較難獲得' },
          { value: 'super_rare', label: '超稀有', color: 'purple', description: '非常罕見' },
          { value: 'hidden', label: '隱藏', color: 'gold', description: '神秘款式' },
          { value: 'sp', label: 'SP', color: 'rainbow', description: '特別版' }
        ],
        status: [
          { value: 'active', label: '正常販售', description: '目前可購買' },
          { value: 'discontinued', label: '停產', description: '已停止生產' },
          { value: 'preorder', label: '預購', description: '尚未正式發售' },
          { value: 'limited', label: '限量', description: '限量發售' }
        ],
        sort: [
          { value: 'name', label: '名稱', description: '按產品名稱排序' },
          { value: 'price', label: '價格', description: '按當前價格排序' }
        ],
        priceRange: { min: 0, max: 1000, step: 10, currency: 'NT$' }
      }
    }, { 
      status: 500 
    })
  }
}

// 🔧 【支持的HTTP方法】只支持GET請求
export const dynamic = 'force-dynamic' // 確保獲取最新選項