import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import {
  Col,
  FormFeedback,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
  Spinner,
} from "reactstrap";
import * as Yup from "yup";
import {
  randomPassword,
  upper,
  lower,
  digits,
  symbols,
} from "secure-random-password";
import DriverServices from "../../../services/DriverServices/DriverServices";
import { values } from "lodash";
import toast from "react-hot-toast";

const DriverResetPassword = ({ isOpen, toggle, id }) => {
  const driverId = id;
  console.log("🚀 ~ DriverResetPassword ~ driverId:", driverId);
  const [passwordShow, setPasswordShow] = useState(false);
  const [confirmPasswordShow, setConfirmPasswordShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const generateNewPassword = () => {
    setLoading(true);
    const generatedPassword = randomPassword({
      length: 8,
      characters: [
        { characters: upper, exactly: 1 }, // Ensure at least 1 uppercase letter
        { characters: symbols, exactly: 1 }, // Ensure at least 1 symbol
        { characters: digits, exactly: 1 }, // Ensure at least 1 number (use `digits` instead of `numbers`)
        lower, // Fill the rest with lowercase characters
      ],
    });

    formik.setFieldValue("password", generatedPassword);
    formik.setFieldValue("password_confirmation", generatedPassword);

    // Add a slight delay before resetting loading state
    setTimeout(() => setLoading(false), 500);
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: driverId,
      password: "",
      password_confirmation: "",
    },
    validationSchema: Yup.object({
      password: Yup.string().required("Please Enter Your Password"),

      password_confirmation: Yup.string()
        .oneOf([Yup.ref("password")], "Confirm Password Doesn't Match")
        .required("Please Confirm Your Password"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await DriverServices.resetPasswordDriver(values);
        // console.log("🚀 ~ onSubmit: ~ response:", response);
        toast.success("Password is reset successfull.");
        toggle();
      } catch (error) {
        toast.error(error);
        console.log(error);
      }
    },
  });

  useEffect(() => {
    if (!isOpen) {
      formik.resetForm();
    }
  }, [isOpen]);
  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Reset Instructor Password</ModalHeader>
      <ModalBody>
        <form onSubmit={formik.handleSubmit}>
          <Row>
            <Col lg={12} md={12} xs={12} className="mb-3">
              <div className="form-floating">
                <Input
                  name="password"
                  value={formik.values.password || ""}
                  type={passwordShow ? "text" : "password"}
                  className="form-control pe-5"
                  placeholder="Enter New Password"
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
                <Label for="password">New Password</Label>
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

            <Col lg={12} md={12} xs={12} className="mb-3">
              <div className="form-floating">
                <Input
                  name="password_confirmation"
                  type={confirmPasswordShow ? "text" : "password"}
                  className="form-control pe-5"
                  placeholder="Confirm New Password"
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
                <Label for="floatingInput">Confirm New Password</Label>
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
            <Col lg={12} md={12} xs={12} className="mb-3">
              <button className="btn btn-dark" onClick={generateNewPassword}>
                {loading ? (
                  <>
                    <Spinner size="sm"></Spinner> <span> Generating</span>
                  </>
                ) : (
                  "Generate Password"
                )}
              </button>
            </Col>
          </Row>
          <div className="d-flex gap-2 align-content-end justify-content-end">
            <button type="button" className="btn btn-danger" onClick={toggle}>
              Cancel
            </button>
            <button type="submit" className="btn btn-success">
              Reset
            </button>
          </div>
        </form>
      </ModalBody>
    </Modal>
  );
};

export default DriverResetPassword;
