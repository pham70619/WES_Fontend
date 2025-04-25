<script setup>
import { MessageHandler } from '@/common/MessageHandler'
import Dropdown from '../searchComponent/Dropdown.vue'
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import axios from 'axios'

const props = defineProps({
  isopen: {
    type: Boolean,
    required: true,
    default: false,
  },
  editingData: {
    type: Object,
    required: false,
    default: null,
  },
  // mode: edit || add
  mode: {
    type: String,
    required: false,
  },
})

// define variable
const { t } = useI18n()
const companyID = ref('')
const menuID = ref('')
const companyData = ref([])
const menuData = ref([])
const companyOptions = computed(() => companyData.value)
const menuOptions = computed(() => menuData.value)

// define status
const emits = defineEmits(['close', 'save'])

// handle close
const handleClose = () => {
  cleanData()
  emits('close')
}

// extract menu data
const extracdataWithPath = (menuTree) => {
  const result = []

  const traverse = (nodes) => {
    for (const node of nodes) {
      if (node.path) {
        result.push({
          value: node.menu_id,
          label: t(node.i18n_key),
        })
      }
      if (node.children && node.children.length > 0) {
        traverse(node.children)
      }
    }
  }

  traverse(menuTree)
  return result
}

// initial data
const initData = async () => {
  // get company
  const companyResponse = await axios.get('http://10.35.10.83:5000/Company/getCompany')
  companyData.value = companyResponse.data.map((item) => ({
    value: item.company_id,
    label: item.company_name,
  }))

  // get menu
  const menuResponse = await axios.get('http://10.35.10.83:5000/Menu/getMenu')
  const rawMenu = menuResponse.data

  //get menu with path
  menuData.value = extracdataWithPath(rawMenu)
}

// clean input box
const cleanData = () => {
  companyID.value = ''
  menuID.value = ''
}

// handle save
const handleSave = () => {
  const selectedCompany = companyOptions.value.find((c) => c.value === companyID.value)
  const selectedmenu = menuOptions.value.find((m) => m.value === menuID.value)

  const payload = {
    companyID: companyID.value,
    companyName: selectedCompany?.label || '',
    menuID: menuID.value,
    menuTitle: selectedmenu?.label || '',
  }
  emits('save', payload)
  emits('close')
  cleanData()
}

// const check required inputbox
const isFormValid = computed(() => {
  return (
    companyID.value !== '' &&
    companyID.value !== null &&
    menuID.value !== '' &&
    menuID.value !== null
  )
})

defineExpose({
  initData,
})
</script>

<template>
  <a-modal
    :open="isopen"
    :title="t('P0010-CoMenuSet')"
    :width="800"
    :centered="true"
    :closable="true"
    :maskClosable="false"
    :keyboard="true"
    @cancel="handleClose"
  >
    <!-- content -->
    <div class="d-flex border-top pt-3">
      <div style="width: 50%">
        <Dropdown
          v-model="companyID"
          :label="t('T0037-cmpName')"
          :options="companyOptions"
          :placeholder="''"
          :disabled="false"
          :required="true"
          :width="'200px'"
        />
      </div>
      <div style="width: 50%">
        <Dropdown
          v-model="menuID"
          :label="t('T0042-menu')"
          :options="menuOptions"
          :placeholder="''"
          :disabled="false"
          :required="true"
          :width="'200px'"
        />
      </div>
    </div>

    <!-- footer -->
    <template #footer>
      <div class="border-top p-2">
        <!-- <a-button v-if="mode === 'edit'" type="primary" danger @click="handleDelete"
          >delete</a-button
        > -->
        <a-button @click="handleClose">{{ t('B0000-Cancel') }}</a-button>
        <a-button :disabled="!isFormValid" type="primary" @click="handleSave">{{
          t('B0005-ok')
        }}</a-button>
      </div>
    </template>
  </a-modal>
</template>
