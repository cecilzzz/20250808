#!/usr/bin/env npx tsx
/**
 * DataManagement - 產品數據管理命令行工具
 *
 * 🎯 這個腳本的工作：
 * 提供便捷的命令行界面來管理產品數據
 *
 * 🚫 這個腳本不做什麼：
 * - 不處理複雜的業務邏輯（由相應的工具類處理）
 * - 不直接操作文件系統（通過工具類間接操作）
 *
 * ✅ 只負責：
 * - 解析命令行參數
 * - 調用相應的數據管理工具
 * - 提供友好的用戶界面
 * - 處理錯誤和異常情況
 *
 * 💡 比喻：就像是「數據管理遙控器」，通過簡單的按鈕控制複雜的操作
 */

import { program } from 'commander'
import { FieldOperations } from '../src/data/tools/field-manager'
import { SplitOperations } from '../src/data/tools/data-splitter'

// 🎨 【美化輸出】控制台顏色
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
}

// 🎯 【工具函數】格式化輸出
const log = {
  success: (msg: string) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg: string) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  warning: (msg: string) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  info: (msg: string) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  title: (msg: string) => console.log(`${colors.bold}${colors.magenta}🚀 ${msg}${colors.reset}`)
}

// 🎛️ 【程序配置】
program
  .name('data-management')
  .description('🎯 Labubu產品數據管理工具')
  .version('1.0.0')

// 📊 【命令】數據分割
program
  .command('split')
  .description('📂 將products.json按系列分割成多個文件')
  .option('-p, --preview', '👁️ 只預覽，不實際執行')
  .action((options) => {
    try {
      log.title('產品數據分割工具')
      
      if (options.preview) {
        log.info('預覽模式，不會實際修改文件')
        SplitOperations.preview()
      } else {
        log.warning('即將執行數據分割，建議先運行 --preview 查看結果')
        console.log('繼續嗎？(按 Ctrl+C 取消，Enter 繼續)')
        
        process.stdin.once('data', () => {
          SplitOperations.split()
          log.success('數據分割完成！')
        })
      }
    } catch (error) {
      log.error(`分割失敗: ${error.message}`)
      process.exit(1)
    }
  })

// ➕ 【命令】添加字段
program
  .command('add-field')
  .description('➕ 為所有產品添加新字段')
  .requiredOption('-n, --name <name>', '字段名稱')
  .requiredOption('-v, --value <value>', '默認值')
  .option('-t, --type <type>', '數據類型 (string|number|boolean)', 'string')
  .action((options) => {
    try {
      log.title(`添加字段: ${options.name}`)
      
      // 🔄 轉換數據類型
      let defaultValue = options.value
      if (options.type === 'number') {
        defaultValue = parseFloat(options.value)
        if (isNaN(defaultValue)) {
          throw new Error('無效的數字值')
        }
      } else if (options.type === 'boolean') {
        defaultValue = options.value.toLowerCase() === 'true'
      }
      
      log.info(`字段名稱: ${options.name}`)
      log.info(`默認值: ${defaultValue} (${options.type})`)
      log.warning('即將為所有產品添加此字段')
      
      FieldOperations.addField(options.name, defaultValue)
      log.success('字段添加完成！')
    } catch (error) {
      log.error(`添加字段失敗: ${error.message}`)
      process.exit(1)
    }
  })

// ✏️ 【命令】重命名字段
program
  .command('rename-field')
  .description('✏️ 重命名產品字段')
  .requiredOption('-o, --old <oldName>', '舊字段名稱')
  .requiredOption('-n, --new <newName>', '新字段名稱')
  .action((options) => {
    try {
      log.title(`重命名字段: ${options.old} → ${options.new}`)
      log.warning('即將重命名所有產品中的此字段')
      
      FieldOperations.renameField(options.old, options.new)
      log.success('字段重命名完成！')
    } catch (error) {
      log.error(`重命名字段失敗: ${error.message}`)
      process.exit(1)
    }
  })

// 🗑️ 【命令】刪除字段
program
  .command('remove-field')
  .description('🗑️ 從所有產品中刪除字段')
  .requiredOption('-n, --name <name>', '要刪除的字段名稱')
  .action((options) => {
    try {
      log.title(`刪除字段: ${options.name}`)
      log.warning('即將從所有產品中刪除此字段，此操作不可逆！')
      console.log('確定要繼續嗎？(輸入 yes 確認)')
      
      process.stdin.once('data', (data) => {
        const input = data.toString().trim()
        if (input.toLowerCase() === 'yes') {
          FieldOperations.removeField(options.name)
          log.success('字段刪除完成！')
        } else {
          log.info('操作已取消')
        }
      })
    } catch (error) {
      log.error(`刪除字段失敗: ${error.message}`)
      process.exit(1)
    }
  })

// 🔄 【命令】更新字段
program
  .command('update-field')
  .description('🔄 批量更新字段值')
  .requiredOption('-n, --name <name>', '字段名稱')
  .requiredOption('-f, --function <function>', '更新函數 (JavaScript表達式)')
  .action((options) => {
    try {
      log.title(`更新字段: ${options.name}`)
      log.info(`更新函數: ${options.function}`)
      log.warning('即將批量更新所有產品中的此字段')
      
      // 🔧 創建更新函數
      const updateFunction = new Function('currentValue', 'product', `return ${options.function}`)
      
      FieldOperations.updateField(options.name, updateFunction)
      log.success('字段更新完成！')
    } catch (error) {
      log.error(`更新字段失敗: ${error.message}`)
      process.exit(1)
    }
  })

// 📊 【命令】分析字段
program
  .command('analyze')
  .description('📊 分析所有產品的字段使用情況')
  .action(() => {
    try {
      log.title('產品字段分析')
      FieldOperations.analyzeFields()
      log.success('分析完成！')
    } catch (error) {
      log.error(`分析失敗: ${error.message}`)
      process.exit(1)
    }
  })

// 📚 【命令】幫助信息
program
  .command('examples')
  .description('📚 顯示使用示例')
  .action(() => {
    console.log(`
${colors.bold}🎯 Labubu產品數據管理工具使用示例${colors.reset}

${colors.cyan}1. 數據分割${colors.reset}
  # 預覽分割結果
  pnpm run data:split --preview
  
  # 執行實際分割
  pnpm run data:split

${colors.cyan}2. 字段管理${colors.reset}
  # 添加新字段
  pnpm run data:add-field --name "limited_edition" --value false --type boolean
  
  # 重命名字段
  pnpm run data:rename-field --old "currentPrice" --new "price_current"
  
  # 刪除字段
  pnpm run data:remove-field --name "deprecated_field"
  
  # 批量更新字段值
  pnpm run data:update-field --name "updatedAt" --function "new Date().toISOString()"

${colors.cyan}3. 數據分析${colors.reset}
  # 分析字段使用情況
  pnpm run data:analyze

${colors.yellow}💡 提示：${colors.reset}
- 所有操作都會自動創建備份
- 建議在操作前先運行 --preview 或 analyze 查看當前狀態
- 批量操作不可逆，請謹慎使用
`)
  })

// 🚀 【執行】解析命令行參數
program.parse()

// 📝 【默認】沒有參數時顯示幫助
if (!process.argv.slice(2).length) {
  program.outputHelp()
  console.log(`\n${colors.cyan}💡 運行 '${program.name()} examples' 查看使用示例${colors.reset}`)
}