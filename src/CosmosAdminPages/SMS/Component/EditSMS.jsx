import { useFormik } from "formik";
import React from "react";
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
  Form,
} from "reactstrap";
import * as Yup from "yup"; // For validation schema
import SmsService from "../../../services/SmsService/SmsService";
import toast from "react-hot-toast";

const EditSMS = ({ modal, toggleModal, data }) => {
  console.log("🚀 ~ EditSMS ~ data:", data);

  // Form validation schema

  // Formik setup
  const formik = useFormik({
    initialValues: {
      title: data?.description || "",
      code: data?.code || "",
      content_text: data?.content_text || "",
      placeholders: data?.placeholders || "",
    },
    enableReinitialize: true, // Ensures form is updated when 'data' changes

    // validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await SmsService.update(data.id, {
          content_text: values.content_text,
        });
        toast.success("Upated successfull.");
        toggleModal();
      } catch (error) {
        console.log(error);
      }
    },
  });

  return (
    <Modal isOpen={modal} toggle={toggleModal} backdrop="static" size="lg">
      <ModalHeader toggle={toggleModal}>Edit SMS</ModalHeader>
      <ModalBody>
        <Form onSubmit={formik.handleSubmit}>
          <Row>
            <Col lg={12} className="mb-2">
              <h6>Title: {formik.values.title}</h6>
            </Col>
            <Col lg={12} className="mb-3">
              <h6>Code: {formik.values.code}</h6>
            </Col>
            <Col lg={7} className="mb-3">
              <Label for="content_text">Context text</Label>
              <textarea
                class="form-control"
                name="content_text"
                placeholder="Context text"
                value={formik.values.content_text}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                rows="8"
                className={`form-control ${
                  formik.touched.content_text && formik.errors.content_text
                    ? "is-invalid"
                    : ""
                }`}
              />
            </Col>

            <Col lg={5} className="mb-3">
              <Label for="placeholders">Placeholders</Label>

              <textarea
                class="form-control"
                name="placeholders"
                placeholder="Placeholders"
                value={formik.values.placeholders}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                rows="8"
                className={`form-control ${
                  formik.touched.placeholders && formik.errors.placeholders
                    ? "is-invalid"
                    : ""
                }`}
                readOnly={true}
              />
            </Col>
          </Row>

          <ModalFooter>
            <Button color="danger" onClick={toggleModal} type="button">
              Cancel
            </Button>
            <Button color="success" type="submit">
              Save
            </Button>
          </ModalFooter>
        </Form>
      </ModalBody>
    </Modal>
  );
};
export default EditSMS;
