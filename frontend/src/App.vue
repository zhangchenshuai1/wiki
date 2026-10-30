<template>
    <component :is="layout">
        <router-view />
    </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import PublicLayout from './components/layout/PublicLayout.vue'
import AdminLayout from './components/layout/AdminLayout.vue'

const route = useRoute()
const layout = computed(() => (route.meta.layout === 'admin' ? AdminLayout : PublicLayout))
</script>
