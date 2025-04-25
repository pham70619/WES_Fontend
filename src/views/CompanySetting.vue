<script setup>
import { ref, computed, onMounted, h, resolveComponent, nextTick } from 'vue'
import DataTable from '@/components/dataTable/DataTable.vue'
import { useI18n } from 'vue-i18n'
import Modal from '@/components/setting/CompanySettingModal.vue'
import axios from 'axios'
import { CompanyService } from '@/Serveice/setting/CompanyService'
import { ModalHandler } from '@/common/ModalHandler'
// import { h, resolveComponent, nextTick } from 'vue'

const { t } = useI18n()
const dataTableRef = ref()
const loading = ref(false)
const isModalOpen = ref(false)
const Mode = ref('')
const edittingRecord = ref()
const main_data = ref([])
const selectedData = ref([])
const modalRef = ref()
const deletedData = ref([])
const companyService = CompanyService()
const isModified = ref(false)

// define columns
const main_columns = computed(() => [
  // { title: 'Company ID', dataIndex: 'gui', key: 'gui' },
  { title: t('T0038-cmpShortName'), dataIndex: 'company_short_name', key: 'company_short_name' },
  { title: t('T0037-cmpName'), dataIndex: 'company_name', key: 'company_name' },
  { title: t('T0039-UBN'), dataIndex: 'gui', key: 'gui' },
  { title: t('T0016-address'), dataIndex: 'address', key: 'address' },
  {
    title: t('T0041-isActive'),
    dataIndex: 'status',
    key: 'status',
    customRender: ({ text }) => (text ? '✔️ Active' : '❌ Inactive'),
    width: 110,
  },
  {
    title: t('T0040-action'),
    key: 'action',
    // customRender: ({ record }) => {
    //   const AButton = resolveComponent('a-button')
    //   return h(
    //     // 'a-button',
    //     AButton,
    //     {
    //       // type: 'link',
    //       size: 'small',
    //       onClick: () => onOpenModal(record),
    //     },
    //     'Edit',
    //   )
    // },
  },
])

// const detail_columns = computed(() => [
//   { title: 'Created At', dataIndex: 'created_at', key: 'created_at' },
//   { title: 'Created By', dataIndex: 'created_by', key: 'created_by' },
//   { title: 'Updated At', dataIndex: 'updated_at', key: 'updated_at' },
//   { title: 'Updated By', dataIndex: 'updated_by', key: 'updated_by' },
// ])

// define function
// handle when selection change
const handleSelectionChanged = (data) => {
  selectedData.value = data
  console.log(selectedData.value)
}

// open modal handle
const onOpenModal = (data) => {
  if (data) {
    Mode.value = 'edit'
    edittingRecord.value = data
    console.log('editting data:', edittingRecord)
    // modalRef.value?.initData()
    nextTick(() => {
      modalRef.value?.initData() // ✅ gọi hàm từ component con
    })
  } else {
    Mode.value = 'add'
    edittingRecord.value = null
  }
  isModalOpen.value = true
}

// close modal handle
const onCloseModal = () => {
  isModalOpen.value = false
}

// handle delete
const onLocalDelete = () => {
  if (selectedData.length === 0) {
    return
  }

  const toBeDelIds = selectedData.value.map((item) => item.requestID)

  // store into local delete list
  deletedData.value.push(...selectedData.value)

  // delete local data
  main_data.value = main_data.value.filter((item) => !toBeDelIds.includes(item.requestID))

  // Xoá lựa chọn hiện tại
  selectedData.value = []
  dataTableRef?.value.resetSelectedData()
  isModified.value = true
}

// save data handle
const onModalSave = (newCompany) => {
  if (Mode.value === 'edit' && edittingRecord.value) {
    const index = main_data.value.findIndex((x) => x.requestID === edittingRecord.value.requestID)
    if (index !== -1) {
      main_data.value[index] = {
        ...main_data.value[index], // giữ nguyên các trường khác
        ...newCompany, // cập nhật giá trị mới
        isModified: true,
      }

      isModified.value = true
    }
  } else {
    main_data.value.unshift({
      requestID: String(Date.now()),
      ...newCompany,
      company_id: 0,
      isModified: true,
    })
    isModified.value = true
  }
  // main_data.value.unshift({
  //   requestID: Date.now(),
  //   ...newCompany,
  //   isModified: true,
  //   // audit: {
  //   //   created_at: formatDate(new Date().toISOString()),
  //   //   created_by: newCompany.created_by,
  //   //   updated_at: '',
  //   //   updated_by: '',
  //   // },
  // })
}

// onSave
const onSave = () => {
  ModalHandler.confirm({
    title: t('P0009-CmpSet'),
    content: t('M0012-confSave'),
    onOk: async () => {
      try {
        const updatePayload = main_data.value
          .filter((x) => x.isModified)
          .map((x) => ({
            company_id: x.company_id ?? 0,
            company_name: x.company_name,
            company_short_name: x.company_short_name,
            gui: x.gui,
            address: x.address,
            status: x.status,
            created_by: 'admin',
          }))

        const deletePayload = deletedData.value
          .filter((x) => x.company_id !== 0)
          .map((x) => x.company_id)

        if (updatePayload.length === 0 && deletePayload.length === 0) {
          console.log('No changes to save.')
          return
        }

        console.log('updatepayload:', updatePayload)
        console.log('deletepayload:', deletePayload)

        // add or update
        if (updatePayload.length > 0) {
          await companyService.updateCompanyData(updatePayload)
        }

        // delete
        if (deletePayload.length > 0) {
          await companyService.deleteCompanyData(deletePayload)
        }

        // Refresh data
        await getCompanyData()
        deletedData.value = []
        selectedData.value = []
        updatePayload.value = []
        deletePayload.value = []
        dataTableRef?.value.resetSelectedData()
        isModified.value = false
      } catch (error) {
        console.error('Error saving data:', error)
      }
    },
    onCancel: () => {
      onCancel()
    },
  })
}

// on Cancel
const onCancel = async () => {
  await getCompanyData()
  deletedData.value = []
  selectedData.value = []
  dataTableRef.value?.resetSelectedData()
  isModified.value = false
}

// format date
const formatDate = (isoString) => {
  if (!isoString) return ''
  const date = new Date(isoString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

// get company data
const getCompanyData = async () => {
  const now = Date.now()
  // call api
  companyService.getCompanyData().then((response) => {
    const convData = response.map((item, index) => ({
      requestID: String(now + index),
      company_id: item.company_id,
      company_name: item.company_name,
      company_short_name: item.company_short_name,
      gui: item.gui,
      address: item.address,
      status: item.status,
      audit: {
        created_at: formatDate(item.created_at),
        created_by: item.created_by,
        updated_at: formatDate(item.updated_at),
        updated_by: item.updated_by,
      },
    }))
    main_data.value = convData
  })
}

onMounted(() => {
  getCompanyData()
})
</script>

<template>
  <div class="flex-grow-1 overflow-auto">
    <DataTable
      ref="dataTableRef"
      :columns="main_columns"
      :detailColumns="undefined"
      :data="main_data"
      :totalRecord="undefined"
      :checkBox="true"
      :loading="loading"
      :expandable="false"
      :expandObject="''"
      @selectionChanged="handleSelectionChanged"
      @onEditData="onOpenModal"
    >
      <template #ActionBar>
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <span v-if="selectedData.length > 0" class="ms-3">
              {{ t('M0000-SelectedCount', { count: selectedData.length }) }}</span
            >
          </div>
          <div class="d-flex gap-2">
            <a-button
              type="primary"
              danger
              :disabled="selectedData.length === 0"
              @click="onLocalDelete"
            >
              {{ t('B0007-delete') }}
            </a-button>
            <a-button @click="onOpenModal()">{{ t('B0008-add') }}</a-button>
          </div>
        </div>
      </template>
    </DataTable>
  </div>

  <!-- footer -->
  <div class="shadow-lg border-top w-100 p-4 d-flex justify-content-end">
    <a-button class="me-3" :disabled="!isModified" @click="onSave">{{ t('B0009-save') }}</a-button>
    <a-button :disabled="!isModified" @click="onCancel">{{ t('B0000-Cancel') }}</a-button>
  </div>

  <Modal
    ref="modalRef"
    :isopen="isModalOpen"
    :editingData="edittingRecord"
    :mode="Mode"
    @close="onCloseModal"
    @save="onModalSave"
  />
</template>
