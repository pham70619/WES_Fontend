<script setup>
import { ref } from "vue";
import ActionBar from "@/components/ActionBar.vue";
import Table from "@/components/Table1.vue";
import { APIServer, APIPaths } from "@/common/ApiPath";

const main_columns = [
  { title: "出庫任務", dataIndex: "requestID", key: "requestID" },
  { title: "類型", dataIndex: "messageType", key: "messageType" },
  { title: "出庫單號", dataIndex: "loadID", key: "loadID" },
  {
    title: "優先度",
    dataIndex: "priority",
    key: "priority",
    sorter: (a, b) => a.priority - b.priority,
    sortDirections: ["ascend", "descend"],
  },
  { title: "目的地", dataIndex: "destination", key: "destination" },
  { title: "出貨時間", dataIndex: "despatchTime", key: "despatchTime" },
  { title: "狀態", dataIndex: "status", key: "status" },
  { title: "客戶", dataIndex: "customerID", key: "customerID" },
];

const detail_columns = [
  { title: "板號", dataIndex: "palletID", key: "palletID" },
  // { title: "備註", dataIndex: "remark1", key: "remark1" },
  // { title: "建立時間", dataIndex: "updateTime", key: "updateTime" },
  // { title: "更新人員", dataIndex: "updateBy", key: "updateBy" },
];

const main_data = ref([]);
const API = `${APIServer}${APIPaths.getRetrievload}`;
const priority_endpoint = `${APIServer}${APIPaths.retrieveLoadPriority}`;
const dropdown_options = ref([
  "全選",
  "Pending",
  "Processing",
  "Processed",
  "Successed",
  "Failed",
]);

//'data'- response data from actionbar
const handleFetchedData = (data) => {
  console.log("retrieveload received data from Actionbar:", data);
  main_data.value = data || [];
};
</script>

<template>
  <ActionBar
    :InputBox="true"
    InputBoxContent="板號"
    :InputBox1="true"
    InputBoxContent1="單號"
    :DateInput="true"
    DateInputContent="出貨日期"
    :DropdownSelection="true"
    DropdownTitle="狀態"
    :DropdownOptions="dropdown_options"
    :GetDataEndpoint="API"
    ComponentName="Retrieveload"
    @dataFetched="handleFetchedData"
  />
  <Table
    :mainColumns="main_columns"
    :detailColumns="detail_columns"
    :mainData="main_data"
    :showSettingBar="true"
    :submitBtn="false"
    :adjustPriority="true"
    :cancelBtn="false"
    :priorityEndpoint="priority_endpoint"
    expandObject="palletList"
  />
</template>
