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
} from "reactstrap";

//redux
import { useSelector, useDispatch } from "react-redux";

import { Link, useNavigate } from "react-router-dom";

// Formik Validation
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
import AuthenticationsServices from "../../services/AuthenticationService/AuthenticationsServices";
import toast from "react-hot-toast";

const ChangePassword = (prop) => {
  const [oldPasswordShow, setOldPasswordShow] = useState(false);
  const [newPasswordShow, setNewPasswordShow] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.user?.id;
  const [loading, setLoading] = useState(false);
  // const { user } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [passwordShow, setPasswordShow] = useState(false);
  const [confirmPasswordShow, setConfirmPasswordShow] = useState(false);
  // const idValue =userName || 0;
  // console.log(idValue);

  const formik = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,
    initialValues: {
      old_password: "",
      password: "",
      confirm_password: "",
    },
    validationSchema: Yup.object({
      old_password: Yup.string().required("Please Enter Your Old Password"),

      password: Yup.string().required("Please Enter Your New Password"),
      confirm_password: Yup.string()
        .oneOf([Yup.ref("password")], "Confirm Password Doesn't Match")
        .required("Please Confirm Your Password"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const response = await AuthenticationsServices.updatePassword(
          userId,
          values.old_password,
          values.password,
          values.confirm_password
        );
        console.log("API response", response);

        toast.success("Password updated successfully");
        localStorage.clear();
        navigate("/login");
      } catch (error) {
        console.error("Error while resetting password", error);
        toast.error(error.response?.data?.error);
        // Handle the error, for example, by showing an alert
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <React.Fragment>
      <div className="page-content">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Card>
                <h4 className="text-muted text-center mt-3">Change Password</h4>
                <CardBody className="p-2">
                  <div className="p-2">
                    <Form onSubmit={formik.handleSubmit}>
                      <Row>
                        <Col lg={12} className="mt-3">
                          <div className="form-floating mb-3">
                            <Input
                              name="old_password"
                              value={formik.values.old_password || ""}
                              type={oldPasswordShow ? "text" : "password"}
                              className="form-control pe-5"
                              placeholder="Enter Old Password"
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              invalid={
                                !!(
                                  formik.touched.old_password &&
                                  formik.errors.old_password
                                )
                              }
                              style={{ padding: "0.5rem", height: "1rem" }}
                            />
                            <Label for="floatingInput">Old Password</Label>
                            {formik.touched.old_password &&
                              formik.errors.old_password && (
                                <FormFeedback type="invalid">
                                  {formik.errors.old_password}
                                </FormFeedback>
                              )}
                            <button
                              className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted mt-2"
                              type="button"
                              id="password-addon"
                              onClick={() =>
                                setOldPasswordShow(!oldPasswordShow)
                              }
                              style={{
                                marginRight:
                                  formik.touched.old_password &&
                                  formik.errors.old_password
                                    ? "18px"
                                    : "0px",
                              }}
                            >
                              {oldPasswordShow ? (
                                <i
                                  className="bx bxs-show"
                                  style={{ fontSize: "22px" }}
                                ></i>
                              ) : (
                                <i
                                  class="bx bxs-hide"
                                  style={{ fontSize: "22px" }}
                                ></i>
                              )}
                            </button>
                          </div>
                        </Col>
                        <Col lg={12} className="mt-3">
                          <div className="form-floating mb-3">
                            <Input
                              name="password"
                              value={formik.values.password || ""}
                              type={passwordShow ? "text" : "password"}
                              className="form-control pe-5"
                              placeholder="Enter New Password"
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              invalid={
                                !!(
                                  formik.touched.password &&
                                  formik.errors.password
                                )
                              }
                              style={{ padding: "0.5rem", height: "1rem" }}
                            />
                            <Label for="floatingInput">New Password</Label>
                            {formik.touched.password &&
                              formik.errors.password && (
                                <FormFeedback type="invalid">
                                  {formik.errors.password}
                                </FormFeedback>
                              )}
                            <button
                              className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted mt-2"
                              type="button"
                              id="password-addon"
                              onClick={() => setPasswordShow(!passwordShow)}
                              style={{
                                marginRight:
                                  formik.touched.password &&
                                  formik.errors.password
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
                                  class="bx bxs-hide"
                                  style={{ fontSize: "22px" }}
                                ></i>
                              )}
                            </button>
                          </div>
                        </Col>
                        <Col lg={12} className="mt-2">
                          <div className="form-floating mb-3">
                            <Input
                              name="confirm_password"
                              value={formik.values.confirm_password || ""}
                              type={confirmPasswordShow ? "text" : "password"}
                              className="form-control pe-5"
                              placeholder="Confirm Password"
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              invalid={
                                !!(
                                  formik.touched.confirm_password &&
                                  formik.errors.confirm_password
                                )
                              }
                              style={{ padding: "0.5rem", height: "1rem" }}
                            />
                            <Label for="floatingInput">Confirm Password</Label>
                            {formik.touched.confirm_password &&
                              formik.errors.confirm_password && (
                                <FormFeedback type="invalid">
                                  {formik.errors.confirm_password}
                                </FormFeedback>
                              )}
                            <button
                              className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted mt-2"
                              type="button"
                              id="confirm-password-addon"
                              onClick={() =>
                                setConfirmPasswordShow(!confirmPasswordShow)
                              }
                              style={{
                                marginRight:
                                  formik.touched.confirm_password &&
                                  formik.errors.confirm_password
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
                                  class="bx bxs-hide"
                                  style={{ fontSize: "22px" }}
                                ></i>
                              )}
                            </button>
                          </div>
                        </Col>
                        <Col className="">
                          <button
                            className="btn btn-success w-100"
                            type="submit"
                            disabled={loading}
                          >
                            Change Password
                          </button>
                        </Col>
                      </Row>
                    </Form>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
          {/* </Card> */}
        </Container>
      </div>
    </React.Fragment>
  );
};

export default ChangePassword;
