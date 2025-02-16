import React from "react";
import {
  Button,
  Col,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Input,
  Label,
} from "reactstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import PackageService from "../../../services/PackageServices/PackageService";
import toast from "react-hot-toast";

// Validation Schema using Yup
const validationSchema = Yup.object({
  name: Yup.string().required("Package Name is required"),
  price: Yup.number()
    .required("Price is required")
    .positive("Price must be positive"),
  course_duration: Yup.number()
    .required("Course duration is required")
    .positive("Price must be positive"),
  package_type: Yup.string().required("Package type is required"),
  session_duration: Yup.number()
    .required("Session duration is required")
    .positive("Price must be positive"),
  is_popular: Yup.boolean(),
  show_promotion: Yup.boolean(),
  promotion_text: Yup.number().positive("Price must be positive"),
  pickup_drop_text: Yup.string().required("Pick up drop text is required."),
});

const EditPackage = ({
  modal,
  toggleModal,
  setEditingPackage,
  editingPackage,
  newPackage,
  setNewPackage,
  setDataList,
  dataList,
}) => {
  console.log("newPackage", newPackage);

  const formik = useFormik({
    initialValues: editingPackage,
    validationSchema,
    onSubmit: async (values) => {
      try {
        const updatedValues = {
          ...values,
          is_popular: values.is_popular === "1" ? 1 : 0, // Convert to number
          show_promotion: values.show_promotion === "1" ? 1 : 0, // Convert to number
        };

        const updatedPackage = await PackageService.update(
          editingPackage.id,
          updatedValues
        );

        setDataList(
          dataList.map((pkg) =>
            pkg.id === editingPackage.id ? updatedPackage.data : pkg
          )
        );

        toast.success("Package updated successfully!");
        toggleModal();
      } catch (error) {
        toast.error("Error updating package!");
        console.error("Error updating package:", error);
      }
    },
    enableReinitialize: true,
  });
  const handleAddDetail = () => {
    const newDetails = [...formik.values.details, { title: "", value: "" }];
    formik.setFieldValue("details", newDetails);
  };

  const handleRemoveDetail = (index) => {
    const updatedDetails = formik.values.details.filter(
      (detail, i) => i !== index
    );
    formik.setFieldValue("details", updatedDetails);
  };

  return (
    <Modal isOpen={modal} toggle={toggleModal}>
      <ModalHeader toggle={toggleModal}>Edit Package</ModalHeader>
      <form onSubmit={formik.handleSubmit}>
        <ModalBody>
          <Row>
            {/* Package Name */}
            <Col lg={6} className="mb-3">
              <div className="form-floating">
                <Input
                  type="text"
                  name="name"
                  placeholder="Package Name"
                  value={formik.values?.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`form-control ${
                    formik.errors.name && formik.touched.name
                      ? "is-invalid"
                      : ""
                  }`}
                  style={{ padding: "0.5rem", height: "1rem" }}
                />
                <Label for="floatingInput">
                  Package Name <span className="text-danger">*</span>
                </Label>
                {formik.errors.name && formik.touched.name && (
                  <div className="invalid-feedback">{formik.errors.name}</div>
                )}
              </div>
            </Col>

            {/* Price */}
            <Col lg={6} className="mb-3">
              <div className="form-floating">
                <Input
                  type="text"
                  name="price"
                  placeholder="Price"
                  value={formik.values?.price}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`form-control ${
                    formik.errors.price && formik.touched.price
                      ? "is-invalid"
                      : ""
                  }`}
                  style={{ padding: "0.5rem", height: "1rem" }}
                />
                <Label for="floatingInput">
                  Price<span className="text-danger">*</span>
                </Label>
                {formik.errors.price && formik.touched.price && (
                  <div className="invalid-feedback">{formik.errors.price}</div>
                )}
              </div>
            </Col>

            {/* Course Duration */}
            <Col lg={6} className="mb-3">
              <div className="form-floating">
                <Input
                  type="text"
                  name="course_duration"
                  placeholder="Course Duration"
                  value={formik.values?.course_duration}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`form-control ${
                    formik.errors.course_duration &&
                    formik.touched.course_duration
                      ? "is-invalid"
                      : ""
                  }`}
                  style={{ padding: "0.5rem", height: "1rem" }}
                />
                <Label for="floatingInput">
                  Course Duration<span className="text-danger">*</span>
                </Label>
                {formik.errors.course_duration &&
                  formik.touched.course_duration && (
                    <div className="invalid-feedback">
                      {formik.errors.course_duration}
                    </div>
                  )}
              </div>
            </Col>

            {/* Package Type */}
            <Col lg={6} className="mb-3">
              <div className="form-floating">
                <Input
                  type="select"
                  name="package_type"
                  value={formik.values?.package_type}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`form-control ${
                    formik.errors.package_type && formik.touched.package_type
                      ? "is-invalid"
                      : ""
                  }`}
                  style={{ padding: "0.5rem", height: "1rem" }}
                >
                  <option value="">Select Package Type</option>
                  <option value="PER-HOUR">PER-HOUR</option>
                  <option value="PER-COURSE">PER-COURSE</option>
                  <option value="DRIVING-TEST">DRIVING-TEST</option>
                  <option value="CUSTOM">CUSTOM</option>
                </Input>
                <Label for="floatingInput">
                  Package Type <span className="text-danger">*</span>
                </Label>
                {formik.errors.package_type && formik.touched.package_type && (
                  <div className="invalid-feedback">
                    {formik.errors.package_type}
                  </div>
                )}
              </div>
            </Col>

            {/* Session Duration */}
            <Col lg={6} className="mb-3">
              <div className="form-floating">
                <Input
                  type="text"
                  name="session_duration"
                  placeholder="Session Duration"
                  value={formik.values?.session_duration}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`form-control ${
                    formik.errors.session_duration &&
                    formik.touched.session_duration
                      ? "is-invalid"
                      : ""
                  }`}
                  style={{ padding: "0.5rem", height: "1rem" }}
                />
                <Label for="floatingInput">
                  Session Duration <span className="text-danger">*</span>
                </Label>
                {formik.errors.session_duration &&
                  formik.touched.session_duration && (
                    <div className="invalid-feedback">
                      {formik.errors.session_duration}
                    </div>
                  )}
              </div>
            </Col>

            {/* Popular Ribbon */}
            <Col lg={6} className="mb-3">
              <div className="form-floating">
                <Input
                  type="select"
                  name="is_popular"
                  value={formik.values?.is_popular}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`form-control ${
                    formik.errors.is_popular && formik.touched.is_popular
                      ? "is-invalid"
                      : ""
                  }`}
                  style={{ padding: "0.5rem", height: "1rem" }}
                >
                  <option value={1}>Yes</option>
                  <option value={0}>No</option>
                </Input>
                <Label for="floatingInput">Popular Ribbon </Label>
                {formik.errors.is_popular && formik.touched.is_popular && (
                  <div className="invalid-feedback">
                    {formik.errors.is_popular}
                  </div>
                )}
              </div>
            </Col>

            {/* Promotion */}
            {/* Show Promotion */}
            <Col lg={6} className="mb-3">
              <div className="form-floating">
                <Input
                  type="select"
                  name="show_promotion"
                  value={formik.values?.show_promotion}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`form-control ${
                    formik.errors?.show_promotion &&
                    formik.touched?.show_promotion
                      ? "is-invalid"
                      : ""
                  }`}
                  style={{ padding: "0.5rem", height: "1rem" }}
                >
                  <option value={1}>Yes</option>
                  <option value={0}>No</option>
                </Input>
                <Label for="floatingInput">Promotion</Label>
                {formik.errors.show_promotion &&
                  formik.touched.show_promotion && (
                    <div className="invalid-feedback">
                      {formik.errors.show_promotion}
                    </div>
                  )}
              </div>
            </Col>

            {/* Discount Field (Dynamic) */}
            {formik.values?.show_promotion == 1 && (
              <Col lg={6} className="mb-3">
                <div className="form-floating">
                  <Input
                    type="text"
                    name="promotion_text"
                    placeholder="Enter Discounted Value"
                    value={formik.values?.promotion_text}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`form-control ${
                      formik.errors.promotion_text &&
                      formik.touched.promotion_text
                        ? "is-invalid"
                        : ""
                    }`}
                    style={{ padding: "0.5rem", height: "1rem" }}
                  />
                  <Label for="floatingInput">Discount</Label>
                  {formik.errors.promotion_text &&
                    formik.touched.promotion_text && (
                      <div className="invalid-feedback">
                        {formik.errors.promotion_text}
                      </div>
                    )}
                </div>
              </Col>
            )}

            <Col lg={6} className="mb-3">
              <div className="form-floating">
                <Input
                  type="text"
                  name="pickup_drop_text"
                  placeholder="Pickup Drop "
                  value={formik.values?.pickup_drop_text}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`form-control ${
                    formik.errors.pickup_drop_text &&
                    formik.touched.pickup_drop_text
                      ? "is-invalid"
                      : ""
                  }`}
                  style={{ padding: "0.5rem", height: "1rem" }}
                />
                <Label for="floatingInput">
                  Pickup drop <span className="text-danger">*</span>
                </Label>
                {formik.errors.pickup_drop_text &&
                  formik.touched.pickup_drop_text && (
                    <div className="invalid-feedback">
                      {formik.errors.pickup_drop_text}
                    </div>
                  )}
              </div>
            </Col>

            <Col lg={13} className="mb-3">
              <div className="d-flex justify-content-between">
                <h5>Details </h5>
                <h5
                  onClick={() => {
                    // Add an empty detail without affecting other fields
                    setNewPackage((prev) => ({
                      ...prev, // Keep all previous values
                      details: [
                        ...prev.details,
                        { title: "", value: "" }, // Add an empty detail
                      ],
                    }));
                  }}
                  className="btn-sm"
                  style={{ cursor: "pointer" }}
                >
                  <i
                    className="bx bx-plus-circle"
                    style={{ fontSize: "22px" }}
                  ></i>{" "}
                </h5>
              </div>

              <Col lg={12} className="mb-3">
                {formik.values?.details?.map((detail, index) => (
                  <div key={index} className="mb-1">
                    <Row>
                      <Col xs={12} lg={6}>
                        <Input
                          type="text"
                          placeholder="Detail Title"
                          value={formik.values.details[index].title}
                          onChange={(e) => {
                            const updatedDetails = formik.values.details.map(
                              (d, i) =>
                                i === index
                                  ? { ...d, title: e.target.value }
                                  : d
                            );
                            formik.setFieldValue("details", updatedDetails);
                          }}
                          className="modal-input mb-1"
                        />
                      </Col>
                      <Col xs={12} lg={5}>
                        <Input
                          type="text"
                          placeholder="Detail Value"
                          value={formik.values.details[index].value}
                          onChange={(e) => {
                            const updatedDetails = formik.values.details.map(
                              (d, i) =>
                                i === index
                                  ? { ...d, value: e.target.value }
                                  : d
                            );
                            formik.setFieldValue("details", updatedDetails);
                          }}
                          className="modal-input mb-1"
                        />
                      </Col>
                      <Col lg={1}>
                        <h6
                          onClick={() => handleRemoveDetail(index)}
                          className="btn-sm mt-2"
                          style={{ cursor: "pointer", color: "red" }}
                        >
                          <i className="bx bx-trash"></i>
                        </h6>
                      </Col>
                    </Row>
                  </div>
                ))}
              </Col>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={toggleModal}>
            Cancel
          </Button>
          <Button color="success" type="submit">
            Save
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
};

export default EditPackage;
