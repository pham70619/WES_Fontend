<script setup>
import { ref, onMounted } from 'vue'
import ActionBar from '@/components/ActionBar.vue'
import Table from '@/components/Table1.vue'
import { getData } from '@/Serveice/ActivityLogService'
// import { useI18n } from 'vue-i18n'

const main_data = ref([])
const main_columns = [
  { title: '帳號', dataIndex: 'account', key: 'account' },
  { title: '使用者名稱', dataIndex: 'username', key: 'username' },
  { title: '公司', dataIndex: 'company', key: 'company' },
  { title: '角色', dataIndex: 'roles', key: 'roles' },
  { title: '服務', dataIndex: 'service', key: 'service' },
  { title: 'API', dataIndex: 'API', key: 'API' },
  { title: '時間', dataIndex: 'time', key: 'time' },
  { title: '狀態', dataIndex: 'status', key: 'status' },
]
const detail_columns = [
  { title: '請求', dataIndex: 'request', key: 'request' },
  { title: '回復', dataIndex: 'response', key: 'response' },
]

const fetchData = async () => {
  try {
    const body = {
      message: 'getdata',
    }
    const response = await getData(body)

    if (Array.isArray(response)) {
      main_data.value = response
    } else {
      console.error('🚨 API response is not an array!', response)
      main_data.value = []
    }
    // main_data.value = response
  } catch (error) {
    console.log('Error fetching data:', error)
  }
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <!-- <h6>{{ $t('hello') }}</h6>
  <h6>{{ $t('goodbye') }}</h6> -->
  <ActionBar
    :InputBox="true"
    InputBoxContent="帳號"
    :InputBox1="true"
    InputBoxContent1="服務"
    :DateInput="true"
    DateInputContent="日期"
    @dataFetched=""
  />
  <Table
    :mainColumns="main_columns"
    :detailColumns="detail_columns"
    :mainData="main_data"
    :checkBox="false"
    :showSettingBar="false"
    :submitBtn="false"
    :adjustPriority="false"
    :cancelBtn="false"
    :submitEndpoint="false"
    :priorityEndpoint="false"
    :cancelEndpoint="false"
    expandObject="detail"
    :expandation="true"
  />
</template>
