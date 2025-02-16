import PropTypes from "prop-types";
import React, { useEffect } from "react";
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
} from "reactstrap";

//redux
import { useSelector, useDispatch } from "react-redux";

import { Link, useNavigate } from "react-router-dom";
import withRouter from "../../Components/Common/withRouter";

// Formik Validation
import * as Yup from "yup";
import { useFormik } from "formik";

// action
import { userForgetPassword } from "../../slices/thunks";
import { useParams } from "react-router-dom";

// import images
// import profile from "../../assets/images/bg.png";
import logoLight from "../../assets/images/logo-light.png";
import ParticlesAuth from "../AuthenticationInner/ParticlesAuth";
import { createSelector } from "reselect";
import { useState } from "react";
import AuthenticationsServices from "../../services/AuthenticationService/AuthenticationsServices";
import toast from "react-hot-toast";

const ForgetPasswordPage = () => {
  document.title = "Reset Password";

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email")
      .required("Please enter your email"),
  });

  const onSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await AuthenticationsServices.forgetPassword(
        values.email
      );
      if (response.status === "ok") {
        navigate("/reset-password");
        toast.success("Reset code sent successfully");
      }
    } catch (error) {
      toast.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const validation = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema,
    onSubmit,
  });

  const selectLayoutState = (state) => state.ForgetPassword;
  const selectLayoutProperties = createSelector(selectLayoutState, (state) => ({
    forgetError: state.forgetError,
    forgetSuccessMsg: state.forgetSuccessMsg,
  }));
  const { forgetError, forgetSuccessMsg } = useSelector(selectLayoutProperties);

  return (
    <ParticlesAuth>
      <div className="auth-page-content">
        <Container>
       

          <Row className="mt-sm-5 mb-4 justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Card className="mt-5">
                <CardBody className="p-4">
                  <div className="text-center mt-2">
                    <h5 className="text-primary">Forgot Password?</h5>
                  </div>

                  <Alert className="border-0 alert-warning text-center mb-2 mx-2">
                    Enter your email and instructions will be sent to you!
                  </Alert>
                  {forgetError && <Alert color="danger">{forgetError}</Alert>}
                  {forgetSuccessMsg && (
                    <Alert color="success">{forgetSuccessMsg}</Alert>
                  )}

                  <Form onSubmit={validation.handleSubmit}>
                    <div className="mb-4">
                      <Label className="form-label">Email</Label>
                      <Input
                        name="email"
                        className="form-control"
                        placeholder="Enter email"
                        type="email"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.email}
                        invalid={
                          validation.touched.email && validation.errors.email
                        }
                        disabled={validation.isSubmitting}
                      />
                      {validation.touched.email && validation.errors.email && (
                        <FormFeedback>{validation.errors.email}</FormFeedback>
                      )}
                    </div>

                    <div className="text-center mt-4">
                      <button
                        className="btn btn-success w-100"
                        type="submit"
                        disabled={validation.isSubmitting}
                      >
                        {validation.isSubmitting
                          ? "Sending..."
                          : "Send Reset Link"}
                      </button>
                    </div>
                  </Form>
                </CardBody>
              </Card>

              <div className="mt-4 text-center">
                <p className="mb-0 text-black">
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

export default ForgetPasswordPage;
