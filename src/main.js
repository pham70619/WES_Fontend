// import './assets/main.css'
import 'bootstrap/dist/css/bootstrap.min.css' //bootstrap css
import 'bootstrap/dist/js/bootstrap.bundle.min.js' //bootstrap js
import 'bootstrap-icons/font/bootstrap-icons.css' //bootstrap icons
import 'ant-design-vue/dist/reset.css' //antdv css
import Antd from 'ant-design-vue'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import i18n from './i18n/i18n' //多國語言

const app = createApp(App)

app.use(router)
app.use(Antd)
app.use(i18n)
app.mount('#app')
