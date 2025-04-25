import { reactive } from 'vue'
// import { APIServer, APIPaths } from '@/common/ApiPath'
import { APIPaths } from '@/Serveice/apiService/APIEndpoints'
import { useRouter } from 'vue-router'
import { Modal } from 'bootstrap'
import { MessageHandler } from '@/common/MessageHandler'
import { useMenu } from '@/common/useMenu'
import api from '@/Serveice/apiService/APIService'
import axios from 'axios'
import Base from 'ant-design-vue/es/typography/Base'

const { setMenu } = useMenu()

const Base_URL = import.meta.env.VITE_API_BASE_URL
const LoginUrl = `${Base_URL}${APIPaths.login}`

export const LoginFunction = () => {
  const router = useRouter()
  const Userform = reactive({
    username: '',
    password: '',
  })

  // const api = 'http://10.35.10.82:7001/test/23529784/RSI_SINSHIH_1/P1-RS1/Login'
  // const api = 'http://10.35.10.82:5000/UI/Auth/login'

  const login = async () => {
    if (Userform.username != '' && Userform.password != '') {
      const body = {
        Username: Userform.username,
        Password: Userform.password,
      }
      console.log('body:', body)
      try {
        MessageHandler.showLoading()
        // const response = await fetch(`${APIPaths.Login}`, {
        // const response = await fetch(api, {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify({
        //     Username: Userform.username,
        //     Password: Userform.password,
        //   }),
        //   withCredentials: true,
        // })

        const response = await axios.post(LoginUrl, body)
        // const response = await api.post(`${APIPaths.login}`, body)

        // if (!response.ok) {
        //   if (response.status === 404) {
        //     MessageHandler.showError('找不到對應資料 - no data!')
        //   } else if (response.status === 500) {
        //     MessageHandler.showError('主機發生錯誤, 請稍後重試!')
        //   } else {
        //     MessageHandler.showError('登入失敗, 請重試!')
        //   }

        //   return null
        //   // throw new Error('Login failed. Please check your Username and Password')
        // }

        console.log('response:', response)

        const data = response.data

        if (!data?.token) {
          MessageHandler.showError(data.message || '登入失敗，未收到授權資訊')
          return
        }

        MessageHandler.showSuccess('登入成功')
        const Token = data.token
        // setMenu(data.menu) // put menu data into local storage

        if (Token) {
          // store token to localstorage
          localStorage.setItem('token', Token)
          console.log(`token: ${Token}`)

          // stored user infor to localstorage
          localStorage.setItem('username', Userform.username)
          localStorage.setItem('password', Userform.password)

          //close modal
          const modalElement = document.getElementById('loginModal')
          const bsModal = Modal.getInstance(modalElement)
          if (bsModal) {
            bsModal.hide()
          }

          //back to home page
          router.push('/dashboard')
          console.log('Login successful! Navigating to home page.')
        } else {
          console.error('No token received. Login failed!')
        }

        console.log(data)
      } catch (error) {
        console.error('Error during login:', error.message)
        throw error // Ném lỗi để xử lý bên ngoài
      }
    } else {
      console.log('Username or Password empty!')
    }
  }

  return {
    Userform,
    login,
  }
}
