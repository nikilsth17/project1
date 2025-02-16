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
  ButtonToggle,
  Button,
  Form,
} from "reactstrap";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import { Spinner } from "reactstrap";
import UnitServices from "../../services/DibyaServices/UnitServices/UnitServices";

const UnitEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [unit, setUnit] = useState();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: unit?.title ?? "",
      description: unit?.description ?? "",
    },
    onSubmit: async (values) => {
      try {
        setIsSaving(true);
        await UnitServices.update(id, values);
        toast.success("Unit Updated Successfully", {
          autoClose: 3000,
        });

        navigate("/unit-list");
      } catch (error) {
        console.error("Error creating/updating Good Category:", error);
      } finally {
        setIsSaving(false);
      }
    },
  });

  const breadcrumbItems = [{ title: "Back to List ", link: "/unit-list" }];

  useEffect(() => {
    (async () => {
      try {
        const response = await UnitServices.viewunit(id);
        setUnit(response);
      } catch (error) {
        console.log("🚀 ~ async ~ error:", error);
      }
    })();
  }, [id]);

  return (
    <Container fluid>
      <React.Fragment>
        <div className="page-content">
          <BreadCrumb
            title="Unit Field"
            pageTitle="Unit List"
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
                            navigate("/unit-list");
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

export default UnitEdit;
