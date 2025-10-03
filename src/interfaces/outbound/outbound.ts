export interface OutboundItem {
  _id: string
  sourceFileName: string
  salesOrderToWms: boolean
  salesOrderInvoiceRequest: boolean
  invoiceRequested: boolean
  invoiceReceived: boolean
  invoiceToStralog: boolean
  invoiceToIntercomm: boolean
  invoiceConfirmationToSftp: boolean
  createdAt: string
  updatedAt: string
}

export interface OutboundPagination {
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface OutboundList {
  data: OutboundItem[]
  pagination: OutboundPagination
}

export interface ProcessScanResponse {
  message: string
} 