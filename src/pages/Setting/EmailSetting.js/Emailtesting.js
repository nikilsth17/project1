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
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import AmazonServices from "../../../services/AustServices/Amazon/AmazonServices";
import { Spinner } from "reactstrap";

const Emailtesting = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [templateData, setTemplateData] = useState({
    toAddress: "",
    toName: "",
    subject: "",
    content: "",
  });

  const validationSchema = Yup.object().shape({
    toAddress: Yup.string()
      .required("Please enter a valid name")
      .matches(/[a-zA-Z]/, "Please Enter Number Only"),

    toName: Yup.string()
      .required("Please enter a valid name")
      .matches(/[a-zA-Z]/, "Please Enter Number Only"),
  });

  const formik = useFormik({
    initialValues: {
      toAddress: templateData.toAddress,
      toName: templateData.toName,
      subject: templateData.subject,
      content: templateData.content,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        setIsSaving(true);
        await AmazonServices.create(values);
        toast.success("Email has sent to your mail Successfully!", {
          autoClose: 3000,
        });
        navigate("/email-setting");
        navigate("/email-setting");
      } catch (err) {
        console.error(err);
      } finally {
        setIsSaving(false);
      }
    },
  });

  const breadcrumbItems = [{ title: " < Setting", link: "/email-setting" }];
  return (
    <Container fluid>
      <React.Fragment>
        <div className="page-content">
          <BreadCrumb
            title="Email Test"
            pageTitle="Setting"
            breadcrumbItems={breadcrumbItems}
          />

          <Row>
            <Col>
              <Card className="p-2 pt-2">
                <Form onSubmit={formik.handleSubmit}>
                  <FormGroup row className="pt-2">
                    <Label for="toAddress" sm={2}>
                      To Receiver Email
                    </Label>
                    <Col sm={4}>
                      <Input
                        type="text"
                        id="toAddress"
                        name="toAddress"
                        value={formik.values.toAddress}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`form-control ${formik.touched.toAddress && formik.errors.toAddress
                          ? "is-invalid"
                          : ""
                          }`}
                      />
                      {formik.touched.toAddress && formik.errors.toAddress && (
                        <div className="invalid-feedback">
                          {formik.errors.toAddress}
                        </div>
                      )}
                    </Col>

                    <Label for="toName" sm={2}>
                      Name
                    </Label>
                    <Col sm={4}>
                      <Input
                        type="text"
                        id="toName"
                        name="toName"
                        value={formik.values.toName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`form-control ${formik.touched.toName && formik.errors.toName
                          ? "is-invalid"
                          : ""
                          }`}
                      />
                      {formik.touched.toName && formik.errors.toName && (
                        <div className="invalid-feedback">
                          {formik.errors.toName}
                        </div>
                      )}
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Label for="subject" sm={2}>
                      Subject
                    </Label>
                    <Col sm={10}>
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
                  </FormGroup>

                  <FormGroup row>
                    <Label for="content" sm={2}>
                      Body
                    </Label>
                    <Col sm={10}>
                      <ReactQuill
                        value={formik.values.content}
                        onChange={(value) =>
                          formik.setFieldValue("content", value)
                        }
                      />
                      {formik.touched.content && formik.errors.content && (
                        <div className="invalid-feedback">
                          {formik.errors.content}
                        </div>
                      )}
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Label></Label>
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
                            navigate("/email-setting");
                            setIsCanceling(false);
                          }, 1000); // Simulating a delay of 1 second before navigating and setting isCanceling back to false
                        }}
                        className="btn btn-danger ms-2"
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
                  </FormGroup>
                </Form>
              </Card>
            </Col>
          </Row>
        </div>
      </React.Fragment>
    </Container>
  );
};

export default Emailtesting;
