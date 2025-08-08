/**
 * FieldManager - 產品數據字段批量管理工具
 *
 * 🎯 這個工具的工作：
 * 提供批量修改所有產品數據字段的功能
 *
 * 🚫 這個工具不做什麼：
 * - 不處理單個產品的編輯（由產品編輯器處理）
 * - 不進行數據驗證（由驗證器處理）
 *
 * ✅ 只負責：
 * - 批量添加新字段
 * - 批量修改字段名稱
 * - 批量更新字段值
 * - 批量刪除字段
 *
 * 💡 比喻：就像是「批量編輯器」，能夠一次性修改所有產品文件
 */

import * as fs from 'fs'
import * as path from 'path'
import { glob } from 'glob'
import { Product, PRODUCT_FIELDS, FieldMetadata } from '../schema/product-schema'

// 🎛️ 【工具配置】
const PRODUCTS_DIR = path.join(process.cwd(), 'src/data/products')
const BACKUP_DIR = path.join(process.cwd(), 'src/data/backups')

// 🔧 【工具類】字段管理器
export class FieldManager {
  private productFiles: string[] = []
  
  constructor() {
    this.initializeFiles()
  }

  // 🔄 【初始化】掃描所有產品文件
  private initializeFiles(): void {
    try {
      this.productFiles = glob.sync(`${PRODUCTS_DIR}/*.json`)
      console.log(`📁 找到 ${this.productFiles.length} 個產品系列文件`)
    } catch (error) {
      console.error('❌ 初始化文件列表失败:', error)
      throw error
    }
  }

  // 💾 【備份】創建數據備份
  private createBackup(): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const backupPath = path.join(BACKUP_DIR, `products-backup-${timestamp}`)
    
    // 🔄 確保備份目錄存在
    if (!fs.existsSync(BACKUP_DIR)) {
      fs.mkdirSync(BACKUP_DIR, { recursive: true })
    }
    
    fs.mkdirSync(backupPath, { recursive: true })
    
    // 📄 複製所有產品文件
    this.productFiles.forEach(filePath => {
      const fileName = path.basename(filePath)
      fs.copyFileSync(filePath, path.join(backupPath, fileName))
    })
    
    console.log(`💾 已創建備份: ${backupPath}`)
    return backupPath
  }

  // 📄 【讀取】讀取單個產品文件
  private readProductFile(filePath: string): Product[] {
    try {
      const content = fs.readFileSync(filePath, 'utf8')
      return JSON.parse(content)
    } catch (error) {
      console.error(`❌ 讀取文件失敗: ${filePath}`, error)
      throw error
    }
  }

  // 💾 【寫入】寫入單個產品文件
  private writeProductFile(filePath: string, products: Product[]): void {
    try {
      const content = JSON.stringify(products, null, 2)
      fs.writeFileSync(filePath, content + '\n', 'utf8')
    } catch (error) {
      console.error(`❌ 寫入文件失敗: ${filePath}`, error)
      throw error
    }
  }

  // ➕ 【添加字段】為所有產品添加新字段
  public addField(fieldName: string, defaultValue: any): void {
    console.log(`🚀 開始為所有產品添加字段: ${fieldName}`)
    
    // 💾 先創建備份
    this.createBackup()
    
    let totalProducts = 0
    let processedFiles = 0
    
    this.productFiles.forEach(filePath => {
      try {
        const products = this.readProductFile(filePath)
        
        // ➕ 為每個產品添加新字段（如果不存在）
        const updatedProducts = products.map(product => ({
          ...product,
          [fieldName]: product.hasOwnProperty(fieldName) ? product[fieldName] : defaultValue
        }))
        
        this.writeProductFile(filePath, updatedProducts)
        
        totalProducts += products.length
        processedFiles++
        
        console.log(`✅ 已處理: ${path.basename(filePath)} (${products.length} 個產品)`)
      } catch (error) {
        console.error(`❌ 處理文件失敗: ${path.basename(filePath)}`, error)
      }
    })
    
    console.log(`🎉 完成！處理了 ${processedFiles} 個文件，共 ${totalProducts} 個產品`)
  }

  // ✏️ 【重命名字段】批量重命名字段
  public renameField(oldFieldName: string, newFieldName: string): void {
    console.log(`🚀 開始重命名字段: ${oldFieldName} → ${newFieldName}`)
    
    // 💾 先創建備份
    this.createBackup()
    
    let totalProducts = 0
    let processedFiles = 0
    
    this.productFiles.forEach(filePath => {
      try {
        const products = this.readProductFile(filePath)
        
        // ✏️ 重命名字段
        const updatedProducts = products.map(product => {
          if (product.hasOwnProperty(oldFieldName)) {
            const { [oldFieldName]: oldValue, ...rest } = product
            return {
              ...rest,
              [newFieldName]: oldValue
            }
          }
          return product
        })
        
        this.writeProductFile(filePath, updatedProducts)
        
        totalProducts += products.length
        processedFiles++
        
        console.log(`✅ 已處理: ${path.basename(filePath)} (${products.length} 個產品)`)
      } catch (error) {
        console.error(`❌ 處理文件失敗: ${path.basename(filePath)}`, error)
      }
    })
    
    console.log(`🎉 完成！處理了 ${processedFiles} 個文件，共 ${totalProducts} 個產品`)
  }

  // 🔄 【更新字段】批量更新字段值
  public updateField(fieldName: string, updater: (currentValue: any, product: Product) => any): void {
    console.log(`🚀 開始批量更新字段: ${fieldName}`)
    
    // 💾 先創建備份
    this.createBackup()
    
    let totalProducts = 0
    let processedFiles = 0
    
    this.productFiles.forEach(filePath => {
      try {
        const products = this.readProductFile(filePath)
        
        // 🔄 更新字段值
        const updatedProducts = products.map(product => ({
          ...product,
          [fieldName]: updater(product[fieldName], product)
        }))
        
        this.writeProductFile(filePath, updatedProducts)
        
        totalProducts += products.length
        processedFiles++
        
        console.log(`✅ 已處理: ${path.basename(filePath)} (${products.length} 個產品)`)
      } catch (error) {
        console.error(`❌ 處理文件失敗: ${path.basename(filePath)}`, error)
      }
    })
    
    console.log(`🎉 完成！處理了 ${processedFiles} 個文件，共 ${totalProducts} 個產品`)
  }

  // 🗑️ 【刪除字段】批量刪除字段
  public removeField(fieldName: string): void {
    console.log(`🚀 開始刪除字段: ${fieldName}`)
    
    // 💾 先創建備份
    this.createBackup()
    
    let totalProducts = 0
    let processedFiles = 0
    
    this.productFiles.forEach(filePath => {
      try {
        const products = this.readProductFile(filePath)
        
        // 🗑️ 刪除字段
        const updatedProducts = products.map(product => {
          const { [fieldName]: removedField, ...rest } = product
          return rest
        })
        
        this.writeProductFile(filePath, updatedProducts)
        
        totalProducts += products.length
        processedFiles++
        
        console.log(`✅ 已處理: ${path.basename(filePath)} (${products.length} 個產品)`)
      } catch (error) {
        console.error(`❌ 處理文件失敗: ${path.basename(filePath)}`, error)
      }
    })
    
    console.log(`🎉 完成！處理了 ${processedFiles} 個文件，共 ${totalProducts} 個產品`)
  }

  // 📊 【統計】分析所有產品的字段使用情況
  public analyzeFields(): void {
    console.log(`🔍 開始分析產品字段...`)
    
    const fieldStats: { [key: string]: number } = {}
    let totalProducts = 0
    
    this.productFiles.forEach(filePath => {
      try {
        const products = this.readProductFile(filePath)
        
        products.forEach(product => {
          Object.keys(product).forEach(fieldName => {
            fieldStats[fieldName] = (fieldStats[fieldName] || 0) + 1
          })
          totalProducts++
        })
        
        console.log(`📄 已分析: ${path.basename(filePath)} (${products.length} 個產品)`)
      } catch (error) {
        console.error(`❌ 分析文件失敗: ${path.basename(filePath)}`, error)
      }
    })
    
    console.log(`\n📊 字段統計報告:`)
    console.log(`總產品數: ${totalProducts}`)
    console.log(`發現字段: ${Object.keys(fieldStats).length}`)
    console.log(`\n詳細統計:`)
    
    Object.entries(fieldStats)
      .sort(([,a], [,b]) => b - a)
      .forEach(([fieldName, count]) => {
        const coverage = ((count / totalProducts) * 100).toFixed(1)
        console.log(`  ${fieldName}: ${count}/${totalProducts} (${coverage}%)`)
      })
  }
}

// 🎯 【導出】便捷函數
export const fieldManager = new FieldManager()

// 🚀 【使用示例】
export const FieldOperations = {
  // 添加新字段
  addField: (fieldName: string, defaultValue: any) => 
    fieldManager.addField(fieldName, defaultValue),
  
  // 重命名字段
  renameField: (oldName: string, newName: string) => 
    fieldManager.renameField(oldName, newName),
  
  // 更新字段值
  updateField: (fieldName: string, updater: (currentValue: any, product: Product) => any) => 
    fieldManager.updateField(fieldName, updater),
  
  // 刪除字段
  removeField: (fieldName: string) => 
    fieldManager.removeField(fieldName),
  
  // 分析字段
  analyzeFields: () => 
    fieldManager.analyzeFields()
}