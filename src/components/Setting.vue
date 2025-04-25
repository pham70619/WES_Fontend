<script setup>
import { ref, watch } from 'vue'
import WMSSetting from './setting/WMSSetting.vue'
import WCSSetting from './setting/WCSSetting.vue'
import WhIdCustom from './setting/WhIdCustom.vue'
import ZoneIDCustom from './setting/ZoneIDCustom.vue'
import Parameter from './setting/Parameter.vue'
import AutoFileClean from './setting/AutoFileClean.vue'
import { APIServer, APIPaths } from '@/common/ApiPath'
import dataService from '@/common/setting/DataService'
import { ModalHandler } from '@/common/ModalHandler'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
})

const WMSAPI = `${APIServer}${APIPaths.getSettingWMS}`
const WCSAPI = `${APIServer}${APIPaths.getSettingWMS}`
const WHAPI = `${APIServer}${APIPaths.CustomWH}`
const ZoneAPI = `${APIServer}${APIPaths.CustomZone}`
const ParAPI = `${APIServer}${APIPaths.CustomPar}`

const addAPI = `${APIServer}${APIPaths.getSettingWMS}`
const editAPI = `${APIServer}${APIPaths.getSettingWMS}`
const deleteAPI = `${APIServer}${APIPaths.getSettingWMS}`

const WMSSettingData = ref([])
const WCSSettingData = ref([])
const WHSettingData = ref([])
const ZoneSettingData = ref([])
const ParSettingData = ref([])

const WMSAddRecords = ref([])
const WMSEditRecords = ref([])
const WMSDeleteRecords = ref([])

const WCSAddRecords = ref([])
const WCSEditRecords = ref([])
const WCSDeleteRecords = ref([])

const WHAddRecords = ref([])
const WHEditRecords = ref([])
const WHDeleteRecords = ref([])

const ZoneAddRecords = ref([])
const ZoneEditRecords = ref([])
const ZoneDeleteRecords = ref([])

const ParAddRecords = ref([])
const ParEditRecords = ref([])
const ParDeleteRecords = ref([])

// define close state
const emit = defineEmits(['close'])
const closeModal = () => {
  emit('close')
  WMSSettingData.value = []
  WCSSettingData.value = []
  WHSettingData.value = []
  ZoneSettingData.value = []

  WMSAddRecords.value = []
  WMSEditRecords.value = []
  WMSDeleteRecords.value = []

  WCSAddRecords.value = []
  WCSEditRecords.value = []
  WCSDeleteRecords.value = []

  WHAddRecords.value = []
  WHEditRecords.value = []
  WHDeleteRecords.value = []

  ZoneAddRecords.value = []
  ZoneEditRecords.value = []
  ZoneDeleteRecords.value = []
}

const selectedItem = ref('WMS')
const selectItem = (item) => {
  selectedItem.value = item
}

const fetchData = async () => {
  try {
    const [WMSResponse, WCSResponse, WHResponse, ZoneResponse, ParResponse] = await Promise.all([
      dataService.Post(WMSAPI, null, null, 'getAll'),
      dataService.Post(WCSAPI, null, null, 'getAll'),
      dataService.Post(WHAPI, null, null, 'getAll'),
      dataService.Post(ZoneAPI, null, null, 'getAll'),
      dataService.Post(ParAPI, null, null, 'getAll'),
    ])
    // store WMS data
    if (WMSResponse) {
      console.log('Received WMS Setting Data:', WMSResponse)
      WMSSettingData.value = WMSResponse
    } else {
      console.log('Failed to fetch WMS data!')
    }

    // store WCS data
    if (WCSResponse) {
      console.log('Received WCS Setting Data:', WCSResponse)
      WCSSettingData.value = WCSResponse
    } else {
      console.log('Failed to fetch WCS data!')
    }

    // store WH data
    if (WHResponse) {
      console.log('Received WH Setting Data:', WHResponse)
      WHSettingData.value = WHResponse
    } else {
      console.log('Failed to fetch WH data!')
    }

    // store Zone data
    if (ZoneResponse) {
      console.log('Received Zone Setting Data:', ZoneResponse)
      ZoneSettingData.value = ZoneResponse
    } else {
      console.log('Failed to fetch Zone data!')
    }

    // store Parameter data
    if (ParResponse) {
      console.log('Received Parameter Setting Data:', ParResponse)
      ParSettingData.value = ParResponse
    } else {
      console.log('Failed to fetch Parameter data!')
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

// handle update data function
const handleUpdateData = ({ action, record, component }) => {
  let DataSource, AddRecords, EditRecords, DeleteRecords

  switch (component) {
    case 'WMS':
      DataSource = WMSSettingData
      AddRecords = WMSAddRecords
      EditRecords = WMSEditRecords
      DeleteRecords = WMSDeleteRecords
      break

    case 'WCS':
      DataSource = WCSSettingData
      AddRecords = WCSAddRecords
      EditRecords = WCSEditRecords
      DeleteRecords = WCSDeleteRecords
      break

    case '倉庫':
      DataSource = WHSettingData
      AddRecords = WHAddRecords
      EditRecords = WHEditRecords
      DeleteRecords = WHDeleteRecords
      break

    case '區域':
      DataSource = ZoneSettingData
      AddRecords = ZoneAddRecords
      EditRecords = ZoneEditRecords
      DeleteRecords = ZoneDeleteRecords
      break

    case 'PAR':
      DataSource = ParSettingData
      AddRecords = ParAddRecords
      EditRecords = ParEditRecords
      DeleteRecords = ParDeleteRecords
      break
    default:
      console.error(`Unknown component: ${component}`)
      return
  }

  if (action === 'add') {
    DataSource.value.push(record)
    AddRecords.value.push(record)
    console.log(`Add records to ${component}:`, AddRecords.value)
  } else if (action === 'edit') {
    const index = DataSource.value.findIndex((item) => item.id === record.id)
    if (index !== -1) {
      DataSource.value[index] = record
      EditRecords.value.push(record)
      console.log(`Edit records in ${component}:`, EditRecords.value)
    }
  } else if (action === 'delete') {
    const index = DataSource.value.findIndex((item) => item.id === record.id)
    if (index !== -1) {
      DataSource.value.splice(index, 1)
      DeleteRecords.value.push(record)
      console.log(`Delete records from ${component}:`, DeleteRecords.value)
    }
  }
}

// handle save data function
const saveData = () => {
  const hasDeletions =
    WMSDeleteRecords.value.length > 0 ||
    WCSDeleteRecords.value.length > 0 ||
    WHDeleteRecords.value.length > 0 ||
    ZoneDeleteRecords.value.length > 0 ||
    ParDeleteRecords.value.length > 0

  const _content = hasDeletions ? '發現刪除資料行為, 無法還原資料, 是否確認儲存!' : '是否確認儲存!'

  ModalHandler.confirm({
    title: '確認儲存設定',
    content: _content,
    onOk: async () => {
      try {
        // Define a function to handle API calls for a specific type of record
        const saveRecords = async (api, records, action) => {
          for (const record of records) {
            const response = await dataService.Post(api, record, record.id, action)
            console.log(`${action} response:`, response)
          }
        }

        // Save WMS records
        if (WMSAddRecords.value.length > 0) {
          await saveRecords(addAPI, WMSAddRecords.value, 'add')
          WMSAddRecords.value = [] // Reset after saving
        }
        if (WMSEditRecords.value.length > 0) {
          await saveRecords(editAPI, WMSEditRecords.value, 'edit')
          WMSEditRecords.value = [] // Reset after saving
        }
        if (WMSDeleteRecords.value.length > 0) {
          await saveRecords(deleteAPI, WMSDeleteRecords.value, 'delete')
          WMSDeleteRecords.value = [] // Reset after saving
        }

        // Save WCS records
        if (WCSAddRecords.value.length > 0) {
          await saveRecords(addAPI, WCSAddRecords.value, 'add')
          WCSAddRecords.value = [] // Reset after saving
        }
        if (WCSEditRecords.value.length > 0) {
          await saveRecords(editAPI, WCSEditRecords.value, 'edit')
          WCSEditRecords.value = [] // Reset after saving
        }
        if (WCSDeleteRecords.value.length > 0) {
          await saveRecords(deleteAPI, WCSDeleteRecords.value, 'delete')
          WCSDeleteRecords.value = [] // Reset after saving
        }

        // Save Warehouse records
        if (WHAddRecords.value.length > 0) {
          await saveRecords(addAPI, WHAddRecords.value, 'add')
          WHAddRecords.value = [] // Reset after saving
        }
        if (WHEditRecords.value.length > 0) {
          await saveRecords(editAPI, WHEditRecords.value, 'edit')
          WHEditRecords.value = [] // Reset after saving
        }
        if (WHDeleteRecords.value.length > 0) {
          await saveRecords(deleteAPI, WHDeleteRecords.value, 'delete')
          WHDeleteRecords.value = [] // Reset after saving
        }

        // Save Zone records
        if (ZoneAddRecords.value.length > 0) {
          await saveRecords(addAPI, ZoneAddRecords.value, 'add')
          ZoneAddRecords.value = [] // Reset after saving
        }
        if (ZoneEditRecords.value.length > 0) {
          await saveRecords(editAPI, ZoneEditRecords.value, 'edit')
          ZoneEditRecords.value = [] // Reset after saving
        }
        if (ZoneDeleteRecords.value.length > 0) {
          await saveRecords(deleteAPI, ZoneDeleteRecords.value, 'delete')
          ZoneDeleteRecords.value = [] // Reset after saving
        }

        // Emit close event and refetch data
        emit('close')
      } catch (error) {
        console.error('Error while saving data:', error)
      }
    },
    onCancel: () => {
      console.log('Cancel Save and Update Setting Data!')
    },
  })
}

// Watch for `isOpen` changes
watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal) {
      console.log('Modal opened, fetching data...')
      // fetchData()
    }
  },
)
</script>

<template>
  <!-- :with:"1000" -->
  <a-modal :open="isOpen" title="Setting" @ok="saveData" @cancel="closeModal" :width="1100">
    <div class="border-bottom">
      <ul class="d-flex m-0 gap-4">
        <li
          v-for="item in ['WMS', 'WCS', '倉庫', '區域', 'Parameter', '自動清檔']"
          :key="item"
          :class="{ active: selectedItem === item }"
          @click="selectItem(item)"
          class="pointer"
        >
          {{ item }}
        </li>
      </ul>
    </div>

    <div>
      <!-- WMS 連線設定 -->
      <div v-if="selectedItem === 'WMS'">
        <WMSSetting :data="WMSSettingData" @updateData="handleUpdateData" />
      </div>

      <!-- WMS 連線設定 -->
      <div v-if="selectedItem === 'WCS'">
        <WCSSetting :data="WCSSettingData" @updateData="handleUpdateData" />
      </div>

      <!-- 倉庫定義 -->
      <div v-if="selectedItem === '倉庫'">
        <WhIdCustom :data="WHSettingData" @updateData="handleUpdateData" />
      </div>

      <!-- 區域定義 -->
      <div v-if="selectedItem === '區域'">
        <ZoneIDCustom :data="ZoneSettingData" @updateData="handleUpdateData" />
      </div>

      <!-- 參數設定 -->
      <div v-if="selectedItem === 'Parameter'">
        <Parameter :data="ParSettingData" @updateData="handleUpdateData" />
      </div>

      <!-- 自動清檔設定 -->
      <div v-if="selectedItem === '自動清檔'">
        <AutoFileClean :data="ParSettingData" @updateData="handleUpdateData" />
      </div>
    </div>
  </a-modal>
</template>

<style scoped>
.active {
  border-bottom: 2px solid #007bff; /* Màu xanh đậm */
  background-color: rgb(228, 238, 247);
  /* font-weight: bold; Làm nổi bật thêm */
}
.pointer {
  cursor: pointer;
  padding: 3px 20px;

  transition: background-color 0.3s ease;
}
.pointer:hover {
  background-color: #f0f0f0;
}
ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
</style>
