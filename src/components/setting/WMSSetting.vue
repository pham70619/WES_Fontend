<script setup>
import { computed, ref } from 'vue'
import EditModal from './EditModal.vue'
import { ModalHandler } from '@/common/ModalHandler'

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
})

const DBTable_Columns = [
  { title: 'WAREHOUSE_ID', dataIndex: 'warehouseId', key: 'warehouseId', width: 140 },
  { title: 'COMPANY_ID', dataIndex: 'companyId', key: 'companyId' },
  { title: 'ZONE_ID', dataIndex: 'zoneId', key: 'zoneId' },
  { title: 'IP', dataIndex: 'ip', key: 'ip' },
  { title: 'Port', dataIndex: 'port', key: 'port' },
  { title: '路徑', dataIndex: 'path', key: 'path', width: 310 },
  { title: '帳號', dataIndex: 'username', key: 'username' },
  { title: '密碼', dataIndex: 'password', key: 'password' },
  { title: '格式', dataIndex: 'format', key: 'format', width: 70 },
  {
    title: '是否實際回傳',
    dataIndex: 'isActual',
    key: 'isActual',
    customRender: ({ text }) => (text ? '是' : '否'),
  },
  { title: '建立時間', dataIndex: 'date', key: 'date' },
  { title: '建立人員', dataIndex: 'createBy', key: 'createBy' },
  { title: '最後更新時間', dataIndex: 'updateAt', key: 'updateAt' },
  { title: '更新人員', dataIndex: 'updateBy', key: 'updateBy' },
  { title: '描述', dataIndex: 'description', key: 'description' },
  { title: 'Action', key: 'operation', fixed: 'right' },
]

const transMethod = ref('DBTable')
const Mode = ref()
const isEditModalOpen = ref(false)
const editingRecord = ref(null)
const emit = defineEmits(['updateData'])
// open edit modal
const openEditModal = (record) => {
  if (record) {
    Mode.value = 'Edit'
    editingRecord.value = { ...record } // Copy data
  } else {
    Mode.value = 'Add'
    editingRecord.value = {} // Initialize new record
  }
  console.log('data in editing:', editingRecord)
  isEditModalOpen.value = true
}

// close edit modal
const closeEditModal = () => {
  isEditModalOpen.value = false
}

// add or edit data
//_record 是 editModal 回傳的資料
const saveRecord = (_record) => {
  if (Mode.value === 'Add') {
    _record.id = new Date().getTime() // Generate a unique id (e.g., timestamp)
    _record.type = transMethod.value //add type
    console.log(`Item ${_record.id} has been added!`)
    emit('updateData', { action: 'add', record: _record, component: 'WMS' })
  } else if (Mode.value === 'Edit') {
    console.log(`Item ${_record.id} has been edited!`)
    emit('updateData', { action: 'edit', record: _record, component: 'WMS' })
  }
  isEditModalOpen.value = false
}

// delete data
const deleteRecord = (_record) => {
  ModalHandler.confirm({
    title: '確認刪除資料',
    content: '是否確定刪除資料?',
    onOk: async () => {
      console.log(`WMS/${_record.type} data with ID: ${_record.id} has been deleted!`)
      emit('updateData', { action: 'delete', record: _record, component: 'WMS' })
    },
    onCancel: () => {
      console.log(`Cancel delete WMS/${_record.type} data!`)
    },
  })
}

// Filter data based on transMethod
const filteredData = computed(() => {
  if (transMethod.value === 'DBTable') {
    return props.data.filter((item) => item.type === 'DBTable')
  } else if (transMethod.value === 'API') {
    return props.data.filter((item) => item.type === 'API')
  } else if (transMethod.value === 'FTP') {
    return props.data.filter((item) => item.type === 'FTP')
  }
  return []
})
</script>

<template>
  <div class="m-3 pb-3 gap-3 border-bottom d-flex align-items-center position-relative">
    <div>
      <label class="form-label mb-2">傳輸方式</label>
      <select class="form-select" v-model="transMethod">
        <option value="API">API</option>
        <option value="DBTable">DBTable</option>
        <option value="FTP">FTP</option>
      </select>
    </div>
    <p class="m-0 position-absolute start-50">設定回傳WMS資料的方式</p>
  </div>

  <div class="d-flex align-items-center m-3">
    <label>詳細設定表</label>
    <button class="btn btn-outline-primary ms-auto" @click="openEditModal()">Add</button>
  </div>

  <div class="border-bottom pb-3">
    <a-table
      :columns="DBTable_Columns"
      :data-source="filteredData"
      bordered
      :pagination="false"
      :scroll="{ x: 2000 }"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'operation'">
          <div class="d-flex gap-3">
            <a @click="openEditModal(record)" style="color: blue">Edit</a>
            <a @click="deleteRecord(record)" style="color: red">Delete</a>
          </div>
        </template>
      </template>
    </a-table>
  </div>

  <EditModal
    :isopen="isEditModalOpen"
    :editingData="editingRecord"
    :addOrEdit="Mode"
    component="WMSConnection"
    @close="closeEditModal"
    @save="saveRecord"
  />
</template>
