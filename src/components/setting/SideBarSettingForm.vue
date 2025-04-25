<script setup>
import { onMounted, ref, watch, computed } from 'vue'
import InputBox from '../searchComponent/InputBox.vue'
import Dropdown from '../searchComponent/Dropdown.vue'
import { ModalHandler } from '@/common/ModalHandler'

const props = defineProps(['settingData'])
// const props = defineProps({
//   settingData: {
//     type: Object,
//   },
// })
const emit = defineEmits(['update:settingData', 'deleteChild'])
const localSettings = computed({
  get: () => props.settingData,
  set: (val) => emit('update:settingData', val),
})
const enableOptions = computed(() => [
  { label: 'True', value: 1 },
  { label: 'False', value: 0 },
])

watch(
  () => props.settingData,
  (newVal, oldVal) => {
    if (!newVal) return
    newVal.isModified = true
  },
  { deep: true },
)

// add children
const addChild = () => {
  if (!Array.isArray(localSettings.value.children)) {
    localSettings.value.children = []
  }

  const childName = 'Child ' + (localSettings.value.children.length + 1)

  const newChild = {
    id: Date.now(),
    menu_id: null,
    title: childName,
    parent_id: null,
    path: null,
    icon: null,
    menu_type: 'MENU',
    sort_order: localSettings.value.children.length + 1,
    enabled: 1,
    is_expandable: 0,
    i18n_key: 'Test',
    children: [],
  }

  // add child
  localSettings.value.children.push(newChild)

  // update parent's is_expandable
  if (localSettings.value.children.length > 0) {
    localSettings.value.is_expandable = 1
    localSettings.value.path = null
  }
}

// remove child
const removeChild = (_id) => {
  ModalHandler.confirm({
    title: 'confirm delete action',
    content: 'make sure delete this children',
    onOk: () => {
      const children = localSettings.value.children
      const index = children.findIndex((child) => child.id === _id)
      if (index !== -1) {
        const removedChild = children[index]

        // end event to parent
        emit('deleteChild', removedChild)
        children.splice(index, 1)

        // update parent's is_expandale
        if (children.length === 0) {
          localSettings.value.is_expandable = 0
        }
      }
    },
    onCancel: () => {
      undefined
    },
  })
}
</script>

<template>
  <div class="main-content">
    <div class="border-bottom p-3">
      <h4 class="m-0">{{ $t(localSettings.i18n_key) }}</h4>
    </div>
    <div class="mt-3 d-flex">
      <div class="d-flex flex-column gap-4" style="width: 50%">
        <InputBox
          v-model="localSettings.path"
          :label="'Path'"
          :placeHolder="''"
          :disabled="localSettings.children && localSettings.children.length > 0"
          :readonly="false"
          :maxLength="100"
          type="text"
          width="200px"
          @validation=""
        />
        <InputBox
          v-model="localSettings.icon"
          :label="'Icon'"
          :placeHolder="''"
          :disabled="false"
          :readonly="false"
          :maxLength="10"
          type="text"
          width="150px"
          @validation=""
        />
        <InputBox
          v-model="localSettings.sort_order"
          :label="'Sort Order'"
          :placeHolder="''"
          :disabled="false"
          :readonly="false"
          :maxLength="10"
          type="number"
          width="120px"
          @validation=""
        />
      </div>
      <div class="d-flex flex-column gap-4" style="width: 50%">
        <Dropdown
          v-model="localSettings.enabled"
          :label="'Enable'"
          :options="enableOptions"
          :placeholder="''"
          :disabled="false"
          :width="'100px'"
        />
        <InputBox
          v-model="localSettings.i18n_key"
          :label="'I18n key'"
          :placeHolder="''"
          :disabled="false"
          :readonly="false"
          :maxLength="50"
          type="text"
          width="150px"
          @validation=""
        />
        <InputBox
          v-model="localSettings.menu_id"
          :label="'Id'"
          :placeHolder="''"
          :disabled="true"
          :readonly="false"
          :maxLength="10"
          type="text"
          width="120px"
          @validation=""
        />
        <InputBox
          v-model="localSettings.parent_id"
          :label="'Parent Id'"
          :placeHolder="''"
          :disabled="true"
          :readonly="false"
          :maxLength="10"
          type="number"
          width="120px"
          @validation=""
        />
      </div>
    </div>
  </div>
  <div class="children">
    <div class="px-3 pb-2 border-bottom d-flex justify-content-between">
      <h4 class="m-0">Children</h4>
      <a-button @click="addChild">add child</a-button>
    </div>

    <div>
      <ul class="ms-3 mt-2 p-3">
        <li
          v-for="(child, index) in localSettings.children"
          :key="index"
          class="d-flex justify-content-between align-itmes-center"
        >
          <span>{{ $t(child.i18n_key) }}</span>
          <a @click="removeChild(child.id)" style="cursor: pointer; color: red">X</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.main-content {
  height: 300px;
}
</style>
