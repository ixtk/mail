import axios from "axios"

const config = {
  baseURL: '/api',
  withCredentials: true
}

export const axiosInstance = axios.create(config)

export const axiosInterceptorsInstance = axios.create(config)
axiosInterceptorsInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = "/login"
    }
    return Promise.reject(error)
  }
)

export const setCsrfToken = (inputInstance, csrfToken) => {
  inputInstance.defaults.headers.post["X-CSRF-Token"] = csrfToken
  inputInstance.defaults.headers.patch["X-CSRF-Token"] = csrfToken
  inputInstance.defaults.headers.put["X-CSRF-Token"] = csrfToken
  inputInstance.defaults.headers.delete["X-CSRF-Token"] = csrfToken
}
