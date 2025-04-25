<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  label: {
    type: String,
    required: true,
  },
  placeHolder: {
    type: String,
    required: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  maxLength: {
    type: Number,
    default: 100,
  },
  type: {
    type: String,
    default: 'text',
    // text || date
  },
  width: {
    type: String,
    default: '200px',
    // 200px || 300px ||....
  },
  required: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue', 'validation'])

const inputContent = ref('')
watch(
  () => props.modelValue,
  (val) => {
    inputContent.value = val
  },
)

watch(inputContent, (val) => {
  emit('update:modelValue', val)
})

// blur event and send inputcontent to parent component
const onBlur = () => {
  if (props.required && !inputContent.value.trim()) {
    emit('validation', { valid: false, message: `${props.label} is required.` })
  } else {
    emit('validation', { valid: true, value: inputContent.value })
  }
}
</script>

<template>
  <div class="d-flex align-items-center">
    <span></span>
    <div>
      <label class="ms-3"
        >{{ label }}
        <span v-if="props.required" style="color: red">*</span>
      </label>
      <a-input
        v-model:value="inputContent"
        :placeholder="props.placeHolder"
        :maxlength="props.maxLength"
        :disabled="props.disabled"
        :readonly="props.readonly"
        :type="type"
        :style="{ width }"
        class="ms-2"
        @blur="onBlur"
      />
    </div>
  </div>
</template>
