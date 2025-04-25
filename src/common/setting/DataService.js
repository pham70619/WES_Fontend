import { MessageHandler } from '../MessageHandler'
import { useRouter } from 'vue-router'

const dataService = {
  async Post(endPoint, _data, _id, _action) {
    const _body = {
      action: _action,
    }
    if (_data) {
      _body.data = _data
    }
    if (_id) {
      _body.id = _id
    }

    const router = useRouter()
    const token = localStorage.getItem('token')

    try {
      const response = await fetch(endPoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(_body),
      })

      console.log(`${_action} record`, JSON.stringify(_body))

      if (!response.ok) {
        MessageHandler.showError('處理失敗!')
        return null
      }

      const data = await response.json()
      // check token expired
      if (data.Error === 'TokenExpired') {
        localStorage.removeItem('token')
        MessageHandler.showError('Token Has Expired!')
        console.log('Token expired!')
        router.push('/login') // push back to login page
        return
      }

      MessageHandler.showSuccess
      return await data
    } catch (error) {
      console.error('Error fetch data:', error)
      MessageHandler.showError('發生問題, 請聯絡工程師解決')
    }
  },
}

export default dataService
