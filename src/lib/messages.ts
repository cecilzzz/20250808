/**
 * 翻譯訊息加載器 - 靜態導入方式
 */

import zhTW from '../../messages/zh-TW.json'
import en from '../../messages/en.json'

export const messages = {
  'zh-TW': zhTW,
  'en': en
} as const

export function getMessagesForLocale(locale: string) {
  return messages[locale as keyof typeof messages] || messages['zh-TW']
}