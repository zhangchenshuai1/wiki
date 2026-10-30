<template>
    <div class="admin-layout">
        <AdminSidebar />
        <div class="admin-main">
            <slot />
        </div>
    </div>
</template>

<script setup lang="ts">
import AdminSidebar from './AdminSidebar.vue'
</script>

<style scoped>
.admin-layout {
    display: flex;
    min-height: 100vh;
}
.admin-main {
    flex: 1;
    padding: 20px;
    background: var(--el-bg-color-page);
}
</style>
