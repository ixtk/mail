import { useNavigate, useParams } from "react-router-dom"
import { Button } from "../components/ui/button"
import { useEffect, useState } from "react"
import { axiosInstance } from "../lib/axiosInstance"
import { Badge } from "../components/ui/badge"

export const Email = () => {
  const { emailCategory, emailId } = useParams()
  const navigate = useNavigate()
  const [email, setEmail] = useState({})
  const [loading, setLoading] = useState(true)

  const reply = () => {
    navigate("/compose", {
      state: {
        recipients: email.recipients.map((r) => r.email).join(","),
        subject: `Re: ${email.subject}`,
        body: `\n\n----\non ${new Date(email.sentAt).toLocaleDateString(
          "en-US",
          {
            hour: "2-digit",
            hour12: false,
            minute: "2-digit",
            weekday: "short",
            day: "2-digit",
            month: "long"
          }
        )}, ${email.sender.email} wrote:\n\n${email.body}\n----\n\n`
      }
    })
  }

  const toggleArchive = async () => {
    const response = await axiosInstance.patch(`/emails/${emailId}`, {
      archived: !email.archived
    })
    setEmail({ ...email, archived: response.data.archived })
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
        setEmail(responseEmail)
        setLoading(false)
      } catch (er) {
        console.log(er.message, er.stack)
      }
    }

    getEmail()
  }, [emailId])

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
            <span className="font-bold">To:</span> <span>bar@example.com</span>
          </li>
          <li>
            <span>
              {new Date(email.sentAt).toLocaleDateString("en-US", {
                hour: "2-digit",
                hour12: false,
                minute: "2-digit",
                weekday: "short",
                day: "2-digit",
                month: "long"
              })}
            </span>
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
      </div>
    </div>
  )
}
