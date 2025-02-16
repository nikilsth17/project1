import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Form,
  Col,
  Container,
  FormGroup,
  Input,
  Label,
  Row,
} from "reactstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import ConfigureSetingServices from "../../../services/AustServices/ConfigurationSettingSErvices/ConfigureSetingServices";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Spinner } from "reactstrap";
const EmailTemplateUpdate = () => {
  const { key } = useParams();
  console.log("🚀 ~ file: EmailTemplateUpdate.js:21 ~ EmailTemplateUpdate ~ key:", key)
  const [isSaving, setIsSaving] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const [templateData, setTemplateData] = useState({
    id: null,
    name: "",
    value: "",
    description: "",
    subject: "",
  });
  const [isEmailhook, setIsEmailhook] = useState([]);

  async function fetchCustomers() {
    try {
      const fetchedCustomers = await ConfigureSetingServices.Emailgethooks();
      setIsEmailhook(fetchedCustomers);
      console.log(fetchedCustomers);
    } catch (err) {
      setError(err);
    }
  }

  useEffect(() => {
    fetchCustomers();
  }, []);



  useEffect(() => {
    if (key) {
      setIsEditing(true);
      ConfigureSetingServices.view(key)
        .then((data) => {
          setTemplateData(data);
          formik.setValues({
            key: data.name, // Assuming 'name' as the key for your form
            body: data.value,
            subject: data.subject,
          });
        })
        .catch((error) => console.error("Error fetching item:", error));
    } else {
      setIsEditing(false);

    }
  }, [key]);

  const validationSchema = Yup.object().shape({

    body: Yup.string()
      .required("Please enter a valid name")
      .matches(/[a-zA-Z]/, "Please Enter Number Only"),

    subject: Yup.string()
      .required("Please enter a valid name")
      .matches(/[a-zA-Z]/, "Please Enter Number Only"),


  });

  const formik = useFormik({
    initialValues: {
      key: templateData.name,
      body: templateData.value,
      subject: templateData.subject,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        setIsSaving(true);
        // Assuming ConfigureSetingServices.updateEmailtemplateupdate() requires both Body and Subject
        await ConfigureSetingServices.updateEmailtemplateupdate({
          key: values.key,
          body: values.body,
          subject: values.subject,
        });
        toast.success("Email Template Updated Successfully", {
          autoClose: 3000,
        });
        navigate("/email-template");
      } catch (err) {
        console.log(err);
        setIsSaving(false);
      }
    },
  });


  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Email Template" pageTitle="Setting" />

          <Row>
            <Card>
              <Form onSubmit={formik.handleSubmit}>
                <FormGroup row>
                  <Label for="subject" sm={2}>
                    Subject
                  </Label>
                  <div>
                    <Col sm={8}>
                      <Input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formik.values.subject}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`form-control ${formik.touched.subject && formik.errors.subject
                          ? "is-invalid"
                          : ""
                          }`}
                      />
                      {formik.touched.subject && formik.errors.subject && (
                        <div className="invalid-feedback">
                          {formik.errors.subject}
                        </div>
                      )}
                    </Col>
                  </div>

                </FormGroup>

                <FormGroup row>
                  <Col sm={12}>
                    <Label for="body" sm={2}>
                      Body
                    </Label>
                    <Row>
                      {/* First body */}
                      <Col sm={8}>
                        <ReactQuill
                          value={formik.values.body}
                          onChange={(value) => formik.setFieldValue("body", value)}
                        />
                        {formik.touched.body && formik.errors.body && (
                          <div className="invalid-feedback">{formik.errors.body}</div>
                        )}
                      </Col>

                      {/* Second body */}
                      <Col sm={4}>
                        <Label for="email-hooks" sm={3}>
                          Email Hooks
                        </Label>
                        <div className="border rounded p-3">
                          {isEmailhook.map((email, index) => (
                            <span key={index}>
                              {email.name}
                              {index !== isEmailhook.length - 1 && ', '}
                            </span>
                          ))}
                        </div>
                      </Col>
                    </Row>
                  </Col>
                </FormGroup>



                <FormGroup row>
                  <Label></Label>
                  <div >
                    <Col sm={12} className="text-end">
                      <Button
                        type="submit"
                        className="btn btn-primary me-2"
                        disabled={isSaving}
                      >
                        {isSaving ? (
                          <>
                            <Spinner size="sm" color="light" className="me-2" />{" "}
                            Saving...
                          </>
                        ) : (
                          "Save"
                        )}
                      </Button>
                      <Button
                        onClick={() => {
                          setIsCanceling(true);
                          setTimeout(() => {
                            navigate("/email-template");
                            setIsCanceling(false);
                          }, 1000); // Simulating a delay of 1 second before navigating and setting isCanceling back to false
                        }}
                        className="btn btn-danger me-2"
                        disabled={isCanceling || isSaving}
                      >
                        {isCanceling ? (
                          <>
                            <Spinner size="sm" color="light" /> Canceling...
                          </>
                        ) : (
                          "Cancel"
                        )}
                      </Button>
                    </Col>
                  </div>
                </FormGroup>
              </Form>
            </Card>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default EmailTemplateUpdate