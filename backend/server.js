import express from "express"
import mongoose from "mongoose"
import bcrypt from "bcrypt"
import session from "express-session"
import MongoStore from "connect-mongo"
import cors from "cors"
import dotenv from "dotenv"

import { Email, User } from "./models.js"

dotenv.config({ path: "./config/.env" })

const app = express()

app.use(
  cors({
    origin: process.env.ALLOWED_ORIGIN,
    credentials: true
  })
)

app.use(express.json())

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
      sameSite: true
    },
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URL
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
  const { email, password } = req.body

  const hashedPassword = await bcrypt.hash(password, 8)

  const newUser = await User.create({
    email: email,
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
  res.sendStatus(204)
})

app.post("/emails", protectRoute, async (req, res) => {
  const { recipients, subject, body } = req.body
  const emails = recipients.split(",").map((email) => email.trim())

  const recipientUsers = await User.find({ email: { $in: emails } })

  const email = await Email.create({
    sender: req.user._id,
    recipients: recipientUsers.map((user) => user._id),
    subject,
    body
  })

  await email.save()
  res.status(201).json({ message: "Email sent successfully.", _id: email._id })
})

app.get("/emails/c/:mailbox", protectRoute, async (req, res) => {
  const { mailbox } = req.params
  let emails

  switch (mailbox) {
    case "inbox":
      emails = await Email.find({
        recipients: req.user._id,
        archived: false
      })
        .sort({ sentAt: -1 })
        .populate("sender", "email")
      break
    case "sent":
      emails = await Email.find({ sender: req.user._id })
        .sort({ sentAt: -1 })
        .populate("sender", "email")
      break
    case "archived":
      emails = await Email.find({
        recipients: req.user._id,
        archived: true
      })
        .sort({ sentAt: -1 })
        .populate("sender", "email")
      break
    default:
      return res.status(400).json({ error: "Invalid mailbox" })
  }

  res.json(emails)
})

app.get("/emails/:emailId", protectRoute, async (req, res) => {
  const { emailId } = req.params
  let email

  try {
    email = await Email.findOne({
      _id: emailId,
      $or: [{ recipients: req.user._id }, { sender: req.user._id }]
    })
      .populate("sender")
      .populate("recipients")
  } catch (e) {
    console.log(e.stack)
    res.status(400).json({ message: e.message })
  }

  res.json(email)
})

app.patch("/emails/:id", protectRoute, async (req, res) => {
  const { id } = req.params
  const { archived } = req.body

  const email = await Email.findOne({
    _id: id,
    recipients: req.user._id
  })

  email.archived = archived

  const updatedEmail = await email.save()
  return res.json(updatedEmail)
})

app.delete("/emails/:id", protectRoute, async (req, res) => {
  const { id } = req.params

  await Email.findByIdAndDelete(id)
  return res.sendStatus(204)
})

app.listen(process.env.EXPRESS_PORT, async () => {
  console.log("Server running...")
  await mongoose.connect(process.env.MONGODB_URL)
  console.log("Connected to the DB...")
})
