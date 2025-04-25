import { ref } from 'vue'

const menuData = ref([])

// generate id
function assignUniqueIds(menuItems) {
  return menuItems.map((item) => {
    const newItem = {
      ...item,
      id: Date.now() + Math.random(), // generate id
      // enabled: item.enabled === 1, //convert to boolean
    }

    if (Array.isArray(item.children) && item.children.length > 0) {
      newItem.children = assignUniqueIds(item.children)
    }

    return newItem
  })
}

export function useMenu() {
  // put menu data into local storage
  const setMenu = (menu) => {
    const menuWithIds = assignUniqueIds(menu)
    menuData.value = menuWithIds
    localStorage.setItem('menu', JSON.stringify(menuWithIds))
  }

  // get menu data from local storage
  const loadMenuFromStorage = () => {
    const stored = localStorage.getItem('menu')
    if (stored) {
      try {
        menuData.value = JSON.parse(stored)
      } catch (error) {
        console.warn('Invalid menu in localStorage!')
        menuData.value = []
      }
    }
  }

  // clear menu data
  const clearMenu = () => {
    menuData.value = []
    localStorage.removeItem('menu')
  }

  return {
    menuData,
    setMenu,
    loadMenuFromStorage,
    clearMenu,
  }
}
