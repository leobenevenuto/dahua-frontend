import api from '@/api/config'
import type { OutboundList } from '@/interfaces/outbound/outbound'

export const outboundService = {
  getOutboundFiles: async (page: number = 1, limit: number = 50): Promise<OutboundList> => {
    const response = await api.get<OutboundList>(`/api/v1/outbound?page=${page}&limit=${limit}`)
    return response.data
  }
} 