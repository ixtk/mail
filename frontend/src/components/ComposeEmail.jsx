import { Form, Formik, ErrorMessage } from "formik"
import { useLocation, useNavigate } from "react-router-dom"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useEffect, useRef } from "react"
import { axiosInstance } from "@/lib/axiosInstance"

import { string, object } from "yup"

const emailComposeSchema = object({
  subject: string().trim().min(3).required(),
  body: string().trim().min(3).required(),
  recipients: string()
    .trim()
    .required()
    .test("are-valid-emails", "One or more emails are invalid", (value) => {
      const emails = value.split(",")
      const emailRegex = /^\S+@\S+\.\S+$/
      return emails.every((email) => emailRegex.test(email.trim()))
    })
})

export const ComposeEmail = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const textareaRef = useRef()

  const initialValues = location.state || {
    recipients: "",
    subject: "",
    body: ""
  }

  const sendEmail = async (emailValues) => {
    const response = await axiosInstance.post("/emails", emailValues)
    navigate(`/c/sent/${response.data._id}`)
  }

  useEffect(() => {
    textareaRef.current.focus()
    textareaRef.current.setSelectionRange(0, 0)
  }, [])

  return (
    <div>
      <Formik
        initialValues={initialValues}
        validationSchema={emailComposeSchema}
        onSubmit={sendEmail}
      >
        {(formik) => {
          return (
            <Form
              autoComplete="off"
              className="max-w-md mx-auto flex flex-col gap-4"
            >
              <div>
                <Label className="mb-4 inline-block" htmlFor="recipients">
                  Recipients
                </Label>
                <Input
                  id="recipients"
                  {...formik.getFieldProps("recipients")}
                />
                <ErrorMessage
                  name="recipients"
                  component="span"
                  className="text-red-600"
                />
              </div>
              <div>
                <Label className="mb-4 inline-block" htmlFor="subject">
                  Subject
                </Label>
                <Input id="subject" {...formik.getFieldProps("subject")} />
                <ErrorMessage
                  name="subject"
                  component="span"
                  className="text-red-600"
                />
              </div>
              <div>
                <Label className="mb-4 inline-block" htmlFor="subject">
                  Body
                </Label>
                <Textarea
                  ref={textareaRef}
                  rows="15"
                  id="body"
                  {...formik.getFieldProps("body")}
                />
                <ErrorMessage
                  name="body"
                  component="span"
                  className="text-red-600"
                />
              </div>
              <Button className="self-end">Send</Button>
            </Form>
          )
        }}
      </Formik>
    </div>
  )
}
