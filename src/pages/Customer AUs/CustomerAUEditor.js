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
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import Select from "react-select";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import CustomerTypeServices from "../../services/Inventory Services/CustomerTypeServices";
import CustomerAust from "../../services/AustServices/Customeraust/CustomerAust";
import GeneralServices from "../../services/AustServices/GeneralService/GeneralServices";
import { Spinner } from "reactstrap";
const CustomerAUEditor = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [isSaving, setIsSaving] = useState(false);
  const [customer, setCustomer] = useState();
  const [isEditing, setIsEditing] = useState(false);
  const [ishearAboutUsId, setIshearAboutUsId] = useState([]);
  const [iscountryId, setIscountryId] = useState([]);
  const [isuserId, setIsuserId] = useState([]);
  const [customerTypeId, setCustomerTypeId] = useState([]);
  const [isCustomerType, setIsCustomerType] = useState(null);
  const [selectedHearAboutUsId, setSelectedHearAboutUsId] = useState(null);
  const [selectedCountryId, setSelectedCountryId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  // const [paymentOptions, setPaymentOptions] = useState([]);
  useEffect(() => {
    const fetchselectData = async () => {
      try {
        const fetchedhearAboutUs = await GeneralServices.getHearAboutSource();
        setIshearAboutUsId(fetchedhearAboutUs);
        const fetchedsetIscountry = await GeneralServices.getCountriesType();
        setIscountryId(fetchedsetIscountry);
        const fetchedcustomertype = await CustomerTypeServices.getList();
        setCustomerTypeId(fetchedcustomertype);
        const fetchedcustomer = await CustomerAust.getList();
        setIsuserId(fetchedcustomer.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchselectData();
  }, []);

  const hearAboutUsoptions = ishearAboutUsId.map((vendor) => ({
    value: vendor.id,
    label: vendor.name,
  }));

  const countryoptions = iscountryId.map((vendor) => ({
    value: vendor.id,
    label: vendor.name,
  }));
  const useroptions = isuserId?.map((vendor) => ({
    value: vendor.id,
    label: vendor.emailAddress,
  }));
  const customeroptions = customerTypeId.map((vendor) => ({
    value: vendor.id,
    label: vendor.title,
    // + ' ' + vendor.description, // Corrected concatenation
  }));

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    accountFirstName: Yup.string().required("Account First Name is required"),
    accountLastName: Yup.string().required("Account Last Name is required"),
    accountEmailAddress: Yup.string()
      .email("Invalid email format")
      .required("Account Email Address is required"),
    accountPhoneNumber: Yup.string().required(
      "Account Phone Number is required"
    ),
    companyName: Yup.string().required("Company Name is required"),
    companyAbn: Yup.string().required("Company ABN is required"),
    companyPhoneNumber: Yup.string().required(
      "Company Phone Number is required"
    ),
    accountStatementEmail: Yup.string()
      .email("Invalid email format")
      .required("Account Statement Email is required"),
    addressLine1: Yup.string().required("Address Line 1 is required"),
    addressLine2: Yup.string(),
    hearAboutUsId: Yup.number().required("Hear About Us is required"),

    countryId: Yup.number().required("Country is required"),
    city: Yup.string().required("City is required"),
    state: Yup.string().required("State is required"),
    postCode: Yup.string().required("Post Code is required"),
  });

  const formik = useFormik({
    initialValues: {
      id: 0,
      firstName: "",
      lastName: "",
      accountFirstName: "",
      accountLastName: "",
      accountEmailAddress: "",
      accountPhoneNumber: "",
      companyName: "",
      companyAbn: "",
      companyPhoneNumber: "",
      accountStatementEmail: "",
      addressLine1: "",
      addressLine2: "",
      hearAboutUsId: 0,
      // hearAboutUsInformation: "",
      countryId: 0,
      city: "",
      state: "",
      postCode: "",
      userId: "",
      quickBookId: "",
      customerTypeId: [],
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      console.log("🚀 ~ onSubmit: ~ values:", values);
      try {
        setIsSaving(true); // Set saving state to true on save
        if (isEditing) {
          await CustomerAust.update(id, values);
          toast.success("Customer Updated Successfully", { autoClose: 3000 });
          navigate("/CustomerAUS");
        }
      } catch (error) {
        console.error("Error updating category:", error);
        // Log the error response if available
        if (error.response) {
          console.error("Error response:", error.response.data);
        }
      } finally {
        setIsSaving(false); // Set saving state back to false when operation finishes
      }
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          setIsEditing(true);
          const customerData = await CustomerAust.view(id);
          formik.setValues({
            ...customerData,
            userId: customerData.userId,
            hearAboutUsId: customerData.hearAboutUsId,
            countryId: customerData.countryId,
            customerTypeId: customerData.customerType.id, // Set the initial value to the ID
          });
          setSelectedHearAboutUsId({
            value: customerData.hearAboutUsId,
            label: customerData.hearAboutUsInformation,
          });
          setSelectedCountryId({
            value: customerData.countryId,
            label: customerData.countryName,
          });
          setIsCustomerType({
            // Update isCustomerType with the selected customerType
            value: customerData.customerType.id,
            label: customerData.customerType.title,
          });
          setSelectedUser({
            value: customerData.userId,
            label: customerData.userName,
          });
        } else {
          setIsEditing(false);
        }
      } catch (error) {
        console.error("Error fetching customer data:", error);
      }
    };

    fetchData();
  }, [id]);

  const handlehearAboutUsChange = (selectedOption) => {
    setSelectedHearAboutUsId(selectedOption);
    formik.setFieldValue("hearAboutUsId", selectedOption?.value || null);
  };

  const handlecountryChange = (selectedOption) => {
    setSelectedCountryId(selectedOption);
    formik.setFieldValue(" countryId", selectedOption?.value || null);
  };

  const handlecstomertypeChange = (selectedOption) => {
    setIsCustomerType(selectedOption);
    formik.setFieldValue("customerTypeId", selectedOption?.value || null);
  };

  const breadcrumbItems = [{ title: "Back to List ", link: "/CustomerAUS" }];

  return (
    <React.Fragment>
      <div className="page-content">
        <BreadCrumb
          title="Customer Field"
          pageTitle="Customer"
          breadcrumbItems={breadcrumbItems}
        />
        <Row>
          <Col>
            <Card>
              <CardBody>
                <Form onSubmit={formik.handleSubmit}>
                  <FormGroup row>
                    <Col sm={6}>
                      <Label for="firstName">FirstName:</Label>

                      <Input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formik.values.firstName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`form-control ${
                          formik.touched.firstName && formik.errors.firstName
                            ? "is-invalid"
                            : ""
                        }`}
                      />
                      {formik.touched.firstName && formik.errors.firstName && (
                        <div className="invalid-feedback">
                          {formik.errors.firstName}
                        </div>
                      )}
                    </Col>
                    <Col sm={6}>
                      <Label for=" lastName">Last Name:</Label>

                      <Input
                        type="text"
                        id=" lastName"
                        name="lastName"
                        value={formik.values.lastName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`form-control ${
                          formik.touched.lastName && formik.errors.lastName
                            ? "is-invalid"
                            : ""
                        }`}
                      />
                      {formik.touched.lastName && formik.errors.lastName && (
                        <div className="invalid-feedback">
                          {formik.errors.lastName}
                        </div>
                      )}
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Col sm={6}>
                      <Label for="AccountFirstName">Account FirstName:</Label>

                      <Input
                        type="text"
                        id="accountFirstName"
                        name="accountFirstName"
                        value={formik.values.accountFirstName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`form-control ${
                          formik.touched.accountFirstName &&
                          formik.errors.accountFirstName
                            ? "is-invalid"
                            : ""
                        }`}
                      />
                      {formik.touched.accountFirstName &&
                        formik.errors.accountFirstName && (
                          <div className="invalid-feedback">
                            {formik.errors.accountFirstName}
                          </div>
                        )}
                    </Col>
                    <Col sm={6}>
                      <Label for=" accountLastName">Account LastName:</Label>

                      <Input
                        type="text"
                        id="accountLastName"
                        name="accountLastName"
                        value={formik.values.accountLastName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`form-control ${
                          formik.touched.accountLastName &&
                          formik.errors.accountLastName
                            ? "is-invalid"
                            : ""
                        }`}
                      />
                      {formik.touched.accountLastName &&
                        formik.errors.accountLastName && (
                          <div className="invalid-feedback">
                            {formik.errors.accountLastName}
                          </div>
                        )}
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Col sm={6}>
                      <Label for=" accountEmailAddress">
                        Account EmailAddress:
                      </Label>

                      <Input
                        type="email"
                        id=" accountEmailAddress"
                        name="accountEmailAddress"
                        value={formik.values.accountEmailAddress}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`form-control ${
                          formik.touched.accountEmailAddress &&
                          formik.errors.accountEmailAddress
                            ? "is-invalid"
                            : ""
                        }`}
                      />
                      {formik.touched.accountEmailAddress &&
                        formik.errors.accountEmailAddress && (
                          <div className="invalid-feedback">
                            {formik.errors.accountEmailAddress}
                          </div>
                        )}
                    </Col>
                    <Col sm={6}>
                      <Label for="  accountPhoneNumber">
                        Account PhoneNumber:
                      </Label>

                      <Input
                        type="text"
                        id="accountPhoneNumber"
                        name="accountPhoneNumber"
                        value={formik.values.accountPhoneNumber}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`form-control ${
                          formik.touched.accountPhoneNumber &&
                          formik.errors.accountPhoneNumber
                            ? "is-invalid"
                            : ""
                        }`}
                      />
                      {formik.touched.accountPhoneNumber &&
                        formik.errors.accountPhoneNumber && (
                          <div className="invalid-feedback">
                            {formik.errors.accountPhoneNumber}
                          </div>
                        )}
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Col sm={6}>
                      <Label for=" companyName">Company Name:</Label>

                      <Input
                        type="text"
                        id="companyName"
                        name="companyName"
                        value={formik.values.companyName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`form-control ${
                          formik.touched.companyName &&
                          formik.errors.companyName
                            ? "is-invalid"
                            : ""
                        }`}
                      />
                      {formik.touched.companyName &&
                        formik.errors.companyName && (
                          <div className="invalid-feedback">
                            {formik.errors.companyName}
                          </div>
                        )}
                    </Col>
                    <Col sm={6}>
                      <Label for="companyAbn">Company Abn:</Label>

                      <Input
                        type="text"
                        id="companyAbn"
                        name="companyAbn"
                        value={formik.values.companyAbn}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`form-control ${
                          formik.touched.companyAbn && formik.errors.companyAbn
                            ? "is-invalid"
                            : ""
                        }`}
                      />
                      {formik.touched.companyAbn &&
                        formik.errors.companyAbn && (
                          <div className="invalid-feedback">
                            {formik.errors.companyAbn}
                          </div>
                        )}
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col sm={6}>
                      <Label for=" companyPhoneNumber">
                        Company PhoneNumber:
                      </Label>

                      <Input
                        type="text"
                        id="companyPhoneNumber"
                        name="companyPhoneNumber"
                        value={formik.values.companyPhoneNumber}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`form-control ${
                          formik.touched.companyPhoneNumber &&
                          formik.errors.companyPhoneNumber
                            ? "is-invalid"
                            : ""
                        }`}
                      />
                      {formik.touched.companyPhoneNumber &&
                        formik.errors.companyPhoneNumber && (
                          <div className="invalid-feedback">
                            {formik.errors.companyPhoneNumber}
                          </div>
                        )}
                    </Col>
                    <Col sm={6}>
                      <Label for="accountStatementEmail">
                        Account StatementEmail:
                      </Label>

                      <Input
                        type="email"
                        id="accountStatementEmail"
                        name="accountStatementEmail"
                        value={formik.values.accountStatementEmail}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`form-control ${
                          formik.touched.accountStatementEmail &&
                          formik.errors.accountStatementEmail
                            ? "is-invalid"
                            : ""
                        }`}
                      />
                      {formik.touched.accountStatementEmail &&
                        formik.errors.accountStatementEmail && (
                          <div className="invalid-feedback">
                            {formik.errors.accountStatementEmail}
                          </div>
                        )}
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col sm={4}>
                      <Label for=" addressLine1">AddressLine1:</Label>

                      <Input
                        type="text"
                        id="addressLine1"
                        name="addressLine1"
                        value={formik.values.addressLine1}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`form-control ${
                          formik.touched.addressLine1 &&
                          formik.errors.addressLine1
                            ? "is-invalid"
                            : ""
                        }`}
                      />
                      {formik.touched.addressLine1 &&
                        formik.errors.addressLine1 && (
                          <div className="invalid-feedback">
                            {formik.errors.addressLine1}
                          </div>
                        )}
                    </Col>
                    <Col sm={4}>
                      <Label for="addressLine2">AddressLine2:</Label>

                      <Input
                        type="text"
                        id="addressLine2"
                        name="addressLine2"
                        value={formik.values.addressLine2}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`form-control ${
                          formik.touched.addressLine2 &&
                          formik.errors.addressLine2
                            ? "is-invalid"
                            : ""
                        }`}
                      />
                      {formik.touched.addressLine2 &&
                        formik.errors.addressLine2 && (
                          <div className="invalid-feedback">
                            {formik.errors.addressLine2}
                          </div>
                        )}
                    </Col>
                    <Col sm={4}>
                      <Label for="  countryId">Country:</Label>

                      <Select
                        name="countryId"
                        id="countryId"
                        value={selectedCountryId}
                        onChange={handlecountryChange}
                        options={countryoptions}
                      />
                      {formik.touched.countryId && formik.errors.countryId && (
                        <div className="invalid-feedback">
                          {formik.errors.countryId}
                        </div>
                      )}
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Col sm={4}>
                      <Label for=" city">City:</Label>

                      <Input
                        type="text"
                        id="city"
                        name="city"
                        value={formik.values.city}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`form-control ${
                          formik.touched.city && formik.errors.city
                            ? "is-invalid"
                            : ""
                        }`}
                      />
                      {formik.touched.city && formik.errors.city && (
                        <div className="invalid-feedback">
                          {formik.errors.city}
                        </div>
                      )}
                    </Col>
                    <Col sm={4}>
                      <Label for="state">State:</Label>

                      <Input
                        type="text"
                        id="state"
                        name="state"
                        value={formik.values.state}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`form-control ${
                          formik.touched.state && formik.errors.state
                            ? "is-invalid"
                            : ""
                        }`}
                      />
                      {formik.touched.state && formik.errors.state && (
                        <div className="invalid-feedback">
                          {formik.errors.state}
                        </div>
                      )}
                    </Col>
                    <Col sm={4}>
                      <Label for=" postCode">Post Code:</Label>

                      <Input
                        type="text"
                        id="postCode"
                        name="postCode"
                        value={formik.values.postCode}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`form-control ${
                          formik.touched.postCode && formik.errors.postCode
                            ? "is-invalid"
                            : ""
                        }`}
                      />
                      {formik.touched.postCode && formik.errors.postCode && (
                        <div className="invalid-feedback">
                          {formik.errors.postCode}
                        </div>
                      )}
                    </Col>
                  </FormGroup>
                  {/* <FormGroup row>
                    <Label for="  userId" sm={2}>
                      User:
                    </Label>
                    <Col sm={4}>
                      <Select
                        value={selectedUser}
                        onChange={(selectedOption) => {
                          setSelectedUser(selectedOption);
                          formik.setFieldValue("userId", selectedOption.value);
                        }}
                        options={useroptions}
                      />

                      {formik.touched.userId && formik.errors.userId && (
                        <div className="invalid-feedback">
                          {formik.errors.userId}
                        </div>
                      )}
                    </Col>
                  </FormGroup> */}
                  <FormGroup row>
                    <Col sm={4}>
                      <Label for="  countryId">Customer Type:</Label>

                      <Select
                        name="customerTypeId"
                        id="customerTypeId"
                        value={isCustomerType}
                        onChange={handlecstomertypeChange}
                        options={customeroptions}
                      />
                      {formik.touched.customerTypeId &&
                        formik.errors.customerTypeId && (
                          <div className="invalid-feedback">
                            {formik.errors.customerTypeId}
                          </div>
                        )}
                    </Col>
                    <Col sm={4}>
                      <Label for=" quickBookId">Quick Book:</Label>

                      <Input
                        type="text"
                        id="quickBookId"
                        name="quickBookId"
                        value={formik.values.quickBookId}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`form-control ${
                          formik.touched.quickBookId &&
                          formik.errors.quickBookId
                            ? "is-invalid"
                            : ""
                        }`}
                      />
                      {formik.touched.quickBookId &&
                        formik.errors.quickBookId && (
                          <div className="invalid-feedback">
                            {formik.errors.quickBookId}
                          </div>
                        )}
                    </Col>
                    <Col sm={4}>
                      <Label for="hearAboutUsId">Hear About Us:</Label>

                      <Select
                        name="hearAboutUsId"
                        id="hearAboutUsId"
                        value={selectedHearAboutUsId}
                        onChange={handlehearAboutUsChange}
                        options={hearAboutUsoptions}
                      />
                      {formik.touched.hearAboutUsId &&
                        formik.errors.hearAboutUsId && (
                          <div className="invalid-feedback">
                            {formik.errors.hearAboutUsId}
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
                      onClick={() => navigate("/CustomerAUS")}
                      className="btn btn-danger "
                    >
                      Cancel
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

export default CustomerAUEditor;
