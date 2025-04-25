import axios from 'axios'
import { APIServer, APIPaths } from '@/common/ApiPath'

const gettoken = () => {
  const token = localStorage.getItem('token')
  if (!token) {
    console.log('Token not found!, Please log in again.')
    return null
  }
  console.log('Get token successful!')
  return token
}
const token = gettoken()

const API = `${APIPaths.ActivityLog}`

const apiClient = axios.create({
  baseURL: 'https://39affaab-826e-47fd-ab0d-f028062da98d.mock.pstmn.io',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
})

export const getData = async (body) => {
  try {
    const response = await apiClient.post(API, body)
    return response.data
  } catch (error) {
    console.error('Error getting activity data:', error)
    throw error
  }
}
