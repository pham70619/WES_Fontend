<script setup>
const props = defineProps({
  //頁面路徑
  to: {
    type: String,
    required: true,
  },

  //頁面名稱
  icon: {
    type: String,
    required: true,
  },

  //頁面名稱
  label: {
    type: String,
    required: true,
  },

  //導欄列展開還是縮小
  isCollapsed: {
    type: Boolean,
    required: true,
  },
})
</script>

<template>
  <a-tooltip
    :title="isCollapsed ? label : ''"
    placement="rightTop"
    overlay-class-name="custom-tooltip"
  >
    <RouterLink
      :to="to"
      :class="['nav-link', { collapsed: isCollapsed }]"
      active-class="active-link"
    >
      <i :class="['bi', icon]"></i>
      <span v-if="!isCollapsed" class="ms-2">{{ label }}</span>
    </RouterLink>
  </a-tooltip>
</template>

<style>
.custom-tooltip .ant-tooltip-inner {
  background-color: #fdfeff;
  color: #333;
  font-weight: bold;
}
.custom-tooltip .ant-tooltip-arrow::before {
  background-color: #fdfeff;
}
.nav-link {
  color: #fdfeff;
  /* border: 1px solid #fdfeff; */
  border-radius: 6px;
  display: flex;
  align-items: flex-start;
  padding: 5px;
  margin-bottom: 10px;
  /* font-weight: bolder; */
  background-color: transparent;
  transition: all 0.3s ease;
  width: 100%;
}

.nav-link i {
  color: #fdfeff;
}

.nav-link:hover {
  background-color: #fdfeff;
  color: #141414;
}

.nav-link:hover i {
  color: #141414;
}

.active-link {
  color: #141414;
  background-color: #fdfeff;
  transition: all 0.3s ease;
}

.active-link i {
  color: #141414;
}

.nav-link.collapsed {
  justify-content: center;
}
</style>
