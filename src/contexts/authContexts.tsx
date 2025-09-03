import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import type { AuthContext as IAuthContext, UserData } from '../interfaces/authContexts'
import { jwtDecode } from 'jwt-decode'
export const AuthContext = createContext<IAuthContext | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  const validateAndSetToken = () => {
    try {
      const token = localStorage.getItem('token')

      if (!token) {
        setIsAuthenticated(false)
        setUserData(null)
        setLoading(false)
        return false
      }

      try {
        const decoded = jwtDecode<UserData & { exp?: number }>(token)
        const currentTime = Date.now() / 1000

        if (decoded.exp && decoded.exp < currentTime) {
          logout()
          setLoading(false)
          return false
        }

        setUserData(decoded)
        setIsAuthenticated(true)
        setLoading(false)
        return true
      } catch (error) {
        console.error('Error decoding token:', error)
        logout()
        setLoading(false)
        return false
      }
    } catch (error) {
      console.error('Error validating token:', error)
      setLoading(false)
      return false
    }
  }

  // Run validation immediately when component mounts
  useEffect(() => {
    console.log('Auth provider mounted')
    validateAndSetToken()
  }, [])

  const getDecodedToken = () => {
    const token = localStorage.getItem('token')
    if (!token) return null

    try {
      return jwtDecode<UserData>(token)
    } catch (error) {
      console.error('Error decoding token in getDecodedToken:', error)
      return null
    }
  }

  const login = (token: string) => {
    if (!token) {
      console.error('Attempted to login with empty token')
      return
    }

    try {
      const decoded = jwtDecode<UserData>(token)

      localStorage.setItem('token', token)

      setUserData(decoded)
      setIsAuthenticated(true)
    } catch (error) {
      console.error('Error during login:', error)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')

    setIsAuthenticated(false)
    setUserData(null)
  }

  const value = {
    isAuthenticated,
    loading,
    userData,
    login,
    logout,
    getDecodedToken,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}
