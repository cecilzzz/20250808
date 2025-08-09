/**
 * LocaleLayout - 語言路由佈局 (修復版本)
 */

import { locales, type Locale } from '@/i18n/request'
import { AuthProvider } from '@/contexts/AuthContext'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { notFound } from 'next/navigation'

interface LocaleLayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function LocaleLayout({
  children,
  params
}: LocaleLayoutProps) {
  const { locale } = await params
  
  if (!locales.includes(locale as Locale)) {
    notFound()
  }

  return (
    <LanguageProvider initialLocale={locale as Locale}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </LanguageProvider>
  )
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}