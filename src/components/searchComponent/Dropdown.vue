<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: '',
  },
  label: {
    type: String,
    required: true,
  },
  options: {
    type: Array,
    required: true,
    // [{ label: 'Option 1', value: '1' }, ...]
  },
  placeholder: {
    type: String,
    default: '請選擇',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  width: {
    type: String,
    default: '200px',
  },
  required: {
    type: Boolean,
    required: false,
  },
})

const emit = defineEmits(['update:modelValue', 'change'])

const selectedValue = ref(props.modelValue)

watch(
  () => props.modelValue,
  (val) => {
    selectedValue.value = val
  },
)

watch(selectedValue, (val) => {
  emit('update:modelValue', val)
  emit('change', val) // gửi ra ngoài khi có thay đổi
})
</script>

<template>
  <div class="d-flex align-items-center">
    <label class="ms-3">{{ label }} <span v-if="props.required" style="color: red">*</span></label>
    <a-select
      v-model:value="selectedValue"
      :options="props.options"
      :placeholder="props.placeholder"
      :disabled="props.disabled"
      :style="{ width }"
      class="ms-2"
    />
  </div>
</template>

<style scoped>
.base-select {
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
}
.select-label {
  font-weight: 500;
  margin-bottom: 4px;
}
</style>
