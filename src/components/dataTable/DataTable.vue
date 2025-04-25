<script setup>
import { ref, computed, onMounted, watch, reactive } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  columns: {
    type: Array,
    required: true,
  },
  detailColumns: {
    type: Array,
    required: false,
  },
  data: {
    type: Array,
    required: true,
  },
  totalRecord: {
    type: Number,
    required: false,
    default: 0,
  },
  checkBox: {
    type: Boolean,
    required: true,
  },
  loading: {
    type: Boolean,
    required: true,
  },
  expandable: {
    type: Boolean,
    required: true,
  },
  expandObject: {
    type: String,
    required: false,
  },
})

// define return event for parent component
const emit = defineEmits(['fetchData', 'selectionChanged', 'onEditData'])

const dataSource = computed(() => props.data)
const loading = computed(() => props.loading)
const currentPage = ref(1)
const pageSize = ref(10)
const sortField = ref(null)
const sortOrder = ref(null)
const selectedKeys = ref([])
const selectedRows = ref([])
const selectedRowDataMap = ref({})

watch(
  () => props.totalRecord,
  (newTotal) => {
    pagination.value.total = newTotal
  },
)

// watch(
//   () => props.selectedRowKeys,
//   (newKeys) => {
//     selectedKeys.value = newKeys
//   },
// )

const pagination = ref({
  current: 1,
  pageSize: pageSize.value,
  total: 0,
  // total: props.totalRecord,
  showSizeChanger: true,
  pageSizeOptions: ['10', '20', '50', '100'],
  // 有{多少}筆資料
  showTotal: (total) => t('M0001-DataCount', { count: total }),
})

const selection = computed(() => ({
  // selectedRowKeys: Object.keys(selectedRowDataMap.value).map((id) => Number(id)),
  selectedRowKeys: Object.keys(selectedRowDataMap.value),
  onChange: (keys, rows) => {
    // id list in current page
    // data is current page data
    const currentPageIds = props.data.map((item) => item.requestID)

    // clear selected id on current page
    currentPageIds.forEach((id) => {
      delete selectedRowDataMap.value[id]
    })

    // add new rows list of currentpage into global variable
    rows.forEach((row) => {
      selectedRowDataMap.value[row.requestID] = row
    })

    selectedKeys.value = Object.keys(selectedRowDataMap.value)
    selectedRows.value = Object.values(selectedRowDataMap.value)

    emit('selectionChanged', selectedRows.value)
  },
}))

const emitFetchData = () => {
  emit('fetchData', {
    page: currentPage.value,
    size: pageSize.value,
    sort: sortField.value,
    order: sortOrder.value,
  })
}

// handle when change page or sort
const handleChangePage = (paginationInfo, filters, sorter) => {
  console.log('📦 Pagination:', paginationInfo)
  console.log('🔽 Sorter:', sorter)
  console.log('Sort Field:', sorter.field)
  console.log('Sort Order:', sorter.order)
  currentPage.value = paginationInfo.current
  pageSize.value = paginationInfo.pageSize
  pagination.value.current = paginationInfo.current
  pagination.value.pageSize = paginationInfo.pageSize

  if (sorter.order) {
    sortField.value = sorter.field
    sortOrder.value = sorter.order === 'ascend' ? 'asc' : 'desc'
    console.log('sorter:', sortField.value)
  } else {
    console.log('nullllll')
    sortField.value = null
    sortOrder.value = null
  }

  // return event
  emitFetchData()
}

// open edit
const onOpenModal = (data) => {
  emit('onEditData', data)
}

// onSearch btn, call by parent component
const resetToFirstPage = () => {
  // resetdata in variable
  selectedRowDataMap.value = {}
  selectedRows.value = []

  // set currentpage to 1
  currentPage.value = 1
  pagination.value.current = 1
  emitFetchData()
}

// clear selected data
const resetSelectedData = () => {
  selectedRowDataMap.value = {}
  selectedRows.value = []
}

// fetchdata onmounted
onMounted(() => {
  emitFetchData()
})

// expose function for parent component
defineExpose({
  resetToFirstPage,
  resetSelectedData,
})
</script>

<template>
  <div class="cotainer-fluid">
    <!-- search bar -->
    <div class="mt-3 mx-2 d-flex align-items-center">
      <slot name="Searchbar"></slot>
    </div>

    <!-- actionbar -->
    <div class="mt-3 mx-3">
      <slot name="ActionBar"></slot>
    </div>
    <div class="pt-3 px-2">
      <!-- requestID -->
      <!-- v-slots="$slots" -->
      <a-table
        v-bind="$attrs"
        :columns="columns"
        :data-source="dataSource"
        :pagination="pagination"
        :loading="loading"
        :row-selection="checkBox ? selection : null"
        :row-key="(record) => record.requestID"
        bordered
        @change="handleChangePage"
      >
        <template v-if="expandable" #expandedRowRender="{ record }">
          <div
            style="
              max-height: 300px;
              overflow-y: auto;
              background: #f0f2f5;
              margin: 16px;
              padding: 8px;
              border-radius: 4px;
            "
          >
            <a-table
              :columns="detailColumns"
              :data-source="record[expandObject]"
              :pagination="false"
              :row-key="(record) => record.requestID"
              size="small"
              bordered
            />
          </div>
        </template>

        <!-- action -->
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <a-button size="small" @click="onOpenModal(record)">{{ t('B0006-edit') }}</a-button>
          </template>
        </template>
      </a-table>
    </div>
  </div>
</template>
