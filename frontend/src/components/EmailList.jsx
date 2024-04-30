import { axiosInstance } from "@/lib/axiosInstance"
import { Skeleton } from "@/components/ui/skeleton"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { formatDate } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

export const EmailList = ({ emailCategory }) => {
  const [emails, setEmails] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const deleteEmail = async (id) => {
    const response = await axiosInstance.delete(`/emails/${id}`)
    setEmails(emails.filter((e) => e._id !== id))
    // navigate("/c/inbox")
  }

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
      {loading ? (
        <div className="flex flex-col gap-4">
          <div className="py-3">
            <Skeleton className="h-4 w-1/2" />
          </div>
          <div className="py-3">
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      ) : emails.length === 0 ? (
        <h2 className="my-6">No emails</h2>
      ) : (
        emails.map((email) => (
          <div className="py-3 gap-4" key={email._id}>
            <div className="flex gap-4 items-center">
              <Link
                to={`/c/${emailCategory}/${email._id}`}
                className="flex justify-between grow gap-4"
              >
                <div className="font-medium hidden md:block">
                  {email.sender.email}
                </div>
                <div className="">{email.subject}</div>
                <div className="hidden md:block">
                  {formatDate(email.sentAt)}
                </div>
              </Link>
              <div>
                <Button
                  className="p-2 flex items-center h-auto"
                  onClick={() => deleteEmail(email._id)}
                  variant="outlineDestructive"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
