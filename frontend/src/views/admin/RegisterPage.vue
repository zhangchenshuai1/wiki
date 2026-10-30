<template>
    <div class="login-page">
        <div class="login-card">
            <h2>注册账号</h2>
            <el-form @submit.prevent="handleRegister">
                <el-form-item>
                    <el-input v-model="username" placeholder="用户名" size="large" />
                </el-form-item>
                <el-form-item>
                    <el-input v-model="password" type="password" placeholder="密码（至少6位）" size="large" show-password />
                </el-form-item>
                <el-form-item>
                    <el-input v-model="confirmPwd" type="password" placeholder="确认密码" size="large" show-password />
                </el-form-item>
                <el-button type="primary" size="large" :loading="loading" @click="handleRegister" style="width:100%">
                    注册
                </el-button>
            </el-form>
            <p class="link-text">
                已有账号？<router-link to="/admin/login">去登录</router-link>
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '../../stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const username = ref('')
const password = ref('')
const confirmPwd = ref('')
const loading = ref(false)

async function handleRegister() {
    if (!username.value || !password.value) {
        ElMessage.warning('请填写用户名和密码')
        return
    }
    if (password.value.length < 6) {
        ElMessage.warning('密码至少6位')
        return
    }
    if (password.value !== confirmPwd.value) {
        ElMessage.warning('两次密码不一致')
        return
    }
    loading.value = true
    try {
        await authStore.register(username.value, password.value)
        ElMessage.success('注册成功')
        router.replace('/')
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
