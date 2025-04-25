<script setup>
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  modelValue: {
    type: [Number, String],
    default: '',
  },
  label: {
    type: String,
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  min: {
    type: Number,
    required: true,
  },
  max: {
    type: Number,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue', 'click'])

const vModel = ref('')

watch(
  () => props.modelValue,
  (val) => {
    vModel.value = val
  },
)

watch(
  () => vModel.value,
  (val) => {
    emit('update:modelValue', val)
  },
)

const onClick = () => {
  emit('click')
}
</script>

<template>
  <div class="d-flex align-items-center">
    <label v-if="label" class="label ms-3">{{ label }}</label>
    <a-input-number
      v-model:value="vModel"
      :placeholder="t('L0008-priority')"
      :disabled="disabled"
      :min="min"
      :max="max"
      :step="1"
      class="ms-2"
    />
    <!-- 調整 -->
    <!-- <a-button class="ms-2" @click="onClick">調整</a-button> -->
    <button class="ms-2 btn btn-primary" @click="onClick" :disabled="props.disabled">
      {{ t('B0003-adjust') }}
    </button>
  </div>
</template>
