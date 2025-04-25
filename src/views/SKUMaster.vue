<script setup>
import ActionBar from "@/components/ActionBar.vue";
import Table from "@/components/Table1.vue";
import { APIServer, APIPaths } from "@/common/ApiPath";
import { ref } from "vue";

const main_columns = [
  { title: "任務號", dataIndex: "requestID", key: "requestID" },
  { title: "類型", dataIndex: "messageType", key: "messageType" },
  { title: "貨號", dataIndex: "productID", key: "productID" },
  { title: "商品描述", dataIndex: "description", key: "description" },
  { title: "建立時間", dataIndex: "createTime", key: "createTime" },
  { title: "狀態", dataIndex: "status", key: "status" },
  { title: "客戶", dataIndex: "ownerID", key: "ownerID" },
];

const detail_columns = [
  { title: "版本號", dataIndex: "versionNumber", key: "versionNumber" },
  { title: "版本描述", dataIndex: "versionDescription", key: "versionDescription" },
  { title: "建立時間", dataIndex: "timeStamp", key: "timeStamp" },
  //   { title: '備註', dataIndex: 'remark1', key: 'remark1' },
  //   { title: '建立時間', dataIndex: 'createTime', key: 'createTime' },
  //   { title: '更新時間', dataIndex: 'updateTime', key: 'updateTime' },
  //   { title: '更新者', dataIndex: 'updateBy', key: 'updateBy' },
];

const API = `${APIPaths.getSKUMaster}`;
const cancelEnpoint = `${APIServer}${APIPaths.SKUCancel}`;
const main_data = ref([]);
const dropdownOptions = ref([
  "全選",
  "Pending",
  "Processing",
  "Processed",
  "Successed",
  "Failed",
]);

// handle data fetched from actionbar
const handleFetchedData = (data) => {
  console.log("SKUMaster received data from ActionBar:", data);
  main_data.value = data || [];
};
</script>

<template>
  <ActionBar
    :InputBox="true"
    InputBoxContent="貨號"
    :InputBox1="true"
    InputBoxContent1="客戶代號"
    :DateInput="true"
    DateInputContent="建立日期"
    :DropdownSelection="true"
    DropdownTitle="狀態"
    :DropdownOptions="dropdownOptions"
    :GetDataEndpoint="API"
    ComponentName="SKUMaster"
    @dataFetched="handleFetchedData"
  />
  <Table
    :mainColumns="main_columns"
    :detailColumns="detail_columns"
    :mainData="main_data"
    expandObject="versionList"
    :checkBox="true"
    :showSettingBar="true"
    :submitBtn="false"
    :adjustPriority="false"
    :cancelBtn="true"
    :cancelEndpoint="cancelEnpoint"
  ></Table>
</template>
