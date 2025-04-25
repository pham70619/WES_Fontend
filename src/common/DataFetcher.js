import { MessageHandler } from './MessageHandler'
import { useRouter } from 'vue-router'
import { v4 as uuidv4 } from 'uuid'

export const DataFetcher = () => {
  const router = useRouter()
  const gettoken = () => {
    const token = localStorage.getItem('token')
    if (!token) {
      console.log('Token not found!, Please log in again.')
      return null
    }
    return token
  }

  const Getdata = async ({ API, body, component }) => {
    try {
      const token = gettoken()
      //   define the header
      const Header = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }

      MessageHandler.showLoading()
      console.log('fetching Endpoint:', API)

      // store start time
      const startTime = Date.now() // or performance.now()

      const response = await fetch(API, {
        method: 'POST',
        headers: Header,
        body: JSON.stringify(body),
      })

      // store end time
      const endTime = Date.now() // or performance.now()

      // calculate process time
      const duration = (endTime - startTime) / 1000
      console.log(`⏱️ Request processing time: ${duration.toFixed(3)} s`)

      if (!response.ok) {
        if (response.status === 404) {
          MessageHandler.showError('找不到對應資料 - no data!')
        } else if (response.status === 400) {
          MessageHandler.showError('請輸入查詢條件!')
        } else if (response.status === 401) {
          MessageHandler.showError('token過期, 請重新登入!')
          // localStorage.removeItem('token')
          console.log('Token expired!')
          // router.push('/login')
        } else if (response.status === 502) {
          MessageHandler.showError('主機發生錯誤, 請稍後重試!')
        } else if (response.status === 500) {
          MessageHandler.showError('主機發生錯誤, 請稍後重試!')
        } else {
          MessageHandler.showError('取得資料失敗, 請重試!')
        }

        return null
      }

      let data = await response.json()

      // add a unique displayID to each record
      if (component !== 'APILog') {
        data = data.map((item) => ({
          ...item,
          DisplayID: uuidv4(), //generate unique id
        }))
      }

      MessageHandler.showSuccess('處理成功')
      console.log('fetch data successful:', data)
      // return data.resultData // return data for partent component
      return data // return data for partent component
    } catch (error) {
      MessageHandler.showError('取得資料失敗, 請重試!')
      console.error('Error fetching:', error)
    }
  }

  return {
    Getdata,
  }
}
