import React, { useState, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  Table,
  Button,
  ButtonGroup,
  Form,
  FormGroup,
  Label,
  Input,
  ButtonToggle,
  Spinner,
} from "reactstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { useFormik } from "formik";
import * as Yup from "yup";

import toast from "react-hot-toast";
import ConfigureSetingServices from "../../../services/AustServices/ConfigurationSettingSErvices/ConfigureSetingServices";

const ServiceExtraEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (id) {
      setIsEditing(true);
      ConfigureSetingServices.serviceview(id)
        .then((services) => {
          formik.setValues(services);
        })
        .catch((error) => console.error("Error fetching item:", error));
    } else {
      setIsEditing(false);
    }
  }, [id]);

  const formik = useFormik({
    initialValues: {
      signatureRate: 0,
      extraFuelChargeRate: 0,
      overSizeRate: 0,
      overWeightRate: 0,
      maxDeadWeight: 0,
      maxVolumetricWeight: 0,
      maxSize: 0,
      overSize: 0,
      overWeight: 0,
      additionalCharge: 0,
      applicableServiceTypeCodes: "",
    },
    onSubmit: async (values) => {
      try {
        if (id) {
          setIsSaving(true);
          const response = await ConfigureSetingServices.configureServiceUpdate(
            values,
            id
          );
          if (response) {
            toast.success("Service Setting Updated Successfully", {
              autoClose: 3000,
            });
            navigate("/service-setting");
          }
        } else {
          toast.error("Invalid ID. Please provide a valid ID.");
        }
        console.log("🚀 ~ onSubmit: ~ values:", values);
      } catch (error) {
        console.error("Error updating Service Setting:", error);
        toast.error("Failed to update Service Setting. Please try again.");
      }
      setIsSaving(false);
    },
  });

  const breadcrumbItems = [
    {
      title: "Back to List",
      link: "/service-setting",
    },
  ];

  const pageTitle = (() => {
    switch (id) {
      case "1":
        return "Aramex Field";
      case "2":
        return "AuPost Field";
      case "3":
        return "CourierPlease Field";
      default:
        return "";
    }
  })();
  const Title = (() => {
    switch (id) {
      case "1":
        return "Aramex ";
      case "2":
        return "AuPost ";
      case "3":
        return "CourierPlease ";
      default:
        return "";
    }
  })();

  return (
    <React.Fragment>
      <div className="page-content">
        <BreadCrumb
          title={Title}
          pageTitle={pageTitle}
          breadcrumbItems={breadcrumbItems}
        />
        <Container fluid>
          <Row>
            <Card>
              <CardBody>
                <Form onSubmit={formik.handleSubmit}>
                  <Row className="mb-2">
                    <Col sm={4}>
                      <Label for="extraFuelChargeRate">
                        Extra Fuel Charge Rate:
                      </Label>
                      <div className="input-group">
                        <Input
                          type="number"
                          id="extraFuelChargeRate"
                          name="extraFuelChargeRate"
                          value={formik.values.extraFuelChargeRate}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className={`form-control ${
                            formik.touched.extraFuelChargeRate &&
                            formik.errors.extraFuelChargeRate
                              ? "is-invalid"
                              : ""
                          }`}
                        />
                        <div className="input-group-append">
                          <span className="input-group-text">%</span>
                        </div>
                      </div>
                      {formik.touched.extraFuelChargeRate &&
                        formik.errors.extraFuelChargeRate && (
                          <div className="invalid-feedback">
                            {formik.errors.extraFuelChargeRate}
                          </div>
                        )}
                    </Col>

                    <Col sm={4}>
                      <Label for="overWeightRate">Over Weight Rate:</Label>
                      <div className="input-group">
                        <Input
                          type="number"
                          id="overWeightRate"
                          name="overWeightRate"
                          value={formik.values.overWeightRate}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className={`form-control ${
                            formik.touched.overWeightRate &&
                            formik.errors.overWeightRate
                              ? "is-invalid"
                              : ""
                          }`}
                        />
                        <div className="input-group-append">
                          <span className="input-group-text">AUD</span>
                        </div>
                      </div>
                      {formik.touched.overWeightRate &&
                        formik.errors.overWeightRate && (
                          <div className="invalid-feedback">
                            {formik.errors.overWeightRate}
                          </div>
                        )}
                    </Col>
                    <Col sm={4} className="mb-2">
                      <Label for="signatureRate">Signature Rate:</Label>
                      <div className="input-group">
                        <Input
                          type="number"
                          id="signatureRate"
                          name="signatureRate"
                          value={formik.values.signatureRate}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className={`form-control ${
                            formik.touched.signatureRate &&
                            formik.errors.signatureRate
                              ? "is-invalid"
                              : ""
                          }`}
                        />
                        <div className="input-group-append">
                          <span className="input-group-text">AUD</span>
                        </div>
                      </div>
                      {formik.touched.signatureRate &&
                        formik.errors.signatureRate && (
                          <div className="invalid-feedback">
                            {formik.errors.signatureRate}
                          </div>
                        )}
                    </Col>
                  </Row>
                  <Row className="mb-2">
                    <Col sm={4}>
                      <Label for="maxDeadWeight">Max Dead Weight:</Label>
                      <div className="input-group">
                        <Input
                          type="number"
                          id="maxDeadWeight"
                          name="maxDeadWeight"
                          value={formik.values.maxDeadWeight}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className={`form-control ${
                            formik.touched.maxDeadWeight &&
                            formik.errors.maxDeadWeight
                              ? "is-invalid"
                              : ""
                          }`}
                        />
                        <div className="input-group-append">
                          <span className="input-group-text">Kg</span>
                        </div>
                      </div>
                      {formik.touched.maxDeadWeight &&
                        formik.errors.maxDeadWeight && (
                          <div className="invalid-feedback">
                            {formik.errors.maxDeadWeight}
                          </div>
                        )}
                    </Col>

                    <Col sm={4}>
                      <Label for="maxVolumetricWeight">
                        Max Volumetric Weight :
                      </Label>
                      <div className="input-group">
                        <Input
                          type="number"
                          id="maxVolumetricWeight"
                          name="maxVolumetricWeight"
                          value={formik.values.maxVolumetricWeight}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className={`form-control ${
                            formik.touched.maxVolumetricWeight &&
                            formik.errors.maxVolumetricWeight
                              ? "is-invalid"
                              : ""
                          }`}
                        />
                        <div className="input-group-append">
                          <span className="input-group-text">Kg</span>
                        </div>
                      </div>
                      {formik.touched.maxVolumetricWeight &&
                        formik.errors.maxVolumetricWeight && (
                          <div className="invalid-feedback">
                            {formik.errors.maxVolumetricWeight}
                          </div>
                        )}
                    </Col>
                    <Col sm={4}>
                      <Label for="overWeight">Over Weight:</Label>
                      <div className="input-group">
                        <Input
                          type="number"
                          id="overWeight"
                          name="overWeight"
                          value={formik.values.overWeight}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className={`form-control ${
                            formik.touched.overWeight &&
                            formik.errors.overWeight
                              ? "is-invalid"
                              : ""
                          }`}
                        />
                        <div className="input-group-append">
                          <span className="input-group-text">Kg</span>
                        </div>
                      </div>
                      {formik.touched.overWeight &&
                        formik.errors.overWeight && (
                          <div className="invalid-feedback">
                            {formik.errors.overWeight}
                          </div>
                        )}
                    </Col>
                  </Row>
                  <Row className="mb-2">
                    <Col sm={4}>
                      <Label for="maxSize">Max Size :</Label>
                      <div className="input-group">
                        <Input
                          type="number"
                          id="maxSize"
                          name="maxSize"
                          value={formik.values.maxSize}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className={`form-control ${
                            formik.touched.maxSize && formik.errors.maxSize
                              ? "is-invalid"
                              : ""
                          }`}
                        />
                        <div className="input-group-append">
                          <span className="input-group-text">cm</span>
                        </div>
                      </div>
                      {formik.touched.maxSize && formik.errors.maxSize && (
                        <div className="invalid-feedback">
                          {formik.errors.maxSize}
                        </div>
                      )}
                    </Col>

                    <Col sm={4}>
                      <Label for="overSize">Over Size:</Label>
                      <div className="input-group">
                        <Input
                          type="number"
                          id="overSize"
                          name="overSize"
                          value={formik.values.overSize}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className={`form-control ${
                            formik.touched.overSize && formik.errors.overSize
                              ? "is-invalid"
                              : ""
                          }`}
                        />
                        <div className="input-group-append">
                          <span className="input-group-text">cm</span>
                        </div>
                      </div>
                      {formik.touched.overSize && formik.errors.overSize && (
                        <div className="invalid-feedback">
                          {formik.errors.overSize}
                        </div>
                      )}
                    </Col>
                    <Col sm={4} className="mb-2">
                      <Label for="overSizeRate">Over Size Rate:</Label>
                      <div className="input-group">
                        <Input
                          type="number"
                          id="overSizeRate"
                          name="overSizeRate"
                          value={formik.values.overSizeRate}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className={`form-control ${
                            formik.touched.overSizeRate &&
                            formik.errors.overSizeRate
                              ? "is-invalid"
                              : ""
                          }`}
                        />
                        <div className="input-group-append">
                          <span className="input-group-text">AUD</span>
                        </div>
                      </div>
                      {formik.touched.overSizeRate &&
                        formik.errors.overSizeRate && (
                          <div className="invalid-feedback">
                            {formik.errors.overSizeRate}
                          </div>
                        )}
                    </Col>

                    <Col sm={4} className="mb-2">
                      <Label for="additionalCharge">Additional Charge:</Label>
                      <div className="input-group">
                        <Input
                          type="number"
                          id="additionalCharge"
                          name="additionalCharge"
                          value={formik.values.additionalCharge}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className={`form-control ${
                            formik.touched.additionalCharge &&
                            formik.errors.additionalCharge
                              ? "is-invalid"
                              : ""
                          }`}
                        />
                        <div className="input-group-append">
                          <span className="input-group-text">AUD</span>
                        </div>
                      </div>

                      {formik.touched.additionalCharge &&
                        formik.errors.additionalCharge && (
                          <div className="invalid-feedback">
                            {formik.errors.additionalCharge}
                          </div>
                        )}
                    </Col>

                    <Col sm={4} className="mb-2">
                      <Label for="applicableServiceTypeCodes">
                        Applicable Service Type Codes:
                      </Label>

                      <Input
                        type="text"
                        id="applicableServiceTypeCodes"
                        name="applicableServiceTypeCodes"
                        value={formik.values.applicableServiceTypeCodes}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`form-control ${
                          formik.touched.applicableServiceTypeCodes &&
                          formik.errors.applicableServiceTypeCodes
                            ? "is-invalid"
                            : ""
                        }`}
                      />
                      {formik.touched.applicableServiceTypeCodes &&
                        formik.errors.applicableServiceTypeCodes && (
                          <div className="invalid-feedback">
                            {formik.errors.applicableServiceTypeCodes}
                          </div>
                        )}
                    </Col>
                  </Row>

                  <div className="text-end">
                    <Button
                      type="submit"
                      className="btn btn-primary me-2"
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <>
                          <Spinner size="sm" color="light" className="me-2" />{" "}
                          Saving...
                        </>
                      ) : (
                        "Save"
                      )}
                    </Button>
                    <Button
                      className="btn btn-danger me-2"
                      onClick={() => {
                        setIsCanceling(true);
                        setTimeout(() => {
                          navigate("/service-setting");
                          setIsCanceling(false);
                        }, 1000);
                      }}
                      disabled={isCanceling || isSaving}
                    >
                      {isCanceling ? (
                        <>
                          <Spinner size="sm" color="light" className="me-2" />{" "}
                          Canceling...
                        </>
                      ) : (
                        "Cancel"
                      )}
                    </Button>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default ServiceExtraEditor;
