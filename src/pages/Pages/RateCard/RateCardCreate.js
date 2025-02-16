import React, { useState } from "react";
import {
  Col,
  Row,
  Button,
  Card,
  CardBody,
  FormGroup,
  Label,
  Input,
  Container,
  Spinner,
} from "reactstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Dropzone from "react-dropzone";
import { Link } from "react-router-dom";
import RatecardServices from "../../../services/AustServices/RateCardServices";
import axios from "axios";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
const RateCardCreate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const token = localStorage.getItem("jwtToken");

  const intlOptions = [
    { value: 1, label: "Australia Post" },
    // Add more options as needed
  ];

  const domesticOptions = [
    { value: 0, label: "Dummy" },
    { value: 1, label: "Aramex" },
    { value: 2, label: "Courier Please" },
    // Add more options as needed
  ];

  const validationSchema = Yup.object().shape({
    DomesticServiceProvider: Yup.string().required(
      "Please select domestic service provider"
    ),
    IntlServiceProvider: Yup.string(),
    Signature: Yup.boolean().required("Please select if Signature is required"),
    // formFile: Yup.string().required("Please provide a file"),
  });

  const formik = useFormik({
    initialValues: {
      DomesticServiceProvider: "",
      IntlServiceProvider: "",
      Signature: false,
      formFile: "",
    },
    // validationSchema: validationSchema,
    onSubmit: async (values) => {
      if (isEditing) {
        //
      } else {
        try {
          setIsSaving(true);
          console.log("🚀 ~ onSubmit: ~ values:", values);
          const response = await axios.post("/ratecard", values, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          });
          console.log("🚀 ~ onSubmit: ~ response:", response);
          toast.success("Rate Card Added Successfully", {
            autoClose: 3000,
          });
          navigate("/ratecard-list");
        } catch (error) {
          console.log("🚀 ~ onSubmit: ~ error:", error);
        }
      }
      setIsSaving(false);
    },
  });

  const handleAcceptedFiles = (files) => {
    const formattedFiles = files.map((file) => ({
      name: file.name,
      path: file.path,
      preview: URL.createObjectURL(file),
    }));
    setSelectedFiles(formattedFiles);
    formik.setFieldValue("formFile", files[0]);
  };

  const handleFileRemove = (index) => {
    const files = [...selectedFiles];
    const removedFile = files.splice(index, 1)[0];
    setSelectedFiles(files);

    if (removedFile.name === formik.values.formFile) {
      formik.setFieldValue("formFile", "");
    }
  };
  const breadcrumbItems = [{ title: "Back To List ", link: "/ratecard-list" }];

  return (
    <Container fluid>
      <div className="page-content">
        <BreadCrumb
          title="Rate Card Field"
          pageTitle="Rate Card"
          breadcrumbItems={breadcrumbItems}
        />
        <Row>
          <Col>
            <Card className="pt-1">
              <CardBody>
                <Row>
                  <Col lg={8}>
                    <Row>
                      <Col lg={12}>
                        <Dropzone onDrop={handleAcceptedFiles}>
                          {({ getRootProps, getInputProps }) => (
                            <div className="dropzone dz-clickable pt-4">
                              <div
                                className="dz-message needsclick mb-5 p-3"
                                {...getRootProps()}
                              >
                                <input {...getInputProps()} />
                                <i className=" align-item-center display-4 text-muted ri-upload-cloud-2-fill" />
                                <h4 className="fs-15 fw-semi-bold pt-3">
                                  Drop files here or{" "}
                                  <Link to="#">click to upload.</Link>
                                </h4>
                                <h4 className="fs-14 text-muted ">
                                  Max Upload Size 10MB.
                                </h4>
                              </div>
                            </div>
                          )}
                        </Dropzone>
                        <div className="list-unstyled mb-0" id="file-previews">
                          {selectedFiles.map((f, i) => (
                            <Card
                              className=" mb-0  shadow-none border dz-processing dz-image-preview dz-success dz-complete"
                              key={i + "-file"}
                            >
                              <div>
                                <Row className="align-items-center">
                                  <Col className="col-auto">
                                    <img
                                      data-dz-thumbnail=""
                                      height="100"
                                      className="avatar-sm rounded bg-light"
                                      alt={f.name}
                                      src={f.preview}
                                    />
                                  </Col>
                                  <Col>
                                    <Link
                                      to="#"
                                      className="text-muted font-weight-bold"
                                    >
                                      {f.name}
                                    </Link>
                                    <p className="mb-0">
                                      <strong>{f.formattedSize}</strong>
                                    </p>
                                  </Col>
                                  <Col lg={2}>
                                    <Link onClick={() => handleFileRemove(i)}>
                                      <h3>
                                        <i className="ri-delete-bin-2-line text-danger"></i>
                                      </h3>
                                    </Link>
                                  </Col>
                                </Row>
                              </div>
                            </Card>
                          ))}
                        </div>
                      </Col>
                    </Row>
                  </Col>
                  <Col lg={4}>
                    <form onSubmit={formik.handleSubmit}>
                      <div className="mb-3">
                        <Label
                          htmlFor="DomesticServiceProvider"
                          className="form-label"
                        >
                          Domestic Service Provider:
                        </Label>
                        <Select
                          name="DomesticServiceProvider"
                          isClearable
                          id="DomesticServiceProvider"
                          value={domesticOptions.find(
                            (option) =>
                              option.value ===
                              formik.values.DomesticServiceProvider
                          )}
                          onChange={(selectedOption) =>
                            formik.setFieldValue(
                              "DomesticServiceProvider",
                              selectedOption?.value
                            )
                          }
                          options={domesticOptions}
                        />
                        {formik.touched.DomesticServiceProvider &&
                          formik.errors.DomesticServiceProvider && (
                            <div className="invalid-feedback">
                              {formik.errors.DomesticServiceProvider}
                            </div>
                          )}
                      </div>
                      <div className="mb-3">
                        <Label
                          htmlFor="IntlServiceProvider"
                          className="form-label"
                        >
                          International Service Provider:
                        </Label>
                        <Select
                          name="IntlServiceProvider"
                          id="IntlServiceProvider"
                          isClearable
                          value={intlOptions.find(
                            (option) =>
                              option.value === formik.values.IntlServiceProvider
                          )}
                          onChange={(selectedOption) =>
                            formik.setFieldValue(
                              "IntlServiceProvider",
                              selectedOption?.value
                            )
                          }
                          options={intlOptions}
                        />
                        {formik.touched.IntlServiceProvider &&
                          formik.errors.IntlServiceProvider && (
                            <div className="invalid-feedback">
                              {formik.errors.IntlServiceProvider}
                            </div>
                          )}
                      </div>

                      {/* <div className="mb-3">
                        <Label htmlFor="formFile" className="form-label">
                          Upload File
                        </Label>
                        <Input
                          type="text"
                          name="formFile"
                          id="formFile"
                          value={formik.values.formFile}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          readOnly
                        />
                        {formik.touched.formFile && formik.errors.formFile && (
                          <div className="invalid-feedback">
                            {formik.errors.formFile}
                          </div>
                        )}
                      </div> */}
                      <div className="mb-3">
                        <Label htmlFor="Signature" className="form-label">
                          Signature Status
                        </Label>
                        <FormGroup check>
                          <Label check>
                            <Input
                              type="radio"
                              name="Signature"
                              value={true}
                              checked={formik.values.Signature === true}
                              onChange={() =>
                                formik.setFieldValue("Signature", true)
                              }
                            />
                            Active
                          </Label>
                        </FormGroup>
                        <FormGroup check>
                          <Label check>
                            <Input
                              type="radio"
                              name="Signature"
                              value={false}
                              checked={formik.values.Signature === false}
                              onChange={() =>
                                formik.setFieldValue("Signature", false)
                              }
                            />
                            Inactive
                          </Label>
                        </FormGroup>
                        {formik.touched.Signature &&
                          formik.errors.Signature && (
                            <div className="invalid-feedback">
                              {formik.errors.Signature}
                            </div>
                          )}
                      </div>

                      <div className="text-end">
                        <Button
                          type="submit"
                          className="btn btn-primary"
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
                              navigate("/ratecard-list");
                              setIsCanceling(false);
                            }, 1000);
                          }}
                          className="btn btn-danger ms-2"
                          disabled={isCanceling || isSaving}
                        >
                          {isCanceling ? (
                            <>
                              <Spinner
                                size="sm"
                                color="light"
                                className="ms-2"
                              />{" "}
                              Canceling...
                            </>
                          ) : (
                            "Cancel"
                          )}
                        </Button>
                      </div>
                    </form>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </Container>
  );
};

export default RateCardCreate;
