<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import NavBar from '@/components/NavBar.vue'
import SideBar from '@/components/SideBar.vue'
import { AuthCheck } from '@/common/CheckAuth'
import { TokenService } from '@/Serveice/TokenService'
import { userInactivityTimeOut } from '@/handlers/UserInactiveTimeOut'
import { LogoutFunction } from '@/handlers/Logout_handle'

const { checkAuth } = AuthCheck()
const { startRefreshToken, stopRefreshToken } = TokenService()
const { showPasswordModal, continueSession } = userInactivityTimeOut()
const password = ref('')
const correctPassword = localStorage.getItem('password')
const errorMessages = ref('')
const { logout } = LogoutFunction()

const verifyPassword = () => {
  if (password.value === correctPassword) {
    continueSession()
    password.value = ''
    errorMessages.value = ''
  } else {
    errorMessages.value = '密碼錯誤!'
  }
}

// // reload monitor
// const reload = () => {
//   location.reload()
// }

onMounted(() => {
  checkAuth()
  // startRefreshToken()
})

onUnmounted(() => {
  // stopRefreshToken()
})
</script>

<template>
  <div class="dashboard-container">
    <SideBar />
    <div class="content">
      <!-- <NavBar @onchangeLang="reload" /> -->
      <div class="content-header">
        <NavBar @onchangeLang="" />
      </div>
      <div class="content-body mx-2">
        <RouterView />
      </div>
    </div>

    <div v-if="showPasswordModal" class="modal">
      <div class="modal-content">
        <h3 class="mb-4">請輸入密碼</h3>
        <span v-if="errorMessages" class="text-start text-danger small w-100">{{
          errorMessages
        }}</span>
        <input
          type="password"
          class="form-control mb-4 mx-auto"
          v-model="password"
          placeholder="password"
          @keyup.enter="verifyPassword"
        />

        <div class="d-flex justify-content-between px-3">
          <button type="button" class="btn btn-outline-danger px-3" @click="logout">登出</button>
          <button type="button" class="btn btn-outline-secondary px-3" @click="verifyPassword">
            確認
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-container {
  display: flex;
  flex-direction: row;
  overflow: hidden; /* lock scroll main display */
}

.content {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  width: 100%;
  height: 100vh;
}

.content .content-body {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex-grow: 1;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  width: 400px;
}
</style>
