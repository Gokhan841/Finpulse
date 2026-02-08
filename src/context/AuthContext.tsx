import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { authAPI, User, RegisterData, LoginData } from '@/lib/api'
import toast from 'react-hot-toast'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  login: (data: LoginData) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  updateUser: (user: User) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check for existing token and fetch user profile on app start
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('authToken')
      
      if (token) {
        try {
          const userData = await authAPI.getProfile()
          setUser(userData)
          setIsAuthenticated(true)
        } catch (error) {
          // Token is invalid or expired
          localStorage.removeItem('authToken')
          setUser(null)
          setIsAuthenticated(false)
        }
      }
      
      setLoading(false)
    }

    initAuth()
  }, [])

  const login = async (data: LoginData) => {
    try {
      const response = await authAPI.login(data)
      
      if (!response.token || typeof response.token !== 'string') {
        throw new Error('Invalid token received from server')
      }
      
      localStorage.setItem('authToken', response.token)
      const savedToken = localStorage.getItem('authToken')   
    
      if (savedToken !== response.token) {
        throw new Error('Token storage failed')
      }
      
      // Set user data
      setUser(response.user)
      setIsAuthenticated(true)
      
      toast.success('Login successful!')
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed'
      toast.error(message)
      throw error
    }
  }

  const register = async (data: RegisterData) => {

    
    try {
      const response = await authAPI.register(data)
      
      localStorage.setItem('authToken', response.token)
  
      
      setUser(response.user)
      setIsAuthenticated(true)
      
      toast.success('Registration successful!')
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed'
      toast.error(message)
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem('authToken')
    setUser(null)
    setIsAuthenticated(false)
    toast.success('Logged out successfully')
  }

  const updateUser = (userData: User) => {
    setUser(userData)
  }

  const value: AuthContextType = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    updateUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
