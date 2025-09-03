export interface UserData {
    id?: string
    email?: string
    name?: string
    company?: string
    exp?: number
  }


  export interface AuthContext {
    isAuthenticated: boolean
    loading: boolean
    userData: UserData | null
    login: (token: string) => void
    logout: () => void
    getDecodedToken: () => UserData | null
  }
  