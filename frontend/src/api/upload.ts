import api from './request'

export function uploadImage(file: File) {
    const formData = new FormData()
    formData.append('file', file)
    return api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    })
}
