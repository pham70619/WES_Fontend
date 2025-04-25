<script setup>
import { MessageHandler } from '@/common/MessageHandler'
import Dropdown from '../searchComponent/Dropdown.vue'
import InputBox from '../searchComponent/InputBox.vue'
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

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

const isActiveOptions = computed(() => [
  { label: t('L0013-true'), value: 1 },
  { label: t('L0014-false'), value: 0 },
])
const { t } = useI18n()
const company_name = ref('')
const company_short_name = ref('')
const gui = ref('')
const address = ref('')
const status = ref(1)
const created_by = ref('admin')
const validateRef = ref()

// define status
const emits = defineEmits(['close', 'save', 'delete'])

const cleanData = () => {
  company_name.value = ''
  company_short_name.value = ''
  gui.value = ''
  address.value = ''
  status.value = 1
}
// handle save
const handleSave = () => {
  const payload = {
    company_name: company_name.value,
    company_short_name: company_short_name.value,
    gui: gui.value,
    address: address.value,
    status: status.value,
  }
  emits('save', payload)
  emits('close')

  // clean data in input box
  cleanData()
}

// handle close
const handleClose = () => {
  if (props.mode === 'edit') {
    // clean data in input box
    cleanData()
  }
  emits('close')
}

// handle delete
// const handleDelete = () => {
//   emit('delete')
// }

// initial data
const initData = () => {
  console.log('editting data:', props.editingData)
  company_name.value = props.editingData?.company_name ?? ''
  company_short_name.value = props.editingData?.company_short_name ?? ''
  gui.value = props.editingData?.gui ?? ''
  address.value = props.editingData?.address ?? ''
  status.value = props.editingData?.status ?? true
}

// const check required inputbox
const isFormValid = computed(() => {
  return company_name.value.trim() !== '' && gui.value.trim() !== ''
})

// validation
const handleValidate = (validationResult) => {
  if (!validationResult.valid) {
    MessageHandler.showError(validationResult.message)
  }
}

defineExpose({
  initData,
})
</script>

<template>
  <a-modal
    :open="isopen"
    :title="t('P0009-CmpSet')"
    :width="800"
    :centered="true"
    :closable="true"
    :maskClosable="false"
    :keyboard="true"
    @cancel="handleClose"
  >
    <!-- content -->
    <div class="d-flex flex-column gap-3 border-top pt-3">
      <div class="d-flex">
        <div class="d-flex flex-column gap-3" style="width: 50%">
          <InputBox
            v-model="company_name"
            :label="t('T0037-cmpName')"
            :placeHolder="''"
            :disabled="false"
            :readonly="false"
            :maxLength="100"
            :required="true"
            type="text"
            width="240px"
            @validation="handleValidate"
          />
          <InputBox
            v-model="company_short_name"
            :label="t('T0038-cmpShortName')"
            :placeHolder="''"
            :disabled="false"
            :readonly="false"
            :maxLength="100"
            :required="false"
            type="text"
            width="240px"
            @validation=""
          />
        </div>
        <div class="d-flex flex-column gap-3" style="width: 50%">
          <InputBox
            v-model="gui"
            :label="t('T0039-UBN')"
            :placeHolder="''"
            :disabled="false"
            :readonly="false"
            :maxLength="100"
            :required="true"
            type="text"
            width="120px"
            @validation="handleValidate"
          />
          <Dropdown
            v-model="status"
            :label="t('T0041-isActive')"
            :options="isActiveOptions"
            :placeholder="''"
            :disabled="false"
            :width="'150px'"
          />
        </div>
      </div>
      <div>
        <InputBox
          v-model="address"
          :label="t('T0016-address')"
          :placeHolder="''"
          :disabled="false"
          :readonly="false"
          :maxLength="300"
          type="text"
          width="500px"
          @validation=""
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
