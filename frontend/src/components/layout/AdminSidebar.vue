<template>
    <aside class="sidebar">
        <div class="sidebar-header">
            <h2>Wiki 管理</h2>
        </div>
        <el-menu :default-active="route.path" router :style="{ borderRight: 'none' }">
            <el-menu-item index="/admin">
                <span>仪表盘</span>
            </el-menu-item>
            <el-menu-item index="/admin/posts/new">
                <span>写文章</span>
            </el-menu-item>
            <el-menu-item @click="goHome">
                <span>返回前台</span>
            </el-menu-item>
            <el-menu-item @click="handleLogout">
                <span>退出登录</span>
            </el-menu-item>
        </el-menu>
    </aside>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

function goHome() {
    router.push('/')
}

function handleLogout() {
    authStore.logout()
    router.push('/')
}
</script>

<style scoped>
.sidebar {
    width: 220px;
    min-height: 100vh;
    background: var(--el-bg-color);
    border-right: 1px solid var(--el-border-color-light);
}
.sidebar-header {
    padding: 20px;
    text-align: center;
}
.sidebar-header h2 {
    margin: 0;
    font-size: 18px;
}
</style>
