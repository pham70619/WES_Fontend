<script setup>
import { reactive, watch, computed } from 'vue'
// import WhID from './EditItem/WhID.vue'

const wrapperCol = {
  span: 14,
}
const labelCol = {
  style: {
    width: '150px',
  },
}

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
  addOrEdit: {
    type: String,
    required: false,
  },
  component:{
    type: String,
    required: true,
  }
})

// define status
const emit = defineEmits('close', 'save')

const form = reactive({})

watch(
  () => props.editingData,
  (newData) => {
    if (newData) {
      Object.assign(form, newData)
      console.log('Received editingData:', newData)
    } else {
      console.log('editingData is null or undefined.')
    }
  },
  { immediate: true },
)

// Determine the title based on the component name
const _title =computed(() =>{
  switch(props.component){
    case 'WMSConnection':
      return '定義回傳WMS連線'
    case 'WCSConnection':
      return '定義下發WCS連線'
    case 'WHIDCustom':
      return '定義倉庫名稱'
    case 'ZoneIDCustom':
      return '定義區域'
    case 'Parameter':
      return '參數設定'
    default:
      return '未定義的標題'
  }
})


// handle save
const handleSave = () => {
  emit('save', { ...form }) //send data to parten component
  Object.keys(form).forEach((key) => delete form[key]) // Clear the form
}

// handle close
const handleClose = () => {
  emit('close')
  if (props.addOrEdit === 'Edit') {
    Object.keys(form).forEach((key) => delete form[key]) // Clear the form
  }
}
</script>

<template>
  <a-modal :open="isopen" :title="_title" :width="800" @ok="handleSave" @cancel="handleClose">

    <!-- WMS Connection Setting form -->
    <a-form v-if="props.component === 'WMSConnection' || props.component === 'WCSConnection'" class="border-top mt-3 pt-3">
      <a-space>
        <a-space-compact direction="vertical" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-form-item label="WAREHOUSE_ID">
            <a-input v-model:value="form.warehouseId" />
          </a-form-item>
          <a-form-item label="COMPANY_ID">
            <a-input v-model:value="form.companyId"/>
          </a-form-item>
          <a-form-item label="ZONE_ID">
            <a-input v-model:value="form.zoneId"/>
          </a-form-item>
          <a-form-item label="IP">
            <a-input v-model:value="form.ip" placeholder="eg:192.168.1.199" />
          </a-form-item>
        </a-space-compact>

        <a-space-compact direction="vertical" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-form-item label="Port">
            <a-input v-model:value="form.port" placeholder="eg:5432" />
          </a-form-item>
          <a-form-item label="路徑">
            <a-input v-model:value="form.path" placeholder="eg:/example/api" required: true/>
          </a-form-item>
          <a-form-item label="帳號">
            <a-input v-model:value="form.username"/>
          </a-form-item>
          <a-form-item label="密碼">
            <a-input v-model:value="form.password"/>
          </a-form-item>
        </a-space-compact>

        <a-space-compact direction="vertical" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-form-item label="格式">
            <a-select v-model:value="form.format">
              <a-select-option value="row">Row</a-select-option>
              <a-select-option value="batch">Batch</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="是否實際回傳">
            <a-select v-model:value="form.isActual">
              <a-select-option :value="true">是</a-select-option>
              <a-select-option :value="false">否</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="建立時間">
            <a-space direction="horizontal" :size="12">
              <!-- v-model:value="form.date"  -->
              <a-date-picker />
              <!-- v-model:value="form.time" -->
              <a-time-picker  />
            </a-space>
          </a-form-item>
          <a-form-item v-if="props.addOrEdit === 'Add'" label="建立人員">
            <a-input v-model:value="form.createBy"/>
          </a-form-item>
          <a-form-item v-if="props.addOrEdit === 'Edit'" label="更新人員">
            <a-input v-model:value="form.updateBy"/>
          </a-form-item>
        </a-space-compact>
      </a-space>
      <a-form-item label="描述">
        <a-textarea v-model:value="form.description" :rows="4" />
      </a-form-item>
    </a-form>


    <!-- ZoneIDCustom form -->
    <a-form v-if="props.component === 'ZoneIDCustom'" class="border-top border-bottom mt-3 pt-3" layout="horizontal" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-item label="倉庫代碼(ID)">
        <a-input v-model:value="form.warehouseId" />
      </a-form-item>

      <a-form-item label="區域">
        <a-input v-model:value="form.zoneId" />
      </a-form-item>

      <a-form-item v-if="props.addOrEdit === 'Add'" label="建立人員(員編)">
        <a-input v-model:value="form.createBy" />
      </a-form-item>

      <a-form-item v-if="props.addOrEdit === 'Edit'" label="更新人員(員編)">
        <a-input v-model:value="form.updateBy" />
      </a-form-item>

      <a-form-item label="描述">
        <a-textarea v-model:value="form.description" :rows="4" />
      </a-form-item>
    </a-form>

    <!-- WHID Custom form -->
    <a-form v-if="props.component === 'WHIDCustom'" class="border-top border-bottom mt-3 pt-3" layout="horizontal" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-item label="倉庫名稱">
        <a-input v-model:value="form.whName" />
      </a-form-item>

      <a-form-item label="倉庫代碼(ID)">
        <a-input v-model:value="form.warehouseId" />
      </a-form-item>

      <a-form-item label="地址">
        <a-input v-model:value="form.address" />
      </a-form-item>

      <a-form-item v-if="props.addOrEdit === 'Add'" label="建立人員(員編)">
        <a-input v-model:value="form.createBy" />
      </a-form-item>

      <a-form-item v-if="props.addOrEdit === 'Edit'" label="更新人員(員編)">
        <a-input v-model:value="form.updateBy" />
      </a-form-item>

      <a-form-item label="描述">
        <a-textarea v-model:value="form.description" :rows="4" />
      </a-form-item>
    </a-form>


    <!-- Parameter Custom form -->
    <a-form v-if="props.component === 'Parameter'" class="border-top border-bottom mt-3 pt-3" layout="horizontal" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-item label="功能群組">
        <a-input v-model:value="form.func_group" />
      </a-form-item>

      <a-form-item label="功能設定">
        <a-input v-model:value="form.func_key" />
      </a-form-item>

      <a-form-item label="排序">
        <a-input-number v-model:value="form.func_sort" :min="1" :max="10" :style="{ width: '100%' }"/>
      </a-form-item>

      <a-form-item label="內容值">
        <a-input v-model:value="form.func_value" />
      </a-form-item>

      <a-form-item v-if="props.addOrEdit === 'Add'" label="建立人員(員編)">
        <a-input v-model:value="form.createBy" />
      </a-form-item>

      <a-form-item v-if="props.addOrEdit === 'Edit'" label="更新人員(員編)">
        <a-input v-model:value="form.updateBy" />
      </a-form-item>

      <a-form-item label="描述">
        <a-textarea v-model:value="form.description" :rows="4" />
      </a-form-item>
    </a-form>


    <!-- Automatic file cleaning form -->
    <a-form v-if="props.component === 'AutoFileClean'" class="border-top border-bottom mt-3 pt-3" layout="horizontal" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-item label="資料表">
        <a-input v-model:value="form.table" />
      </a-form-item>

      <a-form-item label="儲存時間">
        <a-input-number v-model:value="form.time" :min="60" :max="1000" :style="{ width: '100%' }"/>
      </a-form-item>

      <a-form-item label="自動清檔">
        <a-select v-model:value="form.active">
          <a-select-option :value="'啟用'">啟用</a-select-option>
          <a-select-option :value="'停用'">停用</a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
