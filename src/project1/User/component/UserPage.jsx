import React, { useState, useEffect } from "react";
import { Formik, Form, Field, useFormik } from "formik";
import {
  Button,
  div,
  Label,
  Input,
  Table,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Row,
  Col,
  FormFeedback,
} from "reactstrap";
import * as Yup from "yup";
import _BaseAPIService from "../../../services/_BaseAPIService";
import "../../../i18n"; // Import i18n configuration
import { useTranslation } from "react-i18next";

const UserSchema = Yup.object().shape({
  first_name: Yup.string().required("Required"),
  last_name: Yup.string().required("Required"),
  phone_no: Yup.string().required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().min(6, "Too Short!").required("Required"),
  user_role: Yup.string().required("Required"),
  administrative_unit: Yup.string().required("Required"),
  address: Yup.string().required("Required"),
  municipality: Yup.string().required("Required"),
  sub_administrative: Yup.string().required("Required"),
  soco: Yup.string().required("Required"),
  aldeia: Yup.string().required("Required"),
});

const UserPage = ({ modal, toggleModal, editingUser, setEditingUser }) => {
  const [users, setUsers] = useState([]);
  const { t, i18n } = useTranslation();

  const administrativeUnits = ["Unit 1", "Unit 2", "Unit 3"]; // Replace with actual data

  const handleSubmit = (values, { resetForm }) => {
    if (editingUser) {
      setUsers(
        users.map((user) =>
          user._id === editingUser._id ? { ...editingUser, ...values } : user
        )
      );
    } else {
      setUsers([...users, { _id: users.length + 1, ...values }]);
    }
    resetForm();
    setEditingUser(null);
    toggleModal();
  };
  console.log("🚀 ~ UserPage ~ editingUser:", editingUser);

  const handleEdit = (user) => {
    setEditingUser(user);
    toggleModal();
  };
  const [passwordShow, setPasswordShow] = useState(false);
  const [confirmPasswordShow, setConfirmPasswordShow] = useState(false);

  const formik = useFormik({
    initialValues: {
      first_name: editingUser?.first_name || "",
      last_name: editingUser?.last_name || "",
      phone_no: editingUser?.phone_no || "",
      email: editingUser?.email || "",
      password: "",
      user_role: editingUser?.user_role || "",
      administrative_unit: editingUser?.administrative_unit || "",
      address: editingUser?.address || "",
      municipality: editingUser?.municipality || "",
      sub_administrative: editingUser?.sub_administrative || "",
      soco: editingUser?.soco || "",
      aldeia: editingUser?.aldeia || "",
    },
    onSubmit: { handleSubmit },
    enableReinitialize: true,
  });
  return (
    <Modal isOpen={modal} toggle={toggleModal} size="lg">
      <ModalHeader toggle={toggleModal}>
        {editingUser ? t("Edit User") : t("Add User")}
      </ModalHeader>

      <ModalBody>
        <form onSubmit={formik.handleSubmit}>
          <Row>
            <Col lg={6} md={6} className="mb-3">
              <div className="form-floating">
                <Input
                  name="first_name"
                  className="form-control"
                  placeholder={t("Enter first name")}
                  type="text"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.first_name || ""}
                  invalid={
                    !!(formik.touched.first_name && formik.errors.first_name)
                  }
                  style={{ padding: "0.5rem", height: "1rem" }}
                />
                <Label for="floatingInput">{t("First Name")}</Label>{" "}
                {/* Corrected the Label */}
                {formik.touched.first_name && formik.errors.first_name && (
                  <FormFeedback type="invalid">
                    {formik.errors.first_name}
                  </FormFeedback>
                )}
              </div>
            </Col>

            <Col lg={6} md={6} className="mb-3">
              <div className="form-floating">
                <Input
                  name="last_name"
                  className="form-control"
                  placeholder="Enter last name"
                  type="text"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.last_name || ""}
                  invalid={
                    !!(formik.touched.last_name && formik.errors.last_name)
                  }
                  style={{ padding: "0.5rem", height: "1rem" }}
                />
                <Label for="floatingInput">{t("Last Name")}</Label>
                {formik.touched.last_name && formik.errors.last_name && (
                  <FormFeedback type="invalid">
                    {formik.errors.last_name}
                  </FormFeedback>
                )}
              </div>
            </Col>
            <Col lg={6} md={6} className="mb-3">
              <div className="form-floating">
                <Input
                  name="phone_no"
                  className="form-control"
                  placeholder="Enter phone number"
                  type="tel"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.phone_no || ""}
                  invalid={
                    !!(formik.touched.phone_no && formik.errors.phone_no)
                  }
                  style={{ padding: "0.5rem", height: "1rem" }}
                />
                <Label for="floatingInput">{t("Phone No")}</Label>
                {formik.touched.phone_no && formik.errors.phone_no && (
                  <FormFeedback type="invalid">
                    {formik.errors.phone_no}
                  </FormFeedback>
                )}
              </div>
            </Col>
            <Col lg={6} md={6} className="mb-3">
              <div className="form-floating">
                <Input
                  name="email"
                  className="form-control"
                  placeholder="Enter email"
                  type="email"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email || ""}
                  invalid={!!(formik.touched.email && formik.errors.email)}
                  style={{ padding: "0.5rem", height: "1rem" }}
                />
                <Label for="floatingInput">Email</Label>
                {formik.touched.email && formik.errors.email && (
                  <FormFeedback type="invalid">
                    {formik.errors.email}
                  </FormFeedback>
                )}
              </div>
            </Col>

            <Col lg={6} md={6} className="mb-3">
              <div className="form-floating">
                <Input
                  name="user_role"
                  className="form-control"
                  placeholder="Enter user role"
                  type="text"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.user_role || ""}
                  invalid={
                    !!(formik.touched.user_role && formik.errors.user_role)
                  }
                  style={{ padding: "0.5rem", height: "1rem" }}
                />
                <Label for="floatingInput">{t("User Role")}</Label>
                {formik.touched.user_role && formik.errors.user_role && (
                  <FormFeedback type="invalid">
                    {formik.errors.user_role}
                  </FormFeedback>
                )}
              </div>
            </Col>
            <Col lg={6} md={6} className="mb-3">
              <div className="form-floating">
                <Input
                  name="administrative_unit"
                  type="select"
                  className="form-control"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.administrative_unit || ""}
                  invalid={
                    !!(
                      formik.touched.administrative_unit &&
                      formik.errors.administrative_unit
                    )
                  }
                  style={{ padding: "0.5rem", height: "1rem" }}
                >
                  <Label for="floatingInput">Administrative Unit</Label>
                  <option value="">{t("Select Unit")}</option>
                  {administrativeUnits.map((unit, index) => (
                    <option key={index} value={unit}>
                      {unit}
                    </option>
                  ))}
                </Input>
                {formik.touched.administrative_unit &&
                  formik.errors.administrative_unit && (
                    <FormFeedback type="invalid">
                      {formik.errors.administrative_unit}
                    </FormFeedback>
                  )}
              </div>
            </Col>

            <Col lg={6} md={6} className="mb-3">
              <div className="form-floating">
                <Input
                  name="address"
                  className="form-control"
                  placeholder="Enter address"
                  type="text"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.address || ""}
                  invalid={!!(formik.touched.address && formik.errors.address)}
                  style={{ padding: "0.5rem", height: "1rem" }}
                />
                <Label for="floatingInput">{t("Address")}</Label>
                {formik.touched.address && formik.errors.address && (
                  <FormFeedback type="invalid">
                    {formik.errors.address}
                  </FormFeedback>
                )}
              </div>
            </Col>

            <Col lg={6} md={6} className="mb-3">
              <div className="form-floating">
                <Input
                  name="municipality"
                  className="form-control"
                  placeholder="Enter address"
                  type="text"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.municipality || ""}
                  invalid={
                    !!(
                      formik.touched.municipality && formik.errors.municipality
                    )
                  }
                  style={{ padding: "0.5rem", height: "1rem" }}
                />
                <Label for="floatingInput">{t("Municipality")}</Label>
                {formik.touched.municipality && formik.errors.municipality && (
                  <FormFeedback type="invalid">
                    {formik.errors.municipality}
                  </FormFeedback>
                )}
              </div>
            </Col>

            <Col lg={4} md={4} className="mb-3">
              <div className="form-floating">
                <Input
                  name="sub_administrative"
                  className="form-control"
                  placeholder="Enter sub_administrative"
                  type="text"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.sub_administrative || ""}
                  invalid={
                    !!(
                      formik.touched.sub_administrative &&
                      formik.errors.sub_administrative
                    )
                  }
                  style={{ padding: "0.5rem", height: "1rem" }}
                />
                <Label for="floatingInput">Sub-Administrative</Label>
                {formik.touched.sub_administrative &&
                  formik.errors.sub_administrative && (
                    <FormFeedback type="invalid">
                      {formik.errors.sub_administrative}
                    </FormFeedback>
                  )}
              </div>
            </Col>
            <Col lg={4} md={4} className="mb-3">
              <div className="form-floating">
                <Input
                  name="soco"
                  className="form-control"
                  placeholder="Enter soco"
                  type="text"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.soco || ""}
                  invalid={!!(formik.touched.soco && formik.errors.soco)}
                  style={{ padding: "0.5rem", height: "1rem" }}
                />
                <Label for="floatingInput">Soco</Label>
                {formik.touched.soco && formik.errors.soco && (
                  <FormFeedback type="invalid">
                    {formik.errors.soco}
                  </FormFeedback>
                )}
              </div>
            </Col>
            <Col lg={4} md={4} className="mb-3">
              <div className="form-floating">
                <Input
                  name="aldeia"
                  className="form-control"
                  placeholder="Enter aldeia"
                  type="text"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.aldeia || ""}
                  invalid={!!(formik.touched.aldeia && formik.errors.aldeia)}
                  style={{ padding: "0.5rem", height: "1rem" }}
                />
                <Label for="floatingInput">Aldeia</Label>
                {formik.touched.aldeia && formik.errors.aldeia && (
                  <FormFeedback type="invalid">
                    {formik.errors.aldeia}
                  </FormFeedback>
                )}
              </div>
            </Col>
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
                    <i className="bx bxs-show" style={{ fontSize: "22px" }}></i>
                  ) : (
                    <i className="bx bxs-hide" style={{ fontSize: "22px" }}></i>
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
                  onClick={() => setConfirmPasswordShow(!confirmPasswordShow)}
                  style={{
                    marginRight:
                      formik.touched.password_confirmation &&
                      formik.errors.password_confirmation
                        ? "18px"
                        : "0px",
                  }}
                >
                  {confirmPasswordShow ? (
                    <i className="bx bxs-show" style={{ fontSize: "22px" }}></i>
                  ) : (
                    <i className="bx bxs-hide" style={{ fontSize: "22px" }}></i>
                  )}
                </button>
              </div>
            </Col>
          </Row>
          <div className="d-flex justify-content-end gap-3">
            <Button color="danger" onClick={toggleModal}>
              Cancel
            </Button>
            <Button type="submit" color="success">
              {editingUser ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </ModalBody>
    </Modal>
  );
};

export default UserPage;
