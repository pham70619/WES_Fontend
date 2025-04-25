import { Modal } from 'ant-design-vue'
import { createVNode, ref } from 'vue'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
import { InputNumber } from 'ant-design-vue'

export const ModalHandler = {
  confirm({
    title,
    content,
    icon = ExclamationCircleOutlined,
    style = '',
    onOk,
    onCancel,
    className = '',
  }) {
    Modal.confirm({
      title: title || 'Confirm Action',
      centered: true,
      icon: createVNode(icon),
      content: createVNode(
        'div',
        {
          style: style || '',
        },
        content || 'Are you sure you want to proceed?',
      ),

      onOk: onOk || (() => console.log('Confirmed')),
      onCancel: onCancel || (() => console.log('Cancelled')),
      class: className,
    })
  },

  // adjust priority modal
  updatePriority({
    title,
    content,
    // icon = ExclamationCircleOutlined,
    min = 1,
    max = 10,
    onOk,
    onCancel,
    className = '',
  }) {
    const inputValue = ref(min) // Giá trị mặc định của InputNumber

    const modalContent = createVNode('div', {}, [
      createVNode('p', {}, content || 'Enter a value:'),
      createVNode(InputNumber, {
        id: 'inputNumber',
        value: inputValue.value,
        'onUpdate:value': (val) => {
          inputValue.value = val
        },
        min,
        max,
        style: 'width: 100%; margin-top: 8px;',
      }),
    ])

    Modal.confirm({
      title: title || 'Set Priority',
      // icon: createVNode(icon),
      content: modalContent,
      onOk: () => {
        if (onOk) {
          return onOk(inputValue.value) // Truyền giá trị nhập từ InputNumber
        }
      },
      onCancel: () => {
        if (onCancel) {
          return onCancel()
        }
      },
      class: className,
    })
  },
}
