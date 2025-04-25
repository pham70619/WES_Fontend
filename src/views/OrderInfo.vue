<script setup>
import { ref } from 'vue'
import ActionBar from '@/components/ActionBar.vue'
import Table from '@/components/Table1.vue'
import { APIServer, APIPaths } from '@/common/ApiPath'

const main_columns = [
  { title: '門市代號', dataIndex: 'storeID', key: 'storeID' },
  { title: '類型', dataIndex: 'messageType', key: 'messageType' },
  { title: '優先度', dataIndex: 'priority', key: 'priority' },
  { title: '訂單編號', dataIndex: 'customerOrderID', key: 'customerOrderID' },
  { title: '模塊區碼', dataIndex: 'zoneID', key: 'zoneID' },
  {
    title: '出貨日期',
    dataIndex: 'shippingTime',
    key: 'shippingTime',
    sorter: (a, b) => new Date(a.shippingTime).getTime() - new Date(b.shippingTime).getTime(),
    defaultSortOrder: 'descend',
  },
  { title: '建立時間', dataIndex: 'createTime', key: 'createTime' },
  { title: '更新時間', dataIndex: 'updateTime', key: 'updateTime' },
  { title: '更新者', dataIndex: 'updateBy', key: 'updateBy' },
  { title: '狀態', dataIndex: 'status', key: 'status' },
  { title: '綁定', dataIndex: 'remark1', key: 'remark1' },
  { title: '客戶', dataIndex: 'customerID', key: 'customerID' },
]

const detail_columns = [
  { title: '產品編號', dataIndex: 'productID', key: 'productID' },
  { title: '貨物主', dataIndex: 'ownerID', key: 'ownerID' },
  { title: '版本', dataIndex: 'version', key: 'version' },
  { title: '有效日期 ', dataIndex: 'expiry', key: 'expiry' },
  { title: '數量 ', dataIndex: 'quantity', key: 'quantity' },
  // { title: '備註', dataIndex: 'remark1', key: 'remark1' },
  // { title: '出站級別', dataIndex: 'outboundLevel', key: 'outboundLevel' },
  // { title: '更新時間', dataIndex: 'updateTime', key: 'updateTime' },
  // { title: '更新者', dataIndex: 'updateBy', key: 'updateBy' },
]

const main_data = ref([])
const API = `${APIPaths.getOrderData(10, 0)}`
const submit_endpoint = `${APIServer}${APIPaths.merger}`
const priority_endpoint = `${APIServer}${APIPaths.orderInfoPriority}`
const dropdown_options = ref(['全選', 'Pending', 'Processing', 'Processed', 'Successed', 'Failed'])

//'data'- response data from actionbar
const handleFetchedData = (data) => {
  console.log('Orderinfo received data from Actionbar:', data)
  main_data.value = data || []
}
</script>

<template>
  <ActionBar
    :InputBox="true"
    InputBoxContent="門市代碼"
    :InputBox1="true"
    InputBoxContent1="訂單編號"
    :DateInput="true"
    DateInputContent="出貨日期"
    :DropdownSelection="true"
    DropdownTitle="狀態"
    :DropdownOptions="dropdown_options"
    :GetDataEndpoint="API"
    ComponentName="OrderInfo"
    @dataFetched="handleFetchedData"
  />
  <Table
    :mainColumns="main_columns"
    :detailColumns="detail_columns"
    :mainData="main_data"
    :showSettingBar="true"
    :submitBtn="true"
    :adjustPriority="true"
    :cancelBtn="true"
    :submitEndpoint="submit_endpoint"
    :priorityEndpoint="priority_endpoint"
    expandObject="productList"
  >
  </Table>
  <!-- @refreshData="handleRefreshData" -->
</template>
