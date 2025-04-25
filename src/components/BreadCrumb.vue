<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const route = useRoute()
const breadcrumbs = computed(() => {
  const matchedRoutes = route.matched
  return matchedRoutes.map((r) => ({
    label: r.meta.breadcrumb ? t(r.meta.breadcrumb) : r.meta.title || r.name || null, // || r.path,
    path: r.path !== route.path ? r.path : null,
  }))
})
</script>

<template>
  <nav aria-label="breadcrumb">
    <ul class="breadcrumb m-0">
      <li v-for="(item, index) in breadcrumbs" :key="index" class="breadcrumb-item">
        <router-link v-if="item.path" :to="item.path">{{ item.label }}</router-link>
        <span v-else>{{ item.label }}</span>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.breadcrumb {
  display: flex;
  list-style: none;
  padding: 0;
}

.breadcrumb-item {
  font-size: 1rem;
  font-weight: bold;
}

.breadcrumb li + li::before {
  content: '>';
  margin: 0 8px;
}
</style>
