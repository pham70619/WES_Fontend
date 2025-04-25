import axios from 'axios'

const Base_URL = import.meta.env.VITE_API_BASE_URL
// create instance
const api = axios.create({
  baseURL: Base_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request Interceptor: đính kèm token vào header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Response Interceptor: xử lý lỗi như 401 (token hết hạn)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('Token hết hạn hoặc không hợp lệ')
      // Bạn có thể tự động logout hoặc redirect tại đây
      // localStorage.removeItem('token')
      // location.href = '/login' // tùy dự án
    }
    return Promise.reject(error)
  },
)

export default api
