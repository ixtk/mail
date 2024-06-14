import asyncHandler from "express-async-handler"
import bcrypt from "bcrypt"
import crypto from "crypto"
import { User } from "../models.js"

export const getStatus = asyncHandler(async (req, res) => {
  res.setHeader("X-CSRF-Token", req.session?.csrfToken)
  return res.json({ user: req.user })
})

export const register = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const hashedPassword = await bcrypt.hash(password, 8)

  const newUser = await User.create({
    email: email,
    password: hashedPassword
  })

  req.session.userId = newUser._id
  req.session.csrfToken = crypto.randomBytes(32).toString("hex")
  res.setHeader("X-CSRF-Token", req.session.csrfToken)

  res.json({
    user: { username: newUser.username, email: newUser.email }
  })
})

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email }).lean()

  if (user && (await bcrypt.compare(password, user.password))) {
    const { password, ...rest } = user
    req.session.userId = rest._id.toString()
    req.session.csrfToken = crypto.randomBytes(32).toString("hex")
    res.setHeader("X-CSRF-Token", req.session.csrfToken)
    res.json({ user: rest })
  } else {
    res.status(401).json({ message: "Invalid username or password" })
  }
})

export const logout = asyncHandler(async (req, res) => {
  req.session.destroy()
  res.clearCookie("connect.sid")
  res.sendStatus(204)
})
