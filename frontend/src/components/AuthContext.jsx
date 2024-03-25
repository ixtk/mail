import { createContext, useEffect, useState } from "react"

export const AuthContext = createContext({
  initialLoading: true,
  user: null
})

export const AuthContextProvider = ({ children }) => {
  const [initialLoading, setInitialLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const checkStatus = async () => {
      try {
        // const response = await axiosInstance.get("/user/status")
        setInitialLoading(false)
        // setUser(response.data.user)
      } catch (error) {
        setInitialLoading(false)
      }
    }

    checkStatus()

    // const logoutInterceptor =
    //   axiosInterceptorsInstance.interceptors.response.use(
    //     (response) => response,
    //     (error) => {
    //       if (error.response?.status === 401) {
    //         window.location.href = "/login"
    //       }
    //       return Promise.reject(error)
    //     }
    //   )

    // return () => {
    //   axiosInterceptorsInstance.interceptors.response.eject(logoutInterceptor)
    // }
  }, [])

  return (
    <AuthContext.Provider value={{ user, setUser, initialLoading }}>
      {children}
    </AuthContext.Provider>
  )
}
