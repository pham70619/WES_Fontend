<script setup>
import { onMounted, ref, onUnmounted, watch } from 'vue'
import { generateBody } from '@/common/APIBodyConfig'
// import { generateBody } from "@/common/BodyConfig";
import { DataFetcher } from '@/common/DataFetcher'
import { MessageHandler } from '@/common/MessageHandler'

const props = defineProps({
  InputBox: { type: Boolean, required: false, default: false },
  InputBoxContent: { type: String, required: false },
  InputBox1: { type: Boolean, required: false, default: false },
  InputBoxContent1: { type: String, required: false },
  DateInput: { type: Boolean, required: false, default: false },
  DateInputContent: { type: String, required: false, default: '日期' },
  DropdownSelection: { type: Boolean, required: false, default: false },
  DropdownTitle: { type: String, required: false },
  DropdownOptions: { type: Array, required: false },
  GetDataEndpoint: { type: String, required: true },
  ComponentName: { type: String, required: true },
})

const { Getdata } = DataFetcher()
const emits = defineEmits(['dataFetched'])
const _date = ref()
const inputContent = ref()
const inputContent1 = ref()
const selectedOption = ref('全選')
let intervalId = null // Biến để lưu ID của interval

// check special char
const specialCharRegex = /[!@#$%^&*(),.?":{}|<>;]/

// watch inputbox
watch(inputContent, (newValue) => {
  if (specialCharRegex.test(newValue)) {
    MessageHandler.showError(`${props.InputBoxContent} 不符合! 無效特殊字元!`)
  }
})

watch(inputContent1, (newValue) => {
  if (specialCharRegex.test(newValue)) {
    MessageHandler.showError(`${props.InputBoxContent1} 不符合! 無效特殊字元!`)
  }
})

// trim space in InpuContent
const trimInputValues = () => {
  if (inputContent.value) {
    inputContent.value = inputContent.value.trim()
  }
  if (inputContent1.value) {
    inputContent1.value = inputContent1.value.trim()
  }
}

// // get current date
// const getCurrentDate = () => {
//   const today = new Date()
//   const formattedDate = today.toISOString().split('T')[0]
//   _date.value = formattedDate
//   console.log(`Current Date Set: ${formattedDate}`)
// }

// fetch data
const fetchData = async () => {
  trimInputValues()
  // generate body
  const body = generateBody(props.ComponentName, {
    date: _date.value,
    inputContent: inputContent.value,
    inputContent1: inputContent1.value,
    selectedOption: selectedOption.value,
  })

  if (body.error) {
    console.error(body.error) // Log lỗi
    console.log('Failed to generateBody!')
  } else {
    console.log('Generated body:', JSON.stringify(body))
  }

  // call API
  const response = await Getdata({
    API: props.GetDataEndpoint,
    body,
    component: props.ComponentName,
  })
  if (response) {
    console.log('ActionBar Received Data:', response)
    emits('dataFetched', response)
  } else {
    console.log('failed to fetch data!')
    emits('dataFetched')
  }
}

// auto get data when page is open
onMounted(() => {
  // getCurrentDate()
  fetchData()

  // Schedule fetchData to run every 10 seconds
  // intervalId = setInterval(fetchData, 10000)
})

// Clear interval when the component is unmounted
onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId)
    console.log('Interval cleared')
  }
})
</script>

<template>
  <div class="bg-white rounded-3 pt-3 d-flex">
    <div class="d-flex">
      <!-- Input Box -->
      <div v-if="InputBox" class="d-flex ms-3 align-items-center">
        <label for="Inputbox" class="form-label m-0">{{ props.InputBoxContent }}</label>
        <input
          type="text"
          class="form-control ms-3"
          id="InputBox"
          style="width: 150px"
          v-model="inputContent"
        />
      </div>

      <!-- Input Box1 -->
      <div v-if="InputBox1" class="d-flex ms-3 align-items-center">
        <label for="Inputbox" class="form-label m-0">{{ props.InputBoxContent1 }}</label>
        <input
          type="text"
          class="form-control ms-3"
          id="InputBox"
          style="width: 150px"
          v-model="inputContent1"
        />
      </div>

      <!-- Date Input Box -->
      <div v-if="DateInput" class="d-flex align-items-center ms-3">
        <label for="searchDate" class="form-label m-0">{{ props.DateInputContent }}</label>
        <input id="searchDate" type="date" class="form-control ms-3" v-model="_date" />
      </div>

      <!-- dropdown selection -->
      <div v-if="DropdownSelection" class="d-flex align-items-center ms-3">
        <label class="form-label m-0" for="DropdownSelect">{{ props.DropdownTitle }}</label>
        <select class="form-select ms-3" id="DropdownSelect" v-model="selectedOption">
          <option v-for="(option, index) in DropdownOptions" :key="index" :value="option">
            {{ option }}
          </option>
        </select>
      </div>

      <!-- search Button -->
      <div class="ms-3">
        <button class="btn btn-outline-secondary" type="button" @click="fetchData">查詢</button>
      </div>
    </div>

    <!-- <div class="ms-auto">
      <a-tooltip title="重設頁面">
        <a-button @click="fetchData" shape="circle"><i class="bi bi-arrow-clockwise"></i></a-button>
      </a-tooltip>
      <a-button class="ms-2" shape="circle"><i class="bi bi-download"></i></a-button>
      <a-button class="ms-2" shape="circle"><i class="bi bi-question"></i></a-button>
    </div> -->
  </div>
</template>

<style scoped>
label.form-label {
  white-space: nowrap;
}
</style>
