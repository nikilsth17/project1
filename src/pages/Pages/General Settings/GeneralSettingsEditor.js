import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Form,
  Col,
  Container,
  FormGroup,
  Input,
  Label,
  Row,
} from "reactstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import GeneralSettingServices from "../../../services/AustServices/GeneralSettingsServices/GeneralSettingsServices";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
const GeneralSettingEditor = () => {
  const navigate = useNavigate();

  async function initialload() {
    try {
      const data = await GeneralSettingServices.getList();
      formik.setValues(data);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    initialload();
  }, []);

  const validationSchema = Yup.object().shape({
    tax: Yup.number()
      .required("Please enter a valid tax")
      .max(100, "Please enter a value less than 100"),

    sgrRate: Yup.number()
      .required("Please enter a valid code")
      .max(100, "Please enter a value less than 100"),

    intlParcelSenderName: Yup.string()
      .required("Please enter a valid name")
      .matches(/[a-zA-Z]/, "Please Enter Number Only"),
  });

  const formik = useFormik({
    initialValues: {
      tax: 0,
      sgrRate: 0,
      intlParcelSenderName: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        await GeneralSettingServices.update({ ...values });
        toast.success("General Settings Updated Successfully", {
          autoClose: 3000,
        });
        navigate("/general-settings");
      } catch (err) {
        console.log(err);
      }
    },
  });

  return (
    <React.Fragment>
      <div className="page-content">
        <BreadCrumb title="Available Categories" pageTitle="Category " />
        <Container fluid>
          <Row>
            <Card>
              <Form onSubmit={formik.handleSubmit}>
                <FormGroup row>
                  <Label for="tax" sm={2}>
                    Tax:
                  </Label>
                  <Col sm={4}>
                    <Input
                      type="number"
                      id="tax"
                      name="tax"
                      value={formik.values.tax}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`form-control ${
                        formik.touched.tax && formik.errors.tax
                          ? "is-invalid"
                          : ""
                      }`}
                    />
                    {formik.touched.tax && formik.errors.tax && (
                      <div className="invalid-feedback">
                        {formik.errors.tax}
                      </div>
                    )}
                  </Col>

                  <Label for="sgrRate" sm={2}>
                    SGR RAte:
                  </Label>
                  <Col sm={4}>
                    <Input
                      type="number"
                      id="sgrRate"
                      name="sgrRate"
                      value={formik.values.sgrRate}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`form-control ${
                        formik.touched.sgrRate && formik.errors.sgrRate
                          ? "is-invalid"
                          : ""
                      }`}
                    />
                    {formik.touched.sgrRate && formik.errors.sgrRate && (
                      <div className="invalid-feedback">
                        {formik.errors.sgrRate}
                      </div>
                    )}
                  </Col>

                  <Label for="intlParcelSenderName" sm={2}>
                    International Parcel Sender Name:
                  </Label>
                  <Col sm={4}>
                    <Input
                      type="text"
                      id="intlParcelSenderName"
                      name="intlParcelSenderName"
                      value={formik.values.intlParcelSenderName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`form-control ${
                        formik.touched.intlParcelSenderName &&
                        formik.errors.intlParcelSenderName
                          ? "is-invalid"
                          : ""
                      }`}
                    />
                    {formik.touched.intlParcelSenderName &&
                      formik.errors.intlParcelSenderName && (
                        <div className="invalid-feedback">
                          {formik.errors.intlParcelSenderName}
                        </div>
                      )}
                  </Col>
                </FormGroup>
                <div className="text-end">
                  <Button type="submit" className="btn btn-primary">
                    Save
                  </Button>
                </div>
              </Form>
            </Card>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};
export default GeneralSettingEditor;
