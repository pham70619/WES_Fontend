<script setup>
import { ref } from 'vue'
import EditModal from './EditModal.vue'
import { ModalHandler } from '@/common/ModalHandler'

defineProps({
  data: {
    type: Array,
    required: true,
  },
})

const Columns = [
  { title: '倉庫編碼(ID)', dataIndex: 'warehouseId', key: 'warehouseId', width: 150 },
  { title: '區域', dataIndex: 'zoneId', key: 'zoneId', width: 100 },
  { title: '描述', dataIndex: 'description', key: 'description', width: 120 },
  { title: '建立時間', dataIndex: 'createAt', key: 'createAt', width: 160 },
  { title: '建立人員(員編)', dataIndex: 'createBy', key: 'createBy', width: 160 },
  { title: '最後更新時間', dataIndex: 'updateAt', key: 'updateAt', width: 160 },
  { title: '更新人員(員編)', dataIndex: 'updateBy', key: 'updateBy', width: 160 },
  { title: 'Action', key: 'operation', fixed: 'right', width: 110 },
]

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
  isEditModalOpen.value = true
}

// close edit modal
const closeEditModal = () => {
  isEditModalOpen.value = false
}

// add or edit data function
//_record 是 editModal 回傳的資料
const saveRecord = (_record) => {
  if (Mode.value === 'Add') {
    _record.id = new Date().getTime() // Generate a unique id
    console.log(`Item ${_record.id} has been added!`)
    emit('updateData', { action: 'add', record: _record, component: '區域' })
  } else if (Mode.value === 'Edit') {
    console.log(`Item ${_record.id} has been edited!`)
    emit('updateData', { action: 'edit', record: _record, component: '區域' })
  }
  isEditModalOpen.value = false
}

// delete data
const deleteRecord = (_record) => {
  ModalHandler.confirm({
    title: '確認刪除資料',
    content: '是否確定刪除資料?',
    onOk: async () => {
      console.log(`ZoneID data with ID: ${_record.id} has been deleted!`)
      emit('updateData', { action: 'delete', record: _record, component: '區域' })
    },
    onCancel: () => {
      console.log('Cancel delete ZoneID data!')
    },
  })
}
</script>

<template>
  <div class="d-flex align-items-center m-3">
    <p class="m-0">定義區域編號</p>
    <button class="btn btn-outline-primary ms-auto" @click="openEditModal()">Add</button>
  </div>
  <!-- :scroll="{ x: 2000 }" -->
  <div class="border-bottom pb-3">
    <a-table :columns="Columns" :data-source="data" bordered :pagination="false">
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
    component="ZoneIDCustom"
    @close="closeEditModal"
    @save="saveRecord"
  />
</template>
