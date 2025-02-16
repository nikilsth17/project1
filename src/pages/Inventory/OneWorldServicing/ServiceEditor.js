import React, { useState, useEffect } from "react";
import {
  Col,
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
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import toast from "react-hot-toast";
import Select from "react-select";
import { useFormik } from "formik";
import OneWorldServices from "../../../services/Inventory Services/OneWorldServices";
import GeneralServices from "../../../services/AustServices/GeneralService/GeneralServices";
import { Spinner } from "reactstrap";
import StatusRadioButtons from "../../Pages/Starter/StatusRadioButton";
const ServiceEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isCanceling, setIsCanceling] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isServiceProviderId, setisServiceProviderId] = useState([]);
  const [isDomesticServiceProviderId, setisDomesticServiceProviderId] =
    useState([]);
  const [isSelectServiceProvider, setisSelectServiceProvider] = useState(null);
  const [isSelectServiceInProvider, setisSelectServiceInProvider] =
    useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedCustomer =
          await GeneralServices.getInternationalServiceProvider();
        setisServiceProviderId(fetchedCustomer);
        const fetchedDomestic =
          await GeneralServices.getDomesticServiceProvider();
        setisDomesticServiceProviderId(fetchedDomestic);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const Coptions = isServiceProviderId.map((vendor) => ({
    value: vendor.id,
    label: vendor.name,
  }));

  const Ioptions = isDomesticServiceProviderId.map((vendor) => ({
    value: vendor.id,
    label: vendor.name,
  }));

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    code: Yup.string().required("Code is required"),
    discountPercentage: Yup.number()
      .typeError("Discount Percentage must be a number")
      .min(0, "Discount Percentage cannot be negative")
      .max(100, "Discount Percentage cannot be greater than 100")
      .required("Discount Percentage is required"),
    additionalCharge: Yup.number()
      .typeError("Additional Charge must be a number")
      .min(0, "Additional Charge cannot be negative")
      .required("Additional Charge is required"),
    internationalServiceProviderId: Yup.number()
      .nullable()
      .required("Please Select the International Service"),
    domesticeServiceProviderId: Yup.number()
      .nullable()
      .required("Please Select the Domestic Service"),
    status: Yup.boolean().required("Status is required"),
  });

  const formik = useFormik({
    initialValues: {
      id: 0,
      title: "",
      code: "",
      discountPercentage: "",
      additionalCharge: "",
      internationalServiceProviderId: null,
      domesticeServiceProviderId: null,
      status: true,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        setIsSaving(true);
        if (isEditing) {
          await OneWorldServices.update(id, values);
          toast.success("Service Updated Successfully", { autoClose: 3000 });
          console.log("Service updated successfully");
        } else {
          const response = await OneWorldServices.create(values);
          toast.success("Service Added Successfully", { autoClose: 3000 });
          console.log("Service created:", response);
        }
        navigate("/service-list");
      } catch (error) {
        console.error("Error creating/updating service:", error);
      } finally {
        setIsSaving(false); // Set saving state back to false when operation finishes
      }
    },
  });

  useEffect(() => {
    const fetchService = async () => {
      try {
        if (id) {
          setIsEditing(true);
          const service = await OneWorldServices.view(id);
          formik.setValues(service);
          setisSelectServiceProvider({
            value: service.domesticeServiceProviderId,
            label: service.domesticeServiceProviderName,
          });
          setisSelectServiceInProvider({
            value: service.internationalServiceProviderId,
            label: service.internationalServiceProviderName,
          });
        } else {
          setIsEditing(false);
          formik.setValues({
            id: 0,
            title: "",
            code: "",
            discountPercentage: "",
            additionalCharge: "",
            internationalServiceProviderId: null,
            domesticeServiceProviderId: null,
            status: true,
          });
        }
      } catch (error) {
        console.error("Error fetching item:", error);
      }
    };

    fetchService();
  }, [id]);

  const handleProductChange = (selectedOption) => {
    setisSelectServiceProvider(selectedOption);
    formik.setFieldValue(
      "domesticeServiceProviderId",
      selectedOption?.value || null
    );
  };

  const handleInternationalChange = (selectedOption) => {
    setisSelectServiceInProvider(selectedOption);
    formik.setFieldValue(
      "internationalServiceProviderId",
      selectedOption?.value || null
    );
  };

  const handleToggleStatus = () => {
    formik.setFieldValue("status", !formik.values.status);
  };

  const breadcrumbItems = [{ title: "Back To List ", link: "/service-list" }];

  return (
    <Container fluid>
      <React.Fragment>
        <div className="page-content">
          <BreadCrumb
            title="Service Field"
            pageTitle="Service List"
            breadcrumbItems={breadcrumbItems}
          />

          <Row>
            <Col>
              <Card>
                <CardBody>
                  <form onSubmit={formik.handleSubmit}>
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

                      <Label for="code" sm={2}>
                        Code:
                      </Label>
                      <Col sm={4}>
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
                    </FormGroup>

                    <FormGroup row>
                      <Label for="discountPercentage" sm={2}>
                        Discount Percentage:
                      </Label>
                      <Col sm={4}>
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

                      <Label for="additionalCharge" sm={2}>
                        Additional Charge:
                      </Label>
                      <Col sm={4}>
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
                    </FormGroup>

                    <FormGroup row>
                      <Label for="internationalServiceProviderId" sm={2}>
                        International Service:
                      </Label>
                      <Col sm={4}>
                        <Select
                          name="internationalServiceProviderId"
                          id="internationalServiceProviderId"
                          value={isSelectServiceInProvider}
                          onChange={handleInternationalChange}
                          options={Coptions}
                          className={`${
                            formik.touched.internationalServiceProviderId &&
                            formik.errors.internationalServiceProviderId
                              ? "is-invalid"
                              : ""
                          }`}
                          onBlur={formik.handleBlur}
                        />
                        {formik.touched.internationalServiceProviderId &&
                          formik.errors.internationalServiceProviderId && (
                            <div className="invalid-feedback">
                              {formik.errors.internationalServiceProviderId}
                            </div>
                          )}
                      </Col>

                      <Label for="domesticeServiceProviderId" sm={2}>
                        Domestic Service:
                      </Label>
                      <Col sm={4}>
                        <Select
                          name="domesticeServiceProviderId"
                          id="domesticeServiceProviderId"
                          value={isSelectServiceProvider}
                          onChange={handleProductChange}
                          options={Ioptions}
                          className={`${
                            formik.touched.domesticeServiceProviderId &&
                            formik.errors.domesticeServiceProviderId
                              ? "is-invalid"
                              : ""
                          }`}
                          onBlur={formik.handleBlur}
                        />
                        {formik.touched.domesticeServiceProviderId &&
                          formik.errors.domesticeServiceProviderId && (
                            <div className="invalid-feedback">
                              {formik.errors.domesticeServiceProviderId}
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
                            navigate("/service-list");
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
                    </div>
                  </form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </React.Fragment>
    </Container>
  );
};

export default ServiceEditor;
