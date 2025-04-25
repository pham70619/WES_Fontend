import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login.vue'
import Login1 from '@/views/Login1.vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import Dashboard from '@/views/Dashboard.vue'
import OrderInfo from '@/views/OrderInfo1.vue'
import RetrieveLoad from '@/views/RetrieveLoad1.vue'
import Inbound from '@/views/Inbound1.vue'
import SKUMaster from '@/views/SKUMaster1.vue'
import StockAdjust from '@/views/StockAdjust1.vue'
import ApiLog from '@/views/ApiLog1.vue'
import DetailLog from '@/views/DetailLog.vue'
import ActivityLog from '@/views/ActivityLog.vue'
import Test from '@/views/TEST.vue'
import Testtable from '@/views/Testtable.vue'
import CompanySetting from '@/views/CompanySetting.vue'
import CompanyMenuSetting from '@/components/setting/CompanyMenuSetting.vue'
import RoleSetting from '@/components/setting/RoleSetting.vue'
import RoleMenuSetting from '@/components/setting/RoleMenuSetting.vue'
import i18n from '@/i18n/i18n'

const { t } = i18n.global
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login1 },
    {
      path: '/dashboard',
      component: DashboardLayout,
      meta: { breadcrumb: 'P0008-home' },
      children: [
        { path: '', component: Dashboard },
        // 出貨清單
        { path: 'orderinfo', component: OrderInfo, meta: { breadcrumb: 'P0000-orderInfo' } },
        {
          path: 'retrieveload',
          component: RetrieveLoad,
          meta: { breadcrumb: 'P0003-retrieveload' },
        },
        { path: 'inbound', component: Inbound, meta: { breadcrumb: 'P0002-inbound' } },
        { path: 'skumaster', component: SKUMaster, meta: { breadcrumb: 'P0001-skumaster' } },
        {
          path: 'stockadjustment',
          component: StockAdjust,
          meta: { breadcrumb: 'P0004-stockadjustment' },
        },
        { path: 'apilog', component: ApiLog, meta: { breadcrumb: 'P0005-apilog' } },
        { path: 'detaillog', component: DetailLog, meta: { breadcrumb: 'P0006-detaillog' } },
        {
          path: 'activitylog',
          component: ActivityLog,
          meta: { breadcrumb: 'P0007-activitylog' },
        },
        { path: 'test', component: Test, meta: { breadcrumb: 'Test' } },
        { path: 'Testtable', component: Testtable, meta: { breadcrumb: 'Testtable' } },
        {
          path: 'companysetting',
          component: CompanySetting,
          meta: { breadcrumb: 'P0009-CmpSet' },
        },
        {
          path: 'companymenusetting',
          component: CompanyMenuSetting,
          meta: { breadcrumb: 'P0010-CoMenuSet' },
        },
        {
          path: 'rolesetting',
          component: RoleSetting,
          meta: { breadcrumb: 'P0011-RoleSet' },
        },
        {
          path: 'rolemenusetting',
          component: RoleMenuSetting,
          meta: { breadcrumb: 'P0012-RoleMenuSet' },
        },
      ],
    },
  ],
})

export default router
