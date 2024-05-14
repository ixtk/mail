import asyncHandler from "express-async-handler"
import { Email, User } from "../models.js"

export const createEmail = asyncHandler(async (req, res) => {
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

export const getEmailCategory = asyncHandler(async (req, res) => {
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

export const getEmail = asyncHandler(async (req, res) => {
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

export const archiveEmail = asyncHandler(async (req, res) => {
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

export const deleteEmail = asyncHandler(async (req, res) => {
  const { id } = req.params

  await Email.findOneAndDelete({
    _id: id,
    $or: [{ recipients: req.user._id }, { sender: req.user._id }]
  })
  return res.sendStatus(204)
})
