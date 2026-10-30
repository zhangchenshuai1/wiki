<template>
    <div>
        <div v-if="loading" class="loading-text">加载中...</div>
        <template v-else-if="post">
            <h1 class="post-title">{{ post.title }}</h1>
            <div class="post-meta">
                <span>{{ post.author_name }}</span>
                <span>{{ formatDate(post.created_at) }}</span>
                <span>{{ post.view_count }} 阅读</span>
                <el-tag v-if="post.category_name" size="small">{{ post.category_name }}</el-tag>
            </div>
            <el-image v-if="post.cover_image" :src="post.cover_image" :preview-src-list="[post.cover_image]" class="cover-image" fit="contain" />
            <MarkdownPreview :content="post.content" />
            <CommentList :comments="comments" :total="commentTotal" :post-id="post.id" @refresh="fetchComments" />
        </template>
        <div v-else class="loading-text">文章不存在</div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getPost } from '../../api/post'
import { getComments } from '../../api/comment'
import MarkdownPreview from '../../components/post/MarkdownPreview.vue'
import CommentList from '../../components/comment/CommentList.vue'

const route = useRoute()
const post = ref<any>(null)
const comments = ref<any[]>([])
const commentTotal = ref(0)
const loading = ref(true)

async function fetchPost() {
    loading.value = true
    try {
        const res: any = await getPost(Number(route.params.id))
        post.value = res.post
    } catch { /* 忽略 */ }
    finally { loading.value = false }
}

async function fetchComments() {
    try {
        const res: any = await getComments(Number(route.params.id))
        comments.value = res.comments
        commentTotal.value = res.total
    } catch { /* 忽略 */ }
}

function formatDate(date: string) {
    return new Date(date).toLocaleDateString('zh-CN')
}

onMounted(() => {
    fetchPost()
    fetchComments()
})
</script>

<style scoped>
.post-title {
    font-size: 32px;
    margin-bottom: 16px;
}
.post-meta {
    display: flex;
    gap: 16px;
    align-items: center;
    font-size: 14px;
    color: var(--el-text-color-secondary);
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--el-border-color-light);
}
.cover-image {
    width: 100%;
    max-height: 400px;
    border-radius: 8px;
    margin-bottom: 24px;
}
.loading-text {
    text-align: center;
    padding: 60px;
    color: var(--el-text-color-secondary);
}
</style>
