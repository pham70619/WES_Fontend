import { ref, onMounted, onUnmounted } from "vue";

export function userInactivityTimeOut() {
  const timeout = ref(null)
  const inactivityTime = 15 * 60 * 1000 //15 分鐘 分鐘 * 秒 *豪秒
  // const inactivityTime = 2 * 1000 //15 分鐘 分鐘 * 秒 *豪秒
  const showPasswordModal = ref(false);

  //reset timer
  const resetTimer = () => {
    if (timeout.value) clearTimeout(timeout.value);
    timeout.value = setTimeout(() => {
      showPasswordModal.value = true
    }, inactivityTime)
  }

  const continueSession = () => {
    showPasswordModal.value = false
    resetTimer()
  }

  //監聽事件
  onMounted(() => {
    resetTimer();
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);
    window.addEventListener('scroll', resetTimer);
  })

  onUnmounted(() => {
    resetTimer();
    window.removeEventListener('mousemove', resetTimer)
    window.removeEventListener('keydown', resetTimer)
    window.removeEventListener('scroll', resetTimer)
  })

  return { showPasswordModal, continueSession }
}
