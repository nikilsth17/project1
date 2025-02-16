import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Row, Col, Input, Label, Card, CardBody } from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import SettingService from "../../services/SettingService/SettingService";

const SettingPage = () => {
  const [data, setData] = useState();
  console.log("DataSetting", data);
  async function fetchData() {
    // setLoading(true);
    try {
      const response = await SettingService.get();
      setData(response.data);
    } catch (error) {
      console.error("Error fetching packages:", error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);


  const id= data?.id;
  console.log("id",id);

  const formik = useFormik({
    initialValues: {
      google_api_key: data?.google_api_key || '',
      stripe_public_key: data?.stripe_public_key || '',
      twilio_sid: data?.twilio_sid || '',
      twilio_phone_number: data?.twilio_phone_number || '',
      stripe_secret_key: data?.stripe_secret_key || '',
      twilio_auth_token: data?.twilio_auth_token || '',
    },
    validationSchema: Yup.object({
      google_api_key: Yup.string().required("Google API Key is required"),
      stripe_public_key: Yup.string().required("Stripe Public Key is required"),
      twilio_sid: Yup.string().required("Twilio SID is required"),
      twilio_phone_number: Yup.string().required(
        "Twilio Phone Number is required"
      ),
      stripe_secret_key: Yup.string().required("Stripe Secret Key is required"),
      twilio_auth_token: Yup.string().required("Twilio auth token is required"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await SettingService.update(`${id}`, {
          // Include the values to update
          ...values,
        });
        setData(response.data); // Update the state with the new data
      } catch (error) {
        console.log(values);
      }
    },
    enableReinitialize: true, // Allow Formik to reinitialize with new data
  });
  

  return (
    <div className="page-content">
      <div className="container-fluid">
        <BreadCrumb title="Settings" pageTitle="Settings" />
      </div>
      <Card>
        <CardBody className="p-3">
          <form onSubmit={formik.handleSubmit}>
            <Row>
              <Col lg={6} className="mb-3">
                <div className="form-floating">
                  <Input
                    type="text"
                    name="google_api_key"
                    placeholder="Google Api Key"
                    value={formik.values.google_api_key}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`form-control ${
                      formik.errors.google_api_key &&
                      formik.touched.google_api_key
                        ? "is-invalid"
                        : ""
                    }`}
                    style={{ padding: "0.5rem", height: "1rem" }}
                  />
                  <Label for="google_api_key">
                    Google Api Key <span className="text-danger">*</span>
                  </Label>
                  {formik.errors.google_api_key &&
                    formik.touched.google_api_key && (
                      <div className="invalid-feedback">
                        {formik.errors.google_api_key}
                      </div>
                    )}
                </div>
              </Col>
              <Col lg={6} className="mb-3">
                <div className="form-floating">
                  <Input
                    type="text"
                    name="stripe_public_key"
                    placeholder="Stripe Public Key"
                    value={formik.values.stripe_public_key}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`form-control ${
                      formik.errors.stripe_public_key &&
                      formik.touched.stripe_public_key
                        ? "is-invalid"
                        : ""
                    }`}
                    style={{ padding: "0.5rem", height: "1rem" }}
                  />
                  <Label for="stripe_public_key">
                    Stripe Public Key<span className="text-danger">*</span>
                  </Label>
                  {formik.errors.stripe_public_key &&
                    formik.touched.stripe_public_key && (
                      <div className="invalid-feedback">
                        {formik.errors.stripe_public_key}
                      </div>
                    )}
                </div>
              </Col>
              <Col lg={6} className="mb-3">
                <div className="form-floating">
                  <Input
                    type="text"
                    name="twilio_sid"
                    placeholder="Twitter SID"
                    value={formik.values.twilio_sid}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`form-control ${
                      formik.errors.twilio_sid && formik.touched.twilio_sid
                        ? "is-invalid"
                        : ""
                    }`}
                    style={{ padding: "0.5rem", height: "1rem" }}
                  />
                  <Label for="twilio_sid">
                    Twitter SID <span className="text-danger">*</span>
                  </Label>
                  {formik.errors.twilio_sid && formik.touched.twilio_sid && (
                    <div className="invalid-feedback">
                      {formik.errors.twilio_sid}
                    </div>
                  )}
                </div>
              </Col>
              <Col lg={6} className="mb-3">
                <div className="form-floating">
                  <Input
                    type="text"
                    name="twilio_phone_number"
                    placeholder="Twitter Registered Number"
                    value={formik.values.twilio_phone_number}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`form-control ${
                      formik.errors.twilio_phone_number &&
                      formik.touched.twilio_phone_number
                        ? "is-invalid"
                        : ""
                    }`}
                    style={{ padding: "0.5rem", height: "1rem" }}
                  />
                  <Label for="twilio_phone_number">
                    Twitter Registered Number{" "}
                    <span className="text-danger">*</span>
                  </Label>
                  {formik.errors.twilio_phone_number &&
                    formik.touched.twilio_phone_number && (
                      <div className="invalid-feedback">
                        {formik.errors.twilio_phone_number}
                      </div>
                    )}
                </div>
              </Col>
              <Col lg={6} className="mb-3">
                <div className="form-floating">
                  <Input
                    type="text"
                    name="stripe_secret_key"
                    placeholder="Stripe Secret Key"
                    value={formik.values.stripe_secret_key}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`form-control ${
                      formik.errors.stripe_secret_key &&
                      formik.touched.stripe_secret_key
                        ? "is-invalid"
                        : ""
                    }`}
                    style={{ padding: "0.5rem", height: "1rem" }}
                  />
                  <Label for="stripe_secret_key">
                    Stripe Secret Key <span className="text-danger">*</span>
                  </Label>
                  {formik.errors.stripe_secret_key &&
                    formik.touched.stripe_secret_key && (
                      <div className="invalid-feedback">
                        {formik.errors.stripe_secret_key}
                      </div>
                    )}
                </div>
              </Col>
              <Col lg={6} className="mb-3">
                <div className="form-floating">
                  <Input
                    type="text"
                    name="twilio_auth_token"
                    placeholder="Twilio Auth Token"
                    value={formik.values.twilio_auth_token}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`form-control ${
                      formik.errors.twilio_auth_token &&
                      formik.touched.twilio_auth_token
                        ? "is-invalid"
                        : ""
                    }`}
                    style={{ padding: "0.5rem", height: "1rem" }}
                  />
                  <Label for="twilio_auth_token">
                    Twilio Auth Token<span className="text-danger">*</span>
                  </Label>
                  {formik.errors.twilio_auth_token &&
                    formik.touched.twilio_auth_token && (
                      <div className="invalid-feedback">
                        {formik.errors.twilio_auth_token}
                      </div>
                    )}
                </div>
              </Col>
            </Row>

            {/* Add other fields similarly */}

            <button type="submit" className="btn btn-success">
              Save Changes
            </button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default SettingPage;
