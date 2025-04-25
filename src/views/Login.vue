<script setup>
import { onMounted } from 'vue'
import { Modal } from 'bootstrap'
import { LoginFunction } from '@/handlers/Login_handle';

const LgFuntion = LoginFunction()

onMounted(() => {
  // get modal by id
  const modalElement = document.getElementById('loginModal')
  // create instance
  const bsModal = new Modal(modalElement)
  // show modal
  bsModal.show()
})
</script>

<template>

  <!-- Modal -->
  <div
    class="modal fade"
    id="loginModal"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
  >
    <div class="modal-dialog modal-dialog-centered custom-modal-size">
      <div class="modal-content">
        <h2 class="m-4 text-center">Login</h2>
        <form class="px-4" @submit.prevent="LgFuntion.login">
          <div class="mb-3">
            <label for="exampleInputEmail1" class="form-label">Username</label>
            <input
              type="text"
              class="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              required
              v-model="LgFuntion.Userform.username"
            />
          </div>
          <div class="mb-3">
            <label for="exampleInputPassword1" class="form-label">Password</label>
            <input
              type="password"
              class="form-control"
              id="exampleInputPassword1"
              required
              v-model="LgFuntion.Userform.password"
            />
          </div>
          <div class="d-flex justify-content-center mb-3">
            <button type="submit" class="btn btn-primary">Login</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
h2 {
  font-weight: 800;
}

.custom-modal-size {
  width: 350px;
}
</style>
