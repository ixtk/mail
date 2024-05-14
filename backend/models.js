import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
    minLength: 5,
    maxLength: 45,
    match: /^\S+@\S+\.\S+$/
  },
  password: {
    type: String,
    required: true
  }
})

const emailSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  recipients: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  ],
  subject: {
    type: String,
    required: true,
    minLength: 2
  },
  body: {
    type: String,
    required: true,
    minLength: 5
  },
  sentAt: {
    type: Date,
    default: Date.now
  },
  archived: {
    type: Boolean,
    default: false
  }
})

export const Email = mongoose.model("Email", emailSchema)
export const User = mongoose.model("User", userSchema)
