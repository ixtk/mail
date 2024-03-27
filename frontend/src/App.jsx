import {
  createBrowserRouter,
  createRoutesFromElements,
  Outlet,
  Route,
  RouterProvider,
  useNavigate,
  Navigate
} from "react-router-dom"

import { RootLayout } from "./pages/RootLayout"
import { AuthContext, AuthContextProvider } from "./components/AuthContext"
import { useContext, useEffect } from "react"
import { Email } from "./pages/EmailPage"
import { ComposeEmail } from "./components/ComposeEmail"
import { EmailListPage } from "./pages/EmailListPage"
import { LoginPage } from "./pages/LoginPage"
import { RegisterPage } from "./pages/RegisterPage"
import { NotFoundPage } from "./pages/NotFoundPage"

const ProtectedRoute = () => {
  const { user, initialLoading } = useContext(AuthContext)
  const navigate = useNavigate()

  useEffect(() => {
    // Or just use <Navigate />
    if (initialLoading === false && user === null) {
      navigate("/login")
    }
  }, [user, initialLoading, navigate])

  return !initialLoading && user ? <Outlet /> : null
}

const RedirectIfLoggedIn = () => {
  const { user, initialLoading } = useContext(AuthContext)

  if (!initialLoading) {
    if (user) {
      return <Navigate to="/c/inbox" />
    } else {
      return <Outlet />
    }
  } else {
    return null
  }
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route element={<ProtectedRoute />}>
        <Route index element={<Navigate to="c/inbox" />} />
        <Route path="c/:emailCategory" element={<EmailListPage />} />
        <Route path="c/:emailCategory/:emailId" element={<Email />} />
        <Route path="compose" element={<ComposeEmail />} />
      </Route>
      <Route element={<RedirectIfLoggedIn />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
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
