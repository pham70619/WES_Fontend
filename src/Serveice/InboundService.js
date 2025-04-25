import api from './apiService/APIService'
import { APIPaths } from './apiService/APIEndpoints'
import { MessageHandler } from '@/common/MessageHandler'
import { LogoutFunction } from '@/handlers/Logout_handle'
import axios from 'axios'

export const InboundService = () => {
  const { logout } = LogoutFunction()
  // get inbound data
  const postmanApi = `/test/inbound/`
  async function getInboundData(body, params) {
    try {
      MessageHandler.showLoading()
      const response = await api.post(`${APIPaths.getInbound}`, body, { params })
      MessageHandler.showSuccess()
      console.log('inbound fetched data:', response)
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

      // console.log('fetching error:', error)
      throw error
    }
  }

  // submit inbound data
  async function submitInboundData(body) {
    try {
      MessageHandler.showLoading()
      // submit data need to adjust
      const response = await api.post(postmanApi, body)
      MessageHandler.showSuccess('處理成功!')
      return response.data.resultData
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
      // console.log('fetching error:', error)
      throw error
    }
  }

  // cancel inbound data
  async function cancelInboundData(body) {
    try {
      MessageHandler.showLoading()
      const response = await api.post(postmanApi, body)
      MessageHandler.showSuccess('處理成功!')
      return response.data.resultData
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
      // console.log('fetching error:', error)
      throw error
    }
  }

  return {
    getInboundData,
    submitInboundData,
    cancelInboundData,
  }
}
