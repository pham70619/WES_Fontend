import api from './apiService/APIService'
import { APIPaths } from './apiService/APIEndpoints'
import { MessageHandler } from '@/common/MessageHandler'
import { LogoutFunction } from '@/handlers/Logout_handle'
import axios from 'axios'

export const OrderInfoService = () => {
  const { logout } = LogoutFunction()
  // get Orderinfo Data
  // const bindingAPi = `http://10.35.10.82:5001/UI/Outbound/Order/CreateBatch`
  // const despatchAPI = `http://10.35.10.82:5001/UI/Outbound/Order/DespathOrderInfo`
  // const priorityAPi = `http://10.35.10.82:5001/UI/Outbound/Order/UpdateOrderPriority`
  // const API = `http://10.35.10.82:5001/UI/Outbound/Order/GetOrderInfo`

  const bindingAPi = `http://10.35.9.28:5001/UI/Outbound/Order/CreateBatch`
  const despatchAPI = `http://10.35.9.28:5001/UI/Outbound/Order/DespathOrderInfo`
  const priorityAPi = `http://10.35.9.28:5001/UI/Outbound/Order/UpdateOrderPriority`
  const API = `http://10.35.9.28:5001/UI/Outbound/Order/GetOrderInfo`
  async function getOrderInfoData(body, params) {
    try {
      MessageHandler.showLoading()
      // const response = await axios.post(API, body, { params })
      const response = await api.post(`${APIPaths.getOrderData}`, body, { params })
      MessageHandler.showSuccess()
      console.log('orderinfo Data:', response)
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

  // submit Oderinfo data
  async function submitData(body) {
    try {
      MessageHandler.showLoading()
      // const response = await axios.post(despatchAPI, body)
      const response = await api.post(`${APIPaths.submitOerderInfo}`, body)
      MessageHandler.showSuccess()
      console.log('submit response:', response)
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

      throw error
    }
  }

  // binding data
  async function bindingData(body) {
    try {
      MessageHandler.showLoading()
      // const response = await axios.post(bindingAPi, body)
      const response = await api.post(`${APIPaths.bindingOrderInfo}`, body)
      MessageHandler.showSuccess()
      console.log('adjust response data:', response)
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

      throw error
    }
  }

  // adjust priority
  async function adjustPriority(body) {
    try {
      MessageHandler.showLoading()
      // const response = await axios.post(priorityAPi, body)
      const response = await api.post(`${APIPaths.updateOrderInfoPriority}`, body)
      MessageHandler.showSuccess()
      console.log('adjust response data:', response)
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

      throw error
    }
  }
  return {
    getOrderInfoData,
    submitData,
    bindingData,
    adjustPriority,
  }
}
