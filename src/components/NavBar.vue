<script setup>
import BreadCrumb from './BreadCrumb.vue'
import Setting from './Setting.vue'
import { ref } from 'vue'
import i18n from '@/i18n/i18n'

const isOpenSetting = ref(false)

const emit = defineEmits(['onchangeLang'])
const openModal = () => {
  isOpenSetting.value = true
}
const closeModal = () => {
  isOpenSetting.value = false
}

const changeLang = (language) => {
  i18n.global.locale.value = language
  localStorage.setItem('WES-lang', language)
  // emit('onchangeLang')
}
</script>

<template>
  <div class="d-flex align-items-center border-bottom p-2">
    <div>
      <BreadCrumb />
    </div>

    <div class="ms-auto">
      <!-- 選擇語言-->
      <a-popover trigger="click">
        <template #content>
          <ul style="list-style: none; padding: 0; margin: 0">
            <li style="cursor: pointer" @click="changeLang('zh')">中文(繁體)</li>
            <li style="cursor: pointer" @click="changeLang('en')">English</li>
          </ul>
        </template>

        <a-tooltip class="me-2" title="語言設定" placement="left">
          <!-- <a-tooltip class="me-2"> -->
          <a-button shape="circle">
            <i class="bi bi-translate"></i>
          </a-button>
        </a-tooltip>
      </a-popover>

      <!-- 通知按鈕-->
      <a-tooltip class="me-2" title="通知">
        <a-button shape="circle">
          <i class="bi bi-bell"></i>
        </a-button>
      </a-tooltip>

      <!-- 設定按鈕 -->
      <a-tooltip class="me-3" title="設定">
        <a-button shape="circle" @click="openModal"><i class="bi bi-gear"></i></a-button>
      </a-tooltip>
    </div>
  </div>

  <Setting :isOpen="isOpenSetting" @close="closeModal" />
</template>
