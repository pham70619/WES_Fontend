<script setup>
import ActionBar from '@/components/ActionBar.vue'
import { APIServer, APIPaths } from '@/common/ApiPath'
import { ref, reactive, computed } from 'vue'

const logContent = ref('')
const API = `${APIServer}${APIPaths.getLog}`
const activeTab = ref('1')
const dropdownOptions = ref(['a', 'b', 'c', 'd'])
// const ComponentName = 'logDetail'
const ComponentName = 'APILog'

//'data'- response data from actionbar
const handleFetchedData = (data) => {
  console.log('DetailLog received data from Actionbar:', data)
  logContent.value = data.logContent
}

const highlight = reactive({
  info: false, //default uncheck
  warn: false,
  error: false,
})

const handleTabChange = (key) => {
  activeTab.value = key
}

// filter
const filteredLogs = computed(() => {
  const lines = logContent.value.split('\n')

  return lines.filter((line) => {
    if (activeTab.value === '1') return true // tab all
    if (activeTab.value === '2') return /INFO/.test(line)
    if (activeTab.value === '3') return /WARN/.test(line)
    if (activeTab.value === '4') return /ERROR/.test(line)
    return false
  })
})

// Highlight log
const highlightedLogs = computed(() => {
  return filteredLogs.value
    .map((line, index) => {
      const lineNumber = `<span class="log-number text-secondary">${index + 1}</span>` // Số thứ tự

      let highlightedLine = line
      if (highlight.info && /INFO/.test(line)) {
        highlightedLine = `<span class="bg-info bg-opacity-25 d-inline-block">${line}</span>`
      } else if (highlight.warn && /WARN/.test(line)) {
        highlightedLine = `<span class="bg-warning bg-opacity-25 d-inline-block">${line}</span>`
      } else if (highlight.error && /ERROR/.test(line)) {
        highlightedLine = `<span class="bg-danger bg-opacity-25 d-inline-block">${line}</span>`
      }
      return `<div class="log-line">${lineNumber} <span class="log-content">${highlightedLine}</span></div>`
    })
    .join('')
})

// counter
const logCounts = computed(() => {
  const lines = logContent.value.split('\n')
  return {
    all: lines.length,
    info: lines.filter((line) => /INFO/.test(line)).length,
    warn: lines.filter((line) => /WARN/.test(line)).length,
    error: lines.filter((line) => /ERROR/.test(line)).length,
  }
})

const columns = [
  { title: 'File', dataIndex: 'files', key: 'files' },
  {
    title: 'Action',
    key: 'action',
    render: (_, record) => {
      return `<button @click="downloadFile('${record.files}')">Download</button>`
    },
  },
]
const data = ref(
  [
    'example1.txt',
    'example2.txt',
    'example3.txt',
    'example4.txt',
    'example5.txt',
    'example6.txt',
  ].map((file) => ({
    files: file,
  })),
)
</script>

<template>
  <ActionBar
    :DateInput="true"
    :DropdownSelection="true"
    DropdownTitle="服務"
    :DropdownOptions="dropdownOptions"
    :GetDataEndpoint="API"
    :ComponentName="ComponentName"
    @dataFetched="handleFetchedData"
  />
  <div class="row p-3">
    <div class="col-4">
      <a-table bordered :data-source="data.value" :columns="columns" row-key="files"></a-table>
    </div>

    <div class="col-8 border">
      <div class="flex-grow-1 mt-3 bg-white rounded-3">
        <a-tabs default-active-key="1" type="card" @change="handleTabChange">
          <!-- all tab -->
          <a-tab-pane key="1" :tab="`All (${logCounts.all})`">
            <div class="p-4 border" style="font-family: monospace">
              <div class="d-flex align-items-center pb-3 px-3">
                <p class="m-0">Highlight:</p>
                <label class="bg-info bg-opacity-25 d-flex align-items-center ms-3 rounded-2 pe-2">
                  <input class="form-check-input m-2" v-model="highlight.info" type="checkbox" />
                  <span class="text-info">Info</span>
                </label>

                <label
                  class="bg-warning bg-opacity-25 d-flex align-items-center ms-3 rounded-2 pe-2"
                >
                  <input class="form-check-input m-2" v-model="highlight.warn" type="checkbox" />
                  <span class="text-warning">Warning</span>
                </label>

                <label
                  class="bg-danger bg-opacity-25 d-flex align-items-center ms-3 rounded-2 pe-2"
                >
                  <input class="form-check-input m-2" v-model="highlight.error" type="checkbox" />
                  <span class="text-danger">Error</span>
                </label>
              </div>
              <pre v-html="highlightedLogs"></pre>
            </div>
          </a-tab-pane>

          <!-- info tab -->
          <a-tab-pane key="2" :tab="`Info (${logCounts.info})`">
            <div class="p-4 border" style="font-family: monospace">
              <h3>Logs for Info</h3>
              <pre v-html="highlightedLogs"></pre>
            </div>
          </a-tab-pane>

          <!-- warning tab -->
          <a-tab-pane key="3" :tab="`Warning (${logCounts.warn})`">
            <div class="p-4 border" style="font-family: monospace">
              <h3>Logs for Warning</h3>
              <pre v-html="highlightedLogs"></pre>
            </div>
          </a-tab-pane>

          <!-- warning tab -->
          <a-tab-pane key="4" :tab="`Error (${logCounts.error})`">
            <div class="p-4 border" style="font-family: monospace">
              <h3>Logs for Error</h3>
              <pre v-html="highlightedLogs"></pre>
            </div>
          </a-tab-pane>
        </a-tabs>

        <!-- log viewer -->
      </div>
    </div>
  </div>
</template>

<style scoped>
.log-line {
  display: flex; /* Căn chỉnh số thứ tự và nội dung trên cùng một dòng */
  align-items: flex-start; /* Căn chỉnh theo chiều dọc */
}

.log-number {
  width: 50px; /* Đặt độ rộng cố định cho số thứ tự */
  text-align: right; /* Căn phải số thứ tự */
  margin-right: 10px; /* Khoảng cách giữa số thứ tự và nội dung */
  font-family: monospace; /* Font chữ phù hợp */
  color: gray;
}

.log-content {
  flex-grow: 1; /* Đảm bảo phần nội dung chiếm không gian còn lại */
  word-wrap: break-word; /* Nếu nội dung quá dài, sẽ xuống dòng */
}
</style>
