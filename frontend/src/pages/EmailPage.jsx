import { useNavigate, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useContext, useEffect, useState } from "react"
import { axiosInstance } from "@/lib/axiosInstance"
import { Badge } from "@/components/ui/badge"
import { AuthContext } from "@/components/AuthContext"
import { formatDate } from "@/lib/utils"

export const Email = () => {
  const { emailCategory, emailId } = useParams()
  const navigate = useNavigate()
  const [email, setEmail] = useState({})
  const [loading, setLoading] = useState(true)
  const { user } = useContext(AuthContext)

  const deleteEmail = async () => {
    const response = await axiosInstance.delete(`/emails/${emailId}`)
    navigate("/c/inbox")
  }

  const reply = () => {
    navigate("/compose", {
      state: {
        recipients: [email.sender, ...email.recipients]
          .filter((r) => r.email !== user.email)
          .map((r) => r.email)
          .join(","),
        subject: `Re: ${email.subject}`,
        body: `\n\n----\non ${formatDate(email.sentAt)}, ${
          email.sender.email
        } wrote:\n\n${email.body}`
      }
    })
  }

  const toggleArchive = async () => {
    const response = await axiosInstance.patch(`/emails/${emailId}`, {
      archived: !email.archived
    })
    setEmail({ ...email, archived: response.data.archived })
    navigate(`/c/${response.data.archived ? "archived" : "inbox"}/${emailId}`)
  }

  const formatTextWithNewlines = (text) => {
    return text?.split("\n").map((line, index) => (
      <span key={index}>
        {line}
        <br />
      </span>
    ))
  }

  useEffect(() => {
    const getEmail = async () => {
      try {
        const response = await axiosInstance(`/emails/${emailId}`)
        const responseEmail = response.data
        console.log(responseEmail)
        setEmail(responseEmail)
        setLoading(false)
      } catch (er) {
        console.log(er.message)
        navigate("/not-found")
      }
    }

    getEmail()
  }, [emailId, navigate])

  if (loading) {
    return null
  }

  return (
    <div>
      <div>
        <h2 className="font-medium text-3xl">{email.subject}</h2>
        <Badge className="my-4">{emailCategory}</Badge>
        <ul className="pb-4 border-b flex flex-col gap-2">
          <li>
            <span className="font-bold">From:</span>{" "}
            <span>{email.sender.email}</span>
          </li>
          <li>
            <span className="font-bold">To:</span>{" "}
            <span>{email.recipients.map((r) => r.email).join(", ")}</span>
          </li>
          <li>
            <span>{formatDate(email.sentAt)}</span>
          </li>
        </ul>
        <p className="my-4">{formatTextWithNewlines(email.body)}</p>
      </div>
      <div className="flex gap-2">
        <Button onClick={reply} variant="outline">
          Reply
        </Button>
        {emailCategory !== "sent" && (
          <Button onClick={toggleArchive} variant="outline">
            {email.archived ? "Unarchive" : "Archive"}
          </Button>
        )}
        <Button onClick={deleteEmail} variant="outlineDestructive">
          Delete
        </Button>
      </div>
    </div>
  )
}
