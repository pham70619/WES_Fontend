import { MessageHandler } from './MessageHandler'
import { useRouter } from 'vue-router'

export const SendData = async (endpoint, data) => {
  try {
    console.log('Send data to endpoint:', endpoint)
    console.log(JSON.stringify(data))
    const router = useRouter()
    const token = localStorage.getItem('token')
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      MessageHandler.showError('處理失敗!')
      return
      // throw new Error(`Failed to send data: ${response.statusText}`)
    }

    const result = await response.json()
    // check token expired
    if (result.Error === 'TokenExpired') {
      localStorage.removeItem('token')
      MessageHandler.showError('Token Has Expired!')
      console.log('Token expired!')
      router.push('/login') // push back to login page
      return
    }
    console.log('Data sent successfully:', result)

    // show success message
    MessageHandler.showSuccess('處理成功!')
    
    return result
  } catch (error) {
    console.error('Error sending data:', error.message)
    // show error message
    MessageHandler.showError('發送失敗!')
    throw error // Ném lỗi để component cha xử lý}
  }
}
