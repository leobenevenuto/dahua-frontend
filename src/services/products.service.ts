import api from '@/api/config'
import type { ProductsHeaderData } from '@/interfaces/products/pruducts.interface'

export const productsService = {
  getProductsIntegration: async (page: number = 1, limit: number = 50): Promise<ProductsHeaderData> => {
    const response = await api.get<ProductsHeaderData>(`/api/v1/products/products-integration?page=${page}&limit=${limit}`)
    return response.data
  }
} 