<script setup>
import { computed, ref, reactive } from 'vue'
import EditModal from './EditModal.vue'
import { ModalHandler } from '@/common/ModalHandler'
import { cloneDeep } from 'lodash-es'

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
})

const column = [
  { title: '資料表', dataIndex: 'table', key: 'table' },
  { title: '儲存時間(天)', dataIndex: 'time', key: 'time' },
  { title: '自動清檔', dataIndex: 'active', key: 'active' },
  { title: 'Action', key: 'operation' },
]

const data = ref([
  { key: '1', table: 'temp_logs', time: '90', active: '啟用' },
  { key: '2', table: 'temp_orders', time: '120', active: '停用' },
  { key: '3', table: 'session_data', time: '60', active: '啟用' },
  { key: '4', table: 'cache_storage', time: '180', active: '停用' },
  { key: '5', table: 'user_activity', time: '75', active: '啟用' },
])

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

// // delete data
// const deleteRecord = (_record) => {
//   ModalHandler.confirm({
//     title: '確認刪除資料',
//     content: '是否確定刪除資料?',
//     onOk: async () => {
//       console.log(`WMS/${_record.type} data with ID: ${_record.id} has been deleted!`)
//       emit('updateData', { action: 'delete', record: _record, component: 'WMS' })
//     },
//     onCancel: () => {
//       console.log(`Cancel delete WMS/${_record.type} data!`)
//     },
//   })
// }

const editableData = reactive({})
const save = (key) => {
  Object.assign(data.value.filter((item) => key === item.key)[0], editableData[key])
  delete editableData[key]
}

const cancel = (key) => {
  delete editableData[key]
}
const edit = (key) => {
  editableData[key] = cloneDeep(data.value.filter((item) => key === item.key)[0])
}

const deleteRecord = (_record) => {
  ModalHandler.confirm({
    title: '確認刪除資料',
    content: '是否確定刪除資料?',
    onOk: async () => {
      console.log(`WMS/${_record.type} data with ID: ${_record.id} has been deleted!`)
      data.value = data.value.filter((item) => item.key !== _record.key) // Xóa khỏi danh sách
      emit('updateData', { action: 'delete', record: _record, component: 'WMS' })
    },
    onCancel: () => {
      console.log(`Cancel delete WMS/${_record.type} data!`)
    },
  })
}
</script>

<template>
  <div class="d-flex align-items-center m-3">
    <label>詳細設定表</label>
    <button class="btn btn-outline-primary ms-auto" @click="openEditModal()">Add</button>
  </div>

  <div class="border-bottom pb-3">
    <a-table
      :columns="column"
      :data-source="data"
      bordered
      :pagination="false"
      :scroll="{ x: '100%' }"
    >
      <template #bodyCell="{ column, text, record }">
        <template v-if="column.key === 'operation'">
          <span v-if="editableData[record.key]">
            <a-popconfirm title="Sure to save?" @confirm="save(record.key)">
              <a>Save</a>
            </a-popconfirm>

            <a-typography-link @click="cancel(record.key)">Cancel</a-typography-link>
          </span>

          <span v-else>
            <a @click="edit(record.key)" style="color: blue">Edit</a>
            <a-popconfirm title="Sure to delete?" @confirm="deleteRecord(record)">
              <a style="color: red; margin-left: 10px">Delete</a>
            </a-popconfirm>
          </span>
        </template>

        <template v-else-if="column.dataIndex === 'time'">
          <div>
            <a-input-number
              v-if="editableData[record.key]"
              v-model:value="editableData[record.key][column.dataIndex]"
              :min="60"
              :max="365"
              style="margin: -5px 0; width: 100px"
            />
            <template v-else>
              {{ text }}
            </template>
          </div>
        </template>

        <template v-else-if="column.dataIndex === 'active'">
          <div>
            <a-select
              v-if="editableData[record.key]"
              v-model:value="editableData[record.key][column.dataIndex]"
              style="width: 100px"
            >
              <a-select-option :value="true">啟用</a-select-option>
              <a-select-option :value="false">停用</a-select-option>
            </a-select>

            <template v-else>
              {{ text === true ? '啟用' : '停用' }}
            </template>
          </div>
        </template>
      </template>
    </a-table>
  </div>

  <EditModal
    :isopen="isEditModalOpen"
    :editingData="editingRecord"
    :addOrEdit="Mode"
    component="AutoFileClean"
    @close="closeEditModal"
    @save="saveRecord"
  />
</template>

<style scoped>
.editable-row-operations a {
  margin-right: 8px;
}
</style>
