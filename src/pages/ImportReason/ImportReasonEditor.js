import React, { useState, useEffect } from "react";
import {
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  ButtonToggle,
  Card,
  Row,
  Container,
  CardBody,
} from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import Select from "react-select";
import { Spinner } from "reactstrap";
import CurrencyServices from "../../services/AustServices/CurrencySe/CurrencyServices";
import ImportReasonService from "../../services/AustServices/ImportReasonService";

const CurrencyEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isCanceling, setIsCanceling] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [customer, setCustomer] = useState();
  const [isEditing, setIsEditing] = useState(false);
  const [paymentOptions, setPaymentOptions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedRole = await ImportReasonService.getPayment();
        setPaymentOptions(fetchedRole);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"), // Title field must be a non-empty string

    description: Yup.string().required("Description is required"), // Description field must be a non-empty string
  });

  const formik = useFormik({
    initialValues: {
      id: 0,
      title: "",
      description: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        setIsSaving(true);
        if (isEditing) {
          await ImportReasonService.update(values.id, values);
          toast.success("Import Reason Updated Successfully", {
            autoClose: 3000,
          });
          console.log("Import Reason updated successfully");
        } else {
          const response = await ImportReasonService.create(values);
          toast.success("Import Reason Added Successfully", {
            autoClose: 3000,
          });
          console.log("Import Reason created:", response);
        }
        navigate("/import-reason");
      } catch (error) {
        console.error("Error creating/updating import reason:", error);
      } finally {
        setIsSaving(false);
      }
    },
  });

  useEffect(() => {
    if (id) {
      setIsEditing(true);
      ImportReasonService.view(id)
        .then((values) => {
          setCustomer(values);

          formik.setValues(values);
        })
        .catch((error) => console.error("Error fetching item:", error));
    } else {
      setIsEditing(false);
    }
  }, [id]);

  const breadcrumbItems = [{ title: "Back to List", link: "/import-reason" }];

  return (
    <Container fluid>
      <React.Fragment>
        <div className="page-content">
          <BreadCrumb
            title="Import Reason FIeld"
            breadcrumbItems={breadcrumbItems}
            pageTitle="Import Reason"
          />
          <Row>
            <Col>
              <Card>
                <CardBody>
                  <Form onSubmit={formik.handleSubmit}>
                    <FormGroup row>
                      <Label for="currencyCode" sm={2}>
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
                      <Label for="name" sm={2}>
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
                            <Spinner size="sm" color="light" /> Saving...
                          </>
                        ) : (
                          "Save"
                        )}
                      </Button>
                      <Button
                        onClick={() => {
                          setIsCanceling(true);
                          setTimeout(() => {
                            navigate("/import-reason");
                            setIsCanceling(false);
                          }, 1000); // Simulating a delay of 1 second before navigating and setting isCanceling back to false
                        }}
                        className="btn btn-danger"
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

export default CurrencyEditor;
