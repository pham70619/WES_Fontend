<script setup>
import { ref, computed } from 'vue'
import DataTable from '@/components/dataTable/DataTable.vue'
import InputBox from '@/components/searchComponent/InputBox.vue'
import Dropdown from '@/components/searchComponent/Dropdown.vue'
import { StockAdjustService } from '@/Serveice/StockAdjustService'
import StockAdjustBody from '@/Serveice/bodyConfig/StockAdjustBodyConfig'
import Priority from '@/components/searchComponent/Priority.vue'
import { useI18n } from 'vue-i18n'
import { MessageHandler } from '@/common/MessageHandler'
import { ModalHandler } from '@/common/ModalHandler'

// define variable
const { t } = useI18n()
const palletId = ref('')
const timeStamp = ref('')
const errorMsg = ref('')
const main_data = ref([])
const selectedData = ref([])
const loading = ref(false)
const totalCount = ref(0)
const stockAdjustService = StockAdjustService()
const Size = ref('')
const Page = ref('')
const Sort = ref('')
const Order = ref('')
const dataTableRef = ref('')

// define columns
const main_columns = computed(() => [
  { title: t('T0026-orderId'), dataIndex: 'CustomerOrderID', key: 'CustomerOrderID' },
  { title: t('T0017-productId'), dataIndex: 'ProductID', key: 'ProductID' },
  { title: t('T0010-palletId'), dataIndex: 'PalletID', key: 'PalletID' },
  { title: t('T0018-quantity'), dataIndex: 'Quantity', key: 'Quantity' },
  { title: t('T0002-timestamp'), dataIndex: 'TimeStamp', key: 'TimeStamp' },
  { title: t('T0003-reason'), dataIndex: 'Reason', key: 'Reason' },
  { title: t('T0020-version'), dataIndex: 'Version', key: 'Version' },
  { title: t('T0021-ownerId'), dataIndex: 'OwnerID', key: 'OwnerID' },
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
  const body = StockAdjustBody.fetchData(timeStamp.value, palletId.value)
  console.log('body:', body)

  // get params
  const params = {
    batch: pageSize,
    skip: (currentPage - 1) * pageSize,
    // sort: sort,
    // order: order,
  }

  // call api
  stockAdjustService
    .GetStockAdjustData(body, params)
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
    :detailColumns="undefined"
    :data="main_data"
    :totalRecord="totalCount"
    :checkBox="false"
    :loading="loading"
    :expandable="false"
    :expandObject="'productList'"
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

      <!-- 建立日期 -->
      <InputBox
        v-model="timeStamp"
        :label="t('A0010-createTime')"
        :placeHolder="''"
        :disabled="false"
        :readonly="false"
        :maxLength="undefined"
        type="date"
        width="120px"
        @validation=""
      />

      <!-- 查詢 -->
      <a-button class="ms-3" type="primary" @click="handleSearch">{{ t('B0001-Search') }}</a-button>
    </template>
  </DataTable>
</template>
