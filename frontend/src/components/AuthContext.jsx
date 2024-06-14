import { createContext, useEffect, useState } from "react"
import {
  axiosInstance,
  setCsrfToken,
  axiosInterceptorsInstance
} from "@/lib/axiosInstance"

export const AuthContext = createContext({
  user: null,
  setUser: null,
  initialLoading: true
})

export const AuthContextProvider = ({ children }) => {
  const [initialLoading, setInitialLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await axiosInstance.get("/users/status")
        setInitialLoading(false)
        setCsrfToken(axiosInstance, response.headers["x-csrf-token"])
        setCsrfToken(
          axiosInterceptorsInstance,
          response.headers["x-csrf-token"]
        )
        setUser(response.data.user)
      } catch (error) {
        setInitialLoading(false)
      }
    }

    checkStatus()
  }, [])

  return (
    <AuthContext.Provider value={{ user, setUser, initialLoading }}>
      {children}
    </AuthContext.Provider>
  )
}
