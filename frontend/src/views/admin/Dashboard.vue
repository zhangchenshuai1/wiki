<template>
    <div>
        <div class="dashboard-header">
            <h2>文章管理</h2>
            <el-button type="primary" @click="$router.push('/admin/posts/new')">写文章</el-button>
        </div>
        <el-table :data="posts" stripe v-loading="loading" style="width:100%">
            <el-table-column prop="id" label="ID" width="60" />
            <el-table-column prop="title" label="标题" width="200" />
            <el-table-column prop="category_name" label="分类" width="80" />
            <el-table-column prop="status" label="状态" width="80">
                <template #default="{ row }">
                    <el-tag :type="row.status === 'published' ? 'success' : 'info'" size="small">
                        {{ row.status === 'published' ? '已发布' : '草稿' }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="is_pinned" label="置顶" width="60">
                <template #default="{ row }">
                    <span v-if="row.is_pinned">是</span><span v-else>否</span>
                </template>
            </el-table-column>
            <el-table-column prop="is_hidden" label="隐藏" width="60">
                <template #default="{ row }">
                    <el-tag :type="row.is_hidden ? 'danger' : 'success'" size="small">
                        {{ row.is_hidden ? '是' : '否' }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="view_count" label="阅读" width="70" />
            <el-table-column prop="created_at" label="日期" width="100">
                <template #default="{ row }">{{ formatDate(row.created_at) }}</template>
            </el-table-column>
            <el-table-column label="操作" width="300" fixed="right">
                <template #default="{ row }">
                    <el-button size="small" @click="$router.push(`/admin/posts/${row.id}/edit`)">编辑</el-button>
                    <el-button size="small" :type="row.is_hidden ? 'success' : 'warning'" @click="handleToggleHide(row)">
                        {{ row.is_hidden ? '显示' : '隐藏' }}
                    </el-button>
                    <el-popconfirm title="确定删除？" @confirm="handleDelete(row.id)">
                        <template #reference>
                            <el-button size="small" type="danger">删除</el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
        <Pagination :current-page="page" :page-size="10" :total="total" :total-pages="totalPages" @change="goPage" />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { getPosts, deletePost, toggleHide } from '../../api/post'
import Pagination from '../../components/common/Pagination.vue'
import { ElMessage } from 'element-plus'

const posts = ref<any[]>([])
const loading = ref(false)
const page = ref(1)
const total = ref(0)
const totalPages = ref(0)

async function fetchPosts() {
    loading.value = true
    try {
        const res: any = await getPosts({ page: page.value, limit: 10, all: 1 })
        posts.value = res.posts
        total.value = res.total
        totalPages.value = res.totalPages
    } catch { /* 忽略 */ }
    finally { loading.value = false }
}

async function handleToggleHide(row: any) {
    try {
        const res: any = await toggleHide(row.id)
        row.is_hidden = res.is_hidden
        ElMessage.success(res.is_hidden ? '已隐藏' : '已显示')
    } catch { /* 忽略 */ }
}

async function handleDelete(id: number) {
    try {
        await deletePost(id)
        ElMessage.success('删除成功')
        fetchPosts()
    } catch { /* 忽略 */ }
}

function goPage(p: number) { page.value = p }

function formatDate(date: string) {
    return new Date(date).toLocaleDateString('zh-CN')
}

onMounted(fetchPosts)
watch(page, fetchPosts)
</script>

<style scoped>
.dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}
.dashboard-header h2 {
    font-size: 22px;
}
</style>
