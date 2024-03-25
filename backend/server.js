import express from "express"
import mongoose from "mongoose"
import bcrypt from "bcrypt"
import session from "express-session"
import MongoStore from "connect-mongo"

import { Email, User } from "./models.js"

const app = express()
app.use(express.json())

sessionRouter.use(
  session({
    secret: "super secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
      sameSite: true,
      resave: false,
      saveUninitialized: false,
      secure: true
    },
    store: MongoStore.create({
      mongoUrl: "mongodb://127.0.0.1:27017/mail"
    })
  })
)

export const protectRoute = async (req, res, next) => {
  const { session } = req
  if (!session.userId) {
    return res.status(401).json({ message: "Unauthenticated" })
  }

  req.user = await User.findById(req.session.userId).select("-password")

  next()
}

app.get("/user/status", protectRoute, async (req, res) => {
  return res.json({ user: req.user })
})

app.post("/user/register", async (req, res) => {
  const registerValues = req.body

  const hashedPassword = await bcrypt.hash(registerValues.password, 8)

  const newUser = await User.create({
    username: registerValues.username,
    email: registerValues.email,
    password: hashedPassword
  })

  req.session.userId = newUser._id

  res.json({
    user: { username: newUser.username, email: newUser.email }
  })
})

app.post("/user/login", async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email }).lean()

  if (user && (await bcrypt.compare(password, user.password))) {
    const { password, ...rest } = user
    req.session.userId = rest._id.toString()
    res.json({ user: rest })
  } else {
    res.status(401).json({ message: "Invalid username or password" })
  }
})

app.delete("/user/logout", async (req, res) => {
  req.session.destroy()
  res.clearCookie("connect.sid")
  res.json({ message: "Logged out" })
})

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
