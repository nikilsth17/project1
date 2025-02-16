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
        const fetchedRole = await CustomerTypeServices.getPayment();
        setPaymentOptions(fetchedRole);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const validationSchema = Yup.object().shape({
    currencyCode: Yup.string().required("Currency code is required"),
    name: Yup.string().required("Name is required"),
    exchangeRate: Yup.number().required("Exchange rate is required"),
    description: Yup.string().required("Description is required"),
    status: Yup.boolean().required("Status is required"),
  });

  const formik = useFormik({
    initialValues: {
      id: 0,
      currencyCode: "",
      name: "",
      exchangeRate: "",
      description: "",
      status: true,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        setIsSaving(true);
        if (isEditing) {
          await CurrencyServices.updatecurrency(values.id, values);
          toast.success("Currency Updated Successfully", { autoClose: 3000 });
          console.log("Currency updated successfully");
        } else {
          const response = await CurrencyServices.create(values);
          toast.success("Currency Added Successfully", { autoClose: 3000 });
          console.log("Currency created:", response);
        }
        navigate("/Currency");
      } catch (error) {
        console.error("Error creating/updating currency:", error);
      } finally {
        setIsSaving(false);
      }
    },
  });

  useEffect(() => {
    if (id) {
      setIsEditing(true);
      CurrencyServices.view(id)
        .then((values) => {
          setCustomer(values);

          formik.setValues(values);
        })
        .catch((error) => console.error("Error fetching item:", error));
    } else {
      setIsEditing(false);
    }
  }, [id]);

  const breadcrumbItems = [{ title: "Back to List", link: "/Currency" }];

  return (
    <React.Fragment>
      <div className="page-content">
        <Row>
          <Col>
            <Card>
              <CardBody>
                <Form onSubmit={formik.handleSubmit}>
                  <FormGroup row>
                    <Label for="currencyCode" sm={2}>
                      Currency Code:
                    </Label>
                    <Col sm={4}>
                      <Input
                        type="text"
                        id="currencyCode"
                        name="currencyCode"
                        value={formik.values.currencyCode}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`form-control ${
                          formik.touched.currencyCode &&
                          formik.errors.currencyCode
                            ? "is-invalid"
                            : ""
                        }`}
                      />
                      {formik.touched.currencyCode &&
                        formik.errors.currencyCode && (
                          <div className="invalid-feedback">
                            {formik.errors.currencyCode}
                          </div>
                        )}
                    </Col>
                    <Label for="name" sm={2}>
                      Name:
                    </Label>
                    <Col sm={4}>
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
                      {formik.touched.name && formik.errors.name && (
                        <div className="invalid-feedback">
                          {formik.errors.name}
                        </div>
                      )}
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Label for="exchangeRate" sm={2}>
                      Exchange Rate:
                    </Label>
                    <Col sm={4}>
                      <Input
                        type="decimal"
                        id="exchangeRate"
                        name="exchangeRate"
                        value={formik.values.exchangeRate}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`form-control ${
                          formik.touched.exchangeRate &&
                          formik.errors.exchangeRate
                            ? "is-invalid"
                            : ""
                        }`}
                      />
                      {formik.touched.exchangeRate && formik.errors.dueDays && (
                        <div className="invalid-feedback">
                          {formik.errors.exchangeRate}
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
                      className="btn btn-primary  me-2"
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
                          navigate("/Currency");
                          setIsCanceling(false);
                        }, 1000); // Simulating a delay of 1 second before navigating and setting isCanceling back to false
                      }}
                      className="btn btn-danger"
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
  );
};

export default CurrencyEditor;
