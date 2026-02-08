import axios from 'axios'

const api = axios.create({
  // Gerçek sunucu adresi
  baseURL: 'https://case.nodelabs.dev/api/',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Token kontrolü (Giriş yapılmış mı?)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')  // Fixed: matches AuthContext
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 401 hatası (yetkisiz) gelirse login'e at
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken')  // Fixed: matches AuthContext
      
      // Only redirect if not already on auth pages (prevent loop)
      const currentPath = window.location.pathname
      if (currentPath !== '/login' && currentPath !== '/register') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api