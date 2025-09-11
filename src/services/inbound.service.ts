import api from '@/api/config'
import type { InboundList, ProcessScanResponse } from '@/interfaces/inbound/inbound'

export const inboundService = {
  getInboundFiles: async (page: number = 1, limit: number = 50): Promise<InboundList> => {
    const response = await api.get<InboundList>(`/api/v1/inbound?page=${page}&limit=${limit}`)
    return response.data
  },

  processScan: async (): Promise<ProcessScanResponse> => {
    const response = await api.post<ProcessScanResponse>('/api/v1/inbound/process')
    return response.data
  }
} 