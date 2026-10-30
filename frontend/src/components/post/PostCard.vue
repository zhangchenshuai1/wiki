<template>
    <div class="post-card" @click="$router.push(`/post/${post.id}`)">
        <img v-if="post.cover_image" :src="post.cover_image" class="cover" />
        <div class="card-body">
            <span class="category" v-if="post.category_name">{{ post.category_name }}</span>
            <span class="pinned-badge" v-if="post.is_pinned">置顶</span>
            <h3 class="title">{{ post.title }}</h3>
            <p class="summary">{{ post.summary }}</p>
            <div class="meta">
                <span>{{ post.author_name }}</span>
                <span>{{ formatDate(post.created_at) }}</span>
                <span>{{ post.view_count }} 阅读</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{ post: any }>()

function formatDate(date: string) {
    return new Date(date).toLocaleDateString('zh-CN')
}
</script>

<style scoped>
.post-card {
    border: 1px solid var(--el-border-color-light);
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
    transition: box-shadow 0.2s;
    background: var(--el-bg-color);
}
.post-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
.cover {
    width: 100%;
    height: 180px;
    object-fit: cover;
}
.card-body {
    padding: 16px;
}
.category {
    font-size: 12px;
    color: var(--el-color-primary);
    background: rgba(var(--el-color-primary-rgb, 64, 158, 255), 0.1);
    padding: 2px 8px;
    border-radius: 4px;
}
.pinned-badge {
    font-size: 12px;
    color: #e6a23c;
    background: rgba(230, 162, 60, 0.1);
    padding: 2px 8px;
    border-radius: 4px;
    margin-left: 6px;
}
.title {
    margin: 8px 0;
    font-size: 18px;
}
.summary {
    color: var(--el-text-color-secondary);
    font-size: 14px;
    line-height: 1.6;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
.meta {
    margin-top: 12px;
    font-size: 12px;
    color: var(--el-text-color-placeholder);
    display: flex;
    gap: 16px;
}
</style>
