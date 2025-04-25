<script setup>
import { ref, computed } from 'vue'
import SidebarItem from './SidebarItem1.vue'

const props = defineProps({
  //頁面路徑
  to: {
    type: [String, null],
    default: '',
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

  // children
  children: {
    type: Array,
    default: () => [],
  },
})

const hasChildren = computed(() => props.children && props.children.length > 0)

const isOpen = ref(false)

const toggle = () => {
  isOpen.value = !isOpen.value
}
</script>

<template>
  <a-tooltip
    :title="isCollapsed ? label : ''"
    placement="rightTop"
    overlay-class-name="custom-tooltip"
  >
    <RouterLink
      v-if="to"
      :to="to"
      :class="['nav-link', { collapsed: isCollapsed }]"
      active-class="active-link"
    >
      <i :class="['bi', icon]"></i>
      <span v-if="!isCollapsed" class="ms-2">{{ label }}</span>
    </RouterLink>

    <!-- main item -->
    <div
      v-else
      :class="['nav-link', { collapsed: isCollapsed }]"
      @click="hasChildren ? toggle() : null"
    >
      <i :class="['bi', icon]"></i>
      <span v-if="!isCollapsed" class="ms-2">{{ label }}</span>
      <i
        v-if="hasChildren && !isCollapsed"
        class="bi bi-chevron-down ms-auto"
        :class="{ rotate: isOpen }"
      ></i>
    </div>

    <!-- Children (recursive) -->
    <div v-if="hasChildren && isOpen && !isCollapsed" class="submenu ms-4">
      <SidebarItem
        v-for="child in children"
        :to="child.path"
        :icon="child.icon || 'bi-dot'"
        :label="$t(child.i18n_key)"
        :is-collapsed="isCollapsed"
        :children="child.children"
      />
    </div>
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
  /* margin: 0 10px; */
  border-radius: 6px;
  display: flex;
  align-items: flex-start;
  padding: 5px;
  margin-bottom: 10px;
  /* font-weight: bolder; */
  background-color: transparent;
  transition: all 0.3s ease;
  width: 100%;
  cursor: pointer;
  display: flex;
  align-items: center;
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

.bi-chevron-down {
  transition: transform 0.3s ease;
}
.bi-chevron-down.rotate {
  transform: rotate(180deg);
}
</style>
