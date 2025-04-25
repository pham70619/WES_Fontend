<script setup>
import { LoginFunction } from '@/handlers/Login_handle1'

const LgFunction = LoginFunction()
</script>

<template>
  <div class="container-fluid login-container">
    <div class="logo">
      <h3>Warehouse Execution System</h3>
    </div>
    <div class="input-box">
      <form class="px-4" @submit.prevent="LgFunction.login">
        <div class="mb-3">
          <label for="UserName" class="form-label">Username</label>
          <input
            type="text"
            class="form-control"
            id="UserName"
            required
            v-model="LgFunction.Userform.username"
          />
        </div>
        <div class="mb-3">
          <label for="PassWord" class="form-label">PassWord</label>
          <input
            type="password"
            class="form-control"
            id="PassWord"
            required
            v-model="LgFunction.Userform.password"
          />
        </div>
        <div class="d-flex justify-content-center mb-3">
          <button type="submit" class="btn btn-primary">Login</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
h3 {
  font-weight: bolder;
  margin: 20px;
}

.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.logo {
  width: 100%;
}

.input-box {
  flex-grow: 1;
  width: 100%;
  max-width: 500px;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}
</style>
