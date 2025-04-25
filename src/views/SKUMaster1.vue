<script setup>
import { ref, computed } from 'vue'
import DataTable from '@/components/dataTable/DataTable.vue'
import InputBox from '@/components/searchComponent/InputBox.vue'
import Dropdown from '@/components/searchComponent/Dropdown.vue'
import { SKUMasterService } from '@/Serveice/SKUMasterService'
import SKUMasterBody from '@/Serveice/bodyConfig/SKUMasterBodyConfig'
import Priority from '@/components/searchComponent/Priority.vue'
import { useI18n } from 'vue-i18n'
import { MessageHandler } from '@/common/MessageHandler'
import { ModalHandler } from '@/common/ModalHandler'

// define variable
const { t } = useI18n()
const productId = ref('')
const createTime = ref('')
const ownerId = ref('')
const status = ref('')
const priority = ref('')
const statusOptions = computed(() => [
  { label: t('L0007-selectAll'), value: '' },
  { label: t('L0000-pending'), value: 'Pending' },
  { label: t('L0001-processing'), value: 'Processing' },
  { label: t('L0002-processed'), value: 'Processed' },
  { label: t('L0003-deliveryFailed'), value: 'DeliveryFailed' },
  { label: t('L0004-inProgress'), value: 'InProgress' },
  { label: t('L0005-successed'), value: 'SyncSuccessed' },
  { label: t('L0006-failed'), value: 'Failed' },
])
const errorMsg = ref('')
const main_data = ref([])
const selectedData = ref([])
const loading = ref(false)
const totalCount = ref(0)
const skuMasterService = SKUMasterService()
const Size = ref('')
const Page = ref('')
const Sort = ref('')
const Order = ref('')
const dataTableRef = ref('')

// define columns
const main_columns = computed(() => [
  { title: t('T0008-requestId'), dataIndex: 'requestID', key: 'requestID' },
  { title: t('T0009-messageType'), dataIndex: 'messageType', key: 'messageType' },
  { title: t('T0017-productId'), dataIndex: 'productID', key: 'productID' },
  { title: t('T0001-description'), dataIndex: 'description', key: 'description' },
  { title: t('T0015-createTime'), dataIndex: 'createTime', key: 'createTime' },
  { title: t('T0012-status'), dataIndex: 'status', key: 'status' },
  { title: t('T0021-ownerId'), dataIndex: 'ownerID', key: 'ownerID' },
])
const detail_columns = computed(() => [
  { title: t('T0020-version'), dataIndex: 'versionNumber', key: 'versionNumber' },
  { title: t('T0001-description'), dataIndex: 'versionDescription', key: 'versionDescription' },
  { title: t('T0015-createTime'), dataIndex: 'timeStamp', key: 'timeStamp' },
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
  const body = SKUMasterBody.fetchData(
    createTime.value,
    productId.value,
    ownerId.value,
    status.value,
  )
  console.log('body:', body)

  // get params
  const params = {
    batch: pageSize,
    skip: (currentPage - 1) * pageSize,
    // sort: sort,
    // order: order,
  }

  // call api
  skuMasterService
    .getSKUMasterData(body, params)
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
    :expandObject="'versionList'"
    @fetchData="handleParamsAndFetch"
    @selectionChanged="handleSelectionChanged"
  >
    <!-- searchBar -->
    <template #Searchbar>
      <!-- 貨號 -->
      <InputBox
        v-model="productId"
        :label="t('A0008-productId')"
        :placeHolder="''"
        :disabled="false"
        :readonly="false"
        :maxLength="10"
        type="text"
        width="120px"
        @validation=""
      />

      <!-- 客戶代號 -->
      <InputBox
        v-model="ownerId"
        :label="t('A0009-ownerId')"
        :placeHolder="''"
        :disabled="false"
        :readonly="false"
        :maxLength="15"
        type="text"
        width="120px"
        @validation=""
      />

      <!-- 建立日期 -->
      <InputBox
        v-model="createTime"
        :label="t('A0010-createTime')"
        :placeHolder="''"
        :disabled="false"
        :readonly="false"
        :maxLength="10"
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
  </DataTable>
</template>
