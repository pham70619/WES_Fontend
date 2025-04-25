<template>
  <div>
    <a-table
      :columns="columns"
      :data-source="dataSource"
      :pagination="{ pageSize: 5 }"
      rowKey="id"
      @change="handleChange"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const props = defineProps({
  columns: {
    type: Array,
    required: true,
  },
  dataSource: {
    type: Array,
    required: true,
  },
})

// const columns = [
//   {
//     title: 'Name',
//     dataIndex: 'name',
//     key: 'name',
//     sorter: true, // 🔑 bật sort
//     // sortDirections: ['ascend', 'descend'],
//   },
//   {
//     title: 'Age',
//     dataIndex: 'age',
//     key: 'age',
//     sorter: true, // 🔑 bật sort
//     // sortDirections: ['ascend', 'descend'],
//   },
// ]

// const dataSource = ref([])
const loading = ref(false)

// const fetchData = async () => {
//   loading.value = true
//   try {
//     const response = await axios.get(
//       'https://39affaab-826e-47fd-ab0d-f028062da98d.mock.pstmn.io/testtable/sorter',
//     )
//     // Map lại để có field `id`, `name`, `email`
//     // dataSource.value = response.data.map((user) => ({
//     //   id: user.id,
//     //   name: user.name,
//     //   age: user.age,
//     // }))

//     dataSource.value = response.data
//     console.log('table data:', dataSource.value)
//   } catch (error) {
//     console.error('❌ Lỗi khi gọi API:', error)
//   } finally {
//     loading.value = false
//   }
// }

// const dataSource = [
//   { id: 1, name: 'Alice', age: 25 },
//   { id: 2, name: 'Bob', age: 30 },
//   { id: 3, name: 'Charlie', age: 22 },
//   { id: 4, name: 'David', age: 35 },
//   { id: 5, name: 'Eva', age: 28 },
// ]

const handleChange = (pagination, filters, sorter) => {
  console.log('📦 Pagination:', pagination)
  console.log('🔽 Sorter:', sorter)
  console.log('Sort Field:', sorter.field)
  console.log('Sort Order:', sorter.order)
}

onMounted(() => {
  // fetchData()
})
</script>
