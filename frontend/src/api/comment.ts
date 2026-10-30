import api from './request'

export function getComments(postId: number, params?: Record<string, any>) {
    return api.get(`/posts/${postId}/comments`, { params })
}

export function createComment(postId: number, data: Record<string, any>) {
    return api.post(`/posts/${postId}/comments`, data)
}
