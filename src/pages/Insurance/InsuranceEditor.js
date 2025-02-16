import React, { useEffect, useState } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  Table,
  Button,
  ButtonGroup,
  Form,
  FormGroup,
  Label,
  Input,
  ButtonToggle,
} from "reactstrap";
import toast from "react-hot-toast";
import { useFormik } from "formik";
import * as Yup from "yup";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import InsuranceServices from "../../services/AustServices/Insuranceservice/InsuranceServices";
import { Spinner } from "reactstrap";
import StatusRadioButtons from "../Pages/Starter/StatusRadioButton";
const InsuranceEditor = () => {
  const { id } = useParams(); // Get the id parameter from the URL
  const navigate = useNavigate();
  //console.log(id);
  const [isSaving, setIsSaving] = useState(false); // State for save button loading
  const [isCanceling, setIsCanceling] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});

  const validationSchema = Yup.object().shape({
    title: Yup.string()
      //.matches(/^[a-zA-Z]+$/, "Title must contain only letters")
      .required("Title is required"),
    code: Yup.string().required("Code is required"),
    description: Yup.string()
      // .matches(/^[a-zA-Z]+$/, "Description must contain only letters")
      .required("Description is required"),
    additionalCharge: Yup.number()
      .required("Charge is required")
      .positive("Charge must be a positive number"),
  });

  useEffect(() => {
    if (id) {
      setIsEditing(true);
      InsuranceServices.view(id)
        .then((insurance) => {
          formik.setValues({ ...insurance }); // set formik values directly
        })
        .catch((error) => console.error("Error fetching item:", error));
    } else {
      setIsEditing(false);
    }
  }, [id]);

  const formik = useFormik({
    initialValues: {
      id: 0,
      title: "",
      code: "",
      description: "",
      additionalCharge: "",
      status: true,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        setIsSaving(true);
        if (isEditing) {
          // If there's an id, it's an update operation
          await InsuranceServices.update(id, values);
          toast.success("Insurance Updated Successfully", { autoClose: 3000 });
          console.log("Insurance updated successfully");
        } else {
          // If there's no id, it's a create operation
          const response = await InsuranceServices.create(values);
          toast.success("Insurance Added Successfully", { autoClose: 3000 });

          console.log("Insurance created:", response);
          // Redirect to the item list after create/update
        }
        navigate("/Insurance");
      } catch (error) {
        console.error("Error creating/updating Insurance:", error);
      } finally {
        setIsSaving(false); // Set saving state back to false when operation finishes
      }
    },
  });

  const breadcrumbItems = [{ title: "Back to List ", link: "/Insurance" }];

  return (
    <Container fluid>
      <React.Fragment>
        <div className="page-content">
          <BreadCrumb
            title="Insurance Field"
            pageTitle="Insurance"
            breadcrumbItems={breadcrumbItems}
          />
          <Row>
            <Col>
              <Card>
                <CardBody>
                  <Form onSubmit={formik.handleSubmit}>
                    <FormGroup row>
                      <Label for="title" sm={2}>
                        Entities:
                      </Label>

                      <Col sm={4}>
                        <Input
                          type="text"
                          id="title"
                          value={formik.values.title}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className={`form-control ${
                            formik.touched.title && formik.errors.title
                              ? "is-invalid"
                              : ""
                          }`}
                        />

                        {formik.touched.title && formik.errors.title && (
                          <div className="invalid-feedback">
                            {formik.errors.title}
                          </div>
                        )}
                      </Col>
                      <Label for="code" sm={2}>
                        Code:
                      </Label>

                      <Col sm={4}>
                        <Input
                          type="text"
                          id="code"
                          value={formik.values.code}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className={`form-control ${
                            formik.touched.code && formik.errors.code
                              ? "is-invalid"
                              : ""
                          }`}
                        />
                        {formik.touched.code && formik.errors.code && (
                          <div className="invalid-feedback">
                            {formik.errors.code}
                          </div>
                        )}
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Label for="description" sm={2}>
                        Description:
                      </Label>

                      <Col sm={4}>
                        <Input
                          type="text"
                          id="description"
                          value={formik.values.description}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className={`form-control ${
                            formik.touched.description &&
                            formik.errors.description
                              ? "is-invalid"
                              : ""
                          }`}
                        />
                        {formik.touched.description &&
                          formik.errors.description && (
                            <div className="invalid-feedback">
                              {formik.errors.description}
                            </div>
                          )}
                      </Col>

                      <Label for="additionalCharge" sm={2}>
                        Charge:
                      </Label>

                      <Col sm={4}>
                        <Input
                          type="number"
                          id="additionalCharge"
                          value={formik.values.additionalCharge}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className={`form-control ${
                            formik.touched.additionalCharge &&
                            formik.errors.additionalCharge
                              ? "is-invalid"
                              : ""
                          }`}
                        />
                        {formik.touched.additionalCharge &&
                          formik.errors.additionalCharge && (
                            <div className="invalid-feedback">
                              {formik.errors.additionalCharge}
                            </div>
                          )}
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Label for="status" sm={2}>
                        Status:
                      </Label>
                      <Col sm={4} className="mt-2">
                        <StatusRadioButtons formik={formik} />
                      </Col>
                    </FormGroup>
                    <div className="text-end">
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
                            navigate("/Insurance");
                            setIsCanceling(false);
                          }, 1000); // Simulating a delay of 1 second before navigating and setting isCanceling back to false
                        }}
                        className="btn btn-danger me-2"
                        disabled={isCanceling || isSaving}
                      >
                        {isCanceling ? (
                          <>
                            <Spinner size="sm" color="light" className="me-2" />{" "}
                            Canceling...
                          </>
                        ) : (
                          "Cancel"
                        )}
                      </Button>
                    </div>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </React.Fragment>
    </Container>
  );
};

export default InsuranceEditor;
