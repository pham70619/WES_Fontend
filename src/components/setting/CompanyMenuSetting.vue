<script setup>
import { ref, computed, onMounted } from 'vue'
import DataTable from '../dataTable/DataTable.vue'
import Modal from '@/components/setting/CompanyMenuSettingModal.vue'
import { useI18n } from 'vue-i18n'
import axios from 'axios'
import { ModalHandler } from '@/common/ModalHandler'

const { t } = useI18n()
const loading = ref(false)
const selectedData = ref([])
const isModified = ref(false)
const isModalOpen = ref(false)
const deletedData = ref([])
const main_data = ref([])
const modalRef = ref()
const dataTableRef = ref()

// define columns
const main_columns = computed(() => [
  { title: t('T0037-cmpName'), dataIndex: 'companyName', key: 'companyName' },
  { title: t('T0042-menu'), dataIndex: 'menuTitle', key: 'menuTitle' },
  { title: t('T0043-createAt'), dataIndex: 'createdAt', key: 'createdAt' },
  { title: t('T0044-createBy'), dataIndex: 'createdBy', key: 'createdBy' },
])

// open modal handle
const onOpenModal = () => {
  isModalOpen.value = true
  modalRef.value?.initData()
}

// close modal handle
const onCloseModal = () => {
  isModalOpen.value = false
}

// selection change handle
const handleSelectionChanged = (data) => {
  selectedData.value = data
}

// get company menu data
const getCompanyMenuData = async () => {
  const response = await axios.get('http://10.35.10.83:5000/CompanyMenu/getCompanyMenu')
  const convData = response.data.map((item, index) => ({
    requestID: String(Date.now() + index),
    companyID: item.company_id,
    companyName: item.company_name,
    menuID: item.menu_id,
    menuTitle: item.i18n_key,
    createdAt: item.created_at,
    createdBy: item.created_by,
  }))
  main_data.value = convData
  console.log('company menu data:', main_data)
}

// handle local delete
const onLocalDelete = () => {
  const toBeDelIds = selectedData.value.map((item) => item.requestID)
  deletedData.value.push(...selectedData.value)
  main_data.value = main_data.value.filter((item) => !toBeDelIds.includes(item.requestID))
  selectedData.value = []
  dataTableRef?.value.resetSelectedData()
  isModified.value = true

  console.log('deleteData:', deletedData.value)
}

// local save handle
const onModalSave = (newCompanymenu) => {
  main_data.value.unshift({
    requestID: String(Date.now()),
    ...newCompanymenu,
    isModified: true,
  })
  isModified.value = true
  console.log('payload:', newCompanymenu)
}

// onSave
const onSave = () => {
  ModalHandler.confirm({
    title: t('P0010-CoMenuSet'),
    content: t('M0012-confSave'),
    onOk: async () => {
      try {
        const updatePayload = main_data.value
          .filter((x) => x.isModified)
          .map((x) => ({
            company_id: x.companyID,
            company_name: x.companyName,
            menu_id: x.menuID,
            i18n_key: x.menuTitle,
          }))

        const deletePayload = deletedData.value.map((x) => ({
          company_id: x.companyID,
          menu_id: x.menuID,
        }))

        if (updatePayload.length === 0 && deletePayload.length === 0) {
          console.log('No changes to save.')
          return
        }
        console.log('updatepayload:', updatePayload)
        console.log('deletepayload:', deletePayload)

        // add
        if (updatePayload.length > 0) {
          await axios.post('http://10.35.10.83:5000/CompanyMenu/addCompanyMenu', updatePayload)
        }

        // delete
        if (deletePayload.length > 0) {
          await axios.post('http://10.35.10.83:5000/CompanyMenu/deleteCompanyMenu', deletePayload)
        }

        // Refresh data
        await getCompanyMenuData()
        deletedData.value = []
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
  await getCompanyMenuData()
  deletedData.value = []
  selectedData.value = []
  dataTableRef.value?.resetSelectedData()
  isModified.value = false
}

onMounted(() => {
  getCompanyMenuData()
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
    :editingData="undefined"
    :mode="undefined"
    @close="onCloseModal"
    @save="onModalSave"
  />
</template>
