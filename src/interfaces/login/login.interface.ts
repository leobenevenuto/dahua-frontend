export interface LoginCredentials {
  email: string
  password: string
  company: string
}

export interface User {
  id: string
  email: string
  name: string
  company: string
}

export interface LoginResponse {
  token: string
  user: User
} 