'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import ProductGrid from '@/components/ProductGrid'
import type { Product } from '@/types/database'

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalProducts, setTotalProducts] = useState(0)

  const fetchProducts = async (page: number = 1) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/products?page=${page}&limit=20`)
      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || '獲取產品列表失敗')
      }
      
      setProducts(result.data.products)
      setCurrentPage(result.data.page)
      setTotalPages(result.data.totalPages)
      setTotalProducts(result.data.total)
      
    } catch (err) {
      console.error('載入產品失敗:', err)
      setError(err instanceof Error ? err.message : '載入產品失敗')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      fetchProducts(page)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Labubu 收藏品
          </h1>
          <p className="text-gray-600">
            發現並收藏你喜愛的 Labubu 產品
            {!loading && totalProducts > 0 && (
              <span className="ml-2 text-sm text-gray-500">
                共 {totalProducts} 個產品
              </span>
            )}
          </p>
        </div>

        <ProductGrid 
          products={products}
          loading={loading}
          error={error}
        />

        {!loading && !error && totalPages > 1 && (
          <div className="mt-12 flex justify-center">
            <nav className="inline-flex rounded-md shadow-sm" aria-label="分頁導航">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                上一頁
              </button>
              
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const page = i + 1
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      page === currentPage
                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                )
              })}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                下一頁
              </button>
            </nav>
          </div>
        )}
      </main>
    </div>
  )
}