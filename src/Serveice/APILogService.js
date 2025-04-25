import api from './apiService/APIService'
import { APIPaths } from './apiService/APIEndpoints'
import { MessageHandler } from '@/common/MessageHandler'
import { LogoutFunction } from '@/handlers/Logout_handle'
import axios from 'axios'

export const APILogService = () => {
  const { logout } = LogoutFunction()
  const ELKAPI = `http://localhost:9200/.ds-logs-dotnet-default-2025.03.19-000002/_search`

  // get Service name
  async function getServiceName(body) {
    try {
      MessageHandler.showLoading()
      const response = await axios.post(ELKAPI, body)
      // const response = await api.post(`${APIPaths.getOrderData}`, body, { params })
      MessageHandler.showSuccess()
      console.log('servicename Data:', response)
      return response.data.aggregations.services.buckets
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

  // get status code
  async function getStatusCode(body) {
    try {
      MessageHandler.showLoading()
      const response = await axios.post(ELKAPI, body)
      // const response = await api.post(`${APIPaths.getOrderData}`, body, { params })
      MessageHandler.showSuccess()
      console.log('statuscode Data:', response)
      return response.data.aggregations.status_codes.buckets
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

  // fetchdata
  async function getApiLogData(body) {
    try {
      MessageHandler.showLoading()
      const response = await axios.post(ELKAPI, body)
      // const response = await api.post(`${APIPaths.getOrderData}`, body, { params })
      MessageHandler.showSuccess()
      console.log('api log Data:', response)
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
    getServiceName,
    getStatusCode,
    getApiLogData,
  }
}
