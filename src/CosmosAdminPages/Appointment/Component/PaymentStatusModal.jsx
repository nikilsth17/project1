import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";

const PaymentStatusModal = ({
  isOpen,
  toggle,
  status,
  onConfirm,
  totalAmount,
  paidAmount,
  setLoading,
  loading,
}) => {
  const formik = useFormik({
    initialValues: {
      // referenceNo: "",
      payment_type: "Cash",
      amount: "",
      remarks: "",
      discount_amount: 0,
      tip: 0,
    },
    validationSchema: Yup.object({
      // referenceNo: Yup.string().required("Refrence number is required"),
      amount: Yup.number().required("Payment amount is required"),
      remarks: Yup.string(),
    }),
    onSubmit: (values) => {
      onConfirm({
        // referenceNo: values.referenceNo,
        amount: values.amount,
        remarks: values.remarks,
        payment_type: values.payment_type,
        discount_amount: values.discount_amount,
        tip: values.tip,
      });
      toggle();
    },
  });

  useEffect(() => {
    if (!isOpen) {
      formik.resetForm(); // Reset all fields when modal is closed
    }
  }, [isOpen]); 

  const paymentOptions = [
    { value: "Cash", label: "Cash" },
    { value: "Card", label: "Card" },
  ];
  console.log("formik values", formik.values);
  return (
    <Modal isOpen={isOpen} toggle={toggle} backdrop="static">
      <ModalHeader toggle={toggle}>Payment Receive</ModalHeader>
      <form onSubmit={formik.handleSubmit}>
        <ModalBody>
          {/* <p>
          Are you sure you want to change the payment status to <strong>{status}</strong>?
        </p> */}

          {/* {status === "PAID" && ( */}
          {/* <FormGroup>
            <Label for="referenceNo">
              Reference No <span className="text-danger">*</span>
            </Label>
            <Input
              type="text"
              id="referenceNo"
              name="referenceNo"
              placeholder="Enter reference number"
              value={formik.values.referenceNo}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.referenceNo && formik.errors.referenceNo ? (
              <div className="text-danger">{formik.errors.referenceNo}</div>
            ) : null}
          </FormGroup> */}
          <FormGroup>
            <Label for="amount">
              Payment Amount <span className="text-danger">*</span>
            </Label>
            <Input
              type="number"
              id="amount"
              name="amount"
              placeholder="Enter payment amount"
              value={formik.values.amount}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              min={1}
              max={totalAmount - paidAmount}
            />
            {formik.touched.amount && formik.errors.amount ? (
              <div className="text-danger">{formik.errors.amount}</div>
            ) : null}
          </FormGroup>
          <FormGroup>
            <Label for="payment_type">
              Payment Type <span className="text-danger">*</span>
            </Label>
            <Input
              type="select"
              id="payment_type"
              name="payment_type"
              value={formik.values.payment_type}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              {/* Map paymentOptions to <option> elements */}
              {paymentOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Input>
            {formik.touched.payment_type && formik.errors.payment_type ? (
              <div className="text-danger">{formik.errors.payment_type}</div>
            ) : null}
          </FormGroup>
          <FormGroup>
            <Label for="discount_amount">Discount Amount</Label>
            <Input
              type="number"
              id="discount_amount"
              name="discount_amount"
              placeholder="Enter discount amount"
              value={formik.values.discount_amount}
              onChange={formik.handleChange}
            />

            {formik.touched.discount_amount && formik.errors.discount_amount ? (
              <div className="text-danger">{formik.errors.discount_amount}</div>
            ) : null}
          </FormGroup>
          <FormGroup>
            <Label for="tip">Tip</Label>
            <Input
              type="number"
              id="tip"
              name="tip"
              placeholder="Enter tip"
              value={formik.values.tip}
              onChange={formik.handleChange}
            />
            {formik.touched.tip && formik.errors.tip ? (
              <div className="text-danger">{formik.errors.tip}</div>
            ) : null}
          </FormGroup>
          <FormGroup>
            <Label for="remarks">Remarks</Label>
            <Input
              type="textarea"
              id="remarks"
              name="remarks"
              placeholder="Enter remarks"
              value={formik.values.remarks}
              onChange={formik.handleChange}
            />
          </FormGroup>
          {/* )} */}
        </ModalBody>
        <ModalFooter>
          <Button color="danger" type="button" onClick={toggle}>
            Cancel
          </Button>
          <Button
            color="success"
            type="submit"
            // onClick={formik.handleSubmit}
            disabled={loading || !formik.values.amount}
          >
            Confirm
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
};

export default PaymentStatusModal;
