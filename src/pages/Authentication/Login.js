import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Col,
  Container,
  Input,
  Label,
  Row,
  Button,
  Form,
  FormFeedback,
  Alert,
  Spinner,
} from "reactstrap";
import ParticlesAuth from "../AuthenticationInner/ParticlesAuth";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import withRouter from "../../Components/Common/withRouter";
import * as Yup from "yup";
import { useFormik } from "formik";
import { resetLoginFlag } from "../../slices/thunks";
import { login } from "../../slices/qaManagment/authentication/thunk";
import logoLight from "../../assets/qaManagemet/AntsQualityLightLogo.png";
import { createSelector } from "reselect";
import { getLoggedInUser } from "../../helpers/fakebackend_helper";
import logoDark from "../../assets/images/sebs-logo.png";
import { toast } from "react-hot-toast";
import "../../i18n";
import { useTranslation } from "react-i18next";

const Login = (props) => {
  const authuser = getLoggedInUser();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.Auth.isAuthenticated);
  const loginerror = useSelector((state) => state.Auth.errorMsg);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { t, i18n } = useTranslation();

  const [username, setusername] = useState("");
  const handleClick = () => {
    navigate("/register");
  };

  const selectLayoutState = (state) => state;
  const loginpageData = createSelector(selectLayoutState, (state) => ({
    user: state.Account.user,
    error: state.Login.error,
    loading: state.Login.loading,
    errorMsg: state.Login.errorMsg,
  }));

  const { user, error, errorMsg } = useSelector(loginpageData);

  const [userLogin, setUserLogin] = useState([]);
  const [passwordShow, setPasswordShow] = useState(false);

  useEffect(() => {
    if (user) {
      const updatedUserData =
        process.env.REACT_APP_DEFAULTAUTH === "firebase"
          ? user.multiFactor.user.email
          : user.user.email;
      const updatedUserPassword =
        process.env.REACT_APP_DEFAULTAUTH === "firebase"
          ? ""
          : user.user.confirm_password;
      setUserLogin({
        username: updatedUserData,
        password: updatedUserPassword,
      });
    }
  }, [user]);

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Please Enter Your Email"),
      password: Yup.string().required("Please Enter Your Password"),
    }),
    onSubmit: async (values) => {
      try {
        setLoading(true);
        dispatch({ type: "LOGIN_LOADING" });

        await dispatch(login(values, props.router.navigate));

        if (
          isAuthenticated &&
          (authuser.associatedRoles.includes("SuperAdmin") ||
            authuser.associatedRoles.includes("SystemAdmin"))
        ) {
          navigate("/dashboard");
        } else if (
          isAuthenticated &&
          authuser.associatedRoles.includes("SystemUser")
        ) {
          navigate("/project");
        }
      } catch (error) {
        console.error("Login failed:", error);
      } finally {
        setLoading(false);
        dispatch({ type: "LOGIN_LOADED" });
      }
    },
  });

  useEffect(() => {
    if (errorMsg) {
      setTimeout(() => {
        dispatch(resetLoginFlag());
      }, 3000);
    }
  }, [dispatch, errorMsg]);

  const handleForgotPasswordClick = () => {
    console.log(username);
    navigate("/forgot-password");
  };

  document.title = "Cosmos Bookings";

  return (
    <React.Fragment>
      <ParticlesAuth>
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <div className="mt-2">
                <CardBody className="p-2">
                  {/* <div className="text-center mt-2">
                    <h5 className="text-primary">Welcome Back!</h5>
                    <p className="text-muted">
                      Sign in to continue to admin panel.
                    </p>
                  </div> */}
                  {errorMsg && errorMsg ? (
                    <Alert color="danger"> {errorMsg} </Alert>
                  ) : null}
                  <div className="p-2 mt-4">
                    <Form
                      onSubmit={(e) => {
                        e.preventDefault();
                        validation.handleSubmit();
                        return false;
                      }}
                      action="#"
                    >
                      <div className="mb-2">
                        <Label
                          htmlFor="username"
                          className="form-label text-dark"
                        >
                          {t("Email Address")}
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
                      </div>

                      <div className="mb-2">
                        <div className="float-end">
                          <Link
                            // to="/forgot-password-change/:${username}``"
                            to="/forgot-password"
                            className="text-muted"
                            onClick={handleForgotPasswordClick}
                          >
                            Forgot password?
                          </Link>
                        </div>
                        <Label
                          className="form-label text-dark"
                          htmlFor="password-input "
                        >
                          Password
                        </Label>
                        <div className="position-relative auth-pass-inputgroup mb-2">
                          <Input
                            name="password"
                            value={validation.values.password || ""}
                            type={passwordShow ? "text" : "password"}
                            className="form-control pe-5"
                            placeholder="Enter Password"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            invalid={
                              validation.touched.password &&
                              validation.errors.password
                                ? true
                                : false
                            }
                          />
                          {validation.touched.password &&
                          validation.errors.password ? (
                            <FormFeedback type="invalid">
                              {validation.errors.password}
                            </FormFeedback>
                          ) : null}
                          <button
                            className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted"
                            type="button"
                            id="password-addon"
                            onClick={() => setPasswordShow(!passwordShow)}
                          >
                            <i className="ri-eye-fill align-middle"></i>
                          </button>
                        </div>
                      </div>

                      <div className="form-check mb-2 text-dark">
                        <Input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="auth-remember-check"
                        />
                        <Label
                          className="form-check-label"
                          htmlFor="auth-remember-check"
                        >
                          Remember me
                        </Label>
                      </div>
                      <div className=" mb-3">
                        <Button
                          disabled={error ? null : loading ? true : false}
                          color="success"
                          className="btn btn-success w-100"
                          type="submit"
                        >
                          {loading ? (
                            <Spinner size="sm" className="me-2">
                              Loading...
                            </Spinner>
                          ) : null}
                          Sign In
                        </Button>
                      </div>
                      <div className=" text-center text-dark">
                        Dont have an account?{" "}
                        <Link to={`/register`}>Register Here</Link>
                      </div>
                    </Form>
                  </div>
                </CardBody>
              </div>
            </Col>
          </Row>
        </Container>
      </ParticlesAuth>
    </React.Fragment>
  );
};

export default withRouter(Login);
