<template>
    <div class="public-layout">
        <PublicHeader />
        <main class="main-content">
            <slot />
        </main>
    </div>
</template>

<script setup lang="ts">
import PublicHeader from './PublicHeader.vue'
</script>

<style scoped>
.main-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    min-height: calc(100vh - 60px);
}
</style>
