import api from './request'

export function register(username: string, password: string) {
    return api.post('/register', { username, password })
}

export function login(username: string, password: string) {
    return api.post('/login', { username, password })
}

export function getUser() {
    return api.get('/user')
}
