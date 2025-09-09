import { useState, useEffect } from 'react'
import { productsService } from '@/services/products.service'
import type { ProductsHeaderData } from '@/interfaces/products/pruducts.interface'

export const useProducts = (initialPage: number = 1, initialLimit: number = 50) => {
  const [data, setData] = useState<ProductsHeaderData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(initialPage)
  const [limit, setLimit] = useState(initialLimit)

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await productsService.getProductsIntegration(page, limit)
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [page, limit])

  const goToPage = (newPage: number) => {
    setPage(newPage)
  }

  const changeLimit = (newLimit: number) => {
    setLimit(newLimit)
    setPage(1) // Reset to first page when changing limit
  }

  const refresh = () => {
    fetchProducts()
  }

  return {
    data,
    loading,
    error,
    page,
    limit,
    goToPage,
    changeLimit,
    refresh,
    pagination: data?.pagination
  }
} 