import { useState, useEffect } from 'react'
import { outboundService } from '@/services/outbound.service'
import type { OutboundList } from '@/interfaces/outbound/outbound'

export const useOutbound = (initialPage: number = 1, initialLimit: number = 50) => {
  const [data, setData] = useState<OutboundList | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(initialPage)
  const [limit, setLimit] = useState(initialLimit)

  const fetchOutbound = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await outboundService.getOutboundFiles(page, limit)
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch outbound files')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOutbound()
  }, [page, limit])

  const goToPage = (newPage: number) => {
    setPage(newPage)
  }

  const changeLimit = (newLimit: number) => {
    setLimit(newLimit)
    setPage(1) // Reset to first page when changing limit
  }

  const refresh = () => {
    fetchOutbound()
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