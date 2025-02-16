import React, { useState } from "react";
import { Col, Input, Label, Modal, ModalBody, ModalHeader, Row } from "reactstrap";
import Flatpickr from "react-flatpickr";
import { useFormik } from "formik";
import * as Yup from "yup";


const AvailableModal = ({
  availableModal,
  availableToggle,
  setSelectedNewDay,
  event,
}) => {
  // Initialize Formik for form handling
  const validation = useFormik({
    enableReinitialize: true, // Enables form values to reinitialize when `event` changes
    initialValues: {
      title: event?.title || "",
      location: event?.location || "",
      startTime: event?.start ? new Date(event.start) : null,
      endTime: event?.end ? new Date(event.end) : null,
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Please Enter Your Booking Name"),
      location: Yup.string().required("Please Enter a Location"),
      startTime: Yup.date().nullable().required("Please select a start time"),
      endTime: Yup.date().nullable().required("Please select an end time"),
    }),
    onSubmit: async (values) => {
      // Handle form submission (you can add your submit logic here)
      console.log("Form submitted with values: ", values);
    },
  });

  // Helper function for handling Flatpickr change
  const handleFlatpickrChange = (date, field) => {
    validation.setFieldValue(field, date[0]); // Sets the selected date in Formik's values
  };

  return (
    <Modal isOpen={availableModal} toggle={availableToggle}  backdrop="static">
      <ModalHeader toggle={availableToggle}>Available</ModalHeader>
      <ModalBody>
        <form onSubmit={validation.handleSubmit}>
          {/* Title Input */}
          <Row className="mb-3">
            <Col lg={1}>
              <Label htmlFor="titleInput" className="form-label">
                Title
              </Label>
            </Col>
            <Col lg={5}>
              <Input
                type="text"
                className="form-control"
                id="titleInput"
                placeholder="Enter the title"
                name="title" // Name should match formik's field
                value={validation.values.title} // Controlled by formik
                onChange={validation.handleChange} // Formik's handleChange
                onBlur={validation.handleBlur} // To trigger validation on blur
              />
              {/* Error message for Title */}
              {validation.touched.title && validation.errors.title ? (
                <div className="text-danger">{validation.errors.title}</div>
              ) : null}
            </Col>
          </Row>

          {/* Start Time Input */}
          <Row className="mb-3">
            <Col lg={1}>
              <Label htmlFor="startTime" className="form-label">
                Start Time
              </Label>
            </Col>
            <Col lg={5}>
              <Flatpickr
                id="startTime"
                className="form-control"
                value={validation.values.startTime} // Controlled by formik
                onChange={(date) => handleFlatpickrChange(date, "startTime")} // Update Formik on change
                options={{
                  enableTime: true,
                  dateFormat: "Y-m-d H:i",
                }}
              />
              {/* Error message for Start Time */}
              {validation.touched.startTime && validation.errors.startTime ? (
                <div className="text-danger">{validation.errors.startTime}</div>
              ) : null}
            </Col>
          </Row>

          {/* End Time Input */}
          <Row className="mb-3">
            <Col lg={1}>
              <Label htmlFor="endTime" className="form-label">
                End Time
              </Label>
            </Col>
            <Col lg={5}>
              <Flatpickr
                id="endTime"
                className="form-control"
                value={validation.values.endTime} // Controlled by formik
                onChange={(date) => handleFlatpickrChange(date, "endTime")} // Update Formik on change
                options={{
                  enableTime: true,
                  dateFormat: "Y-m-d H:i",
                }}
              />
              {/* Error message for End Time */}
              {validation.touched.endTime && validation.errors.endTime ? (
                <div className="text-danger">{validation.errors.endTime}</div>
              ) : null}
            </Col>
          </Row>

          {/* Submit Button */}
          <Row>
            <Col lg={{ size: 6, className: "text-end" }}>
              <button type="submit" className="btn btn-primary">
                Add
              </button>
            </Col>
          </Row>
        </form>
      </ModalBody>
    </Modal>
  );
};

export default AvailableModal;
