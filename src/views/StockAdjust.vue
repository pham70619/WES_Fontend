<script setup>
import { ref } from "vue";
import ActionBar from "@/components/ActionBar.vue";
import Table from "@/components/Table1.vue";
import { APIServer, APIPaths } from "@/common/ApiPath";

const main_columns = [
  { title: "訂單編號", dataIndex: "CustomerOrderID", key: "CustomerOrderID" },
  { title: "品號", dataIndex: "ProductID", key: "ProductID" },
  { title: "板號", dataIndex: "PalletID", key: "PalletID" },
  { title: "數量", dataIndex: "Quantity", key: "Quantity" },
  { title: "變更時間", dataIndex: "TimeStamp", key: "TimeStamp" },
  { title: "原因", dataIndex: "Reason", key: "Reason" },
  { title: "版本", dataIndex: "Version", key: "Version" },
  { title: "貨物主", dataIndex: "OwnerID", key: "OwnerID" },
];

const main_data = ref([]);
const API = `${APIPaths.getStockAdjust}`; // add stock adjust path

// handle data function
const handleFetchedData = (data) => {
  console.log("Stock Adjustment received data from Actionbar:", data);
  main_data.value = data || [];
};
</script>

<template>
  <ActionBar
    :InputBox="true"
    InputBoxContent="板號"
    :DateInput="true"
    DateInputContent="日期"
    :GetDataEndpoint="API"
    ComponentName="StockAdjust"
    @dataFetched="handleFetchedData"
  />

  <Table
    :mainColumns="main_columns"
    :mainData="main_data"
    :checkBox="false"
    :showSettingBar="false"
    :expandation="false"
  />
</template>
