import { Outlet, NavLink, useNavigate } from "react-router-dom"
import { useContext } from "react"
import { AuthContext } from "../components/AuthContext"
import { Button } from "../components/ui/button"
import { axiosInstance } from "../lib/axiosInstance"
import archivedIcon from "../assets/archived.svg"
import composeIcon from "../assets/compose.svg"
import inboxIcon from "../assets/inbox.svg"
import sentIcon from "../assets/sent.svg"
import logoutIcon from "../assets/log-out.svg"
import loginIcon from "../assets/login.svg"
import registerIcon from "../assets/register.svg"

export const RootLayout = () => {
  const { user, initialLoading, setUser } = useContext(AuthContext)
  const navigate = useNavigate()

  const logoutUser = async () => {
    await axiosInstance.delete("/user/logout")
    setUser(null)
    navigate("/")
  }

  return (
    <div className="max-w-4xl mx-auto px-4">
      <header className="flex justify-between items-center border-b gap-2 py-4">
        {!initialLoading && user ? (
          <>
            <ul className="flex gap-2">
              <li>
                <Button asChild variant="outline">
                  <NavLink to="inbox">
                    <span className="hidden md:inline-block">Inbox</span>
                    <img className="md:hidden" src={inboxIcon} alt="" />
                  </NavLink>
                </Button>
              </li>
              <li>
                <Button asChild variant="outline">
                  <NavLink to="sent">
                    <span className="hidden md:inline-block">Sent</span>
                    <img className="md:hidden" src={sentIcon} alt="" />
                  </NavLink>
                </Button>
              </li>
              <li>
                <Button asChild variant="outline">
                  <NavLink to="archived">
                    <span className="hidden md:inline-block">Archived</span>
                    <img className="md:hidden" src={archivedIcon} alt="" />
                  </NavLink>
                </Button>
              </li>
              <li>
                <Button asChild variant="outline">
                  <NavLink to="compose">
                    <span className="hidden md:inline-block">Compose</span>
                    <img className="md:hidden" src={composeIcon} alt="" />
                  </NavLink>
                </Button>
              </li>
            </ul>
            <div className="flex items-center gap-4">
              <h1 className="text-lg font-bold hidden md:block">
                {user.email}
              </h1>
              <Button variant="outline" onClick={logoutUser}>
                <span className="hidden md:inline-block">Log out</span>
                <img className="md:hidden" src={logoutIcon} alt="" />
              </Button>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-4 ml-auto">
            <Button asChild variant="outline">
              <NavLink to="login">
                <span className="hidden md:inline-block">Login</span>
                <img className="md:hidden" src={loginIcon} alt="" />
              </NavLink>
            </Button>
            <Button variant="outline">
              <NavLink to="register">
                <span className="hidden md:inline-block">Register</span>
                <img className="md:hidden" src={registerIcon} alt="" />
              </NavLink>
            </Button>
          </div>
        )}
      </header>
      <main className="my-8">
        <Outlet />
      </main>
    </div>
  )
}
