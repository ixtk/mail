import { axiosInstance } from "../lib/axiosInstance"
import { Skeleton } from "./ui/skeleton"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

export const EmailList = () => {
  const [emails, setEmails] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getEmails = async () => {
      const response = await axiosInstance("/emails/c/inbox")
      const responseEmails = response.data
      setEmails(responseEmails)
      setLoading(false)
    }

    getEmails()
  }, [])

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
      {emails.map((email) => (
        <Link
          to={email._id}
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
