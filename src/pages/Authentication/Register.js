import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
const Register = () => {
  const { id } = useParams();
  const history = useNavigate();
  const [isCanceling, setIsCanceling] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [userOptions, setuserOptions] = useState([]);

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
      username: "",
      password: "",
      confirmPassword: "",
      roles: [],
    },
    validate: (values) => {
      const errors = {};

      if (!values.username) {
        errors.username = "Name is required";
      }

      // Password validation
      if (!values.password) {
        errors.password = "Password is required";
      } else if (
        !/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}/.test(
          values.password
        )
      ) {
        errors.password =
          "Password must be at least 8 characters, include at least one uppercase, one lowercase, one digit, and one special character.";
      }

      // Conditionally validate confirm password based on password
      if (values.password.length >= 8 && !values.confirmPassword) {
        errors.confirmPassword = "Confirm Password is required";
      } else if (values.password !== values.confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
      }
      if (values.roles.length === 0) {
        errors.roles = "Please select at least one role";
      }

      return errors;
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
      <Container fluid>
        <div className="page-content">
          <BreadCrumb
            title="Admin Register"
            pageTitle="Register"
            breadcrumbItems={breadcrumbItems}
          />

          <Row>
            <Col lg={3}></Col>
            <Col lg={6}>
              <Card>
                <CardBody>
                  <Form
                    onSubmit={validation.handleSubmit}
                    className="needs-validation"
                    action="#"
                  >
                    <FormGroup row>
                      <Label htmlFor="username" className="form-label">
                        Username <span className="text-danger">*</span>
                      </Label>
                      <Col sm={12}>
                        <Input
                          name="username"
                          type="text"
                          placeholder="Enter username"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.username || ""}
                          invalid={
                            validation.touched.username &&
                            validation.errors.username
                          }
                        />
                        {validation.touched.username &&
                          validation.errors.username && (
                            <FormFeedback type="invalid">
                              {validation.errors.username}
                            </FormFeedback>
                          )}
                      </Col>
                    </FormGroup>

                    <FormGroup row>
                      <Label htmlFor="password" className="form-label">
                        Password <span className="text-danger">*</span>
                      </Label>
                      <Col sm={12}>
                        <Input
                          name="password"
                          type="password"
                          placeholder="Enter Password"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.password || ""}
                          invalid={
                            validation.touched.password &&
                            validation.errors.password
                          }
                        />
                        {validation.touched.password &&
                          validation.errors.password && (
                            <FormFeedback type="invalid">
                              {validation.errors.password}
                            </FormFeedback>
                          )}
                      </Col>
                    </FormGroup>

                    <FormGroup row>
                      <Label htmlFor="confirmPassword" className="form-label">
                        Confirm Password <span className="text-danger">*</span>
                      </Label>
                      <Col sm={12}>
                        <Input
                          name="confirmPassword"
                          type="password"
                          placeholder="Confirm Password"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.confirmPassword || ""}
                          invalid={
                            validation.touched.confirmPassword &&
                            validation.errors.confirmPassword
                          }
                        />
                        {validation.touched.confirmPassword &&
                          validation.errors.confirmPassword && (
                            <FormFeedback type="invalid">
                              {validation.errors.confirmPassword}
                            </FormFeedback>
                          )}
                      </Col>
                    </FormGroup>
                    <FormGroup>
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
                            const rolesData = selectedOptions.map((option) => ({
                              id: option.value,
                              name: option.label,
                            }));
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
                            validation.touched.roles && validation.errors.roles
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
                    </FormGroup>

                    <div className="text-end">
                      <Label sm={2}></Label>
                      <Col sm={12}>
                        <Button
                          type="submit"
                          className="btn btn-primary me-2"
                          disabled={isSaving}
                        >
                          {isSaving ? (
                            <>
                              <Spinner
                                size="sm"
                                color="light"
                                className="me-2"
                              />{" "}
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
                              navigate("/User-Role");
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
                      </Col>
                    </div>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </Container>
    </React.Fragment>
  );
};
export default Register;
