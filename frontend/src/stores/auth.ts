import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as authApi from '../api/auth'

export const useAuthStore = defineStore('auth', () => {
    const token = ref(localStorage.getItem('token') || '')
    const user = ref<any>(null)

    const isLoggedIn = computed(() => !!token.value)
    const isAdmin = computed(() => user.value?.role === 'admin')

    async function register(username: string, password: string) {
        const res: any = await authApi.register(username, password)
        token.value = res.token
        user.value = res.user
        localStorage.setItem('token', res.token)
    }

    async function login(username: string, password: string) {
        const res: any = await authApi.login(username, password)
        token.value = res.token
        user.value = res.user
        localStorage.setItem('token', res.token)
    }

    async function fetchUser() {
        if (!token.value) return
        try {
            const res: any = await authApi.getUser()
            user.value = res.user
        } catch {
            logout()
        }
    }

    function logout() {
        token.value = ''
        user.value = null
        localStorage.removeItem('token')
    }

    return { token, user, isLoggedIn, isAdmin, register, login, fetchUser, logout }
})
