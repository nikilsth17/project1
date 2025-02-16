import PropTypes from "prop-types";
import React, { useState } from "react";
import {
  Row,
  Col,
  Card,
  CardBody,
  Container,
  FormFeedback,
  Input,
  Label,
  Form,
  Spinner,
} from "reactstrap";
import { Link } from "react-router-dom";
import logoLight from "../../assets/images/logo-light.png";
import ParticlesAuth from "../AuthenticationInner/ParticlesAuth";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useParams } from "react-router-dom";
import AuthenticationsServices from "../../services/AuthenticationService/AuthenticationsServices";
import withRouter from "../../Components/Common/withRouter";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
const ResetPassword = () => {
  const { token } = useParams();
  // console.log("Token:", token);
  const location = useLocation();
  // console.log("🚀 ~ ResetPassword ~ location:", location);
  const [resetPasswordShow, setResetPasswordShow] = useState(false);

  const [passwordShow, setPasswordShow] = useState(false);
  const [confirmPasswordShow, setConfirmPasswordShow] = useState(false);
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      reset_code: "",
      password: "",
      password_confirmation: "",
    },
    // Make sure the field names in your validation schema match the ones in your form
    validationSchema: Yup.object({
      reset_code: Yup.string().required("Please enter the reset code"),
      password: Yup.string().required("Please Enter Your Password"),
      password_confirmation: Yup.string()
        .oneOf([Yup.ref("password")], "Confirm Password Doesn't Match")
        .required("Please Confirm Your Password"),
    }),

    onSubmit: async (values) => {
      console.log("REsponse for change pw", values);
      try {
        // Call the API service for forgetting password
        const response = await AuthenticationsServices.resetPassword(
          values.reset_code,
          values.password,
          values.password_confirmation
        );
        console.log("API response", response);
        navigate("/login");
        toast.success("Password changed successfully");
      } catch (error) {
        console.error("Error while resetting password", error);
        toast.error("Something went wrong");
        // Handle the error, for example, by showing an alert
      }
    },
  });

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  return (
    <ParticlesAuth>
      <div className="auth-page-content">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Card className="mt-4">
                <CardBody className="p-4">
                  <div className="text-center mt-2">
                    <h5 className="text-primary">Reset Password</h5>

                    <lord-icon
                      src="https://cdn.lordicon.com/rhvddzym.json"
                      trigger="loop"
                      colors="primary:#0ab39c"
                      className="avatar-xl"
                      style={{ width: "120px", height: "120px" }}
                    ></lord-icon>
                  </div>

                  <div className="p-2">
                    <Form onSubmit={validation.handleSubmit}>
                      {/* Reset Code */}
                      <Col lg={12} md={12} xs={12} className="mb-3">
                        <div className="form-floating">
                          <Input
                            name="reset_code"
                            value={validation.values.reset_code}
                            type={resetPasswordShow ? "text" : "password"}
                            className="form-control"
                            placeholder="Enter Reset Code"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            invalid={
                              !!(
                                validation.touched.reset_code &&
                                validation.errors.reset_code
                              )
                            }
                            style={{ padding: "0.5rem", height: "1rem" }}
                          />
                          <Label for="reset_code">Reset Code</Label>
                          {validation.touched.reset_code &&
                            validation.errors.reset_code && (
                              <FormFeedback>
                                {validation.errors.reset_code}
                              </FormFeedback>
                            )}
                          <button
                            className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted mt-2"
                            type="button"
                            onClick={() =>
                              setResetPasswordShow(!resetPasswordShow)
                            }
                            style={{
                              marginRight:
                                validation.touched.reset_code &&
                                validation.errors.reset_code
                                  ? "18px"
                                  : "0px",
                            }}
                          >
                            {resetPasswordShow ? (
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

                      {/* Password */}
                      <Col lg={12} md={12} xs={12} className="mb-3">
                        <div className="form-floating">
                          <Input
                            name="password"
                            value={validation.values.password}
                            type={passwordShow ? "text" : "password"}
                            className="form-control pe-5"
                            placeholder="Enter Password"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            invalid={
                              !!(
                                validation.touched.password &&
                                validation.errors.password
                              )
                            }
                            style={{ padding: "0.5rem", height: "1rem" }}
                          />
                          <Label for="password">Password</Label>
                          {validation.touched.password &&
                            validation.errors.password && (
                              <FormFeedback>
                                {validation.errors.password}
                              </FormFeedback>
                            )}
                          <button
                            className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted mt-2"
                            type="button"
                            onClick={() => setPasswordShow(!passwordShow)}
                            style={{
                              marginRight:
                                validation.touched.password &&
                                validation.errors.password
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

                      {/* Confirm Password */}
                      <Col lg={12} md={12} xs={12} className="mb-3">
                        <div className="form-floating">
                          <Input
                            name="password_confirmation"
                            value={validation.values.password_confirmation}
                            type={confirmPasswordShow ? "text" : "password"}
                            className="form-control pe-5"
                            placeholder="Confirm Password"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            invalid={
                              !!(
                                validation.touched.password_confirmation &&
                                validation.errors.password_confirmation
                              )
                            }
                            style={{ padding: "0.5rem", height: "1rem" }}
                          />
                          <Label for="password_confirmation">
                            Confirm Password
                          </Label>
                          {validation.touched.password_confirmation &&
                            validation.errors.password_confirmation && (
                              <FormFeedback>
                                {validation.errors.password_confirmation}
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
                                validation.touched.password_confirmation &&
                                validation.errors.password_confirmation
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
                      <div className="text-center mt-4">
                        <button
                          className="btn btn-success w-100"
                          type="submit"
                          disabled={loading}
                        >
                          {loading && (
                            <Spinner size="sm" className="me-2">
                              {" "}
                              Loading...{" "}
                            </Spinner>
                          )}
                          Reset Password
                        </button>
                      </div>
                    </Form>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </ParticlesAuth>
  );
};

ResetPassword.propTypes = {
  history: PropTypes.object,
};

export default withRouter(ResetPassword);
