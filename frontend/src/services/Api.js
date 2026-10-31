import axios from 'axios'

const apiUrl = import.meta.env.VITE_API_URL || (
    import.meta.env.PROD
        ? 'https://manuten-o-sesi-2.onrender.com'
        : 'http://localhost:3000'
)

const api = axios.create({
    baseURL: apiUrl
})

//manda token em todos os logins feitos
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token")

    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }

    return config
})

export default api
