import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
})

const emailSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  recipients: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],
  subject: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  sentAt: {
    type: Date,
    default: Date.now
  },
  archived: {
    type: Boolean,
    default: false
  }
  // replyingTo: { type: mongoose.Schema.Types.ObjectId, ref: "Email" }
})

export const Email = mongoose.model("Email", emailSchema)
export const User = mongoose.model("User", userSchema)
