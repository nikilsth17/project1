import React, { useState, useEffect } from "react";
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
  Spinner,
} from "reactstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { useFormik } from "formik";
import * as Yup from "yup";

import toast from "react-hot-toast";
import ConfigureSetingServices from "../../../services/AustServices/ConfigurationSettingSErvices/ConfigureSetingServices";

const ServicesettingvdEditor = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (name) {
      setIsEditing(true);
      ConfigureSetingServices.view(name)
        .then((customers) => {
          formik.setValues(customers);
          setValues({ ...customers });
        })
        .catch((error) => console.error("Error fetching item:", error));
    } else {
      setIsEditing(false);
    }
  }, [name]);

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required("Please enter a valid name")
      .matches(/[a-zA-Z]/, "Please Enter Number Only"),
    value: Yup.string().required("Please enter a valid name"),

    description: Yup.string()
      .required("Please enter a valid name")
      .matches(/[a-zA-Z]/, "Please Enter Number Only"),
  });

  const formik = useFormik({
    initialValues: {
      id: 0,
      name: "",
      value: "",
      description: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        if (isEditing) {
          setIsSaving(true);
          const configDto = {
            id: values.id,
            name: values.name,
            value: values.value,
            description: values.description,
          };

          const payload = [configDto];

          const response = await ConfigureSetingServices.ConfigureUpdate(
            payload
          );

          if (response) {
            toast.success("Service Setting Updated Successfully", {
              autoClose: 3000,
            });

            const read = {
              Aramex: "Aramex",
              Auspost: "AUPost",
            };

            const serviceName = Object.keys(read).find((key) =>
              values.name.includes(key)
            );
            const splitName = read[serviceName];
            console.log("🚀 ~ onSubmit: ~ splitName:", splitName);

            if (splitName) {
              navigate(`/service-setting/details/${splitName}`);
            }

            if (values.name.includes("CourierPlease")) {
              navigate("/service-setting/details/CourierPlease");
            }

            // Check if the name includes 'Amazon' to navigate to the Amazon Setting page
            if (values.name.includes("Amazon")) {
              navigate("/amazon-setting");
            }
          }
        } else {
        }
      } catch (error) {
        console.error("Error updating Service Setting:", error);
        toast.error("Failed to update Service Setting. Please try again.");
      }
      setIsSaving(false);
    },
  });

  return (
    <React.Fragment>
      <div className="page-content">
        <BreadCrumb title="Setting Field" pageTitle="Setting " />
        <Container fluid>
          <Row>
            <Card>
              <CardBody>
                <Form onSubmit={formik.handleSubmit}>
                  <FormGroup row>
                    <Label for="name" sm={2}>
                      Name:
                    </Label>
                    <Col sm={4}>
                      {isEditing ? (
                        <Input
                          type="text"
                          id="name"
                          name="name"
                          value={formik.values.name}
                          readOnly
                        />
                      ) : (
                        <Input
                          type="text"
                          id="name"
                          name="name"
                          value={formik.values.name}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className={`form-control ${
                            formik.touched.name && formik.errors.name
                              ? "is-invalid"
                              : ""
                          }`}
                        />
                      )}
                      {formik.touched.name && formik.errors.name && (
                        <div className="invalid-feedback">
                          {formik.errors.name}
                        </div>
                      )}
                    </Col>

                    <Label for="value" sm={2}>
                      Value:
                    </Label>
                    <Col sm={4}>
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
                      {isEditing ? (
                        <Input
                          type="text"
                          id="description"
                          name="description"
                          value={formik.values.description}
                          readOnly // Make the field read-only
                        />
                      ) : (
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
                      )}
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
                      className="btn btn-danger me-2"
                      onClick={async () => {
                        if (name) {
                          try {
                            setIsCanceling(true);
                            const read = {
                              Aramex: "Aramex",
                              Auspost: "AUPost",
                            };
                            const serviceName = Object.keys(read).find((key) =>
                              name.includes(key)
                            );
                            const splitName = read[serviceName];

                            if (splitName) {
                              await navigate(
                                `/service-setting/details/${splitName}`
                              );
                            } else if (name.includes("CourierPlease")) {
                              await navigate(
                                "/service-setting/details/CourierPlease"
                              );
                            } else if (name.includes("Amazon")) {
                              await navigate("/amazon-setting");
                            } else {
                              await navigate("/default-page");
                            }
                          } catch (error) {
                            console.error("Error navigating:", error);
                          } finally {
                            setIsCanceling(false);
                          }
                        } else {
                          navigate("/default-page");
                        }
                      }}
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
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default ServicesettingvdEditor;
