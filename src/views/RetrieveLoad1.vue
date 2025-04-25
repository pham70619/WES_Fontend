<script setup>
import { ref, computed } from 'vue'
import DataTable from '@/components/dataTable/DataTable.vue'
import InputBox from '@/components/searchComponent/InputBox.vue'
import Dropdown from '@/components/searchComponent/Dropdown.vue'
import { RetrieveLoadService } from '@/Serveice/RetrieveLoadService'
import RetrieveloadBody from '@/Serveice/bodyConfig/RetrieveLoadBodyConfig.js'
import Priority from '@/components/searchComponent/Priority.vue'
import { useI18n } from 'vue-i18n'
import { MessageHandler } from '@/common/MessageHandler'
import { ModalHandler } from '@/common/ModalHandler'

// define variable
const { t } = useI18n()
const palletId = ref('')
const _date = ref('')
const loadId = ref('')
const status = ref('')
const priority = ref('')
const statusOptions = computed(() => [
  { label: t('L0007-selectAll'), value: '' },
  { label: t('L0000-pending'), value: 'Pending' },
  { label: t('L0001-processing'), value: 'Processing' },
  { label: t('L0002-processed'), value: 'Processed' },
  { label: t('L0003-deliveryFailed'), value: 'DeliveryFailed' },
  { label: t('L0004-inProgress'), value: 'InProgress' },
  { label: t('L0005-successed'), value: 'Successed' },
  { label: t('L0006-failed'), value: 'Failed' },
])
const errorMsg = ref('')
const main_data = ref([])
const selectedData = ref([])
const loading = ref(false)
const totalCount = ref(0)
const retrieveLoadService = RetrieveLoadService()
const Size = ref('')
const Page = ref('')
const Sort = ref('')
const Order = ref('')
const dataTableRef = ref('')

// define columns
const main_columns = computed(() => [
  { title: t('T0008-requestId'), dataIndex: 'requestID', key: 'requestID' },
  { title: t('T0009-messageType'), dataIndex: 'messageType', key: 'messageType' },
  { title: t('T0000-loadId'), dataIndex: 'loadID', key: 'loadID' },
  {
    title: t('T0025-priority'),
    dataIndex: 'priority',
    key: 'priority',
    sorter: (a, b) => a.priority - b.priority,
    sortDirections: ['ascend', 'descend'],
  },
  { title: t('T0011-destination'), dataIndex: 'destination', key: 'destination' },
  { title: t('T0028-shippingTime'), dataIndex: 'despatchTime', key: 'despatchTime' },
  { title: t('T0012-status'), dataIndex: 'status', key: 'status' },
  { title: t('T0013-customerId'), dataIndex: 'customerID', key: 'customerID' },
])

const detail_columns = computed(() => [
  { title: t('T0010-palletId'), dataIndex: 'palletID', key: 'palletID' },
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

// fetch data
const fetchData = async ({ page, size, sort, order }) => {
  loading.value = true
  main_data.value = []
  totalCount.value = 0
  selectedData.value = []

  const currentPage = Number.isInteger(page) && page > 0 ? page : 1
  const pageSize = Number.isInteger(size) && size > 0 ? size : Page.value
  // const sortField = sort ?? Sort.value
  // const sortOrder = order ?? Order.value

  // get body
  const body = RetrieveloadBody.fetchData(_date.value, palletId.value, loadId.value, status.value)
  console.log('body:', body)

  // get params
  const params = {
    batch: pageSize,
    skip: (currentPage - 1) * pageSize,
    // sort: sort,
    // order: order,
  }

  // call api
  retrieveLoadService
    .getRetrieveLoadData(body, params)
    .then((response) => {
      main_data.value = response.resultData || []
      totalCount.value = response.successCount || 0
      console.log('data fetched:', main_data.value)
    })
    .catch((error) => {
      console.error('failed to fetch data:', error)
    })
    .finally(() => {
      loading.value = false
    })
}

// adjust Priority
const adjusiPriority = () => {
  if (selectedData.value.length === 0) {
    MessageHandler.showError(t('M0003-plsSelectData'))
    return
  }

  if (!priority.value) {
    MessageHandler.showError(t('M0004-plsSelectPriority'))
    return
  }

  // Lấy giá trị chuẩn để kiểm tra
  const baseCustomerID = selectedData.value[0].customerID
  const baseWarehouseID = selectedData.value[0].warehouseID
  const baseZoneID = selectedData.value[0].zoneID

  const isAllSame = selectedData.value.every(
    (item) =>
      item.customerID === baseCustomerID &&
      item.warehouseID === baseWarehouseID &&
      item.zoneID === baseZoneID,
  )

  if (!isAllSame) {
    MessageHandler.showError('選取的資料包含不同的 CustomerID / WarehouseID / ZoneID，請重新選擇！')
    return
  }

  const loadIds = selectedData.value.map((item) => item.loadID)
  console.log('loadId:', loadIds)

  console.log('Priority adjustment function not completed!!')
}
</script>

<template>
  <DataTable
    ref="dataTableRef"
    :columns="main_columns"
    :detailColumns="detail_columns"
    :data="main_data"
    :totalRecord="totalCount"
    :checkBox="true"
    :loading="loading"
    :expandable="true"
    :expandObject="'palletList'"
    @fetchData="handleParamsAndFetch"
    @selectionChanged="handleSelectionChanged"
  >
    <!-- searchBar -->
    <template #Searchbar>
      <!-- 板號 -->
      <InputBox
        v-model="palletId"
        :label="t('A0001-palletID')"
        :placeHolder="''"
        :disabled="false"
        :readonly="false"
        :maxLength="11"
        type="text"
        width="120px"
        @validation=""
      />

      <!-- 出庫清單 -->
      <InputBox
        v-model="loadId"
        :label="t('A0007-loadId')"
        :placeHolder="''"
        :disabled="false"
        :readonly="false"
        :maxLength="11"
        type="text"
        width="120px"
        @validation=""
      />

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

      <!-- 狀態 -->
      <Dropdown
        v-model="status"
        :label="t('A0003-Status')"
        :options="statusOptions"
        :placeholder="''"
        :disabled="false"
        :width="'150px'"
      />

      <!-- 查詢 -->
      <a-button class="ms-3" type="primary" @click="handleSearch">{{ t('B0001-Search') }}</a-button>
    </template>

    <!-- actionBar -->
    <template #ActionBar>
      <!-- leftside -->
      <div class="d-flex justify-content-end">
        <!-- 優先度調整 -->
        <Priority
          v-model="priority"
          :label="''"
          :disabled="true"
          :min="1"
          :max="99"
          @click="adjusiPriority"
        ></Priority>
      </div>
    </template>
  </DataTable>
</template>
