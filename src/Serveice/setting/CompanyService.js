import api from '../apiService/APIService'
import { APIPaths } from '../apiService/APIEndpoints'
import { MessageHandler } from '@/common/MessageHandler'
import { LogoutFunction } from '@/handlers/Logout_handle'
import axios from 'axios'

// url
const getdata = 'http://10.35.10.83:5000/Company/getCompany'
const upsertdata = 'http://10.35.10.83:5000/Company/updateCompany'
const deldata = 'http://10.35.10.83:5000/Company/deleteCompany'

function handleError(error) {
  const { logout } = LogoutFunction()
  const status = error.response?.status
  const errorMsg = error.response?.data?.message || ''

  switch (status) {
    case 400:
      MessageHandler.showError('請求格式錯誤 (400)。' + (errorMsg && `\n${errorMsg}`))
      break
    case 401:
      MessageHandler.showError('未授權，請重新登入。')
      // logout()
      break
    case 404:
      MessageHandler.showError('找不到資源 (404)。')
      break
    case 500:
      MessageHandler.showError('伺服器錯誤 (500)，請稍後再試。')
      break
    case 503:
      MessageHandler.showError('服務暫時無法使用 (503)，請稍後再試。')
      break
    default:
      MessageHandler.showError(`發生未知錯誤 (${status || 'no status'})。\n${errorMsg}`)
      break
  }
  throw error
}

export const CompanyService = () => {
  // get company data
  async function getCompanyData() {
    try {
      MessageHandler.showLoading()
      // const response = await api.get(`${APIPaths.getCompany}`)
      const response = await axios.get(getdata)
      MessageHandler.showSuccess()
      return response.data
    } catch (error) {
      handleError(error)
    }
  }

  // update company data (add or update)
  async function updateCompanyData(payload) {
    try {
      MessageHandler.showLoading()
      // const response = await api.post(`${APIPaths.updateCompany}`, payload)
      const response = await axios.post(upsertdata, payload)
      MessageHandler.showSuccess()
      return response.data
    } catch (error) {
      handleError(error)
    }
  }

  // delete company data
  async function deleteCompanyData(payload) {
    try {
      MessageHandler.showLoading()
      // const response = await api.post(`${APIPaths.deleteCompany}`, payload)
      const response = await axios.post(deldata, payload)
      MessageHandler.showSuccess()
      return response.data
    } catch (error) {
      handleError(error)
    }
  }

  return {
    getCompanyData,
    updateCompanyData,
    deleteCompanyData,
  }
}
