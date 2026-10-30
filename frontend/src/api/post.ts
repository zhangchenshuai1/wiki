import api from './request'

export function getPosts(params?: Record<string, any>) {
    return api.get('/posts', { params })
}

export function getPost(id: number) {
    return api.get(`/posts/${id}`)
}

export function createPost(data: Record<string, any>) {
    return api.post('/posts', data)
}

export function updatePost(id: number, data: Record<string, any>) {
    return api.put(`/posts/${id}`, data)
}

export function deletePost(id: number) {
    return api.delete(`/posts/${id}`)
}

export function toggleHide(id: number) {
    return api.put(`/posts/${id}/hide`)
}

export function getCategories() {
    return api.get('/categories')
}
