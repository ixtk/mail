import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  useNavigate
} from "react-router-dom"

import { RootLayout } from "./pages/RootLayout"
import { AuthContext, AuthContextProvider } from "./components/AuthContext"
import { useContext, useEffect } from "react"
import { Email } from "./components/Email"
import { ComposeEmail } from "./components/ComposeEmail"
import { EmailListPage } from "./pages/EmailListPage"
import { LoginPage } from "./pages/LoginPage"
import { RegisterPage } from "./pages/RegisterPage"

const ProtectedRoute = ({ children }) => {
  const { user, initialLoading } = useContext(AuthContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (initialLoading === false && user === null) {
      navigate("/login")
    }
  }, [user, initialLoading, navigate])

  return user ? children : null
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route path=":emailCategory" element={<EmailListPage />} />
      <Route path="inbox/:emailId" element={<Email />} />
      <Route path="compose" element={<ComposeEmail />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="register" element={<RegisterPage />} />
    </Route>
  )
)

export const App = () => {
  return (
    <AuthContextProvider>
      <RouterProvider router={router} />
    </AuthContextProvider>
  )
}
