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
import { useFormik } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Dropzone from "react-dropzone";
import { Link } from "react-router-dom";
import axios from "axios";
import ItemServices from "../../services/DibyaServices/ItemServices/ItemServices";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import CategoryServices from "../../services/DibyaServices/CategoryServices/CategoryServices";
import SpecialOccasionServices from "../../services/DibyaServices/SpecialOccasionServices/SpecialOccasionServices";

const SpecialOccasionCreate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const token = localStorage.getItem("jwtToken");

  //   const validationSchema = Yup.object().shape({
  //     Name: Yup.string().required("Please enter a name"),
  //     StartDate: Yup.date().required("Please enter a start date"),
  //     EndDate: Yup.date().required("Please enter an end date"),
  //     description: Yup.string().required("Please enter a description"),
  //   });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedCategories = await CategoryServices.categoryList();
        setCategoryOptions(fetchedCategories);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchItemDetail = async () => {
      try {
        const response = await SpecialOccasionServices.viewspecial(id);
        console.log("🚀 ~ fetchRateCardDetail ~ response:", response);

        formik.setValues({
          Name: response.name,
          description: response.description,
          StartDate: response.startDate.split("T")[0],
          EndDate: response.endDate.split("T")[0],
          isActive: response.isActive,
        });

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
    fetchItemDetail();
  }, [id]);

  const formik = useFormik({
    initialValues: {
      Name: "",
      description: "",
      StartDate: "",
      EndDate: "",
      formfile: "",
      isActive: true,
    },

    // validationSchema,

    onSubmit: async (values) => {
      console.log("🚀 ~ onSubmit: ~ values:", values);
      try {
        setIsSaving(true);

        if (isEditing) {
          const response = await axios.put(`/specialoccasions/${id}`, values, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          });

          console.log("Edit response:", response);

          toast.success("Special occasion updated successfully", {
            autoClose: 3000,
          });
        } else {
          const response = await axios.post("/specialoccasions", values, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          });
          console.log("🚀 ~ onSubmit: ~ values:", values);
          console.log("Add response:", response);

          toast.success("Special occasion added successfully", {
            autoClose: 3000,
          });
        }

        navigate("/special-occasion/list");
      } catch (error) {
        console.error("Error:", error);
        toast.error("An error occurred. Please try again later.");
      } finally {
        setIsSaving(false);
      }
    },
  });

  const handleAcceptedFiles = (files) => {
    const formattedFiles = files.map((file) => ({
      name: file.name,
      path: file.path,
      preview: URL.createObjectURL(file),
    }));
    setSelectedFiles(formattedFiles);
    formik.setFieldValue("formfile", files[0]);
  };

  const handleFileRemove = (index) => {
    const files = [...selectedFiles];
    const removedFile = files.splice(index, 1)[0];
    setSelectedFiles(files);

    if (removedFile.name === formik.values.formfile) {
      formik.setFieldValue("formfile", "");
    }
    console.log("🚀 ~ handleFileRemove ~ formfile:", formfile);
  };

  const breadcrumbItems = [
    {
      title: "Back to List",
      link: "/special-occasion/list",
    },
  ];

  return (
    <Container fluid>
      <div className="page-content">
        <BreadCrumb
          title="Special Occasion Form"
          breadcrumbItems={breadcrumbItems}
          pageTitle="Special Occasion"
        />

        <form onSubmit={formik.handleSubmit}>
          <Card>
            <CardBody>
              <Row>
                <Col lg={4}>
                  <Dropzone onDrop={handleAcceptedFiles}>
                    {({ getRootProps, getInputProps }) => (
                      <div className="dropzone dz-clickable ">
                        <div
                          className="dz-message needsclick mb-2"
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
                        className=" mb-0  shadow-none border dz-processing dz-formfile-preview dz-success dz-complete"
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
                <Col lg={4}>
                  <FormGroup>
                    <Label htmlFor="Name" className="form-label mt-2">
                      Special Occasion Offer:
                    </Label>
                    <Input
                      type="text"
                      name="Name"
                      id="Name"
                      placeholder="Enter name"
                      value={formik.values.Name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.Name && formik.errors.Name && (
                      <div className="invalid-feedback">
                        {formik.errors.Name}
                      </div>
                    )}
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="StartDate" className="form-label mt-2">
                      StartDate:
                    </Label>
                    <input
                      type="date"
                      name="StartDate"
                      id="StartDate"
                      value={formik.values.StartDate}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="form-control"
                    />
                    {formik.touched.StartDate && formik.errors.StartDate && (
                      <div className="invalid-feedback">
                        {formik.errors.StartDate}
                      </div>
                    )}
                  </FormGroup>
                </Col>
                <Col lg={4}>
                  <FormGroup>
                    <Label htmlFor="description" className="form-label mt-2">
                      Description:
                    </Label>
                    <Input
                      type="text"
                      name="description"
                      id="description"
                      placeholder="Enter description"
                      value={formik.values.description}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.description &&
                      formik.errors.description && (
                        <div className="invalid-feedback">
                          {formik.errors.description}
                        </div>
                      )}
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="EndDate" className="form-label mt-2">
                      End Date:
                    </Label>
                    <input
                      type="date"
                      name="EndDate"
                      id="EndDate"
                      value={formik.values.EndDate}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="form-control"
                    />
                    {formik.touched.EndDate && formik.errors.EndDate && (
                      <div className="invalid-feedback">
                        {formik.errors.EndDate}
                      </div>
                    )}
                  </FormGroup>
                </Col>
              </Row>
              <div className="text-end mt-3">
                <Button
                  type="submit"
                  className="btn btn-primary"
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
                  onClick={() => {
                    setIsCanceling(true);
                    setTimeout(() => {
                      navigate("/special-occasion/list");
                      setIsCanceling(false);
                    }, 1000);
                  }}
                  className="btn btn-danger ms-2"
                  disabled={isCanceling || isSaving}
                >
                  {isCanceling ? (
                    <>
                      <Spinner size="sm" color="light" className="ms-2" />{" "}
                      Canceling...
                    </>
                  ) : (
                    "Cancel"
                  )}
                </Button>
              </div>
            </CardBody>
          </Card>
        </form>
      </div>
    </Container>
  );
};

export default SpecialOccasionCreate;
