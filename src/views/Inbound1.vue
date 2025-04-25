<script setup>
import { APIServer, APIPaths } from '@/common/ApiPath'
import { ref, computed } from 'vue'
import DataTable from '@/components/dataTable/DataTable.vue'
import InputBox from '@/components/searchComponent/InputBox.vue'
import Dropdown from '@/components/searchComponent/Dropdown.vue'
import { InboundService } from '@/Serveice/InboundService'
import { inboundBody } from '@/Serveice/apiService/BodyConfig'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const containerId = ref('')
const _date = ref('')
const status = ref('')
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
const inboundService = InboundService()
const Size = ref('')
const Page = ref('')
const Sort = ref('')
const Order = ref('')
const dataTableRef = ref('')

const cancel_endpoint = `${APIServer}${APIPaths.InboundCancel}`

const main_columns = computed(() => [
  { title: t('T0008-requestId'), dataIndex: 'requestID', key: 'requestID' },
  { title: t('T0009-messageType'), dataIndex: 'messageType', key: 'messageType' },
  { title: t('T0010-palletId'), dataIndex: 'palletID', key: 'palletID' },
  { title: t('T0011-destination'), dataIndex: 'destination', key: 'destination' },
  {
    title: t('T0014-zoneId'),
    dataIndex: 'zoneID',
    key: 'zoneID',
  },
  {
    title: t('T0015-createTime'),
    dataIndex: 'createTime',
    key: 'createTime',
    sorter: (a, b) => new Date(a.createTime).getTime() - new Date(b.createTime).getTime(),
    defaultSortOrder: 'descend',
  },
  { title: t('T0012-status'), dataIndex: 'status', key: 'status' },
  { title: t('T0013-customerId'), dataIndex: 'customerID', key: 'customerID' },
])

const detail_columns = computed(() => [
  { title: t('T0017-productId'), dataIndex: 'productID', key: 'productID' },
  { title: t('T0018-quantity'), dataIndex: 'quantity', key: 'quantity' },
  { title: t('T0019-layer'), dataIndex: 'layer', key: 'layer' },
  { title: t('T0020-version'), dataIndex: 'version', key: 'version' },
  { title: t('T0021-ownerId'), dataIndex: 'ownerID', key: 'ownerID' },
  { title: t('T0022-batch'), dataIndex: 'batch', key: 'batch' },
  { title: t('T0023-expiry'), dataIndex: 'expiry', key: 'expiry' },
])

// handle when selection change
const handleSelectionChanged = (data) => {
  selectedData.value = data
  console.log(selectedData.value)
}

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

  const currentPage = Number.isInteger(page) && page > 0 ? page : 1
  const pageSize = Number.isInteger(size) && size > 0 ? size : Page.value
  const sortField = sort ?? Sort.value
  const sortOrder = order ?? Order.value

  console.log('[fetchData] Gọi API với:')
  console.log('➡️ page:', currentPage)
  console.log('➡️ size:', pageSize)
  console.log('➡️ sort:', sortField)
  console.log('➡️ order:', sortOrder)

  // get body
  const body = inboundBody(_date.value, containerId.value, status.value)
  console.log('body:', body)

  // get params
  const params = {
    batch: pageSize,
    skip: (currentPage - 1) * pageSize,
    // sort: sort,
    // order: order,
  }

  // call api
  inboundService
    .getInboundData(body, params)
    .then((response) => {
      main_data.value = response.resultData || []
      // main_data.value = response.datalist || []
      // main_data.value = response.datalist.map((inbound) => ({
      //   requestID: inbound.requestID,
      //   messageType: inbound.messageType,
      //   palletID: inbound.palletID,
      // }))

      totalCount.value = response.successCount || 0
      console.log('data fetched:', response)
    })
    .catch((error) => {
      console.error('failed to fetch data:', error)
    })
    .finally(() => {
      loading.value = false
    })
}

const validateUsername = (value) => {
  if (!value) {
    errorMsg.value = 'Không được để trống!'
  } else if (value.length < 3) {
    errorMsg.value = 'Phải từ 3 ký tự trở lên!'
  } else {
    errorMsg.value = ''
  }
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
    :expandObject="'productList'"
    @fetchData="handleParamsAndFetch"
    @selectionChanged="handleSelectionChanged"
  >
    <!-- searchBar -->
    <template #Searchbar>
      <!-- 板號 -->
      <InputBox
        v-model="containerId"
        :label="t('A0001-palletID')"
        :placeHolder="''"
        :disabled="false"
        :readonly="false"
        :maxLength="10"
        type="text"
        width="120px"
        @validation="validateUsername"
      />
      <!-- <p class="m-0" v-if="errorMsg" style="color: red">{{ errorMsg }}</p> -->

      <!-- 日期 -->
      <InputBox
        v-model="_date"
        :label="t('A0002-Date')"
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

      <!-- search btn -->
      <a-button class="ms-3" type="primary" @click="handleSearch">{{ t('B0001-Search') }}</a-button>
    </template>

    <!-- actionBar -->
    <!-- <template #ActionBar> -->
    <!-- <div class="d-flex justify-content-between"> -->
    <!-- rightside -->
    <!-- <div>
          重新送出 btn
          <button type="button" class="btn btn-primary" @click="submit">
            <i class="bi bi-send"></i>
            {{ t('B0002-Submit') }}
          </button>
          <span v-if="selectedData.length > 0" class="ms-3">
            {{ t('M0000-SelectedCount', { count: selectedData.length }) }}</span
          >
        </div> -->

    <!-- leftside -->
    <!-- <div>
          取消 btn
          <button class="ms-3 btn btn-danger" @click="cancel">
            {{ t('B0000-Cancel') }}
          </button>
        </div> -->
    <!-- </div> -->
    <!-- </template> -->
  </DataTable>
</template>
