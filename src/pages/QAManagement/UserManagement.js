import React, { useState } from "react";
import {
  Row,
  Col,
  Container,
  Card,
  CardBody,
  CardHeader,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import UserList from "../../Components/QAManagementComponent/Datatable/UserList";
import { useDispatch } from "react-redux";
import { addUsers, updateUserById, getUsers } from "../../slices/thunks";
import { useEffect } from "react";
import * as Yup from "yup"; // Import Yup
import { Formik, Form, Field, ErrorMessage } from "formik";

// import Components
import BreadCrumb from "../../Components/Common/BreadCrumb";

const UserManagement = () => {
  document.title = " User Management";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false); // New state for editing mode
  const [editedUser, setEditedUser] = useState(null); // New state for edited user
  const dispatch = useDispatch();

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    setIsEditMode(false); // Reset editing mode when the modal is closed
    setEditedUser(null); // Reset edited user when the modal is closed
    setNewUserData({
      username: "",
      firstName: "",
      lastName: "",
      password: "",
      role: "",
      email: "",
    });
  };

  const [newUserData, setNewUserData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    role: "",
    password: "",
    email: "",
  });
  let validationSchema = Yup.object().shape({
    username: Yup.string().required("username is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    role: Yup.string().required("Role is required"),
  });

  if (!isEditMode) {
    validationSchema = validationSchema.concat(
      Yup.object().shape({
        password: Yup.string()
          .required("Password is required")
          .min(8, "Password must be at least 8 characters")
          .matches(
            /^(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*()_+])(?=\S+$)/,
            "Password must include at least one number, one uppercase letter, and one special character"
          ),
      })
    );
  }

  useEffect(() => {
    // Fetch users when the component mounts
    dispatch(getUsers());
  }, [dispatch]);

  const handleEditUser = (user) => {
    setIsModalOpen(true);
    setIsEditMode(true);
    setEditedUser(user);
    setNewUserData({
      id: user.id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      password: user.password,
      email: user.email,
      role: user.role,
    });
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="User Management" pageTitle="Ants Quality" />
          {/* Tile Boxs Widgets */}
          <Col lg={12}>
            <Card>
              <CardHeader>
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="card-title mb-0">User List</h5>
                  <div
                    className="btn btn-outline-primary"
                    onClick={toggleModal}
                  >
                    + Add
                  </div>
                </div>
              </CardHeader>
              <CardBody>
                <Row>
                  <UserList onEditUser={handleEditUser} />
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Container>
      </div>

      {/* Add User Modal */}
      <Modal isOpen={isModalOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>
          {isEditMode ? (
            <div className="text-primary">Edit User</div>
          ) : (
            <div className="text-primary">Add New User</div>
          )}
        </ModalHeader>
        <ModalBody>
          {/* Form for adding a new user */}
          <Formik
            initialValues={newUserData}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              if (isEditMode) {
                // Exclude the "password" field if it's empty during editing
                const updatedUser = {
                  ...values,
                };
                if (!values.password) {
                  delete updatedUser.password;
                }
                console.log(
                  "edited user.id:",
                  editedUser.id,
                  "editedData:",
                  updatedUser
                );
                dispatch(updateUserById(editedUser.id, updatedUser));
              } else {
                // Handle add user here
                //convert role to int
                values.role = parseInt(values.role);
                const newUser = {
                  ...values,
                };
                dispatch(addUsers(newUser));
              }
              toggleModal();
            }}
          >
            {(formik) => (
              <Form>
                <FormGroup>
                  <Label for="username">Username</Label>
                  <Field
                    type="text"
                    name="username"
                    id="username"
                    placeholder="Enter username"
                    className={`form-control ${
                      formik.touched.username && formik.errors.username
                        ? "is-invalid"
                        : ""
                    }`}
                  />
                  <ErrorMessage
                    name="username"
                    component="div"
                    className="invalid-feedback"
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="email">Email address</Label>
                  <Field
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Enter your email address"
                    className={`form-control ${
                      formik.touched.email && formik.errors.email
                        ? "is-invalid"
                        : ""
                    }`}
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="invalid-feedback"
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="firstName">First Name</Label>
                  <Field
                    type="text"
                    name="firstName"
                    id="firstName"
                    placeholder="Enter first name"
                    className={`form-control ${
                      formik.touched.firstName && formik.errors.firstName
                        ? "is-invalid"
                        : ""
                    }`}
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="invalid-feedback"
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="lastName">Last Name</Label>
                  <Field
                    type="text"
                    name="lastName"
                    id="lastName"
                    placeholder="Enter last name"
                    className={`form-control ${
                      formik.touched.lastName && formik.errors.lastName
                        ? "is-invalid"
                        : ""
                    }`}
                  />
                  <ErrorMessage
                    name="lastName"
                    component="div"
                    className="invalid-feedback"
                  />
                </FormGroup>
                {!isEditMode && (
                  <FormGroup>
                    <Label for="password">Password</Label>
                    <Field
                      type="password"
                      name="password"
                      id="password"
                      placeholder="Enter password"
                      className={`form-control ${
                        formik.touched.password && formik.errors.password
                          ? "is-invalid"
                          : ""
                      }`}
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="invalid-feedback"
                    />
                  </FormGroup>
                )}

                <FormGroup>
                  <Label for="role">Role</Label>
                  <Field
                    as="select"
                    name="role"
                    id="role"
                    className={`form-select ${
                      formik.touched.role && formik.errors.role
                        ? "is-invalid"
                        : ""
                    }`}
                  >
                    <option value="" disabled>
                      Select Role
                    </option>
                    <option value="1">SystemAdmin</option>
                    <option value="2">SystemUser</option>
                  </Field>
                  <ErrorMessage
                    name="role"
                    component="div"
                    className="invalid-feedback"
                  />
                </FormGroup>
                <ModalFooter>
                  <Button color="light" onClick={toggleModal}>
                    Cancel
                  </Button>
                  <Button color="primary" type="submit">
                    {isEditMode ? "Update" : "Submit"}
                  </Button>
                </ModalFooter>
              </Form>
            )}
          </Formik>
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
};

export default UserManagement;
