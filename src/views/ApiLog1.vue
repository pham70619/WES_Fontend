<script setup>
import { APIServer, APIPaths } from '@/common/ApiPath'
import { ref, computed, onMounted } from 'vue'
import DataTable from '@/components/dataTable/DataTable.vue'
import InputBox from '@/components/searchComponent/InputBox.vue'
import Dropdown from '@/components/searchComponent/Dropdown.vue'
import { APILogService } from '@/Serveice/APILogService'
import APILogBody from '@/Serveice/bodyConfig/APILogBodyConfig'
import Priority from '@/components/searchComponent/Priority.vue'
import { useI18n } from 'vue-i18n'
import { MessageHandler } from '@/common/MessageHandler'
import { ModalHandler } from '@/common/ModalHandler'

// define variable
const { t } = useI18n()
const _date = ref('')
const service = ref('')
const orderId = ref('')
const status = ref('')
const priority = ref('')
const errorMsg = ref('')
const main_data = ref([])
const selectedData = ref([])
const loading = ref(false)
const totalCount = ref(0)
const apiLogService = APILogService()
const Size = ref('')
const Page = ref('')
const Sort = ref('')
const Order = ref('')
const dataTableRef = ref('')
const statusCode = ref([])
const serviceName = ref([])
const serviceOptions = computed(() =>
  serviceName.value.map((item) => ({
    label: item.key,
    value: item.key,
  })),
)
const statusOptions = computed(() =>
  statusCode.value.map((item) => ({
    label: item.key,
    value: item.key,
  })),
)

// define columns
const main_columns = computed(() => [
  // { title: 'Action', key: 'operation', width: 80 },
  { title: t('T0004-service'), dataIndex: 'serviceName', key: 'serviceName' },
  {
    title: t('T0002-timestamp'),
    dataIndex: 'TimeStamp',
    key: 'TimeStamp',
    sorter: (a, b) => new Date(a.TimeStamp).getTime() - new Date(b.TimeStamp).getTime(),
    defaultSortOrder: 'descend',
  },
  { title: 'URL', dataIndex: 'url', key: 'url' },
  { title: t('T0005-processTime'), dataIndex: 'exec_time', key: 'exec_time' },
  { title: t('T0006-from'), dataIndex: 'from', key: 'from' },
  { title: t('T0007-to'), dataIndex: 'to', key: 'to' },
  { title: t('T0012-status'), dataIndex: 'statusCode', key: 'statusCode' },
])

const detail_columns = computed(() => [
  { title: t('T0032-request'), dataIndex: 'request', key: 'request', width: '50%' },
  { title: t('T0033-response'), dataIndex: 'response', key: 'response', width: '50%' },
])

// define function
// handle when selection change
const handleSelectionChanged = (data) => {
  selectedData.value = data
  console.log(selectedData.value)
}

// handle params and fetch data
const handleParamsAndFetch = (params) => {
  Size.value = params.size
  Page.value = params.page
  Sort.value = params.sort
  Order.value = params.order

  fetchData(params)
}

const handleSearch = () => {
  if (dataTableRef.value?.resetToFirstPage) {
    dataTableRef.value.resetToFirstPage()
  }
}

// get servicename
const getServiceName = () => {
  const body = APILogBody.getServiceName()
  apiLogService
    .getServiceName(body)
    .then((response) => {
      serviceName.value = response
      console.log('service name:', serviceName.value)
    })
    .catch((error) => {
      console.error('error:', error)
    })
}

// get servicename
const getSatusCode = () => {
  const body = APILogBody.getStatusCode()
  apiLogService
    .getStatusCode(body)
    .then((response) => {
      statusCode.value = response
      console.log('status code:', statusCode.value)
    })
    .catch((error) => {
      console.error('error:', error)
    })
}
// fetch data
const fetchData = async ({ page, size, sort, order }) => {
  loading.value = true
  main_data.value = []
  totalCount.value = 0
  selectedData.value = []

  console.log('fetch api log')

  // get body
  const body = APILogBody.fetchData(_date.value, service.value, status.value)
  console.log('body:', body)

  apiLogService
    .getApiLogData(body)
    .then((response) => {
      main_data.value = response.hits.hits.map((hit, index) => {
        const log = hit._source.metadata.LogRecord

        // try parse JSON
        // let parsedRequest = log.ApiRequest.Body
        // let parsedResponse = log.ApiResponse.Body

        // try {
        //   parsedRequest = JSON.stringify(JSON.parse(log.ApiRequest.Body), null, 2)
        // } catch (e) {
        //   console.warn('request is not valid JSON')
        // }

        // try {
        //   parsedResponse = JSON.stringify(JSON.parse(log.ApiResponse.Body), null, 2)
        // } catch (e) {
        //   console.warn('response is not valid JSON')
        // }

        return {
          requestID: Math.floor(Math.random() * 1000000),
          key: index,
          TimeStamp: log.Timestamp,
          statusCode: log.ApiResponse.StatusCode,
          url: log.ApiRequest.Url,
          serviceName: log.ServiceName,
          DisplayID: log.LogId,
          detail: [
            {
              request: log.ApiRequest.Body,
              response: log.ApiResponse.Body,
              // request: parsedRequest,
              // response: parsedResponse,
            },
          ],
        }
      })

      console.log('apilog data:', main_data.value)
    })
    .catch((error) => {
      console.error('failed to fetch data:', error)
    })
    .finally(() => {
      loading.value = false
    })
}

onMounted(() => {
  getServiceName()
  getSatusCode()
})
</script>

<template>
  <DataTable
    ref="dataTableRef"
    :columns="main_columns"
    :detailColumns="detail_columns"
    :data="main_data"
    :totalRecord="totalCount"
    :checkBox="false"
    :loading="loading"
    :expandable="true"
    :expandObject="'detail'"
    @fetchData="handleParamsAndFetch"
    @selectionChanged="handleSelectionChanged"
  >
    <!-- searchBar -->
    <template #Searchbar>
      <!-- 日期 -->
      <InputBox
        v-model="_date"
        :label="t('A0002-Date')"
        :placeHolder="''"
        :disabled="false"
        :readonly="false"
        :maxLength="undefined"
        type="date"
        width="120px"
        @validation=""
      />

      <!-- 服務 -->
      <Dropdown
        v-model="service"
        :label="t('A0000-service')"
        :options="serviceOptions"
        :placeholder="''"
        :disabled="false"
        :width="'180px'"
      />

      <!-- 狀態 -->
      <Dropdown
        v-model="status"
        :label="t('A0003-Status')"
        :options="statusOptions"
        :placeholder="''"
        :disabled="false"
        :width="'100px'"
      />

      <!-- 查詢 -->
      <a-button class="ms-3" type="primary" @click="handleSearch">{{ t('B0001-Search') }}</a-button>
    </template>
  </DataTable>
</template>
