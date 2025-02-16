import PropTypes from "prop-types";
import React, { useState } from "react";
import {
  Row,
  Col,
  Alert,
  Card,
  CardBody,
  Container,
  FormFeedback,
  Input,
  Label,
  Form,
  Spinner,
} from "reactstrap";
import toast from "react-hot-toast";
//redux
import { useSelector, useDispatch } from "react-redux";

import { Link, useNavigate } from "react-router-dom";

// Formik formik
import * as Yup from "yup";
import { useFormik } from "formik";

// action
import { userForgetPassword } from "../../slices/thunks";
import { useParams } from "react-router-dom";
import withRouter from "../../Components/Common/withRouter";

// import images
// import profile from "../../assets/images/bg.png";
import logoLight from "../../assets/images/logo-light.png";
import ParticlesAuth from "../AuthenticationInner/ParticlesAuth";
import { createSelector } from "reselect";
import { postresetPwd } from "../../helpers/fakebackend_helper";
import logoDark from "../../assets/images/sebs-logo.png";
import AuthenticationsServices from "../../services/AuthenticationService/AuthenticationsServices";

const PasswordChange = (prop) => {
  document.title = "Reset Password ";
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      emailAddress: "",
      password: "",
      confirmPassword: "",
    },
    onSubmit: () => {
      const pwdData = formik.values;
      forgetPassword(pwdData);
    },
  });
  const [loading, setLoading] = useState(false);

  const forgetPassword = async (pwdData) => {
    try {
      setLoading(true);
      const response = await AuthenticationsServices.forgotPassword(pwdData);
      // setToken(response);
      toast.success(
        "Reset password link has been sent to your email address!Please check your email!"
      );

      navigate("/reset-password", { state: formik.values?.emailAddress });
      setLoading(false);
    } catch (error) {
      console.log("🚀 ~ file: Login.js:27 ~ userLogin ~ error:", error);
      toast.error("Email is not valid!");
      setLoading(false);
    }
  };

  return (
    <ParticlesAuth>
      <div className="auth-page-content">
        <Container>
          <Row>
            <Col lg={12}>
              <div className="text-center  mb-2 text-white-50">
                <div></div>
              </div>
            </Col>
          </Row>

          <Row className="justify-content-center mt-5">
            <Col md={8} lg={6} xl={5}>
              <Card className="mt-4">
                <CardBody className="p-4">
                  <div className="text-center mt-2">
                    <h5 className="text-primary">Forgot Password?</h5>

                    <lord-icon
                      src="https://cdn.lordicon.com/rhvddzym.json"
                      trigger="loop"
                      colors="primary:#0ab39c"
                      className="avatar-xl"
                      style={{ width: "120px", height: "120px" }}
                    ></lord-icon>
                  </div>

                  <div className="p-2">
                    <Form
                      onSubmit={(e) => {
                        e.preventDefault();
                        formik.handleSubmit();
                        return false;
                      }}
                    >
                      <div className="mb-4">
                        <Label className="form-label">Email or UserName</Label>
                        <Input
                          id="emailAddress"
                          name="emailAddress"
                          type="text"
                          placeholder="User Email"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.emailAddress}
                          invalid={
                            formik.touched.emailAddress &&
                            formik.errors.emailAddress
                              ? true
                              : false
                          }
                        />
                        {formik.touched.emailAddress &&
                        formik.errors.emailAddress ? (
                          <FormFeedback type="invalid">
                            <div>{formik.errors.emailAddress}</div>
                          </FormFeedback>
                        ) : null}
                      </div>

                      <div className="text-center mt-4">
                        <button
                          className="btn btn-success w-100"
                          type="submit"
                          disabled={loading}
                        >
                          {loading ? (
                            <Spinner size="sm" className="me-2">
                              {" "}
                              Loading...{" "}
                            </Spinner>
                          ) : null}
                          Reset Password
                        </button>
                      </div>
                      <div className="text-center mt-4"></div>
                    </Form>
                  </div>
                </CardBody>
              </Card>

              <div className="mt-4 text-center">
                <p className="mb-0 fw-bold text-black">
                  Wait, I remember my password...{" "}
                  <Link
                    to="/login"
                    className="fw-semibold text-primary text-decoration-underline"
                  >
                    {" "}
                    Click here{" "}
                  </Link>{" "}
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </ParticlesAuth>
  );
};

PasswordChange.propTypes = {
  history: PropTypes.object,
};

export default PasswordChange;
