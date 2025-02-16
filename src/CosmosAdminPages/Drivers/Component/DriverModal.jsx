import { useFormik } from "formik";
import React, { useState, useEffect } from "react";
import Dropzone from "react-dropzone";
import { Link } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  Col,
  Form,
  FormFeedback,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from "reactstrap";
import FileDropzone from "../../ResuableComponent/DropzoneComponent";
import * as Yup from "yup";
import AddressSelect from "../../Calendar/Component/SelectAddress";
import PickupService from "../../../services/PickupService/PickupService";
import { Address, StateAddress } from "../data/Address";
import SuburbService from "../../../services/SuburbServices/SuburbService";
import DriverServices from "../../../services/DriverServices/DriverServices";
import toast from "react-hot-toast";
import Select from "react-select";
import axios from "axios";

const DriverModal = ({
  isOpen,
  toggle,
  initialData = null,
  onSubmit,
  isLoading = false,
  setData,
  data,
  fetchData,
}) => {
  useEffect(() => {
    setAddress(initialData?.address || "");
  }, [initialData]);
  // console.log("🚀 ~ initialData:", initialData);
  const [showIssuingCountry, setShowIssuingCountry] = useState(false);
  const [address, setAddress] = useState(initialData?.address);
  const [loading, setLoading] = useState(false);
  // console.log("🚀 ~ address:", address);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isManualEntry, setIsManualEntry] = useState(false);
  const [fullAddress, setFullAddress] = useState("");
  // console.log("🚀 ~ fullAddress:", fullAddress);
  const [addressDetails, setAddressDetails] = useState({});
  const [existingImage, setExistingImage] = useState(null);

  const phoneNumberSchema = Yup.string()
    .required("Please Enter Your Phone Number")
    .matches(
      /^(0\d{9}|[1-9]\d{8})$/,
      "Invalid phone number. It should be 10 digits if starting with 0 or 9 digits otherwise."
    )
    .transform((value) => (value.startsWith("0") ? value.slice(1) : value));
  // Validation schema
  const validationSchema = Yup.object({
    email: Yup.string().required("Email is required").email("Invalid email"),
    name: Yup.string().required("Please Enter Your First Name"),
    surname: Yup.string().required("Please Enter Your Last Name"),
    phone_number: phoneNumberSchema,
    driving_license_no: Yup.string().required(
      "Please Enter Your Driving License Number"
    ),
    issuing_state: Yup.string().required("Please Enter Your Issuing State"),
    suburb: Yup.string().required("Suburb is required"),
    state: Yup.string().required("State is required"),
    gap_time: Yup.string().required("Gap Time is required"),
    post_code: Yup.string().required("Postal code is required"),
    street_address: Yup.string().when("isManualEntry", {
      is: true,
      then: (schema) => schema.required("Street address is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
    work_suburbs: Yup.array()
      .of(Yup.number().required("At least one work suburb must be selected"))
      .min(1, "At least one work suburb must be selected"),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: initialData?.id || "",
      name: initialData?.name || "",
      surname: initialData?.surname || "",
      email: initialData?.email || "",
      phone_number: initialData?.phone_number || "",
      driving_license_no: initialData?.driving_license_no || "",
      issuing_state: initialData?.issuing_state || "",
      issuingCountry: initialData?.issuing_country || "",
      street_address: initialData?.street_address || "",
      address_line_2: initialData?.address_line_2 || "",
      suburb: initialData?.suburb || "",
      state: initialData?.state || "",
      post_code: initialData?.post_code || "",
      isManualEntry: false,
      address: Array.isArray(initialData?.address)
        ? initialData.address[0]
        : initialData?.address || "",
      gap_time: initialData?.gap_time || "",
      work_suburbs: Array.isArray(initialData?.work_suburbs)
        ? initialData.work_suburbs.map((suburb) =>
            typeof suburb === "object" ? suburb.id : Number(suburb)
          )
        : [],
      avatar: null,
      // existingImage: initialData?.avatar || null,
      existingImage:
        initialData?.user?.avatar?.path || initialData?.avatar?.path || null,
      is_admin_driver: initialData?.is_admin_driver ?? 0, // Default to true with proper boolean
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const payloadForm = new FormData();
        // Add all fields except the file dynamically
        Object.entries(values).forEach(([key, value]) => {
          if (key !== "avatar") {
            payloadForm.append(key, value);
          }
        });

        values.work_suburbs.forEach((suburb) => {
          payloadForm.append("work_suburbs[]", suburb); // Use [] to indicate an array
        });

        // Add file separately
        // if (selectedFiles.length > 0) {
        //   payloadForm.append("avatar", selectedFiles[0].payload);
        // }

        if (selectedFiles.length > 0) {
          payloadForm.append("avatar", selectedFiles[0].payload);
        } else {
          payloadForm.append("avatar", ""); // Send an empty string if no image is selected
        }

        let response;
        if (values.id) {
          response = await DriverServices.update(values.id, payloadForm);
          toast.success("Updated successfully");
        } else {
          response = await DriverServices.create(payloadForm);
          toast.success("Created successfully");
        }
        await fetchData();

        toggle();
        //return false;
        // // payloadForm.append('name', values.name);
        // // payloadForm.append('description', values.description);
        // // payloadForm.append('file', values.file);

        // // // Normalize is_admin_driver to 1 or 0
        // // const payload = {
        // //   ...values,
        // //   is_admin_driver: values.is_admin_driver ? 1 : 0,
        // //   work_suburbs: values.work_suburbs.map((id) => Number(id)),
        // //   address: Array.isArray(values.address)
        // //     ? values.address[0]
        // //     : values.address,
        // // };

        // // // Ensure avatar is handled correctly
        // // if (values.avatar) {
        // //   payload.avatar = values.avatar;
        // // }

        // if (values.id) {
        //   // Update logic
        //   const response = await axios.put(
        //     `https://api-cosmos2.sebs.asia/api/v1/drivers/${values.id}`,
        //     payload,
        //     {
        //       headers: {
        //         "Content-Type": "application/   json",
        //       },
        //     }
        //   );

        // console.log("response-data", response);
        //   setData((prevData) =>
        //     prevData.map((item) =>
        //       item.id === values.id ? response.data : item
        //     )
        //   );

        //   toast.success("Updated successfully");
        // } else {
        //   const response = await DriverServices.create({
        //     ...payload,
        //     username: values.email,
        //     phone_number: values.phone_number,
        //     street_address: values.street_address,
        //     address: fullAddress,
        //   });

        //   setData((prevData) => [...prevData, response.data]);
        //   fetchData();
        //   toast.success("Created successfully");
        // }

        //toggle();
      } catch (error) {
        console.error(error);
        toast.error(
          error.response?.data?.message ||
            "An error occurred. Please try again."
        );
      } finally {
        setLoading(false);
      }
    },
  });

  //console.log("formik.values", formik.values);
  useEffect(() => {
    if (
      initialData?.issuing_country ||
      initialData?.issuing_state === "Others"
    ) {
      setShowIssuingCountry(true);
    }
  }, [initialData]);

  // Update the full address state whenever street_address, suburb, state, or post_code changes
  useEffect(() => {
    const updatedAddress = `${formik.values.street_address} ${formik.values.suburb} ${formik.values.state} ${formik.values.post_code}`;
    setFullAddress(updatedAddress);
  }, [
    formik.values.street_address,
    formik.values.suburb,
    formik.values.state,
    formik.values.post_code,
  ]);

  const handleStateAddressChange = (event) => {
    const value = event.target.value;
    formik.setFieldValue("state", value);
  };
  const handleWorkSuburbStateChange = (e) => {
    // Convert HTMLSelectElement selectedOptions to array of IDs
    const selectedValues = Array.from(e.target.selectedOptions).map((option) =>
      parseInt(option.value)
    );

    // Update formik with the array of IDs
    formik.setFieldValue("work_suburbs", selectedValues);
  };
  const handleIssuingStateChange = (event) => {
    const value = event.target.value;
    formik.setFieldValue("issuing_state", value);
    setShowIssuingCountry(value === "Others");
    if (value !== "Others") {
      formik.setFieldValue("issuingCountry", "");
    }
  };

  const handleAddressChange = async (selectedOption) => {
    console.log("🚀 ~ handleAddressChange ~ selectedOption:", selectedOption);
    if (selectedOption) {
      setAddress(selectedOption || fullAddress);

      const addressDetail = await PickupService.addressDetail(
        selectedOption.value
      );
      console.log("Address detail is:", addressDetail);

      // Update the address details state with the response
      setAddressDetails(addressDetail);
      formik.setFieldValue("street_address", addressDetail.streetAddress || "");
      formik.setFieldValue("isManualEntry", isManualEntry);

      formik.setFieldValue("address", addressDetail.formattedAddress || "");
      // Populate the form fields with the received address details
      formik.setFieldValue("address_line_2", addressDetail.addressLine || ""); // Update address line
      formik.setFieldValue("suburb", addressDetail.suburb || ""); // Update suburb
      formik.setFieldValue("state", addressDetail.state || ""); // Update state
      formik.setFieldValue("post_code", addressDetail.postalCode || ""); // Update postal code
    }
  };

  const toggleManualEntry = () => {
    setIsManualEntry((prev) => !prev);
    if (formik.values.isManualEntry) {
      // Clear address fields when switching back to search
      formik.setValues({
        ...formik.values,
        street_address: "",
        suburb: "",
        state: "",
        post_code: "",
      });
    }
    formik.setFieldValue("isManualEntry", !formik.values.isManualEntry);
  };

  const [suburbData, setSuburbData] = useState([]);
  console.log("🚀 ~ suburbData:", suburbData);
  const fetchSuburb = async () => {
    try {
      const response = await SuburbService.get();
      setSuburbData(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchSuburb();
  }, []);
  const options = suburbData.map((suburb) => ({
    value: suburb.id.toString(), // Convert to string as react-select expects strings
    label: suburb.name,
  }));

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      formik.resetForm();
      setShowIssuingCountry(false);
      setAddress("");
      setIsManualEntry(false);
      setAddressDetails({});
    }
  }, [isOpen]);

  const handleStatusChange = (e) => {
    const isChecked = e.target.checked ? 1 : 0;
    formik.setFieldValue("is_admin_driver", isChecked);
  };
  return (
    <>
      <Modal isOpen={isOpen} toggle={toggle} size="lg">
        <ModalHeader toggle={toggle}>
          {initialData ? "Edit Driving Instructor" : "Add Driving Instructor"}
        </ModalHeader>
        <Form onSubmit={formik.handleSubmit}>
          <ModalBody>
            <Row className="mt-4">
              <Col
                md={4}
                className="d-flex flex-column justify-content-center align-content-center align-items-center mb-2"
              >
                <FileDropzone
                  selectedFiles={selectedFiles}
                  setSelectedFiles={setSelectedFiles}
                  formik={formik}
                  // existingImage={initialData?.avatar}
                  existingImage={formik.values.existingImage}
                />
              </Col>

              <Col md={8}>
                <Row>
                  <Col md={6} xs={12} className="mb-3">
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
                        style={{ padding: "0.5rem", height: "1rem" }}
                      />
                      <Label for="floatingInput">
                        First Name <span className="text-danger">*</span>
                      </Label>
                      {formik.touched.name && formik.errors.name && (
                        <FormFeedback type="invalid">
                          {formik.errors.name}
                        </FormFeedback>
                      )}
                    </div>
                  </Col>
                  <Col md={6} xs={12} className="mb-3">
                    <div className="form-floating ">
                      <Input
                        name="surname"
                        className="form-control"
                        placeholder="Enter last name"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.surname || ""}
                        invalid={
                          !!(formik.touched.surname && formik.errors.surname)
                        }
                        style={{ padding: "0.5rem", height: "1rem" }}
                      />
                      <Label for="floatingInput">
                        Last Name <span className="text-danger">*</span>
                      </Label>
                      {formik.touched.surname && formik.errors.surname && (
                        <FormFeedback type="invalid">
                          {formik.errors.surname}
                        </FormFeedback>
                      )}
                    </div>
                  </Col>
                  <Col md={6} className="mb-3">
                    <div className="form-floating ">
                      <Input
                        name="email"
                        className="form-control"
                        placeholder="Enter Email"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.email || ""}
                        invalid={
                          !!(formik.touched.email && formik.errors.email)
                        }
                        style={{ padding: "0.5rem", height: "1rem" }}
                      />
                      <Label for="floatingInput">
                        Email address <span className="text-danger">*</span>
                      </Label>
                      {formik.touched.email && formik.errors.email && (
                        <FormFeedback type="invalid">
                          {formik.errors.email}
                        </FormFeedback>
                      )}
                    </div>
                  </Col>
                  <Col md={6} className="mb-3">
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
                          Phone Number <span className="text-danger">*</span>
                        </Label>
                      </div>
                    </div>
                    {formik.touched.phone_number &&
                      formik.errors.phone_number && (
                        <FormFeedback
                          id="phone_number_error"
                          type="invalid"
                          style={{ display: "block", marginTop: "0.25rem" }}
                        >
                          {formik.errors.phone_number}
                        </FormFeedback>
                      )}
                  </Col>
                  <Col md={6} className="mb-3">
                    <div className="form-floating ">
                      <Input
                        name="driving_license_no"
                        className="form-control"
                        placeholder="Enter driving license no"
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
                        style={{ padding: "0.5rem", height: "1rem" }}
                      />
                      <Label for="floatingInput">
                        Driving License No{" "}
                        <span className="text-danger">*</span>
                      </Label>
                      {formik.touched.driving_license_no &&
                        formik.errors.driving_license_no && (
                          <FormFeedback type="invalid">
                            {formik.errors.driving_license_no}
                          </FormFeedback>
                        )}
                    </div>
                  </Col>

                  <Col md={6} xs={12} className="mb-3">
                    <div className="form-floating ">
                      <Input
                        name="issuing_state"
                        className="form-control"
                        placeholder="Enter issuing state"
                        type="select"
                        // onChange={formik.handleChange}
                        onChange={handleIssuingStateChange}
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
                        <option value="">Select an option </option>
                        {Address[0].map((state) => (
                          <option key={state.value} value={state.value}>
                            {state.label}
                          </option>
                        ))}
                      </Input>
                      <Label for="floatingInput">
                        Issuing State <span className="text-danger">*</span>
                      </Label>
                      {formik.touched.issuing_state &&
                        formik.errors.issuing_state && (
                          <FormFeedback type="invalid">
                            {formik.errors.issuing_state}
                          </FormFeedback>
                        )}
                    </div>
                  </Col>
                  {showIssuingCountry && (
                    <Col md={12} className="mb-3">
                      <div className="form-floating">
                        <Input
                          name="issuingCountry"
                          className="form-control"
                          placeholder="Enter issuing country"
                          type="text"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.issuingCountry || ""}
                          invalid={
                            !!(
                              formik.touched.issuingCountry &&
                              formik.errors.issuingCountry
                            )
                          }
                          style={{ padding: "0.5rem", height: "1rem" }}
                        />
                        <Label for="floatingInput">Issuing Country</Label>
                        {formik.touched.issuingCountry &&
                          formik.errors.issuingCountry && (
                            <FormFeedback type="invalid">
                              {formik.errors.issuingCountry}
                            </FormFeedback>
                          )}
                      </div>
                    </Col>
                  )}

                  <Col md={12} xs={12} className="mb-3">
                    {/* {!isManualEntry ? (
                      <>
                        <div className="mb-0">
                          <AddressSelect
                            name="address"
                            address={address}
                            setAddress={handleAddressChange}
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
                    {/* <Input type="hidden" name="address" /> */}
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
                          }}
                          className="d-flex justify-content-end align-items-end"
                        >
                          Select from search addresses
                        </Link>
                      </>
                    )} */}
                  </Col>

                  <Col md={12} className="mb-3">
                    <div className="form-floating ">
                      <Input
                        name="address_line_2"
                        className="form-control"
                        placeholder="Enter address_line_2"
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
                        style={{ padding: "0.5rem", height: "1rem" }}
                        readOnly={false}
                      />
                      <Label for="floatingInput">
                        Address Line 2 (optional)
                      </Label>
                      {formik.touched.address_line_2 &&
                        formik.errors.address_line_2 && (
                          <FormFeedback type="invalid">
                            {formik.errors.address_line_2}
                          </FormFeedback>
                        )}
                    </div>
                  </Col>
                  <Col md={4} className="mb-3">
                    <div className="form-floating ">
                      <Input
                        name="suburb"
                        className="form-control"
                        placeholder="Enter Suburb"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.suburb || ""}
                        invalid={
                          !!(formik.touched.suburb && formik.errors.suburb)
                        }
                        style={{ padding: "0.5rem", height: "1rem" }}
                      />

                      <Label for="floatingInput">Suburb</Label>
                      {formik.touched.suburb && formik.errors.suburb && (
                        <FormFeedback type="invalid">
                          {formik.errors.suburb}
                        </FormFeedback>
                      )}
                    </div>
                  </Col>
                  <Col md={4} className="mb-3">
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
                          invalid={
                            !!(formik.touched.state && formik.errors.state)
                          }
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
                        invalid={
                          !!(formik.touched.state && formik.errors.state)
                        }
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

                  <Col md={4} className="mb-3">
                    <div className="form-floating ">
                      <Input
                        name="post_code"
                        className="form-control"
                        placeholder="Enter address"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.post_code || ""}
                        invalid={
                          !!(
                            formik.touched.post_code && formik.errors.post_code
                          )
                        }
                        style={{ padding: "0.5rem", height: "1rem" }}
                      />
                      <Label for="floatingInput">Post Code</Label>
                      {formik.touched.post_code && formik.errors.post_code && (
                        <FormFeedback type="invalid">
                          {formik.errors.post_code}
                        </FormFeedback>
                      )}
                    </div>
                  </Col>

                  <Col md={6} className="mb-3">
                    <div className="form-floating ">
                      <Input
                        name="gap_time"
                        className="form-control"
                        placeholder="Enter gap time"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.gap_time || ""}
                        invalid={
                          !!(formik.touched.gap_time && formik.errors.gap_time)
                        }
                        style={{ padding: "0.5rem", height: "1rem" }}
                      />
                      <Label for="floatingInput">
                        Gap Time (min)<span className="text-danger">*</span>
                      </Label>
                      {formik.touched.gap_time && formik.errors.gap_time && (
                        <FormFeedback type="invalid">
                          {formik.errors.gap_time}
                        </FormFeedback>
                      )}
                    </div>
                  </Col>
                  <Col md={6} className="mb-2">
                    <Select
                      id="work_suburbs"
                      name="work_suburbs"
                      isMulti
                      options={options}
                      className="basic-multi-select"
                      classNamePrefix="select"
                      value={options.filter((option) =>
                        formik.values.work_suburbs?.includes(
                          Number(option.value)
                        )
                      )}
                      onChange={(selectedOptions) => {
                        const selectedIds = selectedOptions.map((option) =>
                          Number(option.value)
                        );
                        formik.setFieldValue("work_suburbs", selectedIds);
                      }}
                      onBlur={formik.handleBlur}
                      placeholder="Select work suburbs"
                      styles={{
                        control: (baseStyles) => ({
                          ...baseStyles,
                          padding: "0.3rem",
                        }),
                      }}
                    />
                    {formik.touched.work_suburbs &&
                      formik.errors.work_suburbs && (
                        <FormFeedback
                          type="invalid"
                          style={{ display: "block", marginTop: "0.25rem" }}
                        >
                          {formik.errors.work_suburbs}
                        </FormFeedback>
                      )}
                  </Col>

                  <Col>
                    <div className="form-check form-switch mb-3">
                      <label>isAdminDriver</label>
                      <Input
                        type="checkbox"
                        id="flexSwitchCheckDefault"
                        name="is_admin_driver"
                        className="form-check-input"
                        checked={formik.values.is_admin_driver === 1}
                        onChange={handleStatusChange} // Using custom handler
                      />
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter className="d-flex gap-3">
            <button className="btn btn-danger" type="button" onClick={toggle}>
              Cancel
            </button>
            <button
              className="btn btn-success"
              type="submit"
              disabled={loading}
            >
              Save Changes
            </button>
          </ModalFooter>
        </Form>
      </Modal>
    </>
  );
};

export default DriverModal;
