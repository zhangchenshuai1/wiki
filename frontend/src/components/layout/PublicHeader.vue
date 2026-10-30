<template>
    <header class="header">
        <div class="header-inner">
            <router-link to="/" class="logo">Wiki</router-link>
            <nav class="nav">
                <router-link v-for="cat in categories" :key="cat.id" :to="`/?category=${cat.slug}`" class="nav-link">
                    {{ cat.name }}
                </router-link>
            </nav>
            <div class="actions">
                <input v-model="keyword" class="search-input" placeholder="搜索文章..." @keyup.enter="search" />
                <el-switch v-model="isDark" active-text="暗" inactive-text="亮" />
                <template v-if="authStore.isLoggedIn">
                    <router-link to="/posts/new" class="admin-link">写文章</router-link>
                    <router-link v-if="authStore.isAdmin" to="/admin" class="admin-link">管理</router-link>
                    <span class="user-info">{{ authStore.user?.username }}</span>
                    <a class="admin-link" @click="handleLogout" style="cursor:pointer">退出</a>
                </template>
                <template v-else>
                    <router-link to="/admin/login" class="admin-link">登录</router-link>
                    <router-link to="/register" class="admin-link">注册</router-link>
                </template>
            </div>
        </div>
    </header>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useDark, useToggle } from '@vueuse/core'
import { getCategories } from '../../api/post'
import { useAuthStore } from '../../stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const isDark = useDark()
const toggleDark = useToggle(isDark)
const categories = ref<any[]>([])
const keyword = ref('')

function search() {
    const q = keyword.value.trim()
    if (q) {
        router.push(`/search?q=${encodeURIComponent(q)}`)
    }
}

function handleLogout() {
    authStore.logout()
    router.push('/')
}

onMounted(async () => {
    try {
        const res: any = await getCategories()
        categories.value = res.categories
    } catch { /* 忽略 */ }
})
</script>

<style scoped>
.header {
    height: 60px;
    border-bottom: 1px solid var(--el-border-color-light);
    background: var(--el-bg-color);
    position: sticky;
    top: 0;
    z-index: 100;
}
.header-inner {
    max-width: 1200px;
    margin: 0 auto;
    height: 100%;
    display: flex;
    align-items: center;
    padding: 0 20px;
    gap: 24px;
}
.logo {
    font-size: 22px;
    font-weight: 700;
    text-decoration: none;
    color: var(--el-color-primary);
}
.nav {
    display: flex;
    gap: 16px;
}
.nav-link {
    text-decoration: none;
    color: var(--el-text-color-regular);
    font-size: 14px;
}
.nav-link:hover {
    color: var(--el-color-primary);
}
.actions {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 12px;
}
.search-input {
    padding: 6px 12px;
    border: 1px solid var(--el-border-color);
    border-radius: 6px;
    background: var(--el-bg-color);
    color: var(--el-text-color-primary);
    outline: none;
    width: 180px;
    font-size: 14px;
}
.search-input:focus {
    border-color: var(--el-color-primary);
}
.admin-link {
    text-decoration: none;
    color: var(--el-text-color-secondary);
    font-size: 14px;
}
.user-info {
    font-size: 14px;
    color: var(--el-text-color-secondary);
}
</style>
