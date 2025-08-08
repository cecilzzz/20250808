/**
 * DataSplitter - 產品數據分割工具
 *
 * 🎯 這個工具的工作：
 * 將大型products.json文件按系列分割成多個小文件
 *
 * 🚫 這個工具不做什麼：
 * - 不修改產品數據內容（只進行分類）
 * - 不進行數據驗證（由驗證器處理）
 *
 * ✅ 只負責：
 * - 讀取現有的products.json
 * - 按系列分類產品
 * - 生成系列分類文件
 * - 創建系列索引文件
 *
 * 💡 比喻：就像是「文件整理員」，把混亂的大文件整理成分類清晰的小文件
 */

import * as fs from 'fs'
import * as path from 'path'
import { Product, SERIES_CONFIG, SeriesConfig } from '../schema/product-schema'

// 🎛️ 【工具配置】
const SOURCE_FILE = path.join(process.cwd(), 'src/data/products.json')
const PRODUCTS_DIR = path.join(process.cwd(), 'src/data/products')
const BACKUP_DIR = path.join(process.cwd(), 'src/data/backups')

// 🔧 【工具類】數據分割器
export class DataSplitter {
  private products: Product[] = []
  private seriesGroups: { [key: string]: Product[] } = {}
  
  constructor() {
    this.loadSourceData()
    this.groupProductsBySeries()
  }

  // 📄 【讀取】載入源數據
  private loadSourceData(): void {
    try {
      if (!fs.existsSync(SOURCE_FILE)) {
        throw new Error(`源文件不存在: ${SOURCE_FILE}`)
      }
      
      const content = fs.readFileSync(SOURCE_FILE, 'utf8')
      this.products = JSON.parse(content)
      
      console.log(`📄 已載入 ${this.products.length} 個產品`)
    } catch (error) {
      console.error('❌ 載入源數據失敗:', error)
      throw error
    }
  }

  // 🏷️【分組】按系列分組產品
  private groupProductsBySeries(): void {
    console.log('🔄 開始按系列分組產品...')
    
    // 📊 統計各系列產品數量
    const seriesCounts: { [key: string]: number } = {}
    
    this.products.forEach(product => {
      const seriesKey = this.getSeriesKey(product.series)
      
      if (!this.seriesGroups[seriesKey]) {
        this.seriesGroups[seriesKey] = []
      }
      
      this.seriesGroups[seriesKey].push(product)
      seriesCounts[seriesKey] = (seriesCounts[seriesKey] || 0) + 1
    })
    
    console.log('📊 系列分組統計:')
    Object.entries(seriesCounts)
      .sort(([,a], [,b]) => b - a)
      .forEach(([series, count]) => {
        console.log(`  ${series}: ${count} 個產品`)
      })
    
    console.log(`✅ 共分為 ${Object.keys(this.seriesGroups).length} 個系列`)
  }

  // 🔑 【映射】將系列名稱映射到文件名
  private getSeriesKey(seriesName: string): string {
    // 🔍 嘗試從配置中找到匹配的系列
    const configSeries = SERIES_CONFIG.find(config => 
      config.name === seriesName || config.nameEn === seriesName
    )
    
    if (configSeries) {
      return configSeries.key
    }
    
    // 🔄 如果沒找到，生成安全的文件名
    return seriesName
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fff]/g, '-')  // 保留中文字符
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
  }

  // 💾 【創建備份】備份原始文件
  private createBackup(): void {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    
    // 🔄 確保備份目錄存在
    if (!fs.existsSync(BACKUP_DIR)) {
      fs.mkdirSync(BACKUP_DIR, { recursive: true })
    }
    
    const backupFile = path.join(BACKUP_DIR, `products-original-${timestamp}.json`)
    fs.copyFileSync(SOURCE_FILE, backupFile)
    
    console.log(`💾 已備份原始文件: ${backupFile}`)
  }

  // 📁 【創建目錄】確保目標目錄存在
  private ensureDirectories(): void {
    if (!fs.existsSync(PRODUCTS_DIR)) {
      fs.mkdirSync(PRODUCTS_DIR, { recursive: true })
      console.log(`📁 已創建目錄: ${PRODUCTS_DIR}`)
    }
  }

  // 💾 【寫入文件】寫入系列文件
  private writeSeriesFiles(): void {
    console.log('🚀 開始寫入系列文件...')
    
    let writtenFiles = 0
    let totalProducts = 0
    
    Object.entries(this.seriesGroups).forEach(([seriesKey, products]) => {
      try {
        const fileName = `${seriesKey}.json`
        const filePath = path.join(PRODUCTS_DIR, fileName)
        
        // 📅 按發售日期排序產品
        const sortedProducts = products.sort((a, b) => 
          new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime()
        )
        
        const content = JSON.stringify(sortedProducts, null, 2)
        fs.writeFileSync(filePath, content + '\n', 'utf8')
        
        writtenFiles++
        totalProducts += products.length
        
        console.log(`✅ 已寫入: ${fileName} (${products.length} 個產品)`)
      } catch (error) {
        console.error(`❌ 寫入系列文件失敗: ${seriesKey}`, error)
      }
    })
    
    console.log(`🎉 完成！寫入了 ${writtenFiles} 個文件，共 ${totalProducts} 個產品`)
  }

  // 📋 【創建索引】生成系列索引文件
  private createSeriesIndex(): void {
    console.log('📋 創建系列索引文件...')
    
    try {
      const indexData = {
        lastUpdate: new Date().toISOString(),
        totalProducts: this.products.length,
        totalSeries: Object.keys(this.seriesGroups).length,
        series: Object.entries(this.seriesGroups).map(([key, products]) => ({
          key,
          productCount: products.length,
          fileName: `${key}.json`,
          lastModified: new Date().toISOString()
        }))
      }
      
      const indexPath = path.join(PRODUCTS_DIR, '_index.json')
      const content = JSON.stringify(indexData, null, 2)
      fs.writeFileSync(indexPath, content + '\n', 'utf8')
      
      console.log(`✅ 已創建索引文件: _index.json`)
    } catch (error) {
      console.error('❌ 創建索引文件失敗:', error)
    }
  }

  // 🚀 【執行】執行完整的分割流程
  public split(): void {
    console.log('🚀 開始執行產品數據分割...')
    
    try {
      // 💾 1. 創建備份
      this.createBackup()
      
      // 📁 2. 確保目錄存在
      this.ensureDirectories()
      
      // 💾 3. 寫入系列文件
      this.writeSeriesFiles()
      
      // 📋 4. 創建索引文件
      this.createSeriesIndex()
      
      console.log('🎉 產品數據分割完成！')
      console.log(`📁 分割文件位置: ${PRODUCTS_DIR}`)
      
    } catch (error) {
      console.error('❌ 分割過程中發生錯誤:', error)
      throw error
    }
  }

  // 📊 【預覽】預覽分割結果（不實際執行）
  public preview(): void {
    console.log('👁️ 預覽分割結果:')
    console.log(`📄 源文件: ${SOURCE_FILE}`)
    console.log(`📁 目標目錄: ${PRODUCTS_DIR}`)
    console.log(`📊 總產品數: ${this.products.length}`)
    console.log(`📂 將生成 ${Object.keys(this.seriesGroups).length} 個系列文件:`)
    
    Object.entries(this.seriesGroups)
      .sort(([,a], [,b]) => b.length - a.length)
      .forEach(([seriesKey, products]) => {
        console.log(`  📄 ${seriesKey}.json (${products.length} 個產品)`)
      })
  }
}

// 🎯 【導出】便捷函數
export const dataSplitter = new DataSplitter()

// 🚀 【使用示例】
export const SplitOperations = {
  // 預覽分割結果
  preview: () => dataSplitter.preview(),
  
  // 執行分割
  split: () => dataSplitter.split()
}