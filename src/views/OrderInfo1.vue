<script setup>
import { APIServer, APIPaths } from '@/common/ApiPath'
import { ref, computed } from 'vue'
import DataTable from '@/components/dataTable/DataTable.vue'
import InputBox from '@/components/searchComponent/InputBox.vue'
import Dropdown from '@/components/searchComponent/Dropdown.vue'
import { OrderInfoService } from '@/Serveice/OrderinfoService'
import OrderInfoBody from '@/Serveice/bodyConfig/OrderInfoBodyConfig.js'
import Priority from '@/components/searchComponent/Priority.vue'
import { useI18n } from 'vue-i18n'
import { MessageHandler } from '@/common/MessageHandler'
import { ModalHandler } from '@/common/ModalHandler'

// define variable
const { t } = useI18n()
const storeId = ref('')
const shippingTime = ref('')
const orderId = ref('')
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
const orderInfoService = OrderInfoService()
const Size = ref('')
const Page = ref('')
const Sort = ref('')
const Order = ref('')
const dataTableRef = ref('')

// define columns
const main_columns = computed(() => [
  { title: t('T0024-storeId'), dataIndex: 'storeID', key: 'storeID' },
  { title: t('T0009-messageType'), dataIndex: 'messageType', key: 'messageType' },
  { title: t('T0025-priority'), dataIndex: 'priority', key: 'priority' },
  { title: t('T0026-orderId'), dataIndex: 'customerOrderID', key: 'customerOrderID' },
  { title: t('T0027-zoneId'), dataIndex: 'zoneID', key: 'zoneID' },
  {
    title: t('T0028-shippingTime'),
    dataIndex: 'shippingTime',
    key: 'shippingTime',
    sorter: (a, b) => new Date(a.shippingTime).getTime() - new Date(b.shippingTime).getTime(),
    defaultSortOrder: 'descend',
  },
  { title: t('T0015-createTime'), dataIndex: 'createTime', key: 'createTime' },
  { title: t('T0029-updateTime'), dataIndex: 'updateTime', key: 'updateTime' },
  { title: t('T0030-updateBy'), dataIndex: 'updateBy', key: 'updateBy' },
  { title: t('T0012-status'), dataIndex: 'status', key: 'status' },
  { title: t('T0031-binding'), dataIndex: 'remark1', key: 'remark1' },
  { title: t('T0013-customerId'), dataIndex: 'customerID', key: 'customerID' },
])

const detail_columns = computed(() => [
  { title: t('T0017-productId'), dataIndex: 'productID', key: 'productID' },
  { title: t('T0018-quantity'), dataIndex: 'quantity', key: 'quantity' },
  { title: t('T0020-version'), dataIndex: 'version', key: 'version' },
  { title: t('T0021-ownerId'), dataIndex: 'ownerID', key: 'ownerID' },
  { title: t('T0023-expiry'), dataIndex: 'expiry', key: 'expiry' },
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
  const body = OrderInfoBody.fetchData(
    shippingTime.value,
    storeId.value,
    orderId.value,
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
  orderInfoService
    .getOrderInfoData(body, params)
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
// submit Orderinfo data
const submitData = () => {
  if (selectedData.value.length === 0) {
    MessageHandler.showError(t('M0003-plsSelectData'))
    return
  }

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

  // get orderid List
  const orders = selectedData.value.map((item) => item.customerOrderID)
  const body = OrderInfoBody.submitData(orders, baseCustomerID, baseWarehouseID, baseZoneID)

  ModalHandler.confirm({
    title: t('P0000-orderInfo'),
    content: t('M0008-confSubmit'),
    onOk: () => {
      console.log('body:', body.data)
      orderInfoService
        .submitData(body.data)
        .then((response) => {
          selectedData.value = []
          dataTableRef.value.resetSelectedData()
          console.log('submit order successful:', response)
        })
        .catch((error) => {
          console.error('submit order failed:', error)
        })
    },
    onCancel: () => {
      // clear selected data
      selectedData.value = []
      // call clear selected data function in table
      dataTableRef.value.resetSelectedData()
    },
  })
}

// binding data
const bindingData = () => {
  if (selectedData.value.length === 0) {
    MessageHandler.showError(t('M0003-plsSelectData'))
    return
  }

  if (selectedData.value.length === 1) {
    MessageHandler.showError(t('M0010-lessthan2'))
    return
  }

  const baseStoreId = selectedData.value[0].storeID
  const baseCustomerID = selectedData.value[0].customerID
  const baseWarehouseID = selectedData.value[0].warehouseID
  const baseZoneID = selectedData.value[0].zoneID
  const isAllSame = selectedData.value.every((item) => item.storeID === baseStoreId)
  if (!isAllSame) {
    MessageHandler.showError('選取的資料包含不同的 StoreID，請重新選擇！')
    return
  }

  //  get orderid list
  const orders = selectedData.value.map((item) => item.customerOrderID)
  const body = OrderInfoBody.bindingData(
    orders,
    baseStoreId,
    baseCustomerID,
    baseWarehouseID,
    baseZoneID,
  )

  ModalHandler.confirm({
    title: t('P0000-orderInfo'),
    content: t('M0009-confBinding'),
    onOk: () => {
      console.log('body:', body.data)
      orderInfoService
        .bindingData(body.data)
        .then((response) => {
          selectedData.value = []
          dataTableRef.value.resetSelectedData()
          console.log('submit order successful:', response)
        })
        .catch((error) => {
          console.error('submit order failed:', error)
        })
    },
    onCancel: () => {
      selectedData.value = []
      dataTableRef.value.resetSelectedData()
    },
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

  const orders = selectedData.value.map((item) => item.customerOrderID)
  console.log('orders:', orders)
  // const customerID = selectedData.value[0]?.customerID || ''
  // const warehouseID = selectedData.value[0]?.warehouseID || ''
  // const zoneID = selectedData.value[0]?.zoneID || ''

  const body = OrderInfoBody.updatePriority(
    orders,
    baseCustomerID,
    baseWarehouseID,
    baseZoneID,
    priority.value,
  )
  console.log('body:', body.data)
  ModalHandler.confirm({
    title: t('P0000-orderInfo'),
    content: t('M0002-confimAdjustPriority', { priority: priority.value }),
    onOk: () => {
      orderInfoService
        .adjustPriority(body.data)
        .then((response) => {
          // MessageHandler.showSuccess()
          // clear selected data
          selectedData.value = []
          // call clear selected data function in table
          dataTableRef.value.resetSelectedData()
          console.log('adjust priority successful:', response)
        })
        .catch((error) => {
          // MessageHandler.showError('處理失敗!')
          console.error('fail to adjust priority:', error)
        })
    },
    onCancel: () => {
      // clear selected data
      selectedData.value = []
      // call clear selected data function in table
      dataTableRef.value.resetSelectedData()
    },
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
    :checkBox="true"
    :loading="loading"
    :expandable="true"
    :expandObject="'productList'"
    @fetchData="handleParamsAndFetch"
    @selectionChanged="handleSelectionChanged"
  >
    <!-- searchBar -->
    <template #Searchbar>
      <!-- 門市代號 -->
      <InputBox
        v-model="storeId"
        :label="t('A0004-storeID')"
        :placeHolder="''"
        :disabled="false"
        :readonly="false"
        :maxLength="10"
        type="text"
        width="120px"
        @validation=""
      />

      <!-- 訂單編號 -->
      <InputBox
        v-model="orderId"
        :label="t('A0005-orderID')"
        :placeHolder="''"
        :disabled="false"
        :readonly="false"
        :maxLength="12"
        type="text"
        width="120px"
        @validation=""
      />

      <!-- 出貨日期 -->
      <InputBox
        v-model="shippingTime"
        :label="t('A0006-shippingTime')"
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
      <div class="d-flex justify-content-between">
        <!-- rightside -->
        <div>
          <!-- 送出 -->
          <button type="button" class="btn btn-primary" @click="submitData">
            <i class="bi bi-send"></i>
            {{ t('B0002-Submit') }}
          </button>
          <span v-if="selectedData.length > 0" class="ms-3">
            {{ t('M0000-SelectedCount', { count: selectedData.length }) }}</span
          >
        </div>

        <!-- leftside -->
        <div class="d-flex align-items-center">
          <!-- 取消 -->
          <!-- <button class="ms-3 btn btn-danger" @click="cancel">
            {{ t('B0000-Cancel') }}
          </button> -->

          <!-- 綁定 -->
          <button class="ms-3 btn btn-primary" @click="bindingData">
            {{ t('B0004-binding') }}
          </button>

          <!-- vertical line -->
          <div class="vr mx-3"></div>

          <!-- 優先度調整 -->
          <Priority
            v-model="priority"
            :label="''"
            :disabled="false"
            :min="1"
            :max="99"
            @click="adjusiPriority"
          ></Priority>
        </div>
      </div>
    </template>
  </DataTable>
</template>
