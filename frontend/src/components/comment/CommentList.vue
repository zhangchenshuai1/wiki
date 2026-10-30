<template>
    <div class="comments-section">
        <h3>评论 ({{ total }})</h3>
        <CommentForm :post-id="postId" @submitted="$emit('refresh')" />
        <div v-for="comment in comments" :key="comment.id" class="comment-item">
            <div class="comment-header">
                <strong>{{ comment.author_name }}</strong>
                <span class="comment-date">{{ formatDate(comment.created_at) }}</span>
            </div>
            <p class="comment-content">{{ comment.content }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import CommentForm from './CommentForm.vue'

defineProps<{ comments: any[]; total: number; postId: number }>()
defineEmits<{ refresh: [] }>()

function formatDate(date: string) {
    return new Date(date).toLocaleString('zh-CN')
}
</script>

<style scoped>
.comments-section {
    margin-top: 48px;
}
.comments-section h3 {
    font-size: 18px;
    margin-bottom: 16px;
}
.comment-item {
    padding: 16px 0;
    border-bottom: 1px solid var(--el-border-color-light);
}
.comment-header {
    display: flex;
    gap: 12px;
    align-items: center;
    margin-bottom: 8px;
}
.comment-date {
    font-size: 12px;
    color: var(--el-text-color-placeholder);
}
.comment-content {
    font-size: 14px;
    line-height: 1.6;
    color: var(--el-text-color-regular);
}
</style>
