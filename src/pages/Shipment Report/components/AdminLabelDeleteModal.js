import React, { useState } from "react";
import {
  Button,
  Col,
  FormFeedback,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Spinner,
} from "reactstrap";
import toast from "react-hot-toast";
import * as Yup from "yup";
import { useFormik } from "formik";
import ShipmentServices from "../../../services/AustServices/ShipmentServices/ShipmentServices";

const AdminLabelDeleteModal = ({
  isOpen,
  toggleModal,
  shipmentId,
  fetchShipment,
}) => {
  const [loading, setLoading] = useState();
  const cancelShipment = async (values) => {
    try {
      setLoading(true);
      await ShipmentServices.cancelAdminShipment(shipmentId, formik.values);
      toast.success("Shipment cancel successfully!");
      setLoading(false);
      fetchShipment();
      toggleModal();
    } catch (error) {
      console.log("🚀 ~ cancelShipment ~ error:", error);
      toast.error("Something went wrong!");
      setLoading(false);
    }
  };

  const validationSchema = Yup.object({
    reason: Yup.string().required("Reason is required!"),
  });

  const formik = useFormik({
    initialValues: {
      reason: "",
    },
    onSubmit: (values) => {
      cancelShipment(values);
      formik.resetForm();
    },
    validationSchema,
  });
  return (
    <Modal isOpen={isOpen} toggle={toggleModal}>
      <ModalHeader
        // toggle={toggleModal}
        className="bg-secondary"
        style={{ height: "2.5rem" }}
      >
        {" "}
        <Row className="pb-4">
          <span className="text-white">Shipment Cancel</span>
        </Row>
      </ModalHeader>
      <ModalBody>
        <form onSubmit={formik.handleSubmit}>
          <Label className="p-0">
            Do you really want to cancel the Shipment?
          </Label>
          <FormGroup>
            <Label for="reason" className="mb-0">
              Reason<sup className="text-danger">*</sup>
            </Label>
            <Input
              type="text"
              name="reason"
              id="reason"
              placeholder="Enter reason"
              onChange={formik.handleChange}
              value={formik.values.reason}
              onBlur={formik.handleBlur}
              invalid={formik.touched.reason && formik.errors.reason}
            />
            {formik.touched.reason && formik.errors.reason && (
              <FormFeedback>{formik.errors.reason}</FormFeedback>
            )}
          </FormGroup>
          <ModalFooter>
            <Button color="primary" type="submit" disabled={loading}>
              {loading && <Spinner size={"sm"}>Loading...</Spinner>}{" "}
              {loading ? "Proceeding To Cancel..." : "Proceed To Cancel"}
            </Button>
            <Button color="light" onClick={toggleModal}>
              No
            </Button>
          </ModalFooter>
        </form>
      </ModalBody>
    </Modal>
  );
};

export default AdminLabelDeleteModal;
