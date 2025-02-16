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
  Container,
} from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb.js";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import CustomerTypeServices from "../../services/Inventory Services/CustomerTypeServices.js";
import toast from "react-hot-toast";
import Select from "react-select";
import { Spinner } from "reactstrap";
import StatusRadioButtons from "../Pages/Starter/StatusRadioButton.js";
const CustomerEditor = () => {
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
    title: Yup.string().required("Title is required"),
    // .matches(/^[a-zA-Z\s]+$/, "Title should contain only letters and spaces"),
    description: Yup.string().required("Description is required"),
    code: Yup.string().required("Code is required"),
    discountPercentage: Yup.number()
      .typeError("Discount Percentage must be a number")
      .min(0, "Discount Percentage cannot be negative")
      .max(100, "Discount Percentage cannot be greater than 100")
      .required("Discount Percentage is required"),
    additionalCharge: Yup.number()
      .typeError("Discount Amount must be a number")
      .min(0, "Discount Amount cannot be negative")
      .required("Discount Amount is required"),
    dueDays: Yup.number("due days is required"),
    paymentTypes: Yup.array()

      .min(1, "At least one Payment Type must be selected")
      .required("Please Select the Payment Types"),
    status: Yup.boolean().required("Status is required"),
  });

  const formik = useFormik({
    initialValues: {
      id: 0,
      title: "",
      description: "",
      code: "",
      discountPercentage: "",
      additionalCharge: 0,
      dueDays: 0,
      paymentTypes: [],
      status: true,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        setIsSaving(true);
        const paymentTypeIds = values.paymentTypes.map((type) => type.value);

        if (isEditing) {
          await CustomerTypeServices.update(id, {
            ...values,
            paymentTypes: paymentTypeIds,
          });
          toast.success("Customer Type Updated Successfully", {
            autoClose: 3000,
          });
          console.log("Customer updated successfully");
        } else {
          const response = await CustomerTypeServices.create({
            ...values,
            paymentTypes: paymentTypeIds,
          });
          toast.success("Customer Type Added Successfully", {
            autoClose: 3000,
          });
          console.log("Category created:", response);
        }
        navigate("/customer-type");
      } catch (error) {
        console.error("Error creating/updating category:", error);
      } finally {
        setIsSaving(false); // Set saving state back to false when operation finishes
      }
    },
  });

  useEffect(() => {
    if (id) {
      setIsEditing(true);
      CustomerTypeServices.view(id)
        .then((values) => {
          setCustomer(values);
          const selectedPaymentTypes = values.paymentTypes.map((type) => ({
            value: type.id,
            label: type.name,
          }));
          formik.setValues({ ...values, paymentTypes: selectedPaymentTypes });
        })
        .catch((error) => console.error("Error fetching item:", error));
    } else {
      setIsEditing(false);
    }
  }, [id]);

  const breadcrumbItems = [{ title: "Back to List", link: "/customer-type" }];

  return (
    <Container fluid>
      <React.Fragment>
        <div className="page-content">
          <BreadCrumb
            title="Customer Type Field"
            pageTitle="Customer Type List"
            breadcrumbItems={breadcrumbItems}
          />
          <Row>
            <Col>
              <Card>
                <CardBody>
                  <Form onSubmit={formik.handleSubmit}>
                    <FormGroup row>
                      <Label for="title" sm={3}>
                        Customer Type:
                      </Label>
                      <Col sm={3}>
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

                      <Label for="description" sm={3}>
                        Description:
                      </Label>
                      <Col sm={3}>
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
                      <Label for="code" sm={3}>
                        Code:
                      </Label>
                      <Col sm={3}>
                        <Input
                          type="text"
                          id="code"
                          name="code"
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

                      <Label for="discountPercentage" sm={3}>
                        International Discount Per.(%):
                      </Label>
                      <Col sm={3}>
                        <Input
                          type="number"
                          id="discountPercentage"
                          name="discountPercentage"
                          value={formik.values.discountPercentage}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className={`form-control ${
                            formik.touched.discountPercentage &&
                            formik.errors.discountPercentage
                              ? "is-invalid"
                              : ""
                          }`}
                        />
                        {formik.touched.discountPercentage &&
                          formik.errors.discountPercentage && (
                            <div className="invalid-feedback">
                              {formik.errors.discountPercentage}
                            </div>
                          )}
                      </Col>
                    </FormGroup>

                    <FormGroup row>
                      <Label for="additionalCharge" sm={3}>
                        Domestic Additional Charge:
                      </Label>
                      <Col sm={3}>
                        <Input
                          type="number"
                          id="additionalCharge"
                          name="additionalCharge"
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

                      <Label for="paymentTypes" sm={3}>
                        Payment Type:
                      </Label>
                      <Col sm={3}>
                        <Select
                          value={formik.values.paymentTypes}
                          isMulti
                          isClearable
                          onChange={(selectedOptions) =>
                            formik.setValues({
                              ...formik.values,
                              paymentTypes: selectedOptions,
                            })
                          }
                          options={paymentOptions.map((role) => ({
                            value: role.id,
                            label: role.name,
                          }))}
                          className={` ${
                            formik.touched.paymentTypes &&
                            formik.errors.paymentTypes
                              ? "is-invalid"
                              : ""
                          }`}
                        />
                        {formik.touched.paymentTypes &&
                          formik.errors.paymentTypes && (
                            <div className="invalid-feedback">
                              {formik.errors.paymentTypes}
                            </div>
                          )}
                      </Col>
                    </FormGroup>

                    <FormGroup row>
                      <Label for="dueDays" sm={3}>
                        Due day:
                      </Label>
                      <Col sm={3}>
                        <Input
                          type="number"
                          id="dueDays"
                          name="dueDays"
                          value={formik.values.dueDays}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className={`form-control ${
                            formik.touched.dueDays && formik.errors.dueDays
                              ? "is-invalid"
                              : ""
                          }`}
                        />
                        {formik.touched.dueDays && formik.errors.dueDays && (
                          <div className="invalid-feedback">
                            {formik.errors.dueDays}
                          </div>
                        )}
                      </Col>
                      <Label for="status" sm={3}>
                        Status:
                      </Label>
                      <Col sm={3} className="mt-2">
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
                            navigate(`/customer-type`); // Use backticks for string interpolation
                            setIsCanceling(false);
                          }, 1000);
                        }}
                        className="btn btn-danger "
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

export default CustomerEditor;
