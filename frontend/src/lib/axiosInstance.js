import axios from "axios"

const config = {
  baseURL: import.meta.env.VITE_EXPRESS_URL,
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
