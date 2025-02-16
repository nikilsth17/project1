import React, { useState, useEffect } from "react";
import {
  Col,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Label,
  Button,
} from "reactstrap";
import PackageTypeServices from "../../../services/Inventory Services/PackageTypeServices";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import PaymenttypeService from "../../../services/PackageType Service/PackagetypeService";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup"; // For validation schema


// Define validation schema using Yup
const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  gst_percent: Yup.number()
    .min(0, "GST percent must be greater than or equal to 0")
    .required("GST percent is required"),
  service_fee_percent: Yup.number()
    .min(0, "Service fee percent must be greater than or equal to 0")
    .required("Service fee percent is required"),
  service_fee_amount: Yup.number()
    .min(0, "Service fee amount must be greater than or equal to 0")
    .required("Service fee amount is required"),
});


const EditModal = ({ modal, toggleModal, editingPackage, savePackage }) => {
  // Initialize Formik with initial values, validation, and handleSubmit function
  return (
    <Modal isOpen={modal} toggle={toggleModal}  backdrop="static">
      <ModalHeader toggle={toggleModal}>Edit Payment Type</ModalHeader>
      <ModalBody>
        <Formik
          enableReinitialize
          initialValues={{
            title: editingPackage?.title || "",
            gst_percent: editingPackage?.gst_percent || "0",
            service_fee_percent: editingPackage?.service_fee_percent || "0",
            service_fee_amount: editingPackage?.service_fee_amount || "0",
          }}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              const payload = {
                title: values.title,
                gst_percent: values.gst_percent || 0,
                service_fee_percent: values.service_fee_percent || 0,
                service_fee_amount: values.service_fee_amount || 0,
                is_active: true,
              };

              console.log("Request Payload:", payload);

              // Call API to update package
              const response = await PaymenttypeService.update(editingPackage.id, payload);
              console.log("API Response:", response);

              savePackage(payload); // Update parent state with new package
              toggleModal(); // Close modal
              toast.success("Package updated successfully");
            } catch (error) {
              console.error("Error during package update:", error);
              toast.error("Error updating package: " + (error.message || "Unknown error"));
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ values, handleChange, errors, touched, isSubmitting }) => (
            <Form>
              <Row>
                <Col lg={6} className="mb-3">
                  <div className="form-floating">
                    <Input
                      type="text"
                      name="title"
                      placeholder="Title"
                      value={values.title}
                      onChange={handleChange}
                      className={`form-control ${touched.title && errors.title ? "is-invalid" : ""}`}
                    />
                    <Label for="title">Title</Label>
                    {touched.title && errors.title && <div className="text-danger">{errors.title}</div>}
                  </div>
                </Col>
                <Col lg={6} className="mb-3">
                  <div className="form-floating">
                    <Input
                      type="number"
                      name="gst_percent"
                      placeholder="GST Percent"
                      value={values.gst_percent}
                      onChange={handleChange}
                      className={`form-control ${touched.gst_percent && errors.gst_percent ? "is-invalid" : ""}`}
                    />
                    <Label for="gst_percent">GST Percent</Label>
                    {touched.gst_percent && errors.gst_percent && <div className="text-danger">{errors.gst_percent}</div>}
                  </div>
                </Col>
                <Col lg={6} className="mb-3">
                  <div className="form-floating">
                    <Input
                      type="number"
                      name="service_fee_percent"
                      placeholder="Service Fee Percent"
                      value={values.service_fee_percent}
                      onChange={handleChange}
                      className={`form-control ${touched.service_fee_percent && errors.service_fee_percent ? "is-invalid" : ""}`}
                    />
                    <Label for="service_fee_percent">Service Fee Percent</Label>
                    {touched.service_fee_percent && errors.service_fee_percent && <div className="text-danger">{errors.service_fee_percent}</div>}
                  </div>
                </Col>
                <Col lg={6} className="mb-3">
                  <div className="form-floating">
                    <Input
                      type="number"
                      name="service_fee_amount"
                      placeholder="Service Fee Amount"
                      value={values.service_fee_amount}
                      onChange={handleChange}
                      className={`form-control ${touched.service_fee_amount && errors.service_fee_amount ? "is-invalid" : ""}`}
                    />
                    <Label for="service_fee_amount">Service Fee Amount</Label>
                    {touched.service_fee_amount && errors.service_fee_amount && <div className="text-danger">{errors.service_fee_amount}</div>}
                  </div>
                </Col>
              </Row>
              <ModalFooter>
                <Button color="danger" onClick={toggleModal}>Cancel</Button>
                <Button color="success" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save"}
                </Button>
              </ModalFooter>
            </Form>
          )}
        </Formik>
      </ModalBody>
    </Modal>
  );
};

export default EditModal;
