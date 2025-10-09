import api from '@/api/config'
import type { InboundList, ProcessScanResponse } from '@/interfaces/inbound/inbound'

export const inboundService = {
  getInboundFiles: async (page: number = 1, limit: number = 50): Promise<InboundList> => {
    const response = await api.get<InboundList>(`/api/v1/inbound?page=${page}&limit=${limit}`)
    return response.data
  },

  processScan: async (company?: string): Promise<ProcessScanResponse> => {
    const endpoint = company === 'intercomm' 
      ? '/api/v1/inbound/intercomm/process'
      : '/api/v1/inbound/stralog/process'
    const response = await api.post<ProcessScanResponse>(endpoint)
    return response.data
  }
} 