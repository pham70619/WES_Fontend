import api from './apiService/APIService'
import { APIPaths } from './apiService/APIEndpoints'
import { MessageHandler } from '@/common/MessageHandler'
import { LogoutFunction } from '@/handlers/Logout_handle'
import axios from 'axios'

export const SKUMasterService = () => {
  const { logout } = LogoutFunction()
  const fetchDataAPI = `http://10.35.10.82:7001/test/23529784/RSI_SINSHIH_1/P1-RS1/GetSKUMaster`
  const token = localStorage.getItem('token')
  // fetch data
  async function getSKUMasterData(body, params) {
    try {
      MessageHandler.showLoading()
      // const response = await axios.post(fetchDataAPI, body, {
      //   params,
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //     'Content-Type': 'application/json',
      //   },
      // })
      const response = await api.post(`${APIPaths.getSKUMaster}`, body, { params })
      MessageHandler.showSuccess()
      console.log('skumaster Data:', response)
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
    getSKUMasterData,
  }
}
