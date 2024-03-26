import { Form, Formik, ErrorMessage } from "formik"
import { useLocation, useNavigate } from "react-router-dom"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Button } from "./ui/button"
import { Textarea } from "./ui/textarea"
import { useEffect, useRef } from "react"
import { axiosInstance } from "../lib/axiosInstance"

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
    navigate(response.data._id)
  }

  useEffect(() => {
    textareaRef.current.focus()
    textareaRef.current.setSelectionRange(0, 0)
  }, [])

  return (
    <div>
      <Formik initialValues={initialValues} onSubmit={sendEmail}>
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
                <ErrorMessage name="recipients" component="span" />
              </div>
              <div>
                <Label className="mb-4 inline-block" htmlFor="subject">
                  Subject
                </Label>
                <Input id="subject" {...formik.getFieldProps("subject")} />
                <ErrorMessage name="subject" component="span" />
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
                <ErrorMessage name="body" component="span" />
              </div>
              <Button className="self-end">Send</Button>
            </Form>
          )
        }}
      </Formik>
    </div>
  )
}
