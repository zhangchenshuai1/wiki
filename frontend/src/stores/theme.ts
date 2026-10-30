import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useThemeStore = defineStore('theme', () => {
    const isDark = ref(localStorage.getItem('darkMode') === 'true')

    function toggle() {
        isDark.value = !isDark.value
        localStorage.setItem('darkMode', String(isDark.value))
    }

    return { isDark, toggle }
})
