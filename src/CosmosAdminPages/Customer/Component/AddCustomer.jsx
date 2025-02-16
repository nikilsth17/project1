import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  CardBody,
  Card,
  Alert,
  Container,
  Form,
  FormFeedback,
  Input,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "reactstrap";
import toast from "react-hot-toast";
import * as Yup from "yup";
import AddressSelect from "./SelectAddress";
import { useSelector, useDispatch } from "react-redux";
import Select from "react-select";

import { Link, useNavigate } from "react-router-dom";
import PickupService from "../../../services/PickupService/PickupService";
import { Address, StateAddress } from "../../Drivers/data/Address";
import CustomerServices from "../../../services/CustomerServices/CustomerServices";

const AddCustomer = ({
  modal,
  toggleModal,
  fetchCustomers,
  editingPackage,
}) => {
  console.log("🚀 ~ AddCustomer ~ editingPackage:", editingPackage);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [addressDetails, setAddressDetails] = useState({});
  const [passwordShow, setPasswordShow] = useState(false);
  const [confirmPasswordShow, setConfirmPasswordShow] = useState(false);
  const [showIssuingCountry, setShowIssuingCountry] = useState(false);
  const [address, setAddress] = useState("");

  const handleStateChange = (event) => {
    const value = event.target.value;
    formik.setFieldValue("issuing_state", value);
    setShowIssuingCountry(value === "Others"); // Set showIssuingCountry to true if "Others" is selected
  };

  const handleStateAddressChange = (event) => {
    const value = event.target.value;
    formik.setFieldValue("state", value);
  };
  const phoneNumberSchema = Yup.string()
    .required("Please Enter Your Phone Number")
    .matches(
      /^(0\d{9}|[1-9]\d{8})$/,
      "Invalid phone number. It should be 10 digits if starting with 0 or 9 digits otherwise."
    )
    .transform((value) => (value.startsWith("0") ? value.slice(1) : value));
  const [isManualEntry, setIsManualEntry] = useState(false);
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: editingPackage?.email || "",
      name: editingPackage?.name || "",
      surname: editingPackage?.surname || "",
      phone_number: editingPackage?.phone_number || "",
      driving_license_no: editingPackage?.driving_license_no || "",
      issuing_state: editingPackage?.issuing_state || "",
      issuing_country: editingPackage?.issuing_country || "",
      password: "",
      user_type: "CUSTOMER",
      address: editingPackage?.address || "",
      address_line_2: "",
      suburb: editingPackage?.suburb || "",
      state: editingPackage?.state || "",
      post_code: editingPackage?.post_code || "",
      password_confirmation: "",
      street_address: editingPackage?.street_address || "",
      isManualEntry: false, // Ensure this is defined
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email")
        .required("Please Enter Your Email"),
      name: Yup.string().required("Please Enter Your First Name"),
      surname: Yup.string().required("Please Enter Your Last Name"),
      phone_number: phoneNumberSchema,
      driving_license_no: Yup.string().required(
        "Please Enter Your Driving License Number"
      ),
      issuing_state: Yup.string().required("Please Enter Your Issuing State"),
      password: editingPackage
        ? Yup.string().nullable()
        : Yup.string().required("Please Enter Your Password"),
      password_confirmation: editingPackage
        ? Yup.string().nullable()
        : Yup.string()
            .oneOf([Yup.ref("password")], "Confirm Password Doesn't Match")
            .required("Please Confirm Your Password"),
      suburb: Yup.string().required("Suburb is required"),
      state: Yup.string().required("State is required"),
      post_code: Yup.string().required("Postal code is required"),
      address_line_2: Yup.string(),
      isManualEntry: Yup.boolean(),
      address: Yup.string(),
      // then: (schema) =>
      //   schema.required("Address is required when selecting from search"),
      // otherwise: (schema) => schema.notRequired(),

      street_address: Yup.string().when("isManualEntry", {
        is: true,
        then: (schema) =>
          schema.required("Address is required in manual entry"),
        otherwise: (schema) => schema.notRequired(),
      }),
    }),

    onSubmit: async (values, { resetForm }) => {
      console.log("🚀 ~ onSubmit: ~ values:", values);
      const fullAddress = `${values.street_address}, ${values.suburb}, ${values.state}, ${values.post_code}`;

      console.log("🚀 ~ onSubmit: ~ fullAddress:", fullAddress);
      try {
        let response;
        if (editingPackage) {
          const updatePayload = {
            name: values.name,
            surname: values.surname,
            phone: values.phone_number,
            driving_license_no: values.driving_license_no,
            address: fullAddress || "",
            email: values.email,
            issuing_state: values.issuing_state,
            issuing_country: values.issuing_country,
            post_code: values.post_code,
            state: values.state,
            suburb: values.suburb,
            address_line_2: values.address_line_2,
            street_address: values.street_address,
          };
          response = await CustomerServices.update(
            editingPackage?.id,
            updatePayload
          );
        } else {
          response = await CustomerServices.register({
            ...values,
            username: values.email,
            address: fullAddress,
            is_registration_from_admin: true,
          });
          console.log("respoonse", response);
        }

        toggleModal();
        resetForm();
        fetchCustomers();
        toast.success("Customer registration successful.");
      } catch (error) {
        toast.error(
          error?.response?.data?.message ||
            "An error occurred during registration."
        );
        console.error("Error during registration:", error);
      }
    },
  });

  console.log("formik", formik.errors);
  // const handleAddressChange = async (selectedOption) => {
  //   console.log("🚀 ~ handleAddressChange ~ selectedOption:", selectedOption);
  //   if (selectedOption) {
  //     setAddress(selectedOption || fullAddress);

  //     const addressDetail = await PickupService.addressDetail(
  //       selectedOption.value
  //     );
  //     console.log("Address detail is:", addressDetail);

  //     // Update the address details state with the response
  //     setAddressDetails(addressDetail);
  //     formik.setFieldValue("street_address", addressDetail.streetAddress || "");
  //     formik.setFieldValue("isManualEntry", isManualEntry);

  //     formik.setFieldValue("address", addressDetail.formattedAddress || "");
  //     // Populate the form fields with the received address details
  //     formik.setFieldValue("address_line_2", addressDetail.addressLine || ""); // Update address line
  //     formik.setFieldValue("suburb", addressDetail.suburb || ""); // Update suburb
  //     formik.setFieldValue("state", addressDetail.state || ""); // Update state
  //     formik.setFieldValue("post_code", addressDetail.postalCode || ""); // Update postal code
  //   }
  // };

  // const toggleManualEntry = () => {
  //   setIsManualEntry(!isManualEntry);
  //   formik.setFieldValue("isManualEntry", !isManualEntry);
  //   // Reset the other field when switching modes
  //   if (!isManualEntry) {
  //     formik.setFieldValue("address", "");
  //   } else {
  //     formik.setFieldValue("street_address", "");
  //   }
  // };

  useEffect(() => {
    if (!modal) {
      formik.resetForm();
      setShowIssuingCountry(false);
      setAddress("");
      setIsManualEntry(false);
      setAddressDetails({});
    }
  }, [modal]);

  // const options = editingPackage?.drivers?.map((driver) => ({
  //   value: driver.id.toString(), // Convert to string as react-select expects strings
  //   label: `${driver.name || ""} ${driver.surname || ""}`,
  // }));
  // const [driver, setDriver] = useState(null);
  // const handleDriverChange = (selectedOptions) => {
  //   formik.setFieldValue("driver", selectedOptions || []);
  // };

  return (
    <Modal isOpen={modal} toggle={toggleModal} backdrop="static" size="lg">
      <ModalHeader toggle={toggleModal}>
        {editingPackage ? "Update Customer" : "Add New Customer"}
      </ModalHeader>{" "}
      <ModalBody>
        <form onSubmit={formik.handleSubmit}>
          <Row>
            <Col lg={6} md={6} className="mb-3">
              <div className="form-floating">
                <Input
                  name="name"
                  className="form-control"
                  placeholder="Enter first name"
                  type="text"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.name || ""}
                  invalid={!!(formik.touched.name && formik.errors.name)}
                  style={{
                    padding: "0.5rem",
                    height: "1rem",
                  }}
                />
                <Label for="floatingInput">First Name</Label>
                {formik.touched.name && formik.errors.name && (
                  <FormFeedback type="invalid">
                    {formik.errors.name}
                  </FormFeedback>
                )}
              </div>
            </Col>
            <Col lg={6} md={6} xs={12} className="mb-3">
              <div className="form-floating ">
                <Input
                  name="surname"
                  className="form-control"
                  placeholder="Enter last name"
                  type="text"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.surname || ""}
                  invalid={!!(formik.touched.surname && formik.errors.surname)}
                  style={{
                    padding: "0.5rem",
                    height: "1rem",
                  }}
                />
                <Label for="floatingInput">Last Name</Label>
                {formik.touched.surname && formik.errors.surname && (
                  <FormFeedback type="invalid">
                    {formik.errors.surname}
                  </FormFeedback>
                )}
              </div>
            </Col>
            <Col lg={6} md={6} xs={12} className="mb-3">
              <div className="form-floating ">
                <Input
                  name="email"
                  className="form-control"
                  placeholder="Enter Email"
                  type="text"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email || ""}
                  invalid={!!(formik.touched.email && formik.errors.email)}
                  style={{
                    padding: "0.5rem",
                    height: "1rem",
                  }}
                />
                <Label for="floatingInput">Email address</Label>
                {formik.touched.email && formik.errors.email && (
                  <FormFeedback type="invalid">
                    {formik.errors.email}
                  </FormFeedback>
                )}
              </div>
            </Col>
            <Col lg={6} md={6} xs={12} className="mb-3">
              <div className="input-group">
                <span className="input-group-text">+61</span>

                <div className="form-floating flex-grow-1">
                  <Input
                    id="phone_number"
                    name="phone_number"
                    className="form-control"
                    placeholder="Phone Number"
                    type="text"
                    onChange={(e) => {
                      let input = e.target.value;

                      // Strip non-numeric characters
                      input = input.replace(/[^0-9]/g, "");

                      if (input.startsWith("0")) {
                        // If starts with 0, allow up to 10 digits
                        input = input.slice(0, 10);
                      } else {
                        // If not starting with 0, allow up to 9 digits
                        input = input.slice(0, 9);
                      }

                      formik.setFieldValue("phone_number", input);
                    }}
                    onBlur={formik.handleBlur}
                    value={formik.values.phone_number}
                    invalid={
                      formik.touched.phone_number &&
                      !!formik.errors.phone_number
                    }
                    aria-describedby="phone_number_error"
                    style={{
                      padding: "0.75rem 0.75rem 0.375rem 0.75rem", // Padding for floating label alignment
                    }}
                  />
                  <Label for="phone_number" className="form-label">
                    Phone Number
                  </Label>
                </div>
                {formik.touched.phone_number && formik.errors.phone_number && (
                  <FormFeedback id="phone_number_error" type="invalid">
                    {formik.errors.phone_number}
                  </FormFeedback>
                )}
              </div>
            </Col>

            <Col lg={6} md={6} xs={12} className="mb-3">
              <div className="form-floating">
                <Input
                  name="driving_license_no"
                  className="form-control"
                  placeholder="Enter Driving License No."
                  type="text"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.driving_license_no || ""}
                  invalid={
                    !!(
                      formik.touched.driving_license_no &&
                      formik.errors.driving_license_no
                    )
                  }
                  style={{
                    padding: "0.5rem",
                    height: "1rem",
                  }}
                />
                <Label for="floatingInput">Driving License Number</Label>
                {formik.touched.driving_license_no &&
                  formik.errors.driving_license_no && (
                    <FormFeedback type="invalid">
                      {formik.errors.driving_license_no}
                    </FormFeedback>
                  )}
              </div>
            </Col>
            <Col lg={6} md={6} xs={12} className="mb-3">
              <div className="form-floating ">
                <Input
                  name="issuing_state"
                  className="form-control"
                  placeholder="Enter issuing state"
                  type="select"
                  // onChange={formik.handleChange}
                  onChange={handleStateChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.issuing_state || ""}
                  invalid={
                    !!(
                      formik.touched.issuing_state &&
                      formik.errors.issuing_state
                    )
                  }
                  style={{
                    padding: "0.5rem",
                    height: "1rem",
                  }}
                >
                  <option value="">Select an option</option>
                  {Address[0].map((state) => (
                    <option key={state.value} value={state.value}>
                      {state.label}
                    </option>
                  ))}
                </Input>
                <Label for="floatingInput">Issuing State</Label>
                {formik.touched.issuing_state &&
                  formik.errors.issuing_state && (
                    <FormFeedback type="invalid">
                      {formik.errors.issuing_state}
                    </FormFeedback>
                  )}
              </div>
            </Col>
            {showIssuingCountry && (
              <Col lg={12} className="mb-3">
                <div className="form-floating">
                  <Input
                    name="issuing_country"
                    className="form-control"
                    placeholder="Enter issuing country"
                    type="text"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.issuing_country}
                    invalid={
                      !!formik.errors.issuing_country &&
                      formik.touched.issuing_country
                    }
                  />
                  <Label>Issuing Country</Label>
                  <FormFeedback>{formik.errors.issuing_country}</FormFeedback>
                </div>
              </Col>
            )}
            <Col lg={6} md={6} xs={12} className="mb-2">
              {/* {!isManualEntry ? (
                <>
                  <div className="mb-0">
                    <AddressSelect
                      address={address}
                      setAddress={handleAddressChange}
                      addressDetails={addressDetails}
                    />
                  </div>

                  <Link
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      toggleManualEntry();
                    }}
                    className="d-flex justify-content-end align-items-end mt-0"
                  >
                    Couldn't find address? Enter manually
                  </Link>
                </>
              ) : (
                <> */}
              <div className="form-floating mb-1">
                <Input
                  name="street_address"
                  className="form-control"
                  placeholder="Enter pickup address in [unit xx x street  suburb state] format"
                  type="text"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.street_address || ""}
                  invalid={
                    !!(
                      formik.touched.street_address &&
                      formik.errors.street_address
                    )
                  }
                  style={{
                    padding: "0.5rem",
                    height: "1rem",
                  }}
                />
                <Label for="floatingInput">Unit/Street address</Label>
                {formik.touched.street_address &&
                  formik.errors.street_address && (
                    <FormFeedback type="invalid">
                      {formik.errors.street_address}
                    </FormFeedback>
                  )}
              </div>

              {/* <Link
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      toggleManualEntry();
                      // Pass full address value
                    }}
                    className="d-flex justify-content-end align-items-end"
                  >
                    Select from search addresses
                  </Link>
                </>
              )} */}
            </Col>

            <Col lg={6} md={6} xs={12} className="mb-3">
              <div className="form-floating ">
                <Input
                  name="address_line_2"
                  className="form-control"
                  placeholder="Enter Address Line"
                  type="text"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.address_line_2 || ""}
                  invalid={
                    !!(
                      formik.touched.address_line_2 &&
                      formik.errors.address_line_2
                    )
                  }
                  style={{
                    padding: "0.5rem",
                    height: "1rem",
                  }}
                />
                <Label for="floatingInput">Address Line 2 (Optional)</Label>
                {formik.touched.address_line_2 &&
                  formik.errors.address_line_2 && (
                    <FormFeedback type="invalid">
                      {formik.errors.address_line_2}
                    </FormFeedback>
                  )}
              </div>
            </Col>

            <Col lg={4} md={4} xs={12} className="mb-3">
              <div className="form-floating ">
                <Input
                  name="suburb"
                  className="form-control"
                  placeholder="Enter Suburb"
                  type="text"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.suburb || ""}
                  invalid={!!(formik.touched.suburb && formik.errors.suburb)}
                  style={{
                    padding: "0.5rem",
                    height: "1rem",
                  }}
                />
                <Label for="floatingInput">Suburb</Label>
                {formik.touched.suburb && formik.errors.suburb && (
                  <FormFeedback type="invalid">
                    {formik.errors.suburb}
                  </FormFeedback>
                )}
              </div>
            </Col>
            <Col lg={4} md={4} xs={12} className="mb-3">
              {/* {!isManualEntry ? (
                <div className="form-floating ">
                  <Input
                    name="state"
                    className="form-control"
                    placeholder="Enter State"
                    type="text"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.state || ""}
                    invalid={!!(formik.touched.state && formik.errors.state)}
                    style={{
                      padding: "0.5rem",
                      height: "1rem",
                    }}
                  />
                  <Label for="floatingInput">State</Label>
                  {formik.touched.state && formik.errors.state && (
                    <FormFeedback type="invalid">
                      {formik.errors.state}
                    </FormFeedback>
                  )}
                </div>
              ) : ( */}
              <div className="form-floating ">
                <Input
                  name="state"
                  className="form-control"
                  placeholder="Enter issuing state"
                  type="select"
                  // onChange={formik.handleChange}
                  onChange={handleStateAddressChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.state || ""}
                  invalid={!!(formik.touched.state && formik.errors.state)}
                  style={{
                    padding: "0.5rem",
                    height: "1rem",
                  }}
                >
                  <option value="">Select an option</option>
                  {StateAddress[0].map((state) => (
                    <option key={state.value} value={state.value}>
                      {state.label}
                    </option>
                  ))}
                </Input>
                <Label for="floatingInput">State</Label>
                {formik.touched.state && formik.errors.state && (
                  <FormFeedback type="invalid">
                    {formik.errors.state}
                  </FormFeedback>
                )}
              </div>
              {/* )} */}
            </Col>
            <Col lg={4} md={4} xs={12} className="mb-3">
              <div className="form-floating ">
                <Input
                  name="post_code"
                  className="form-control"
                  placeholder="Enter Postal Code"
                  type="text"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.post_code || ""}
                  invalid={
                    !!(formik.touched.post_code && formik.errors.post_code)
                  }
                  style={{
                    padding: "0.5rem",
                    height: "1rem",
                  }}
                />
                <Label for="floatingInput">Postal Code</Label>
                {formik.touched.post_code && formik.errors.post_code && (
                  <FormFeedback type="invalid">
                    {formik.errors.post_code}
                  </FormFeedback>
                )}
              </div>
            </Col>
            {/* 
            <Col md={12} className="mb-3">
              <div>
                <Label
                  className="form-label mb-1"
                  style={{
                    fontWeight: "bold",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  Driving Instructor
                </Label>
                <div style={{ position: "relative" }}>
                 
                  <Select
                   value={driverOptions.filter((option) =>
                    formik.values.driver?.includes(Number(option.value))
                  )}
                    isClearable
                    onChange={handleDriverChange}
                    options={driverOptions}
                    isMulti
                    placeholder="Select driving instructor"
                    styles={{
                      control: (base, state) => ({
                        ...base,
                        paddingLeft: "40px",
                        borderColor: state.isFocused
                          ? "#6c757d"
                          : base.borderColor,
                        boxShadow: state.isFocused
                          ? "0 0 0 0.2rem rgba(0,123,255,.25)"
                          : "none",
                      }),
                      placeholder: (base) => ({
                        ...base,
                        color: "#6c757d",
                      }),
                      singleValue: (base) => ({
                        ...base,
                        marginLeft: "10px",
                      }),
                    }}
                  />
                  {formik.touched.driver && formik.errors.driver && (
                    <FormFeedback
                      type="invalid"
                      style={{ display: "block", marginTop: "0.25rem" }}
                    >
                      {formik.errors.driver}
                    </FormFeedback>
                  )}
                </div>
              </div>
            </Col> */}
            {!editingPackage ? (
              <>
                <Col lg={6} md={6} xs={12} className="mb-3">
                  <div className="form-floating">
                    <Input
                      name="password"
                      value={formik.values.password || ""}
                      type={passwordShow ? "text" : "password"}
                      className="form-control pe-5"
                      placeholder="Enter Password"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      invalid={
                        !!(formik.touched.password && formik.errors.password)
                      }
                      style={{
                        padding: "0.5rem",
                        height: "1rem",
                      }}
                    />
                    <Label for="password">Password</Label>
                    {formik.touched.password && formik.errors.password && (
                      <FormFeedback>{formik.errors.password}</FormFeedback>
                    )}
                    <button
                      className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted mt-2"
                      type="button"
                      onClick={() => setPasswordShow(!passwordShow)}
                      style={{
                        marginRight:
                          formik.touched.password && formik.errors.password
                            ? "18px"
                            : "0px",
                      }}
                    >
                      {passwordShow ? (
                        <i
                          className="bx bxs-show"
                          style={{ fontSize: "22px" }}
                        ></i>
                      ) : (
                        <i
                          className="bx bxs-hide"
                          style={{ fontSize: "22px" }}
                        ></i>
                      )}
                    </button>
                  </div>
                </Col>
                <Col lg={6} md={6} xs={12} className="mb-3">
                  <div className="form-floating">
                    <Input
                      name="password_confirmation"
                      type={confirmPasswordShow ? "text" : "password"}
                      className="form-control pe-5"
                      placeholder="Confirm password"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.password_confirmation || ""}
                      invalid={
                        !!(
                          formik.touched.password_confirmation &&
                          formik.errors.password_confirmation
                        )
                      }
                      style={{
                        padding: "0.5rem",
                        height: "1rem",
                      }}
                    />
                    <Label for="floatingInput">Confirm Password</Label>
                    {formik.touched.password_confirmation &&
                      formik.errors.password_confirmation && (
                        <FormFeedback type="invalid">
                          {formik.errors.password_confirmation}
                        </FormFeedback>
                      )}
                    <button
                      className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted mt-2"
                      type="button"
                      onClick={() =>
                        setConfirmPasswordShow(!confirmPasswordShow)
                      }
                      style={{
                        marginRight:
                          formik.touched.password_confirmation &&
                          formik.errors.password_confirmation
                            ? "18px"
                            : "0px",
                      }}
                    >
                      {confirmPasswordShow ? (
                        <i
                          className="bx bxs-show"
                          style={{ fontSize: "22px" }}
                        ></i>
                      ) : (
                        <i
                          className="bx bxs-hide"
                          style={{ fontSize: "22px" }}
                        ></i>
                      )}
                    </button>
                  </div>
                </Col>
              </>
            ) : null}

            <Col className="d-flex justify-content-end align-items-end gap-2">
              <Button color="danger" type="button" onClick={toggleModal}>
                Cancel
              </Button>

              <Button color="success" type="submit">
                {editingPackage ? "Update" : "Save"}
              </Button>
            </Col>
          </Row>
        </form>
      </ModalBody>
    </Modal>
  );
};

export default AddCustomer;
