import React, { useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  FormGroup,
  Input,
  Label,
  Row,
  Spinner,
  Table,
} from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import axios from "axios";
import toast from "react-hot-toast";
import Dropzone from "react-dropzone";
import BreadCrumb from "../../../Components/Common/BreadCrumb";

const ComboAdd = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const token = localStorage.getItem("jwtToken");

  const formik = useFormik({
    initialValues: {
      Name: "",
      Description: "",
      ComboPrice: "",
      formFile: "",
      Items: [],
    },
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const formData = new FormData();
        formData.append("Name", values.Name);
        formData.append("Description", values.Description);
        formData.append("ComboPrice", values.ComboPrice);
        selectedFiles.forEach((file) => {
          formData.append("formFile", file);
        });
        formData.append("isActive", true);
        formData.append("Items", JSON.stringify(values.Items));

        const response = await axios.post("/combo", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });

        navigate("/combo-list");
        toast.success("Combo added successfully!", {
          autoClose: 3000,
        });
        formik.resetForm();
      } catch (error) {
        console.log("Error:", error);
        toast.error("Error adding combo. Please try again later.");
      }
      setLoading(false);
    },
  });

  const handleAddItem = () => {
    formik.setValues({
      ...formik.values,
      Items: [...formik.values.Items, { itemId: "", quantity: 0 }],
    });
  };

  const handleRemoveItem = (index) => {
    const updatedItems = [...formik.values.Items];
    updatedItems.splice(index, 1);
    formik.setFieldValue("Items", updatedItems);
  };

  const handleAcceptedFiles = (files) => {
    setSelectedFiles(files);
    formik.setFieldValue("formFile", files);
  };

  const handleFileRemove = (index) => {
    const files = [...selectedFiles];
    files.splice(index, 1);
    setSelectedFiles(files);
  };

  const breadcrumbItems = [
    {
      title: "Back to List",
      link: "/combo-list",
    },
  ];

  return (
    <div className="page-content">
      <BreadCrumb
        title="Combo Form"
        breadcrumbItems={breadcrumbItems}
        pageTitle="Combo"
      />
      <Container fluid>
        <Card className="p-2">
          <Row className="mt-2 justify-content-end"></Row>
          <form onSubmit={formik.handleSubmit}>
            <Row>
              <FormGroup row>
                <Label for="Name" className="text-black" sm={2}>
                  Combo :
                </Label>
                <Col sm={4}>
                  <Input
                    id="Name"
                    name="Name"
                    value={formik.values.Name}
                    onChange={formik.handleChange}
                  />
                </Col>
                <Label for="ComboPrice" className="text-black" sm={2}>
                  Price:
                </Label>
                <Col sm={4}>
                  <Input
                    id="ComboPrice"
                    name="ComboPrice"
                    value={formik.values.ComboPrice}
                    onChange={formik.handleChange}
                  />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Label for="Description" className="text-black" sm={2}>
                  Description:
                </Label>
                <Col sm={4}>
                  <Input
                    id="Description"
                    type="textarea"
                    name="Description"
                    value={formik.values.Description}
                    onChange={formik.handleChange}
                  />
                </Col>

                <Label for="ComboPrice" className="text-black" sm={2}>
                  Add Image
                </Label>
                <Col sm={4}>
                  <Dropzone onDrop={handleAcceptedFiles}>
                    {({ getRootProps, getInputProps }) => (
                      <div className="dropzone dz-clickable">
                        <div
                          className="dz-message needsclick mb-2"
                          {...getRootProps()}
                        >
                          <input {...getInputProps()} />
                          <i className="align-item-center display-4 text-muted ri-upload-cloud-2-fill" />
                          <h4 className="fs-15 fw-semi-bold pt-3">
                            Drop files here or{" "}
                            <Link to="#">click to upload.</Link>
                          </h4>
                          <h4 className="fs-14 text-muted">
                            Max Upload Size 10MB.
                          </h4>
                        </div>
                      </div>
                    )}
                  </Dropzone>
                  <div className="list-unstyled mb-0" id="file-previews">
                    {selectedFiles.map((file, index) => (
                      <Card
                        className="mb-0 shadow-none border dz-processing dz-formfile-preview dz-success dz-complete"
                        key={index}
                      >
                        <div>
                          <Row className="align-items-center">
                            <Col className="col-auto">
                              <img
                                data-dz-thumbnail=""
                                height="100"
                                className="avatar-sm rounded bg-light"
                                alt={file.name}
                                src={URL.createObjectURL(file)}
                              />
                            </Col>
                            <Col>
                              <Link
                                to="#"
                                className="text-muted font-weight-bold"
                              >
                                {file.name}
                              </Link>
                              <p className="mb-0">
                                <strong>{file.size}</strong>
                              </p>
                            </Col>
                            <Col lg={2}>
                              <Link onClick={() => handleFileRemove(index)}>
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
              </FormGroup>
            </Row>

            <Row>
              <Col xs={12} md={12} lg={12}>
                <Table bordered>
                  <thead>
                    <tr>
                      <th>S.N</th>
                      <th className="text-black">Item Name</th>
                      <th className="text-black">Item Quantity</th>
                      <th className="text-black">
                        Action{" "}
                        <Button
                          color="primary"
                          size="sm"
                          className=" bx bx-plus-medical ms-auto text-end"
                          onClick={() => handleAddItem()}
                        ></Button>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {formik.values.Items.map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>
                          <Input
                            name={`Items[${index}].itemId`}
                            value={item.itemId}
                            onChange={formik.handleChange}
                          />
                        </td>
                        <td>
                          <Input
                            name={`Items[${index}].quantity`}
                            type="number"
                            value={item.quantity}
                            onChange={formik.handleChange}
                          />
                        </td>
                        <td>
                          <Button
                            color="danger"
                            size="sm"
                            className="bx bx-minus"
                            onClick={() => handleRemoveItem(index)}
                          ></Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Col>
            </Row>

            <Row className="justify-content-end">
              <Col className="text-end">
                <Button
                  type="submit"
                  color="secondary"
                  className="mb-4 me-2"
                  disabled={loading}
                >
                  {loading && (
                    <Spinner size="sm" className="me-2">
                      Loading...
                    </Spinner>
                  )}
                  {loading ? "Saving..." : "Save"}
                </Button>
                <Button
                  color="danger"
                  className="mb-4"
                  onClick={() => navigate("/combo-list")}
                >
                  Cancel
                </Button>
              </Col>
            </Row>
          </form>
        </Card>
      </Container>
    </div>
  );
};

export default ComboAdd;
