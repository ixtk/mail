import { Form, Formik, ErrorMessage, Field } from "formik"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Button } from "./ui/button"
import { Textarea } from "./ui/textarea"

export const ComposeEmail = () => {
  const initialValues = {
    recipients: "",
    subject: "",
    body: ""
  }

  return (
    <div>
      <Formik initialValues={initialValues}>
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
                <Textarea id="body" {...formik.getFieldProps("body")} />
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
