<template>
    <div>
        <PostList :posts="posts" />
        <div v-if="loading" class="loading-text">加载中...</div>
        <Pagination :current-page="page" :page-size="10" :total="total" :total-pages="totalPages" @change="goPage" />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getPosts } from '../../api/post'
import PostList from '../../components/post/PostList.vue'
import Pagination from '../../components/common/Pagination.vue'

const route = useRoute()
const posts = ref<any[]>([])
const page = ref(1)
const total = ref(0)
const totalPages = ref(0)
const loading = ref(false)

const currentCategory = ref((route.query.category as string) || '')

async function fetchPosts() {
    loading.value = true
    try {
        const res: any = await getPosts({
            page: page.value,
            category: currentCategory.value || undefined,
        })
        posts.value = res.posts
        total.value = res.total
        totalPages.value = res.totalPages
    } catch { /* 忽略 */ }
    finally { loading.value = false }
}

function goPage(p: number) {
    page.value = p
    window.scrollTo(0, 0)
    fetchPosts()
}

onMounted(fetchPosts)

watch(() => route.query.category, (val) => {
    currentCategory.value = (val as string) || ''
    page.value = 1
    fetchPosts()
})
</script>

<style scoped>
.loading-text {
    text-align: center;
    padding: 40px;
    color: var(--el-text-color-secondary);
}
</style>
