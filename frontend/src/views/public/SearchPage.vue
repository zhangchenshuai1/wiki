<template>
    <div>
        <h2 class="search-title">搜索结果：{{ keyword }}</h2>
        <PostList v-if="posts.length" :posts="posts" />
        <div v-else-if="!loading" class="empty">没有找到相关文章</div>
        <div v-if="loading" class="loading-text">搜索中...</div>
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
const keyword = ref('')
const posts = ref<any[]>([])
const page = ref(1)
const total = ref(0)
const totalPages = ref(0)
const loading = ref(false)

async function fetchResults() {
    loading.value = true
    try {
        const res: any = await getPosts({ page: page.value, search: keyword.value })
        posts.value = res.posts
        total.value = res.total
        totalPages.value = res.totalPages
    } catch { /* 忽略 */ }
    finally { loading.value = false }
}

function goPage(p: number) {
    page.value = p
    window.scrollTo(0, 0)
}

onMounted(() => {
    keyword.value = (route.query.q as string) || ''
    if (keyword.value) fetchResults()
})

watch(page, fetchResults)
</script>

<style scoped>
.search-title {
    font-size: 24px;
    margin-bottom: 24px;
}
.empty {
    text-align: center;
    padding: 60px;
    color: var(--el-text-color-secondary);
}
.loading-text {
    text-align: center;
    padding: 40px;
    color: var(--el-text-color-secondary);
}
</style>
