import express from "express"
import { Email, User } from "./models.js"
import mongoose from "mongoose"

const app = express()
app.use(express.json())

app.post("/emails", async (req, res) => {
  const { recipients, subject, body, replyingTo } = req.body
  const emails = recipients.split(",").map((email) => email.trim())

  const recipientUsers = await User.find({ email: { $in: emails } })

  const email = await Email.create({
    sender: "66007ce2b359d00179fc32bd",
    recipients: recipientUsers.map((user) => user.id),
    subject,
    body,
    replyingTo: replyingTo ? mongoose.Types.ObjectId(replyingTo) : null
  })

  await email.save()
  res.status(201).json({ message: "Email sent successfully." })
})

app.get("/emails/:mailbox", async (req, res) => {
  const { mailbox } = req.params
  let emails

  switch (mailbox) {
    case "inbox":
      emails = await Email.find({
        recipients: "66007ce2b359d00179fc32bd",
        archived: false
      })
      break
    case "sent":
      emails = await Email.find({ sender: "66007ce2b359d00179fc32bd" })
      break
    case "archived":
      emails = await Email.find({
        recipients: "66007ce2b359d00179fc32bd",
        archived: true
      })
      break
    default:
      return res.status(400).json({ error: "Invalid mailbox" })
  }

  res.json(emails)
})

app.put("/emails/:id", async (req, res) => {
  const { id } = req.params
  const { read, archived } = req.body

  const email = await Email.findOne({
    _id: id,
    user: "66007ce2b359d00179fc32bd"
  })

  if (read !== undefined) {
    email.read = read
  }

  if (archived !== undefined) {
    email.archived = archived
  }

  await email.save()
  res.sendStatus(204)
})

app.listen(3000, async () => {
  console.log("Server running...")
  await mongoose.connect("mongodb://localhost:27017/mail")
  console.log("Connected to the DB...")
})
