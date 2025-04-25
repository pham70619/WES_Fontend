<script setup>
import { ModalHandler } from '@/common/ModalHandler'
import { ref, computed, onMounted } from 'vue'
import SettingForm from '@/components/setting/SideBarSettingForm.vue'
import { MenuService } from '@/Serveice/MenuService'
import { useMenu } from '@/common/useMenu'

const pages = ref([])
const selectedItem = ref(null)
const selectedPage = ref()
const deleteItem = ref([])
const menuService = MenuService()
const currentPage = computed(() => pages.value.find((p) => p.title === selectedPage.value))
const { menuData, clearMenu, setMenu, loadMenuFromStorage } = useMenu()
const addPage = () => {
  const newPageName = 'Parent Menu ' + (menuData.value.length + 1)
  menuData.value.push({
    id: Date.now(),
    menu_id: null,
    title: newPageName,
    parent_id: null,
    path: null,
    icon: null,
    menu_type: 'MENU',
    sort_order: menuData.value.length + 1,
    enabled: 1,
    is_expandable: 0,
    isModified: true,
    i18n_key: 'Test',
    children: [],
  })
  // selectedPage.value = newPageName
}

// refresh menu data
const getMenuData = () => {
  menuService.getData().then((response) => {
    setMenu(response)
  })
}

// delete menu
const removePage = (index) => {
  ModalHandler.confirm({
    title: 'xac nhan ',
    content: 'ban co chac chan muon xoa trang nay',
    onOk: () => {
      const removedpage = menuData.value[index]
      console.log('removed page:', removedpage)

      if (removedpage.menu_id) {
        deleteItem.value.push(removedpage.menu_id)
        console.log('delete menu id:', deleteItem.value)
      }
      menuData.value.splice(index, 1)
      if (selectedPage.value === removedpage.title) {
        selectedPage.value = pages.value[0]?.title || ''
      }
    },
    onCancel: () => {
      undefined
    },
  })
}

// delete child handle
const onDeleteChild = (child) => {
  if (child.menu_id) {
    deleteItem.value.push(child.menu_id)
    console.log('delete menu id:', deleteItem.value)
  }
}

// selected menu handle
const selectPage = (_id) => {
  const parent = menuData.value.find((p) => p.id === _id)
  if (parent) {
    selectedItem.value = parent
    return
  }

  for (const p of menuData.value) {
    const child = p.children?.find((c) => c.id === _id)
    if (child) {
      selectedItem.value = child
      return
    }
  }

  // selectedPage.value = pageTitle
}

// handle change
const saveChanges = () => {
  const modifiedParents = menuData.value.filter((item) => item.isModified)
  const modifiedChildren = menuData.value.flatMap((parent) =>
    parent.children?.filter((child) => child.isModified),
  )

  const allModified = [...modifiedParents, ...modifiedChildren]

  if (allModified.length === 0) {
    console.log('No data has been modified.')
    // return
  }

  ModalHandler.confirm({
    title: 'xac nhan hanh dong',
    content: 'ban co chac chan luwu thay doi',
    onOk: () => {
      // call update api
      menuService
        .updateData(menuData.value)
        .then((response) => {
          console.log('update menu data successful!', response)
        })
        .catch((error) => {
          console.error('failed to update menu data:', error)
        })
        .finally(() => {
          getMenuData()
          loadMenuFromStorage()
        })

      // call delete api
      if (deleteItem.value.length > 0) {
        menuService
          .deleteData(deleteItem.value)
          .then((response) => {
            console.log('delete menu data successful!', response)
            deleteItem.value = []
          })
          .catch((error) => {
            console.error('failed to delete menu data:', error)
          })
          .finally(() => {
            getMenuData()
            loadMenuFromStorage()
          })
      }
    },
    onCancel: () => {
      undefined
    },
  })
}

onMounted(() => {
  loadMenuFromStorage()
})
</script>

<template>
  <div class="container d-flex">
    <div class="side">
      <!-- side header -->
      <div class="px-3 pt-3 border-bottom d-flex justify-content-between">
        <h5>setting side bar</h5>
        <a-button @click="addPage()">add</a-button>
      </div>

      <!-- side content -->
      <div class="p-3">
        <div class="mb-2" v-for="(page, index) in menuData" :key="index">
          <!-- parent -->
          <div
            class="d-flex justify-content-between"
            style="cursor: pointer"
            @click="selectPage(page.id)"
          >
            <p class="mb-0">{{ $t(page.i18n_key) }}</p>
            <a @click.stop="removePage(index)" style="cursor: pointer; color: red">X</a>
          </div>
          <!-- child -->
          <ul v-if="page.children && page.children.length" class="mt-1">
            <li
              v-for="(child, cIndex) in page.children"
              :key="cIndex"
              style="cursor: pointer"
              @click="selectPage(child.id)"
            >
              {{ $t(child.i18n_key) }}
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="content">
      <!-- <h4>{{ currentPage }}</h4> -->
      <!-- <p>Noi dung cua {{ selectedPage }}</p>  -->
      <SettingForm
        v-if="selectedItem"
        v-model:settingData="selectedItem"
        @deleteChild="onDeleteChild"
      />
      <!-- footer -->
      <div class="align-content-end">
        <a-button @click="saveChanges" class="mt-2">Save Changes</a-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.side {
  background-color: rgb(99, 99, 99);
  width: 250px;
  height: 100vh;
  color: #f5f5f5;
}

.content {
  flex-grow: 1;
  background-color: #f5f5f5;
  min-height: 100vh;
}
</style>
