<script setup>
import { ref, computed, watch } from 'vue'
import { MessageHandler } from '@/common/MessageHandler'
import { ModalHandler } from '@/common/ModalHandler'
import { SendData } from '@/common/DataSender'
import { EyeOutlined } from '@ant-design/icons-vue'
import { BindingFormatter } from '@/handlers/Binding_handle'
import { DespathFormatter } from '@/handlers/Despath_handle'
import { PriorityFormatter } from '@/handlers/Priority_handle'
import dayjs from 'dayjs'

const props = defineProps({
  mainColumns: {
    type: Array,
    required: true,
  },

  detailColumns: {
    type: Array,
    required: false,
  },

  mainData: {
    type: Array,
    required: true,
  },

  checkBox: {
    type: Boolean,
    required: false,
    default: true,
  },

  showSettingBar: {
    type: Boolean,
    required: false,
    default: true,
  },

  submitBtn: {
    type: Boolean,
    required: false,
    default: true,
  },

  adjustPriority: {
    type: Boolean,
    required: false,
    default: true,
  },

  cancelBtn: {
    type: Boolean,
    required: false,
    default: true,
  },

  submitEndpoint: {
    type: String,
    required: false,
  },

  priorityEndpoint: {
    type: String,
    required: false,
  },

  cancelEndpoint: {
    type: String,
    required: false,
  },

  expandObject: {
    type: String,
    required: false,
  },

  expandation: {
    type: Boolean,
    required: false,
    default: true,
  },
})

const selectedRowKeys = ref([])
const selectedRows = ref([])
const priorityValue = ref(20)
// Computed property to get the count of selected rows
const selectedCount = computed(() => selectedRows.value.length)

console.log('priorityEndpoint:', props.priorityEndpoint)
// handle selection
const selection = ref({
  onChange: (keys, rows) => {
    selectedRowKeys.value = keys
    selectedRows.value = rows
    // console.log(`selectedRowKeys: ${keys}`, 'selectedRows: ', rows)
  },
  onSelect: (record, selected, rows) => {
    console.log(record, selected, rows)
  },
  onSelectAll: (selected, rows, changeRows) => {
    console.log(selected, rows, changeRows)
  },
  getCheckboxProps: (record) => ({
    disabled:
      record.disabled ||
      (record.status &&
        record.status !== 'Pending' &&
        record.status !== 'Failed' &&
        record.status !== ''),
  }),
})

const despathEndpoint = 'http://10.35.10.82:5001/UI/Outbound/Order/DespathOrderInfo'

// 送出已勾選資料
const sendSelectedRows = async () => {
  if (selectedRows.value.length === 0) {
    MessageHandler.showError('請選擇資料!')
    console.log('No data selected, failed to submit!')
    return
  }

  if (selectedRows.value.some((row) => !row.storeID)) {
    MessageHandler.showError('選擇的數據中缺少 門市代號，無法送出!')
    console.log('Missing StorID data, failed to submit!')
    return
  }

  // check storeId is same or not
  const storeIDs = [...new Set(selectedRows.value.map((row) => row.storeID))]
  const isStoreIDConsistent = storeIDs.length === 1
  let confirmMessage = '是否確認送出資料?'

  if (!isStoreIDConsistent) {
    confirmMessage = '選擇的數據中包含不同的 【門市代號】，是否確定送出?'
  }

  // storeid counter
  const storeIDCounts = new Map()
  selectedRows.value.forEach((row) => {
    storeIDCounts.set(row.storeID, (storeIDCounts.get(row.storeID) || 0) + 1)
  })

  const duplicateStoreIDRows = [] // Chứa các hàng có storeID trùng nhau
  const uniqueStoreIDRows = [] // Chứa các hàng có storeID xuất hiện 1 lần

  selectedRows.value.forEach((row) => {
    if (storeIDCounts.get(row.storeID) > 1) {
      duplicateStoreIDRows.push(row)
    } else {
      uniqueStoreIDRows.push(row)
    }
  })

  // Kiểm tra nhóm dữ liệu
  console.log('Dulicata storeid data:', duplicateStoreIDRows)
  console.log('Unique storeid data:', uniqueStoreIDRows)

  // Nếu có dữ liệu trùng storeID, gửi qua formatter
  let formattedDuplicateData = []
  if (duplicateStoreIDRows.length > 0) {
    formattedDuplicateData = BindingFormatter(duplicateStoreIDRows)
    console.log('Formatted Duplicate Data:', formattedDuplicateData)
  }

  let formattedUniqueData = []
  if (uniqueStoreIDRows.length > 0) {
    formattedUniqueData = DespathFormatter(uniqueStoreIDRows)
    console.log('Formatted Unique Data:', formattedUniqueData)
  }

  ModalHandler.confirm({
    title: 'Confirm Action',
    content: confirmMessage,
    onOk: async () => {
      // const formattedData = BindingFormatter(selectedRows.value)
      // console.log('Formatted Data:', formattedData)
      // const updatedRows = selectedRows.value.map((row) => ({
      //   customerOrderID: row.customerOrderID,
      //   zoneID: row.zoneID,
      //   warehouseID: row.warehouseID,
      //   customerID: row.customerID,
      //   storeID: row.storeID,
      // }))
      // console.log(selectedRows)
      // const result = await SendData(API, updatedRows)

      let duplicateResult = null
      let uniqueResult = null

      // Nếu có dữ liệu trùng storeID, gửi đến `submitEndpoint`
      if (formattedDuplicateData.length > 0) {
        duplicateResult = await SendData(props.submitEndpoint, formattedDuplicateData)
      }

      // Nếu có dữ liệu duy nhất, gửi đến `alternateEndpoint`
      if (formattedUniqueData.length > 0) {
        uniqueResult = await SendData(despathEndpoint, formattedUniqueData)
      }

      // Kiểm tra xem cả hai yêu cầu có thành công không
      if (duplicateResult || uniqueResult) {
        console.log('successful')
        console.log('duplicateResult:', duplicateResult)
        console.log('uniqueResult:', uniqueResult)
        selectedRows.value.forEach((row) => {
          row.disabled = true
        })

        // Xóa danh sách đã chọn
        selectedRows.value.splice(0, selectedRows.value.length)
        selectedRowKeys.value.splice(0, selectedRowKeys.value.length)
        console.log('Cleared selectedRows:', selectedRows.value)
      }

      // const result = await SendData(props.submitEndpoint, formattedData)
      // if(result){
      //   console.log('successful')
      //   selectedRows.value.forEach(row => {
      //     row.disabled = true
      //   })

      //   selectedRows.value.splice(0, selectedRows.value.length) // clear variable
      //   selectedRowKeys.value.splice(0, selectedRowKeys.value.length) // clear variable
      //   console.log(selectedRows)
      // }
    },
    onCancel: () => {
      console.log('cancel submit data!')
    },
  })
}

// update 優先度
const updatePriority = () => {
  if (selectedRows.value.length === 0) {
    MessageHandler.showError('請選擇資料!')
    return
  }

  let formattedPriorityData = []
  if (selectedRows.value.length > 0) {
    formattedPriorityData = PriorityFormatter(selectedRows.value, priorityValue.value)
    console.log('Formatted Priority Data:', formattedPriorityData)
  }
  ModalHandler.confirm({
    title: '確認調整優先度',
    content: '是否確認調整資料?',
    onOk: async () => {
      // const updatedRows = selectedRows.value.map((row) => ({
      //   customerOrderID: row.customerOrderID,
      //   zoneID: row.zoneID,
      //   warehouseID: row.warehouseID,
      //   customerID: row.customerID,
      //   priority: priorityValue.value,
      // }))
      // console.log('Update Priority:', priorityValue.value)
      // await SendData(props.priorityEndpoint, updatedRows)
      let PriorityResponse = null
      if (formattedPriorityData.length > 0) {
        PriorityResponse = await SendData(props.priorityEndpoint, formattedPriorityData)
      }

      if (PriorityResponse) {
        console.log('PriorityResponse:', PriorityResponse)
        selectedRows.value.splice(0, selectedRows.value.length)
        selectedRowKeys.value.splice(0, selectedRowKeys.value.length)
      }
    },
    onCancel: () => {
      console.log('cancel update priority!')
    },
  })
}

// update 優先度
const Cancel = () => {
  if (selectedRows.value.length === 0) {
    MessageHandler.showError('請選擇資料!')
    return
  }

  ModalHandler.confirm({
    title: '確認取消',
    content: '是否確認取消?',
    onOk: async () => {
      const updatedRows = selectedRows.value.map((row) => ({
        customerOrderID: row.customerOrderID,
        zoneID: row.zoneID,
        warehouseID: row.warehouseID,
        customerID: row.customerID,
      }))
      await SendData(props.cancelEndpoint, updatedRows)
    },
    onCancel: () => {
      console.log('cancel the "cancel" action!')
    },
  })
}

const emit = defineEmits(['show'])
const handleClick = (displayID) => {
  emit('show', displayID)
}

// status formatter
const statusFormatter = (status) => {
  const statusMap = {
    '': '佇列中(等待獲取資料)',
    Pending: '佇列中',
    Processing: '進行中',
    Processed: '已發送',
    DeliveryFailed: '發送異常',
    InProgress: '設備搬運中',
    Failed: '異常(任務異常)',
    Sucessed: '已完成(任務已完成)',
  }
  return statusMap[status] || status //return original status if not found
}

const getStatusColor = (status) => {
  switch (status) {
    case '':
    case 'Pending':
      return 'gray'
    case 'Processing':
    case 'Inprogress':
      return 'orange'
    case 'Processed':
      return 'blue'
    case 'Sucessed': // Successed
      return 'green'
    case 'Failed':
    case 'DeliveryFailed':
      return 'red'
    default:
      return 'default' // default color
  }
}

const getStatusCodeColor = (status_code) => {
  switch (status_code) {
    case 100:
    case 101:
      return 'lightblue' // Continue

    case 200:
    case 201:
    case 202:
    case 204:
      return 'blue' //Success

    case 300:
    case 301:
    case 302:
    case 304:
      return 'purple' //Redirects

    case 400:
    case 401:
    case 403:
    case 404:
    case 408:
      return 'orange' //Client Errors

    case 500:
    case 501:
    case 502:
    case 503:
    case 504:
      return 'red' //Server Errors

    default:
      return 'gray' //default color
  }
}

// format date
const formatDate = (dateString) => {
  return dayjs(dateString).format('YYYY-MM-DD HH:mm:ss')
}
</script>

<template>
  <div v-if="showSettingBar" class="d-flex px-3 pt-3 bg-white rounded-3">
    <div class="me-auto">
      <!-- 送出 btn -->
      <button v-if="submitBtn" type="button" class="btn btn-primary" @click="sendSelectedRows">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          class="bi bi-send"
          viewBox="0 0 16 16"
        >
          <path
            d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z"
          ></path>
        </svg>
        送出
      </button>
      <span v-if="selectedCount > 0" class="ms-3 align-self-center"
        >已選擇 {{ selectedCount }} 筆</span
      >
    </div>

    <!-- binding btn -->

    <!-- <div class="me-auto">
      <button v-if="submitBtn" type="button" class="btn btn-primary" @click="sendSelectedRows">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-send"
          viewBox="0 0 16 16">
          <path
            d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z">
          </path>
        </svg>
        binding
      </button>
    </div> -->

    <div class="d-flex align-items-center">
      <div v-if="adjustPriority">
        <!-- 輸入優先度 -->
        <a-input-number
          v-model:value="priorityValue"
          id="inputNumber"
          placeholder="優先度"
          :min="1"
          :max="100"
        />
        <!-- 調整 btn -->
        <button class="btn btn-outline-secondary px-4 mx-3" @click="updatePriority">調整</button>
      </div>

      <div v-if="cancelBtn">
        <!-- 取消 btn -->
        <button class="btn btn-outline-danger" @click="Cancel">取消</button>
      </div>
    </div>
  </div>
  <div class="pt-3">
    <a-table
      :columns="mainColumns"
      :data-source="mainData"
      :row-selection="checkBox ? selection : null"
      :expand-column-width="50"
      :row-key="(record) => record.DisplayID"
      bordered
      :pagination="{ showSizeChanger: true }"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'operation'">
          <a @click="handleClick(record.DisplayID)">
            <EyeOutlined />
          </a>
        </template>

        <template v-if="column.dataIndex === 'shippingTime'">
          {{ formatDate(record.shippingTime) }}
        </template>

        <template v-if="column.dataIndex === 'createTime'">
          {{ formatDate(record.createTime) }}
        </template>

        <template v-if="column.dataIndex === 'updateTime'">
          {{ formatDate(record.updateTime) }}
        </template>

        <template v-if="column.dataIndex === 'TimeStamp'">
          {{ formatDate(record.TimeStamp) }}
        </template>

        <template v-if="column.dataIndex === 'despatchTime'">
          {{ formatDate(record.createTime) }}
        </template>

        <template v-if="column.key === 'status'">
          <span>
            <a-tag :color="getStatusColor(record.status)">
              <!-- {{ record.status.toUpperCase() }} -->
              {{ statusFormatter(record.status) }}
            </a-tag>
          </span>
        </template>

        <template v-if="column.key === 'statusCode'">
          <span>
            <a-tag :color="getStatusCodeColor(record.statusCode)">
              {{ record.statusCode }}
            </a-tag>
          </span>
        </template>

        <template v-if="column.key === 'remark1'">
          {{ record.remark1 === 'Merged' ? '綁定訂單' : record.remark1 }}
        </template>
      </template>
      <!-- expand column -->
      <template #expandColumnTitle>
        <span>展開</span>
      </template>
      <!-- expand column -->
      <template v-if="expandation" #expandedRowRender="{ record }">
        <a-table
          :columns="detailColumns"
          :data-source="record[expandObject]"
          :pagination="false"
          :row-key="(record) => record.DisplayID"
          style="background: #f0f2f5; margin: 16px"
        ></a-table>
      </template>
    </a-table>
  </div>
</template>
