import { Outlet, NavLink } from "react-router-dom"
import { useContext } from "react"
import { AuthContext } from "../components/AuthContext"
import { Button } from "../components/ui/button"
import archivedIcon from "../assets/archived.svg"
import composeIcon from "../assets/compose.svg"
import inboxIcon from "../assets/inbox.svg"
import sentIcon from "../assets/sent.svg"
import logoutIcon from "../assets/log-out.svg"

export const RootLayout = () => {
  return (
    <div className="max-w-4xl mx-auto px-4">
      <header className="flex justify-between items-center border-b gap-2">
        <ul className="py-4 flex gap-2">
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
          <h1 className="text-lg font-bold hidden md:block">toma@email.com</h1>
          <Button variant="outline">
            <span className="hidden md:inline-block">Log out</span>
            <img className="md:hidden" src={logoutIcon} alt="" />
          </Button>
        </div>
      </header>

      <main className="my-8">
        <Outlet />
      </main>
    </div>
  )
}
