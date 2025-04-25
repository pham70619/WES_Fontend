<script setup>
import ActionBar from '@/components/ActionBar.vue'
import Table from '@/components/Table1.vue'
import { APIServer, APIPaths } from '@/common/ApiPath'
import { ref } from 'vue'

const main_columns = [
  { title: '任務號', dataIndex: 'requestID', key: 'requestID' },
  { title: '類型', dataIndex: 'messageType', key: 'messageType' },
  { title: '板號', dataIndex: 'palletID', key: 'palletID' },
  { title: '目的地', dataIndex: 'destination', key: 'destination' },
  { title: '模塊區碼', dataIndex: 'zoneID', key: 'zoneID' },
  {
    title: '建立時間',
    dataIndex: 'createTime',
    key: 'createTime',
    sorter: (a, b) => new Date(a.createTime).getTime() - new Date(b.createTime).getTime(),
    defaultSortOrder: 'descend',
  },
  { title: '狀態', dataIndex: 'status', key: 'status' },
  { title: '客戶', dataIndex: 'customerID', key: 'customerID' },
]

const detail_columns = [
  { title: '產品', dataIndex: 'productID', key: 'productID' },
  { title: '數量', dataIndex: 'quantity', key: 'quantity' },
  { title: '底層', dataIndex: 'layer', key: 'layer' },
  { title: '版本', dataIndex: 'version', key: 'version' },
  { title: '貨物主', dataIndex: 'ownerID', key: 'ownerID' },
  { title: '批次', dataIndex: 'batch', key: 'batch' },
  { title: '到期', dataIndex: 'expiry', key: 'expiry' },
  //   { title: '備註', dataIndex: 'remark1', key: 'remark1' },
  //   { title: '更新時間', dataIndex: 'updateTime', key: 'updateTime' },
  //   { title: '更新者', dataIndex: 'updateBy', key: 'updateBy' },
]

const main_data = ref([])
// const API = `${APIServer}${APIPaths.getInbound}`
const API = `http://10.35.10.82:5006/Inbound/UI/InboundPalletInfo/GetInboundPalletInfos`
// http://10.35.10.82:5006/Inbound/UI/InboundPalletInfo/GetInboundPalletInfos?batch=10&skip=0
const cancel_endpoint = `${APIServer}${APIPaths.InboundCancel}`
const dropdown_options = ref(['全選', 'Pending', 'Processing', 'Processed', 'Successed', 'Failed'])

const handleFetchedData = (data) => {
  console.log('Inbound received data from ActionBar:', data)
  main_data.value = data || []
}
</script>

<template>
  <ActionBar
    :InputBox="true"
    InputBoxContent="板號"
    :DateInput="true"
    DateInputContent="入庫日期"
    :DropdownSelection="true"
    DropdownTitle="狀態"
    :DropdownOptions="dropdown_options"
    :GetDataEndpoint="API"
    ComponentName="Inbound"
    @dataFetched="handleFetchedData"
  />

  <Table
    :mainColumns="main_columns"
    :detailColumns="detail_columns"
    :mainData="main_data"
    :checkBox="true"
    :showSettingBar="true"
    :submitBtn="true"
    :adjustPriority="false"
    :cancelBtn="true"
    :submitEndpoint="submit_endpoint"
    :cancelEndpoint="cancel_endpoint"
    expandObject="productList"
  ></Table>
</template>
