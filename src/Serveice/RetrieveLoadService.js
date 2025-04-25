import api from './apiService/APIService'
import { APIPaths } from './apiService/APIEndpoints'
import { MessageHandler } from '@/common/MessageHandler'
import { LogoutFunction } from '@/handlers/Logout_handle'
import axios from 'axios'

export const RetrieveLoadService = () => {
  const { logout } = LogoutFunction()
  // fetch data
  const fetchdata = `http://10.35.9.28:5001/UI/Outbound/RetrieveLoad/GetRetrieveLoad`

  async function getRetrieveLoadData(body, params) {
    try {
      MessageHandler.showLoading()
      // const response = await axios.post(fetchdata, body, { params })
      const response = await api.post(`${APIPaths.getRetrievload}`, body, { params })
      MessageHandler.showSuccess()
      console.log('retrieveload Data:', response)
      return response.data
    } catch (error) {
      const status = error.response?.status
      switch (status) {
        case 401:
          MessageHandler.showError('未授權，請重新登入。')
          // logout()
          break
        case 404:
          MessageHandler.showError('找不到資源 (404)。') // Not Found
          break
        case 500:
          MessageHandler.showError('伺服器錯誤，請稍後再試。') // Internal Server Error
          break
        default:
          MessageHandler.showError('處理中發生未知錯誤。')
          break
      }

      throw error
    }
  }

  return {
    getRetrieveLoadData,
  }
}
