import { APIServer, APIPaths } from '@/common/ApiPath'


export const TokenService = () => {
  let refreshInternal = null;

  const RefreshToken = async () => {


    const storedUsername = localStorage.getItem('username') || ''
    const storedPassword = localStorage.getItem('password') || ''

    if (storedUsername && storedPassword) {
      try {
        const response = await fetch(`${APIPaths.Login}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            Username: storedUsername,
            Password: storedPassword,
          }),
        })

        if (!response.ok) {
          if (response.status === 404) {
            MessageHandler.showError('找不到對應資料 - no data!')
          } else if (response.status === 500) {
            MessageHandler.showError('主機發生錯誤, 請稍後重試!')
          } else {
            MessageHandler.showError('登入失敗, 請重試!')
          }
          return null
        }

        const data = await response.json()
        const Token = data.token

        if (Token) {
          // store token to localstorage
          localStorage.setItem('token', Token)
          console.log(`token: ${Token}`)

          console.log('refresh token successful!')
        } else {
          console.error('No token received. refresh failed!')
        }

        console.log(data)
      } catch (error) {
        console.error('Error during refresh:', error.message)
        throw error
      }




      // try {
      //   const response = await LgFunction.login();
      //   return response;
      // } catch (error) {
      //   console.error("Error Refresh token:", error)
      //   return null
      // }
    } else {
      console.warn("No stored credentials found in localStorage!")
      return null
    }
  }

  // start refresh
  const startRefreshToken = () => {
    if (!refreshInternal) {
      console.log("start auto refresh token");
      refreshInternal = setInterval(RefreshToken, 30 * 60 * 1000)//30分鐘再抓一次
      // refreshInternal = setInterval(RefreshToken, 2 * 1000)//30分鐘再抓一次
    }

  }

  // stop refesh
  const stopRefreshToken = () => {
    console.log("stop refresh token")
    clearInterval(refreshInternal)
    refreshInternal = null
  }

  return {
    RefreshToken,
    startRefreshToken,
    stopRefreshToken
  }
}
