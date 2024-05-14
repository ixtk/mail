import { User } from "./models.js"

export const protectRoute = async (req, res, next) => {
  const { session } = req
  if (!session.userId) {
    return res.status(401).json({ message: "Unauthenticated" })
  }

  req.user = await User.findById(req.session.userId).select("-password")

  next()
}

export const handleError = (err, req, res, next) => {
  console.log(err.stack)
  res.status(500).json({ message: "Something went wrong" })
}

const validateSchema = (schema, target) => {
  return async (req, res, next) => {
    try {
      await schema.validate(req[target], { abortEarly: false })
      next()
    } catch (error) {
      return res.status(400).json({
        name: error.name,
        message: error.message,
        errors: error.errors
      })
    }
  }
}

export const validateBody = (schema) => validateSchema(schema, "body")
export const validateParams = (schema) => validateSchema(schema, "params")
