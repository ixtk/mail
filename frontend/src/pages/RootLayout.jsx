import { Outlet, NavLink } from "react-router-dom"
import { useContext } from "react"
import { AuthContext } from "../components/AuthContext"
import { Button } from "../components/ui/button"

export const RootLayout = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <header className="flex justify-between items-center border-b">
        <ul className="py-4 flex gap-2">
          <li>
            <Button asChild variant="outline">
              <NavLink to="inbox">Inbox</NavLink>
            </Button>
          </li>
          <li>
            <Button asChild variant="outline">
              <NavLink to="sent">Sent</NavLink>
            </Button>
          </li>
          <li>
            <Button asChild variant="outline">
              <NavLink to="archived">Archived</NavLink>
            </Button>
          </li>
          <li>
            <Button asChild variant="outline">
              <NavLink to="compose">Compose</NavLink>
            </Button>
          </li>
        </ul>
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-bold">toma@email.com</h1>
          <Button variant="outline">Log out</Button>
        </div>
      </header>

      <main className="my-8">
        <Outlet />
      </main>
    </div>
  )
}
