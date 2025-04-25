import { message } from 'ant-design-vue'
import i18n from '@/i18n/i18n'

const { t } = i18n.global
const key = 'loadingKey' // Unique key cho message

export const MessageHandler = {
  // show loading message
  showLoading(content = t('M0007-handling')) {
    message.loading({
      content,
      key,
      duration: 0, // no auto hide
    })
  },

  // show success
  showSuccess(content = t('M0005-successful')) {
    message.success({
      content,
      key,
      duration: 3, // auto hide after 3 second
    })
  },

  // show error
  showError(content = t('M0006-failed')) {
    message.error({
      content,
      key,
      duration: 3, // auto hide after 3 second
    })
  },
}
