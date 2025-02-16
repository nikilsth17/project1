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
const DriverModal = ({
  isOpen,
  toggle,
  initialData = null,
  onSubmit,
  isLoading = false,
  setData,
  data,
}) => {
  useEffect(() => {
    setAddress(initialData?.address || "");
  }, [initialData]);
  console.log("🚀 ~ initialData:", initialData);
  const [showIssuingCountry, setShowIssuingCountry] = useState(false);
  const [address, setAddress] = useState(initialData?.address);

  console.log("🚀 ~ address:", address);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isManualEntry, setIsManualEntry] = useState(false);
  const [fullAddress, setFullAddress] = useState("");
  console.log("🚀 ~ fullAddress:", fullAddress);
  const [addressDetails, setAddressDetails] = useState({});
  const [existingImage, setExistingImage] = useState(null);

  // Validation schema
  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email"),
    name: Yup.string().required("Please Enter Your First Name"),
    surname: Yup.string().required("Please Enter Your Last Name"),
    phone_number: Yup.string()
      .matches(/^\d{9}$/, "Phone number must be exactly 9 digits")
      .required("Phone number is required"),
    driving_license_no: Yup.string().required(
      "Please Enter Your Driving License Number"
    ),
    issuing_state: Yup.string().required("Please Enter Your Issuing State"),
    suburb: Yup.string().required("Suburb is required"),
    state: Yup.string().required("State is required"),
    post_code: Yup.string().required("Postal code is required"),
    street_address: Yup.string().when("isManualEntry", {
      is: true,
      then: (schema) => schema.required("Street address is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
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
      // Take the first address if it's an array, otherwise use as is
      address: Array.isArray(initialData?.address) 
        ? initialData.address[0] 
        : initialData?.address || "",
      gap_time: initialData?.gap_time || "",
      work_suburbs: initialData?.work_suburbs?.map((suburb) => suburb.id) || [],
      avatar: null,
      existingImage: initialData?.avatar || null,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
  
        // Append basic fields
        Object.keys(values).forEach(key => {
          if (key !== 'avatar' && key !== 'existingImage' && values[key] !== null) {
            if (key === 'work_suburbs') {
              formData.append(key, JSON.stringify(values[key]));
            } else if (key === 'address') {
              // Always use the first address as a string
              const addressString = Array.isArray(values[key]) 
                ? values[key][0] 
                : values[key];
              formData.append(key, addressString);
            } else {
              formData.append(key, values[key]);
            }
          }
        });
  
        // Handle image upload
        if (values.avatar) {
          formData.append("avatar", values.avatar);
        } else if (values.existingImage) {
          formData.append("keepExistingImage", "true");
        }
  
        if (values.id) {
          // Update logic
          const response = await DriverServices.update(values.id, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          
          setData(prevData => 
            prevData.map(item => 
              item.id === values.id ? response.data : item
            )
          );
          
          toast.success("Updated successfully");
        } else {
          // Create logic
          formData.append("username", values.email);
          
          const response = await DriverServices.create(formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          
          setData(prevData => [...prevData, response.data]);
          toast.success("Created successfully");
        }
  
        toggle();
      } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || "An error occurred. Please try again.");
      }
    },
  });
  console.log("formik.values", formik.values);
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
  return (
    <>
      <Modal isOpen={isOpen} toggle={toggle} size="lg">
        <ModalHeader toggle={toggle}>
          {initialData ? "Edit Driver" : "Add Driver"}
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
                  existingImage={initialData?.avatar} // Pass the existing image URL
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

                            // Keep the +61 prefix and ensure that only 9 digits are allowed after it
                            const numbersOnly = input
                              .replace(/[^0-9]/g, "")
                              .slice(0, 9);
                            formik.setFieldValue(
                              "phone_number",
                              `${numbersOnly}`
                            );
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
                      {formik.touched.phone_number &&
                        formik.errors.phone_number && (
                          <FormFeedback id="phone_number_error" type="invalid">
                            {formik.errors.phone_number}
                          </FormFeedback>
                        )}
                    </div>
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
                    {!isManualEntry ? (
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
                      <>
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
                        <Link
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
                    )}
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
                    {!isManualEntry ? (
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
                    ) : (
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
                    )}
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
                      <Label for="floatingInput">Gap Time (min)</Label>
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
                      value={options.filter(
                        (option) =>
                          formik.values.work_suburbs?.includes(
                            parseInt(option.value)
                          ) // Ensure matching with `id`
                      )}
                      onChange={(selectedOptions) => {
                        const selectedIds = selectedOptions.map((option) =>
                          parseInt(option.value)
                        ); // Store selected ids
                        formik.setFieldValue("work_suburbs", selectedIds); // Update formik state
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
                  </Col>
                </Row>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter className="d-flex gap-3">
            <button className="btn btn-danger " onClick={toggle}>
              Cancel
            </button>
            <button className="btn btn-success" type="submit">
              Save Changes
            </button>
          </ModalFooter>
        </Form>
      </Modal>
    </>
  );
};

export default DriverModal;
