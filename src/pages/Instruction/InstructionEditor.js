import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  FormGroup,
  Label,
  Input,
  Button,
  Spinner,
  Form,
} from "reactstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import InstructionServices from "../../services/AustServices/InstructionService/InstructionServices";

const InstructionEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [isPickUp, setIsPickUp] = useState(true);

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Please enter a valid title"),
    description: Yup.string().required("Please enter a description"),
  });

  const handleRadioChange = (value) => {
    formik.handleChange({
      target: {
        name: "isPickUp",
        value: value,
        type: "radio",
      },
    });
  };

  useEffect(() => {
    if (id) {
      setIsEditing(true);
      InstructionServices.view(id)
        .then((instruction) => {
          if (instruction) {
            formik.setValues({ ...instruction });
          }
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
      isPickUp: true,
      description: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        setIsSaving(true);
        console.log("Submitting form with values: ", values);

        if (isEditing) {
          await InstructionServices.update(id, values);
          toast.success("Instruction Updated Successfully", {
            autoClose: 3000,
          });
          console.log("Instruction updated successfully");
        } else {
          const response = await InstructionServices.create(values);
          toast.success("Instruction Created Successfully", {
            autoClose: 3000,
          });
          console.log("Instruction created:", response);
        }
        navigate("/Instruction");
      } catch (error) {
        console.error("Error creating/updating Instruction:", error);
        toast.error("Error creating/updating Instruction");
      } finally {
        setIsSaving(false);
      }
    },
  });

  const breadcrumbItems = [{ title: "Back to List", link: "/Instruction" }];

  return (
    <Container fluid>
      <div className="page-content">
        <BreadCrumb
          title="Instruction Field"
          pageTitle="Instruction"
          breadcrumbItems={breadcrumbItems}
        />
        <Row>
          <Col>
            <Card>
              <CardBody>
                <Form onSubmit={formik.handleSubmit}>
                  <FormGroup row>
                    <Label for="title" sm={2}>
                      Instruction:
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

                  <FormGroup row>
                    <Label for="isPickUp" sm={2}>
                      Status:
                    </Label>
                    <Col sm={4}>
                      <FormGroup check inline>
                        <Label check>
                          <Input
                            type="radio"
                            name="isPickUp"
                            checked={formik.values.isPickUp === true}
                            onChange={() => handleRadioChange(true)}
                          />
                          Pick Up
                        </Label>
                      </FormGroup>
                      <FormGroup check inline>
                        <Label check>
                          <Input
                            type="radio"
                            name="isPickUp"
                            checked={formik.values.isPickUp === false}
                            onChange={() => handleRadioChange(false)}
                          />
                          Drop off
                        </Label>
                      </FormGroup>
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
                          navigate("/Instruction");
                          setIsCanceling(false);
                        }, 1000);
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
    </Container>
  );
};

export default InstructionEditor;
