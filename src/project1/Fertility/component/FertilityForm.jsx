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
import Flatpickr from "react-flatpickr";

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

const FertilityForm = ({ modal, toggleModal, editingUser, setEditingUser }) => {
  const [users, setUsers] = useState([]);
  const [dateChange, setDateChange] = useState(null);
  const administrativeUnits = ["Unit 1", "Unit 2", "Unit 3"]; // Replace with actual data
  const handleDateChange = (date) => {
    setDateChange(date[0]); // Assuming date is an array, pick the first value
  };

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
        {editingUser ? "Edit Fertility Form" : "Add Fertility Form"}
      </ModalHeader>
      <ModalBody>
        <form onSubmit={formik.handleSubmit}>
          <Row>
            <Col lg={6} md={6} className="mb-3">
              <div className="form-floating">
                <Input
                  name="first_name"
                  className="form-control"
                  placeholder="Enter first name"
                  type="text"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.first_name || ""}
                  invalid={
                    !!(formik.touched.first_name && formik.errors.first_name)
                  }
                  style={{ padding: "0.5rem", height: "1rem" }}
                />
                <Label for="floatingInput">First Name</Label>
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
                <Label for="floatingInput">Last Name</Label>
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
                  name="gender"
                  className="form-control"
                  type="select"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.gender || ""}
                  invalid={!!(formik.touched.gender && formik.errors.gender)}
                  style={{ padding: "0.5rem", height: "1rem" }}
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </Input>
                <Label for="floatingInput">Gender</Label>
                {formik.touched.gender && formik.errors.gender && (
                  <FormFeedback type="invalid">
                    {formik.errors.gender}
                  </FormFeedback>
                )}
              </div>
            </Col>

            <Col lg={6} md={6} className="mb-3">
              <div className="form-floating">
                <Input
                  name="municipality"
                  className="form-control"
                  type="select"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.municipality || ""}
                  invalid={
                    !!(
                      formik.touched.municipality && formik.errors.municipality
                    )
                  }
                  style={{ padding: "0.5rem", height: "1rem" }}
                >
                  <option value="">Select municipality</option>
                  <option value="male">Bhaktapur</option>
                  <option value="female">Kathmandu</option>
                </Input>
                <Label for="floatingInput">Municipality</Label>
                {formik.touched.municipality && formik.errors.municipality && (
                  <FormFeedback type="invalid">
                    {formik.errors.municipality}
                  </FormFeedback>
                )}
              </div>
            </Col>

            <Col lg={6} md={6} className="mb-3">
              <div className="form-floating">
                <Input
                  name="subAdministrative"
                  className="form-control"
                  type="select"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.subAdministrative || ""}
                  invalid={
                    !!(
                      formik.touched.subAdministrative &&
                      formik.errors.subAdministrative
                    )
                  }
                  style={{ padding: "0.5rem", height: "1rem" }}
                >
                  <option value="">Select Sub Administrative</option>
                  <option value="male">Bhaktapur</option>
                  <option value="female">Kathmandu</option>
                </Input>
                <Label for="floatingInput">Municipality</Label>
                {formik.touched.subAdministrative &&
                  formik.errors.subAdministrative && (
                    <FormFeedback type="invalid">
                      {formik.errors.subAdministrative}
                    </FormFeedback>
                  )}
              </div>
            </Col>

            <Col lg={6} md={6} className="mb-3">
              <div className="form-floating">
                <Input
                  name="soco"
                  className="form-control"
                  type="select"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.soco || ""}
                  invalid={!!(formik.touched.soco && formik.errors.soco)}
                  style={{ padding: "0.5rem", height: "1rem" }}
                >
                  <option value="">Select soco</option>
                  <option value="male">Bhaktapur</option>
                  <option value="female">Kathmandu</option>
                </Input>
                <Label for="floatingInput">Municipality</Label>
                {formik.touched.soco && formik.errors.soco && (
                  <FormFeedback type="invalid">
                    {formik.errors.soco}
                  </FormFeedback>
                )}
              </div>
            </Col>

            <Col lg={6} md={6} className="mb-3">
              <div className="form-floating">
                <Input
                  name="aldeia"
                  className="form-control"
                  type="select"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.aldeia || ""}
                  invalid={!!(formik.touched.aldeia && formik.errors.aldeia)}
                  style={{ padding: "0.5rem", height: "1rem" }}
                >
                  <option value="">Select aldeia</option>
                  <option value="male">Bhaktapur</option>
                  <option value="female">Kathmandu</option>
                </Input>
                <Label for="floatingInput">Municipality</Label>
                {formik.touched.aldeia && formik.errors.aldeia && (
                  <FormFeedback type="invalid">
                    {formik.errors.aldeia}
                  </FormFeedback>
                )}
              </div>
            </Col>

            <Col>
              <div className="form-floating">
                <Flatpickr
                  className="form-control"
                  value={dateChange}
                  onChange={handleDateChange}
                  placeholder="Select from date"
                  options={{
                    altInput: true,
                    altFormat: "d/m/Y",
                    enableTime: false,
                    dateFormat: "d/m/Y",
                    minDate: "today",
                  }}
                />
                <Label for="floatingInput">Fertility Date</Label>
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

export default FertilityForm;
