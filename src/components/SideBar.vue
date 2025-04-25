<script setup>
import { onMounted, ref } from 'vue'
import { LogoutFunction } from '@/handlers/Logout_handle'
import SidebarItem from './sidebar/SidebarItem1.vue'
import { useI18n } from 'vue-i18n'
import { useMenu } from '@/common/useMenu'
import { ModalHandler } from '@/common/ModalHandler'

const { t } = useI18n()
const { menuData, loadMenuFromStorage } = useMenu()
const { logout } = LogoutFunction()

// state to manage sidebar toggle
const isSidebarCollapsed = ref(false)

// function to toggle sidebar state
const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
}

// logout handle
const onLogout = () => {
  ModalHandler.confirm({
    title: t('T0036-confirmLogout'),
    content: t('M0011-confLogout'),
    onOk: () => {
      logout()
      console.log('logout')
    },
    onCancel: () => {
      undefined
    },
  })
}

// const menuData = [
//   {
//     menu_id: 7,
//     parent_id: null,
//     path: null,
//     icon: 'bi-clipboard-check',
//     sort_order: 1,
//     enabled: true,
//     menu_type: 'MENU',
//     is_expandable: 1,
//     i18n_key: 'T0034-pickingList',
//     children: [
//       {
//         menu_id: 2,
//         parent_id: 7,
//         path: '/dashboard/orderinfo',
//         icon: null,
//         sort_order: 5,
//         enabled: true,
//         menu_type: 'MENU',
//         is_expandable: 0,
//         i18n_key: 'P0000-orderInfo',
//         children: [],
//         id: 1744362022355.8787,
//       },
//       {
//         menu_id: 3,
//         parent_id: 7,
//         path: '/dashboard/retrieveload',
//         icon: null,
//         sort_order: 6,
//         enabled: true,
//         menu_type: 'MENU',
//         is_expandable: 0,
//         i18n_key: 'P0003-retrieveload',
//         children: [],
//         id: 1744362022355.5452,
//       },
//     ],
//     id: 1744362022355.4607,
//   },
//   {
//     menu_id: 4,
//     parent_id: null,
//     path: '/dashboard/inbound',
//     icon: 'bi-archive',
//     sort_order: 2,
//     enabled: true,
//     menu_type: 'MENU',
//     is_expandable: 0,
//     i18n_key: 'P0002-inbound',
//     children: [],
//     id: 1744362022355.8154,
//   },
//   {
//     menu_id: 5,
//     parent_id: null,
//     path: '/dashboard/skumaster',
//     icon: 'bi-info-circle',
//     sort_order: 3,
//     enabled: true,
//     menu_type: 'MENU',
//     is_expandable: 0,
//     i18n_key: 'P0001-skumaster',
//     children: [],
//     id: 1744362022355.3003,
//   },
//   {
//     menu_id: 6,
//     parent_id: null,
//     path: '/dashboard/stockadjustment',
//     icon: 'bi-kanban',
//     sort_order: 4,
//     enabled: true,
//     menu_type: 'MENU',
//     is_expandable: 0,
//     i18n_key: 'P0004-stockadjustment',
//     children: [],
//     id: 1744362022355.27,
//   },
//   {
//     menu_id: 10,
//     parent_id: null,
//     path: null,
//     icon: 'bi-file-earmark-code',
//     sort_order: 9,
//     enabled: true,
//     menu_type: 'MENU',
//     is_expandable: 1,
//     i18n_key: 'T0035-log',
//     children: [
//       {
//         menu_id: 8,
//         parent_id: 10,
//         path: '/dashboard/apilog',
//         icon: null,
//         sort_order: 7,
//         enabled: true,
//         menu_type: 'MENU',
//         is_expandable: 0,
//         i18n_key: 'P0005-apilog',
//         children: [],
//         id: 1744362022355.4087,
//       },
//       {
//         menu_id: 9,
//         parent_id: 10,
//         path: '/dashboard/detaillog',
//         icon: null,
//         sort_order: 8,
//         enabled: true,
//         menu_type: 'MENU',
//         is_expandable: 0,
//         i18n_key: 'P0006-detaillog',
//         children: [],
//         id: 1744362022355.7297,
//       },
//     ],
//     id: 1744362022355.1958,
//   },
//   {
//     menu_id: 11,
//     parent_id: null,
//     path: '/dashboard/activitylog',
//     icon: null,
//     sort_order: 10,
//     enabled: true,
//     menu_type: 'MENU',
//     is_expandable: 0,
//     i18n_key: 'P0007-activitylog',
//     children: [],
//     id: 1744362022355.5303,
//   },
//   {
//     menu_id: 12,
//     parent_id: null,
//     path: '/dashboard/test',
//     icon: null,
//     sort_order: 11,
//     enabled: true,
//     menu_type: 'MENU',
//     is_expandable: 0,
//     i18n_key: 'Test',
//     children: [],
//     id: 1744362022355.032,
//   },
// ]

onMounted(() => {
  loadMenuFromStorage()
  console.log('menudata:', menuData)
})
</script>

<template>
  <nav
    class="sidebar d-flex flex-column vh-100"
    :style="[
      'background-color: #1c1c1c; color: #d4d8dd',
      isSidebarCollapsed ? 'width:80px' : 'width:250px',
    ]"
  >
    <!-- toggle button -->
    <button class="toggle-btn btn btn-secondary btn-sm" @click="toggleSidebar">
      {{ isSidebarCollapsed ? '>' : '<' }}
    </button>

    <h5 class="text-center mt-4">
      {{ isSidebarCollapsed ? 'WES' : 'Warehouse Execution System' }}
    </h5>
    <hr class="mx-1" />

    <div class="sidebar-content p-3 overflow-auto">
      <SidebarItem
        v-for="item in menuData"
        :to="item.path"
        :icon="item.icon || 'bi-circle'"
        :label="$t(item.i18n_key)"
        :isCollapsed="isSidebarCollapsed"
        :children="item.children"
      />
    </div>

    <div class="sidebar-footer">
      <button class="btn btn-outline-secondary w-100" @click="onLogout">
        <i class="bi bi-box-arrow-right"></i>
      </button>
    </div>
  </nav>
</template>

<style scoped>
.sidebar {
  position: relative;
}

.toggle-btn {
  position: absolute;
  top: 60px;
  right: -12px;
  cursor: pointer;
  background-color: #fdfeff;
  border-radius: 15px;
  color: #2c2c2c;
}

.sidebar-content::-webkit-scrollbar {
  width: 8px;
}

.sidebar-content::-webkit-scrollbar-thumb {
  background-color: #5c5c5c;
  border-radius: 4px;
}

.sidebar-content::-webkit-scrollbar-track {
  background-color: transparent;
}

.sidebar-content {
  flex-grow: 1;
}

.sidebar-footer {
  flex-shrink: 0;
}
</style>
