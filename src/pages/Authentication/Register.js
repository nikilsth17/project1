import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  FormGroup,
  Label,
  Input,
  ButtonToggle,
  Button,
  Form,
  FormFeedback,
} from "reactstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import GoodCategoryServices from "../../services/AustServices/Good Category/GoodCategoryServices";
import { useDispatch } from "react-redux";
import Select from "react-select";
import AuthenticationsServices from "../../services/AuthenticationService/AuthenticationsServices";
import { Spinner } from "reactstrap";
import ParticlesAuth from "../AuthenticationInner/ParticlesAuth";
const Register = () => {
  const { id } = useParams();
  const history = useNavigate();
  const [isCanceling, setIsCanceling] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [userOptions, setuserOptions] = useState([]);
  const [passwordShow, setPasswordShow] = useState(false);
  const [confirmPasswordShow, setConfirmPasswordShow] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedRole = await AuthenticationsServices.userRole();
        setuserOptions(fetchedRole);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (id) {
      setIsEditing(true);
      AuthenticationsServices.userRoleManage(id)
        .then((userrole) => {
          // Destructure the user role object
          const { username, password, confirmPassword, roles } = userrole;
          // Set form values using formik's setValues function
          formik.setValues({
            username: username.user.username,
            password: "",
            confirmPassword: "",
            roles: user.roles,
          });
        })
        .catch((error) => {
          console.error("Error fetching user role data:", error);
        });
    }
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedRole = await AuthenticationsServices.viewdata(id);
        console.log("🚀 ~ fetchData ~ fetchedRole:", fetchedRole);

        validation.setFieldValue("username", fetchedRole.user.userName);
        // Map the roles to the format expected by Select component
        const temp = fetchedRole.roles.map((role) => ({
          id: role,
          name: role,
        }));

        // Set the initial value of roles field in Formik
        validation.setFieldValue("roles", temp);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    console.log("🚀 ~ fetchData ~ fetchData:", fetchData);

    fetchData();
  }, []);

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      fullName: "",
      lastName: "",
      password: "",
      password_confirmation: "",
      roles: [],
    },

    onSubmit: async (values, { setFieldError, resetForm, setValues }) => {
      try {
        setIsSaving(true);
        // Create an array of roles in the required format
        const rolesArray = values.roles.map((role) => ({
          id: role.id,
          name: role.name,
        }));

        // Create the updated values object for submission
        const updatedValues = {
          username: values.username,
          password: values.password,
          confirmPassword: values.confirmPassword,
          roles: rolesArray,
        };

        if (isEditing) {
          // If isEditing is true, it's an update operation
          await AuthenticationsServices.updateregister(id, updatedValues);
          toast.success("User Updated Successfully", { autoClose: 3000 });

          console.log("User updated successfully");
        } else {
          // Otherwise, it's a registration operation
          const response = await AuthenticationsServices.Register(
            updatedValues
          );
          if (response) {
            resetForm();
            validation.validateForm();
            // navigate("/dashboard");
            toast.success("Registration successful!");
          }
        }
        navigate("/User-Role");
      } catch (error) {
        if (error.response && error.response.status === 409) {
          setFieldError(
            "username",
            "User with the same email address already exists. Please use a different email address."
          );
          toast.error(
            "User with the same email address already exists. Please use a different email address."
          );
        } else {
          console.error("Error:", error);
          toast.error("An error occurred. Please try again later.");
        }
      }
      setIsSaving(false);
    },
  });

  const breadcrumbItems = [{ title: "Back To List ", link: "/User-Role" }];

  return (
    <React.Fragment>
      <ParticlesAuth>
        <Container>
          <Row className="justify-content-center py-4">
            <Col md={8} lg={6} xl={5}>
              <div className="">
                <CardBody>
                  {/* <div className="text-center mt-2">
                    <h5 className="text-primary">Register</h5>
                    <p className="text-muted">
                      Register account to continue to admin panel.
                    </p>
                  </div> */}
                  <Form
                    onSubmit={validation.handleSubmit}
                    // className="needs-validation"
                    action="#"
                  >
                    <Row>
                      <Col md={6} className="mb-2">
                        <Label htmlFor="username" className="form-label text-dark">
                          First Name <span className="text-danger">*</span>
                        </Label>

                        <Input
                          name="firstName"
                          type="text"
                          placeholder="Enter first name"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.firstName || ""}
                          invalid={
                            validation.touched.firstName &&
                            validation.errors.firstName
                          }
                        />
                        {validation.touched.firstName &&
                          validation.errors.firstName && (
                            <FormFeedback type="invalid">
                              {validation.errors.firstName}
                            </FormFeedback>
                          )}
                      </Col>
                      <Col md={6} className="mb-2">
                        <Label htmlFor="username" className="form-label text-dark">
                          Last Name <span className="text-danger">*</span>
                        </Label>

                        <Input
                          name="lastName"
                          type="text"
                          placeholder="Enter last name"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.lastName || ""}
                          invalid={
                            validation.touched.lastName &&
                            validation.errors.lastName
                          }
                        />
                        {validation.touched.lastName &&
                          validation.errors.lastName && (
                            <FormFeedback type="invalid">
                              {validation.errors.lastName}
                            </FormFeedback>
                          )}
                      </Col>
                      <Col md={12} className="mb-2">
                        <Label htmlFor="username" className="form-label text-dark">
                          Email
                        </Label>
                        <Input
                          name="username"
                          className="form-control"
                          placeholder="Enter email"
                          type="text"
                          onChange={(e) => {
                            validation.handleChange(e);
                            setusername(e.target.value);
                          }}
                          onBlur={validation.handleBlur}
                          value={validation.values.username || ""}
                          invalid={
                            validation.touched.username &&
                            validation.errors.username
                              ? true
                              : false
                          }
                        />
                        {validation.touched.username &&
                        validation.errors.username ? (
                          <FormFeedback type="invalid">
                            {validation.errors.username}
                          </FormFeedback>
                        ) : null}
                      </Col>

                      <Col  md={12} xs={12} className="mb-2">
                        <Label for="password" className="text-dark">Password</Label>
                        <div className="position-relative">
                          <Input
                            name="password"
                            value={validation.values.password}
                            type={passwordShow ? "text" : "password"}
                            className="form-control " // Added padding on left to avoid overlap
                            placeholder="Enter Password"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            invalid={
                              !!(
                                validation.touched.password &&
                                validation.errors.password
                              )
                            }
                          />
                          <button
                            className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted my-4"
                            type="button"
                            onClick={() => setPasswordShow(!passwordShow)}
                            style={{
                              right:
                                validation.touched.password &&
                                validation.errors.password
                                  ? "18px"
                                  : "0px",
                              top: "50%",
                              transform: "translateY(-50%)",
                            }}
                          >
                            {passwordShow ? (
                              <i
                                className="bx bxs-show"
                                style={{ fontSize: "20px" }}
                              ></i>
                            ) : (
                              <i
                                className="bx bxs-hide"
                                style={{ fontSize: "20px" }}
                              ></i>
                            )}
                          </button>
                        </div>
                        {validation.touched.password &&
                          validation.errors.password && (
                            <FormFeedback>
                              {validation.errors.password}
                            </FormFeedback>
                          )}
                      </Col>

                      {/* Confirm Password */}
                      <Col  md={12} xs={12} className="mb-3">
                        <Label for="password_confirmation" className="text-dark">
                          Confirm Password
                        </Label>
                        <div className="position-relative">
                          <Input
                            name="password_confirmation"
                            value={validation.values.password_confirmation}
                            type={confirmPasswordShow ? "text" : "password"}
                            className="form-control" // Added padding on left to avoid overlap
                            placeholder="Confirm Password"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            invalid={
                              !!(
                                validation.touched.password_confirmation &&
                                validation.errors.password_confirmation
                              )
                            }
                          />
                          <button
                            className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted my-4"
                            type="button"
                            onClick={() =>
                              setConfirmPasswordShow(!confirmPasswordShow)
                            }
                            style={{
                              right:
                                validation.touched.password_confirmation &&
                                validation.errors.password_confirmation
                                  ? "18px"
                                  : "0px",
                              top: "50%",
                              transform: "translateY(-50%)",
                            }}
                          >
                            {confirmPasswordShow ? (
                              <i
                                className="bx bxs-show"
                                style={{ fontSize: "20px" }}
                              ></i>
                            ) : (
                              <i
                                className="bx bxs-hide"
                                style={{ fontSize: "20px" }}
                              ></i>
                            )}
                          </button>
                        </div>
                        {validation.touched.password_confirmation &&
                          validation.errors.password_confirmation && (
                            <FormFeedback>
                              {validation.errors.password_confirmation}
                            </FormFeedback>
                          )}
                      </Col>

                      {/* <FormGroup>
                        <Label for="paymentTypes" sm={2}>
                          User Roles:
                        </Label>
                        <Col sm={12}>
                          <Select
                            value={validation.values.roles.map((role) => ({
                              value: role.id,
                              label: role.name,
                            }))}
                            isMulti
                            isClearable
                            onChange={(selectedOptions) => {
                              const rolesData = selectedOptions.map(
                                (option) => ({
                                  id: option.value,
                                  name: option.label,
                                })
                              );
                              validation.setValues({
                                ...validation.values,
                                roles: rolesData,
                              });
                            }}
                            options={userOptions.map((role) => ({
                              value: role.id,
                              label: role.name,
                            }))}
                            className={`form-control ${
                              validation.touched.roles &&
                              validation.errors.roles
                                ? "is-invalid"
                                : ""
                            }`}
                          />
                          {validation.touched.roles &&
                            validation.errors.roles && (
                              <div className="invalid-feedback">
                                {validation.errors.roles}
                              </div>
                            )}
                        </Col>
                      </FormGroup> */}

                      <div className="mb-2">
                        <Button
                          type="submit"
                          className="btn btn-success w-100"
                          disabled={isSaving}
                        >
                          {isSaving ? (
                            <>
                              <Spinner
                                size="sm"
                                color="light"
                                className="me-2"
                              />{" "}
                              Registering...
                            </>
                          ) : (
                            "Register"
                          )}
                        </Button>
                      </div>

                      <div className=" text-center text-dark">
                        Already registered account?{" "}
                        <Link to={`/login`}>Login Here</Link>
                      </div>
                    </Row>
                  </Form>
                </CardBody>
              </div>
            </Col>
          </Row>
        </Container>
      </ParticlesAuth>
    </React.Fragment>
  );
};
export default Register;
