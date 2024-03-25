import { Link } from "react-router-dom"

const emails = [
  {
    from: "alex.doe@example.com",
    subject: "Weekly Report",
    date: "2024-03-18T14:00:00Z"
  },
  {
    from: "sam.taylor@example.com",
    subject: "Project Update",
    date: "2024-03-18T13:45:00Z"
  }
]

export const EmailList = () => {
  return (
    <div className="my-4 divide-y">
      {emails.map((email) => (
        <Link
          to="abc"
          key={email.from}
          className="flex justify-between py-3 gap-4"
        >
          <div className="font-medium hidden md:block">{email.from}</div>
          <div className="">{email.subject}</div>
          <div className="hidden md:block">{email.date}</div>
        </Link>
      ))}
    </div>
  )
}
