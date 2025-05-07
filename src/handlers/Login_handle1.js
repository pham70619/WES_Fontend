import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useMenu } from '@/common/useMenu'
import { APIPaths } from '@/Serveice/apiService/APIEndpoints'
import axios from 'axios'
import { MessageHandler } from '@/common/MessageHandler'

const { setMenu } = useMenu()
const Base_URL = import.meta.env.VITE_API_BASE_URL
// const loginUrl = `${Base_URL}${APIPaths.login}`

// test url
const loginUrl = `http://172.20.170.71:5000/UI/Auth/login`

export const LoginFunction = () => {
  const router = useRouter()

  // use form
  const Userform = reactive({
    username: '',
    password: '',
  })

  // handle response
  const handleResponse = (data) => {
    const { token, menu } = data

    if (!token) {
      MessageHandler.showError('登入失敗!')
      return
    }

    // store token and user info
    localStorage.setItem('token', token)
    localStorage.setItem('username', Userform.username)
    localStorage.setItem('password', Userform.password)

    // handle menu data
    if (menu) {
      setMenu(menu)
    }

    MessageHandler.showSuccess('登入成功!')
    router.push('/dashboard')
  }
  // login function
  const login = async () => {
    const payLoad = {
      Username: Userform.username,
      Password: Userform.password,
    }

    try {
      MessageHandler.showLoading()
      const response = await axios.post(loginUrl, payLoad)
      handleResponse(response.data)
    } catch (error) {
      console.log('Error during login:', error.message)
      MessageHandler.showError(error?.response?.data?.message || '登入失敗!')
    }
  }

  return {
    login,
    Userform,
  }
}
