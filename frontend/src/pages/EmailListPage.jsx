import { EmailList } from "../components/EmailList"
import { useParams } from "react-router-dom"

export const EmailListPage = () => {
  const { emailCategory } = useParams()

  const category =
    emailCategory.charAt(0).toUpperCase() + emailCategory.slice(1)

  return (
    <div>
      <h2 className="text-lg font-bold">{category}</h2>
      <EmailList emailCategory={emailCategory.toLowerCase()} />
    </div>
  )
}
