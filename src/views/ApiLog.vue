<script setup>
import ActionBar from '@/components/ActionBar.vue'
import Table from '@/components/Table1.vue'
import { ref } from 'vue'
import { APIServer, APIPaths } from '@/common/ApiPath'

const main_columns = [
  // { title: 'index', dataIndex: 'key', key: 'key', width: 50 },
  { title: 'Action', key: 'operation', width: 80 },
  { title: '服務', dataIndex: 'serviceName', key: 'serviceName' },
  {
    title: '處理時間',
    dataIndex: 'TimeStamp',
    key: 'TimeStamp',
    sorter: (a, b) => new Date(a.TimeStamp).getTime() - new Date(b.TimeStamp).getTime(),
    defaultSortOrder: 'descend',
  },
  { title: 'URL', dataIndex: 'url', key: 'url' },
  { title: '處理時長', dataIndex: 'exec_time', key: 'exec_time' },
  { title: '起', dataIndex: 'from', key: 'from' },
  { title: '迄', dataIndex: 'to', key: 'to' },
  { title: '狀態', dataIndex: 'statusCode', key: 'statusCode' },
]

const main_data = ref([])
const selectedRequest = ref(null)
const selectedResponse = ref(null)
const apiName = ref(null)
const dropdownOptions = ref(['全選', 'InventoryService', 'SystemService', 'TransMissionService'])
// const API = `${APIPaths.getAPILog}`
const API = `http://localhost:9200/.ds-logs-dotnet-default-2025.02.17-000001/_search`
const ComponentName = 'APILog'

const handleFetchedData = (data) => {
  console.log('APILog received data from Actionbar:', data)

  if (!data || !data.hits || !data.hits.hits) {
    main_data.value = []
    return
  }

  main_data.value = data.hits.hits.map((hit, index) => {
    const log = hit._source.metadata.LogRecord

    return {
      key: index,
      TimeStamp: log.Timestamp,
      statusCode: log.ApiResponse.StatusCode,
      url: log.ApiRequest.Url,
      serviceName: log.ServiceName,
      DisplayID: log.LogId,
      detail: {
        request: log.ApiRequest.Body,
        response: log.ApiResponse.Body,
      },
    }
  })

  console.log('APILog data:', main_data.value)
}

const handleShow = (displayID) => {
  console.log('Show request & response with key:', displayID)

  // find the record with the maching key
  const record = main_data.value.find((item) => item.DisplayID === displayID)
  if (record) {
    selectedRequest.value = record.detail.request
    console.log('request content:', selectedRequest.value)
    selectedResponse.value = record.detail.response
    console.log('response content:', selectedResponse.value)
    apiName.value = record.serviceName
  } else {
    selectedRequest.value = null
    selectedResponse.value = null
    apiName.value = null
  }
}
</script>

<template>
  <ActionBar
    :InputBox="true"
    InputBoxContent="Status Code"
    :InputBox1="true"
    InputBoxContent1="訂單號"
    :DateInput="true"
    :DropdownSelection="true"
    DropdownTitle="服務"
    :DropdownOptions="dropdownOptions"
    :GetDataEndpoint="API"
    :ComponentName="ComponentName"
    @dataFetched="handleFetchedData"
  />

  <Table
    :mainColumns="main_columns"
    :mainData="main_data"
    :checkBox="false"
    :showSettingBar="false"
    :expandation="false"
    @show="handleShow"
  ></Table>

  <div class="row d-flex m-0" style="overflow: hidden">
    <h4 class="fw-bold">{{ apiName }}</h4>
    <div class="col-6 bg-white border" style="overflow-y: auto">
      <div class="w-100"><h5 class="text-end fw-bold">Request</h5></div>
      <pre
        class="bg-white border p-3"
        style="height: calc(100% - 50px); overflow-y: auto; white-space: pre-wrap"
        id="request-panel"
        >{{ selectedRequest ? selectedRequest : 'No request data available!' }}</pre
      >
    </div>
    <div class="col-6 bg-white border">
      <div class="w-100"><h5 class="text-end fw-bold">Response</h5></div>
      <pre
        class="bg-white border p-3"
        style="height: calc(100% - 50px); overflow-y: auto; white-space: pre-wrap"
        id="response-panel"
        >{{ selectedResponse ? selectedResponse : 'No response data available!' }}</pre
      >
    </div>
  </div>
</template>
