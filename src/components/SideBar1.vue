<script setup>
import { ref } from 'vue'
import { LogoutFunction } from '@/handlers/Logout_handle'
import SidebarItem from './sidebar/SidebarItem1.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { logout } = LogoutFunction()

// state to manage sidebar toggle
const isSidebarCollapsed = ref(false)

// function to toggle sidebar state
const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
}

const menus = [
  {
    menu_id: 7,
    parent_id: null,
    path: null,
    icon: null,
    sort_order: 1,
    enabled: 1,
    menu_type: null,
    is_expandable: 1,
    i18n_key: 'T0034-pickingList',
    children: [
      {
        menu_id: 2,
        parent_id: 7,
        path: '/dashboard/orderinfo',
        icon: null,
        sort_order: 5,
        enabled: 1,
        menu_type: null,
        is_expandable: 0,
        i18n_key: 'P0000-orderInfo',
        children: [],
      },
      {
        menu_id: 3,
        parent_id: 7,
        path: '/dashboard/retrieveload',
        icon: null,
        sort_order: 6,
        enabled: 1,
        menu_type: null,
        is_expandable: 0,
        i18n_key: 'P0003-retrieveload',
        children: [],
      },
    ],
  },
  {
    menu_id: 4,
    parent_id: null,
    path: '/dashboard/inbound',
    icon: null,
    sort_order: 2,
    enabled: 1,
    menu_type: null,
    is_expandable: 0,
    i18n_key: 'P0002-inbound',
    children: [],
  },
  {
    menu_id: 5,
    parent_id: null,
    path: '/dashboard/skumaster',
    icon: null,
    sort_order: 3,
    enabled: 1,
    menu_type: null,
    is_expandable: 0,
    i18n_key: 'P0001-skumaster',
    children: [],
  },
  {
    menu_id: 6,
    parent_id: null,
    path: '/dashboard/stockadjustment',
    icon: null,
    sort_order: 4,
    enabled: 1,
    menu_type: null,
    is_expandable: 0,
    i18n_key: 'P0004-stockadjustment',
    children: [],
  },
]
</script>

<template>
  <nav
    class="d-flex flex-column vh-100"
    :style="[
      'background-color: #1c1c1c; color: #d4d8dd',
      isSidebarCollapsed ? 'width:80px' : 'width:250px',
    ]"
  >
    <!-- toggle button -->
    <button class="btn btn-sm btn-secondary" @click="toggleSidebar">
      {{ isSidebarCollapsed ? '>' : '<' }}
    </button>

    <h5 class="text-center mt-4">
      {{ isSidebarCollapsed ? 'WES' : 'Warehouse Execution System' }}
    </h5>
    <hr class="mx-1" />

    <SidebarItem
      v-for="item in menus"
      :to="item.path"
      :icon="item.icon || 'bi-circle'"
      :label="t(item.i18n_key)"
      :isCollapsed="isSidebarCollapsed"
      :children="item.children"
    />

    <ul class="nav flex-column p-3 flex-grow-1">
      <!-- order info view-->
      <li>
        <SidebarItem
          :to="'/dashboard/orderinfo'"
          :icon="'bi-truck'"
          :label="t('P0000-orderInfo')"
          :isCollapsed="isSidebarCollapsed"
        />
      </li>

      <!-- skumaster view -->
      <li>
        <SidebarItem
          :to="'/dashboard/skumaster'"
          :icon="'bi-info-circle'"
          :label="t('P0001-skumaster')"
          :isCollapsed="isSidebarCollapsed"
        />
      </li>

      <!-- inbound view -->
      <!-- "t('')" -->
      <li>
        <SidebarItem
          :to="'/dashboard/inbound'"
          :icon="'bi-archive'"
          :label="t('P0002-inbound')"
          :isCollapsed="isSidebarCollapsed"
        />
      </li>

      <!-- retrieveload view -->
      <li>
        <SidebarItem
          :to="'/dashboard/retrieveload'"
          :icon="'bi-clipboard-check'"
          :label="t('P0003-retrieveload')"
          :isCollapsed="isSidebarCollapsed"
        />
      </li>

      <!-- stock Adjustment view -->
      <li>
        <SidebarItem
          :to="'/dashboard/stockadjustment'"
          :icon="'bi-kanban'"
          :label="t('P0004-stockadjustment')"
          :isCollapsed="isSidebarCollapsed"
        />
      </li>

      <!-- api log -->
      <li>
        <SidebarItem
          :to="'/dashboard/apilog'"
          :icon="'bi-kanban'"
          :label="t('P0005-apilog')"
          :isCollapsed="isSidebarCollapsed"
        />
      </li>

      <!-- detail log -->
      <li>
        <SidebarItem
          :to="'/dashboard/detaillog'"
          :icon="'bi-file-earmark-code'"
          :label="t('P0006-detaillog')"
          :isCollapsed="isSidebarCollapsed"
        />
      </li>

      <!-- Activity log -->
      <li>
        <SidebarItem
          :to="'/dashboard/activitylog'"
          :icon="'bi-file-earmark-code'"
          :label="t('P0007-activitylog')"
          :isCollapsed="isSidebarCollapsed"
        />
      </li>
      <!-- test view -->
      <li>
        <SidebarItem
          :to="'/dashboard/test'"
          :icon="'bi-file-earmark-code'"
          :label="'Test'"
          :isCollapsed="isSidebarCollapsed"
        />
      </li>

      <!-- testtable view -->
      <li>
        <SidebarItem
          :to="'/dashboard/Testtable'"
          :icon="'bi-file-earmark-code'"
          :label="'Testtable'"
          :isCollapsed="isSidebarCollapsed"
        />
      </li>
    </ul>

    <button class="btn btn-outline-secondary mx-1" @click="logout">
      <i class="bi bi-box-arrow-right"></i>
    </button>
  </nav>
</template>
