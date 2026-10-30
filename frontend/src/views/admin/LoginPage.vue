<template>
    <div class="login-page">
        <div class="login-card">
            <h2>登录</h2>
            <el-form @submit.prevent="handleLogin">
                <el-form-item>
                    <el-input v-model="username" placeholder="用户名" size="large" />
                </el-form-item>
                <el-form-item>
                    <el-input v-model="password" type="password" placeholder="密码" size="large" show-password />
                </el-form-item>
                <el-button type="primary" size="large" :loading="loading" @click="handleLogin" style="width:100%">
                    登录
                </el-button>
            </el-form>
            <p class="link-text">
                没有账号？<router-link to="/register">去注册</router-link>
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const username = ref('')
const password = ref('')
const loading = ref(false)

async function handleLogin() {
    if (!username.value || !password.value) return
    loading.value = true
    try {
        await authStore.login(username.value, password.value)
        router.replace(authStore.isAdmin ? '/admin' : '/')
    } catch { /* 拦截器已提示 */ }
    finally { loading.value = false }
}
</script>

<style scoped>
.login-page {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 80vh;
}
.login-card {
    width: 360px;
    padding: 40px;
    background: var(--el-bg-color);
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}
.login-card h2 {
    text-align: center;
    margin-bottom: 24px;
    font-size: 22px;
}
.link-text {
    text-align: center;
    margin-top: 16px;
    font-size: 14px;
    color: var(--el-text-color-secondary);
}
</style>
