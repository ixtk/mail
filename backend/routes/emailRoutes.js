import { Router } from "express"
import {
  archiveEmail,
  createEmail,
  deleteEmail,
  getEmail,
  getEmailCategory
} from "../controllers/emailControllers.js"
import { protectRoute } from "../middleware.js"

export const emailRouter = Router()

emailRouter.post("/", protectRoute, createEmail)
emailRouter.get("/c/:mailbox", protectRoute, getEmailCategory)
emailRouter.get("/:emailId", protectRoute, getEmail)
emailRouter.patch("/:id", protectRoute, archiveEmail)
emailRouter.delete("/:id", protectRoute, deleteEmail)
