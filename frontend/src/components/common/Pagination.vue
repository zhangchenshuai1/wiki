<template>
    <div class="pagination-wrapper" v-if="totalPages > 1">
        <el-pagination background :current-page="currentPage" :page-size="pageSize" :total="total"
            @current-change="$emit('change', $event)" layout="prev, pager, next" />
    </div>
</template>

<script setup lang="ts">
defineProps<{ currentPage: number; pageSize: number; total: number; totalPages: number }>()
defineEmits<{ change: [page: number] }>()
</script>

<style scoped>
.pagination-wrapper {
    display: flex;
    justify-content: center;
    margin-top: 32px;
}
</style>
