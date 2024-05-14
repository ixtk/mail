import { Router } from "express"
import {
  getStatus,
  login,
  register,
  logout
} from "../controllers/userControllers.js"
import { protectRoute } from "../middleware.js"

export const userRouter = Router()

userRouter.get("/status", protectRoute, getStatus)
userRouter.post("/register", register)
userRouter.post("/login", login)
userRouter.delete("/logout", logout)
