export interface InboundItem {
  processId: string
  sourceFileName: string
  invoiceReceived: boolean
  invoiceRequested: boolean
  invoiceToStralog: boolean
  invoiceToIntercomm: boolean
  createdAt: string
  updatedAt: string
}

export interface InboundPagination {
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface InboundList {
  data: InboundItem[]
  pagination: InboundPagination
}

export interface ProcessScanResponse {
  message: string
} 