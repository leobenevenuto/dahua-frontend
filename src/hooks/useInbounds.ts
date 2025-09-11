import { useState, useEffect } from 'react'
import { inboundService } from '@/services/inbound.service'
import type { InboundList } from '@/interfaces/inbound/inbound'

export const useInbounds = (initialPage: number = 1, initialLimit: number = 50) => {
  const [data, setData] = useState<InboundList | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(initialPage)
  const [limit, setLimit] = useState(initialLimit)

  const fetchInbounds = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await inboundService.getInboundFiles(page, limit)
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch inbound files')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInbounds()
  }, [page, limit])

  const goToPage = (newPage: number) => {
    setPage(newPage)
  }

  const changeLimit = (newLimit: number) => {
    setLimit(newLimit)
    setPage(1) // Reset to first page when changing limit
  }

  const refresh = () => {
    fetchInbounds()
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