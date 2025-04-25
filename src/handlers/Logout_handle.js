import { useRouter } from 'vue-router'

export const LogoutFunction = () => {
  const router = useRouter()

  const logout = () => {
    localStorage.removeItem('username')
    localStorage.removeItem('password')
    localStorage.removeItem('token')
    console.log('logout')

    router.push('/login')
  }

  return {
    logout,
  }
}
