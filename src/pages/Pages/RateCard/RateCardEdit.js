import React, { useEffect, useState } from "react";
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
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { useFormik } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Dropzone from "react-dropzone";
import { Link } from "react-router-dom";
import RatecardServices from "../../../services/AustServices/RateCardServices";
import axios from "axios";

const convertBase64IntoFile = (base64String) => {
  //   const fileName = "rateCard.jpg";
  //   const fileSize = base64String.length; // This is approximate and may not be the exact file size
  //   const mimeType = "image/jpeg";
  //   const lastModified = new Date().getTime(); // You can set the last modified time as needed

  //   const fileObject = {
  //     path: fileName,
  //     lastModified: lastModified,
  //     lastModifiedDate: new Date(lastModified),
  //     name: fileName,
  //     size: fileSize,
  //     type: mimeType,
  //     webkitRelativePath: "",
  //   };

  const byteCharacters = atob(base64String);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: "image/jpeg" });

  // Create a File object from Blob
  const file = new File([blob], "avatar-4.jpg", { type: "image/jpeg" });

  //   console.log(file);

  return file;
};

const RateCardEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  // const [rateCardId, setRateCardId] = useState(null);
  const token = localStorage.getItem("jwtToken");

  const intlOptions = [
    { value: 1, label: "AUPost" },
    // Add more options as needed
  ];

  const domesticOptions = [
    { value: 0, label: "Dummy" },
    { value: 1, label: "Aramex" },
    { value: 2, label: "CourierPlease" },
    // Add more options as needed
  ];

  const validationSchema = Yup.object().shape({
    // DomesticServiceProvider: Yup.string().required(
    //   "Please select domestic service provider"
    // ),
    // IntlServiceProvider: Yup.string(),
    // Signature: Yup.boolean().required("Please select if Signature is required"),
    // formFile: Yup.string().required("Please provide a file"),
  });

  const formik = useFormik({
    initialValues: {
      DomesticServiceProvider: "",
      IntlServiceProvider: "",
      Signature: false,
      formFile: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        setIsSaving(true);
        console.log("🚀 ~ onSubmit: ~ values:", values);
        const formattedValues = {
          DomesticServiceProvider: values.DomesticServiceProvider?.value,
          IntlServiceProvider: values.IntlServiceProvider?.value,
          Signature: values.Signature,
          formFile: values.formFile,
        };
        const response = await axios.put(`/ratecard/${id}`, formattedValues, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("🚀 ~ onSubmit: ~ response:", response);
        toast.success("Rate Card Updated Successfully", {
          autoClose: 3000,
        });
        navigate("/ratecard-list");
      } catch (error) {
        console.log("🚀 ~ onSubmit: ~ error:", error);
        setIsSaving(false);
      }
    },
  });

  console.log("Formik valuesss", formik.values);

  useEffect(() => {
    const fetchRateCardDetail = async () => {
      try {
        const response = await RatecardServices.view(id);
        console.log("🚀 ~ fetchRateCardDetail ~ response:", response);
        const domesticServiceProvider = domesticOptions.filter(
          (option) => option.label === response.domesticServiceProvider
        );
        formik.setFieldValue(
          "DomesticServiceProvider",
          domesticServiceProvider[0]
        );

        const intlServiceProvider = intlOptions.filter(
          (option) => option.label === response.intlServiceProvider
        );
        formik.setFieldValue("IntlServiceProvider", intlServiceProvider[0]);

        formik.setFieldValue("Signature", response.signature);

        const imageUrl = `data:image/png;base64,${response.image}`;

        const formFile = convertBase64IntoFile(response.image);
        console.log("🚀 ~ fetchRateCardDetail ~ formFile:", formFile);
        const formattedFiles = {
          name: formFile.name,
          path: formFile.path,
          preview: imageUrl,
        };
        setSelectedFiles(formattedFiles);
        formik.setFieldValue("formFile", formFile);
        console.log("🚀 ~ fetchRateCardDetail ~ formFile:", formFile);
      } catch (error) {
        console.log("🚀 ~ fetchRateCardDetail ~ error:", error);
      }
    };
    fetchRateCardDetail();
  }, [id]);

  const handleAcceptedFiles = (files) => {
    console.log("🚀 ~ handleAcceptedFiles ~ files:", files);
    const formattedFiles = files.map((file) => ({
      name: file.name,
      path: file.path,
      preview: URL.createObjectURL(file),
    }));
    setSelectedFiles(formattedFiles);
    formik.setFieldValue("formFile", files[0]);
  };

  const handleFileRemove = () => {
    // const files = [...selectedFiles];
    // const removedFile = files.splice(index, 1)[0];
    setSelectedFiles(null);

    // if (removedFile.name === formik.values.formFile) {
    formik.setFieldValue("formFile", "");
    // }
  };

  const breadcrumbItems = [{ title: "Back To List ", link: "/ratecard-list" }];
  console.log("formik vlaues", formik.values);

  return (
    <Container fluid>
      <div className="page-content">
        <BreadCrumb
          title="Rate Card Field"
          pageTitle="Rate Card"
          breadcrumbItems={breadcrumbItems}
        />
        <Row className="">
          <Col>
            <Card className="pt-1 h-100">
              <CardBody>
                <Row>
                  <Col lg={8}>
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
                      {/* {selectedFiles.map((f, i) => ( */}
                      {selectedFiles && (
                        <Card
                          className=" mb-0  shadow-none border dz-processing dz-image-preview dz-success dz-complete"
                          key={"-file"}
                        >
                          <div>
                            <Row className="align-items-center">
                              <Col>
                                <img
                                  data-dz-thumbnail=""
                                  height="100"
                                  className="avatar-sm rounded bg-light"
                                  alt={selectedFiles.name}
                                  src={selectedFiles.preview}
                                />
                              </Col>
                              <Col>
                                <Link
                                  to="#"
                                  className="text-muted font-weight-bold"
                                >
                                  {selectedFiles.name}
                                </Link>
                                <p className="mb-0">
                                  <strong>{selectedFiles.formattedSize}</strong>
                                </p>
                              </Col>
                              <Col lg={2}>
                                <Link onClick={() => handleFileRemove()}>
                                  <h3>
                                    <i className="ri-delete-bin-2-line text-danger"></i>
                                  </h3>
                                </Link>
                              </Col>
                            </Row>
                          </div>
                        </Card>
                      )}
                      {/* ))} */}
                    </div>
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
                          id="DomesticServiceProvider"
                          isClearable
                          value={formik.values.DomesticServiceProvider}
                          onChange={(selectedOption) =>
                            formik.setFieldValue(
                              "DomesticServiceProvider",
                              selectedOption
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
                          value={formik.values.IntlServiceProvider}
                          onChange={(selectedOption) =>
                            formik.setFieldValue(
                              "IntlServiceProvider",
                              selectedOption
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
                                className="me-2"
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

export default RateCardEdit;
