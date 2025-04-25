<script setup>
import { ref, computed } from 'vue'
import { MessageHandler } from '@/common/MessageHandler'
import { ModalHandler } from '@/common/ModalHandler'
import { SendData } from '@/common/DataSender'
import { EyeOutlined } from '@ant-design/icons-vue'
import { formatter } from '@/handlers/Binding_handle'
import dayjs from "dayjs"

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
    required: true,
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
    disabled: record.disabled || (record.status && record.status !== 'Pending' && record.status !== 'Failed' && record.status !== ""),
  }),
})



// 送出已勾選資料
const sendSelectedRows = async () => {
  if (selectedRows.value.length === 0) {
    MessageHandler.showError('請選擇資料!')
    console.log('No data selected, failed to submit!')
    return
  }

  if (selectedRows.value.some(row => !row.storeID)) {
    MessageHandler.showError('選擇的數據中缺少 門市代號，無法送出!')
    console.log('Missing StorID data, failed to submit!')
    return
  }

  // check storeId is same or not 
  const storeIDs = [...new Set(selectedRows.value.map(row => row.storeID))]
  const isStoreIDConsistent = storeIDs.length ===1;
  let confirmMessage = '是否確認送出資料?'

  if(!isStoreIDConsistent){
    confirmMessage = '選擇的數據中包含不同的 【門市代號】，是否確定送出?';
  }

  ModalHandler.confirm({
    title: 'Confirm Action',
    content: confirmMessage,
    onOk: async () => {
      const formattedData = formatter(selectedRows.value)
      console.log('Formatted Data:', formattedData)
      // const updatedRows = selectedRows.value.map((row) => ({
      //   customerOrderID: row.customerOrderID,
      //   zoneID: row.zoneID,
      //   warehouseID: row.warehouseID,
      //   customerID: row.customerID,
      //   storeID: row.storeID,
      // }))
      // console.log(selectedRows)
      // const result = await SendData(props.submitEndpoint, updatedRows)
      const result = await SendData(props.submitEndpoint, formattedData)
      if(result){
        console.log('successful')
        selectedRows.value.forEach(row => {
          row.disabled = true
        })
      
        selectedRows.value.splice(0, selectedRows.value.length) // clear variable
        selectedRowKeys.value.splice(0, selectedRowKeys.value.length) // clear variable
        console.log(selectedRows)
      }
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

  ModalHandler.confirm({
    title: '確認調整優先度',
    content: '是否確認調整資料?',
    onOk: async () => {
      const updatedRows = selectedRows.value.map((row) => ({
        customerOrderID: row.customerOrderID,
        zoneID: row.zoneID,
        warehouseID: row.warehouseID,
        customerID: row.customerID,
        priority: priorityValue.value,
      }))
      console.log('Update Priority:', priorityValue.value)
      await SendData(props.priorityEndpoint, updatedRows)
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
const handleClick = (key) => {
  emit('show', key)
}

const getStatusColor = (status) => {
  switch (status) {
    case 'Pending':
      return 'gray'
    case 'Processing':
      return 'orange'
    case 'Processed':
      return 'blue'
    case 'Successed':
      return 'green'
    case 'Failed':
      return 'red'
    default:
      return 'default' // Màu mặc định nếu không xác định được trạng thái
  }
}

// format date
const formatDate = (dateString) =>{
  return dayjs(dateString).format("YYYY-MM-DD HH:mm:ss");
}
</script>

<template>
  <div v-if="showSettingBar" class="d-flex px-3 pt-3 bg-white rounded-3">
    <div class="me-auto">
      <!-- 送出 btn -->
      <button v-if="submitBtn" type="button" class="btn btn-primary" @click="sendSelectedRows">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-send"
          viewBox="0 0 16 16">
          <path
            d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z">
          </path>
        </svg>
        送出
      </button>
      <span v-if="selectedCount > 0" class="ms-3 align-self-center">已選擇 {{ selectedCount }} 筆</span>
    </div>

    <div class="d-flex align-items-center">
      <div v-if="adjustPriority">
        <!-- 輸入優先度 -->
        <a-input-number v-model:value="priorityValue" id="inputNumber" placeholder="優先度" :min="1" :max="100" />
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
    <a-table :columns="mainColumns" :data-source="mainData" :row-selection="checkBox ? selection : null"
      :expand-column-width="50" :row-key="(record) => record.requestID" bordered>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'operation'">
          <a @click="handleClick(record.key)">
            <EyeOutlined />
          </a>
        </template>

        <template v-if="column.dataIndex === 'shippingTime'">
          {{ formatDate(record.shippingTime) }}
        </template>

        <template v-if="column.dataIndex === 'createTime'">
          {{ formatDate(record.createTime) }}
        </template>

        <template v-if="column.key === 'status'">
          <span>
            <a-tag :color="getStatusColor(record.status)">
              {{ record.status.toUpperCase() }}
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
        <a-table :columns="detailColumns" :data-source="record[expandObject]" :pagination="false"
          :row-key="(record) => record.requestID" style="background: #f0f2f5; margin: 16px"></a-table>
      </template>
    </a-table>
  </div>
</template>
