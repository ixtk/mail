import { axiosInstance } from "../lib/axiosInstance"
import { Skeleton } from "./ui/skeleton"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"

export const EmailList = ({ emailCategory }) => {
  const [emails, setEmails] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    if (!["inbox", "sent", "archived"].includes(emailCategory)) {
      navigate("/not-found")
    }

    const getEmails = async () => {
      const response = await axiosInstance(`/emails/c/${emailCategory}`)
      const responseEmails = response.data
      setEmails(responseEmails)
      setLoading(false)
    }

    getEmails()
  }, [emailCategory, navigate])

  return (
    <div className="my-4 divide-y">
      {loading && (
        <div className="flex flex-col gap-4">
          <div className="py-3">
            <Skeleton className="h-4 w-1/2" />
          </div>
          <div className="py-3">
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      )}
      {emails.length === 0 && <h2 className="my-6">No emails</h2>}
      {emails.map((email) => (
        <Link
          to={`/c/${emailCategory}/${email._id}`}
          key={email._id}
          className="flex justify-between py-3 gap-4"
        >
          <div className="font-medium hidden md:block">
            {email.sender.email}
          </div>
          <div className="">{email.subject}</div>
          <div className="hidden md:block">
            {new Date(email.sentAt).toLocaleDateString("en-US", {
              dateStyle: "medium"
            })}
          </div>
        </Link>
      ))}
    </div>
  )
}
