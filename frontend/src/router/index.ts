import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/register',
            component: () => import('../views/admin/RegisterPage.vue'),
            meta: { layout: 'admin', guest: true },
        },
        {
            path: '/',
            component: () => import('../views/public/HomePage.vue'),
            meta: { layout: 'public' },
        },
        {
            path: '/search',
            component: () => import('../views/public/SearchPage.vue'),
            meta: { layout: 'public' },
        },
        {
            path: '/post/:id',
            component: () => import('../views/public/PostDetail.vue'),
            meta: { layout: 'public' },
        },
        {
            path: '/posts/new',
            component: () => import('../views/admin/PostEditor.vue'),
            meta: { layout: 'public', requiresAuth: true },
        },
        {
            path: '/admin/login',
            component: () => import('../views/admin/LoginPage.vue'),
            meta: { layout: 'admin', guest: true },
        },
        {
            path: '/admin',
            component: () => import('../views/admin/Dashboard.vue'),
            meta: { layout: 'admin', requiresAuth: true },
        },
        {
            path: '/admin/posts/new',
            component: () => import('../views/admin/PostEditor.vue'),
            meta: { layout: 'admin', requiresAuth: true },
        },
        {
            path: '/admin/posts/:id/edit',
            component: () => import('../views/admin/PostEditor.vue'),
            meta: { layout: 'admin', requiresAuth: true },
        },
    ],
})

router.beforeEach((to, _from, next) => {
    const token = localStorage.getItem('token')
    if (to.meta.requiresAuth && !token) {
        next('/admin/login')
    } else if (to.meta.guest && token) {
        next(token ? '/' : undefined)
    } else {
        next()
    }
})

export default router
