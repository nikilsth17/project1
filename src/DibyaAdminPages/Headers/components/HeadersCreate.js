import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  FormGroup,
  Label,
  Input,
  ButtonToggle,
  Button,
  Form,
} from "reactstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { Spinner } from "reactstrap";
import HeaderServices from "../../../services/DibyaServices/HeaderServices/HeaderServices";
import BreadCrumb from "../../../Components/Common/BreadCrumb";

const HeaderCreate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setdata] = useState();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  // const validationSchema = Yup.object().shape({
  //   name: Yup.string()
  //     .required("Please enter a valid name")
  //     .matches(/^[a-zA-Z]+$/, "Please enter letters only"),
  //   status: Yup.boolean().required("Please select the status"),
  // });

  const formik = useFormik({
    initialValues: {
      name: "",
      value: "",
      description: "",
    },
    // validationSchema: validationSchema,
    onSubmit: async (values) => {
      console.log("🚀 ~ onSubmit: ~ values:", values);
      try {
        setIsSaving(true);
        if (isEditing) {
          // If there's an id, it's an update operation
          await HeaderServices.headersUpdate(id, values);
          toast.success("Data Updated Successfully", {
            autoClose: 3000,
          });
          console.log("Data updated successfully");
        } else {
          const response = await HeaderServices.headerscreate(values);
          toast.success("Data Added Successfully", {
            autoClose: 3000,
          });
          console.log("Data created:", response);
        }
        navigate("/headers-list");
      } catch (error) {
        console.error("Error creating/updating Data:", error);
      } finally {
        setIsSaving(false);
      }
    },
  });

  const breadcrumbItems = [{ title: "Back to List ", link: "/headers-list" }];

  useEffect(() => {
    if (id) {
      setIsEditing(true);
      HeaderServices.viewheaders(id)
        .then((data) => {
          setdata(data);
          formik.setValues({
            id: data.id,
            title: data.title || "",
            value: data.value || "",
            description: data.description || "",
          });
        })
        .catch((error) => console.error("Error fetching item:", error));
    } else {
      setIsEditing(false);
    }
  }, [id]);

  return (
    <Container fluid>
      <React.Fragment>
        <div className="page-content">
          <BreadCrumb
            title="General Config Form"
            pageTitle="General Config"
            breadcrumbItems={breadcrumbItems}
          />
          <Row>
            <Col>
              <Card>
                <CardBody>
                  <Form onSubmit={formik.handleSubmit}>
                    <FormGroup row>
                      <Label for="title" sm={2}>
                        Title:
                      </Label>
                      <Col sm={4}>
                        <Input
                          type="text"
                          id="title"
                          name="title"
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
                      <Label for="status" sm={2}>
                        Value:
                      </Label>
                      <Col sm={4} className="mt-2">
                        <Input
                          type="text"
                          id="value"
                          name="value"
                          value={formik.values.value}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className={`form-control ${
                            formik.touched.value && formik.errors.value
                              ? "is-invalid"
                              : ""
                          }`}
                        />
                        {formik.touched.value && formik.errors.value && (
                          <div className="invalid-feedback">
                            {formik.errors.value}
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
                          name="description"
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
                            navigate("/headers-list");
                            setIsCanceling(false);
                          }, 1000); // Simulating a delay of 1 second before navigating and setting isCanceling back to false
                        }}
                        className="btn btn-danger "
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

export default HeaderCreate;
