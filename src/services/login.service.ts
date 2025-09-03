import api from '@/api/config'
import type { LoginCredentials, LoginResponse } from '@/interfaces/login/login.interface'

export const loginService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/api/v1/accounts/login', credentials)
    return response.data
  }
} 