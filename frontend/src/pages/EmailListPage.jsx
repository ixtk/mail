import { EmailList } from "@/components/EmailList"
import { useParams } from "react-router-dom"

export const EmailListPage = () => {
  const { emailCategory } = useParams()

  return <EmailList emailCategory={emailCategory.toLowerCase()} />
}
