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
  Table,
} from "reactstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import Select from "react-select";
// import QuickBookServices from "../../../../../services/QuickBookServices/QuickBookServices";
import toast from "react-hot-toast";

const PayModal = ({
  payOpen,
  toggle,
  invoice,
  creditCards,
  bankAccounts,
  fetchInvoice,
}) => {
  const [paymentType, setPaymentType] = useState("credit");
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState();
  const PayInvoiceValidation = Yup.object({
    name: Yup.string().required("Card Name is required!"),
    // number: Yup.string().required("Card Number is required"),
    // cardExpiry: Yup.string().required("Card Expirty Date is required"),
    // cvc: Yup.string().required("CVC number is required"),
  });
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const formik = useFormik({
    initialValues: {
      id: "",
    },
    onSubmit: async (values) => {
      console.log("values", values);
      try {
        setLoading(true);
        const response = await QuickBookServices.createCharge({
          invoiceId: invoice.id,
          cardId: values.id?.value,
        });
        fetchInvoice();
        toast.success("Payment has been completed successfully", {
          autoClose: 3000,
        });
        setLoading(false);
        toggle();
      } catch (error) {
        console.log("error", error);
        toast.error("An error has occured. Payment was not successfull!", {
          autoClose: 3000,
        });
        toggle();
        setLoading(false);
      }
    },
    // validationSchema: PayInvoiceValidation,
  });

  const creditCardOptions = creditCards?.map((card) => {
    return {
      label: card.customerName + " " + card.cardNumber,
      value: card.id,
    };
  });

  const bankOptions = bankAccounts.map((bankOption) => {
    return {
      label: bankOption.bankName + " " + bankOption.accountNumber,
      value: bankOption.id,
    };
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <ModalHeader
        className="bg-secondary"
        close={
          <h2 className="cursor-pointer" onClick={toggle}>
            <i className=" bx bx-x text-white " />
          </h2>
        }
      >
        <h5 className="text-white">Pay Invoice</h5>
      </ModalHeader>
      <ModalBody>
        <Row>
          <Table>
            <thead>
              <tr>
                <th>Invoice#</th>
                <th>Total Amount</th>
                <th>Due Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>62733</td>
                <td>${invoice?.totalAmount}</td>
                <td>${invoice?.totalAmount}</td>
              </tr>
              <tr>
                <td>Total</td>
                <td></td>
                <td>${invoice?.totalAmount}</td>
              </tr>
            </tbody>
          </Table>

          <Row>
            <Col
              xs={12}
              className=" mt-2 mb-1 bg-light"
              style={{ height: "25px" }}
            >
              <span style={{ fontSize: "16px", fontWeight: "500" }}>
                Payment Options
              </span>
            </Col>
            <Col xs={6}>
              <FormGroup check>
                <Input
                  name="paymentType"
                  type="radio"
                  onClick={() => {
                    setPaymentType("credit");
                    formik.resetForm();
                  }}
                  checked={paymentType === "credit"}
                />{" "}
                <Label check>Pay by credit card</Label>
              </FormGroup>{" "}
            </Col>
            <Col xs={6}>
              <FormGroup check>
                <Input
                  name="paymentType"
                  type="radio"
                  onClick={() => {
                    setPaymentType("debit");
                    formik.resetForm();
                  }}
                  checked={paymentType === "debit"}
                />{" "}
                <Label check> Pay through bank account</Label>
              </FormGroup>{" "}
            </Col>

            {paymentType === "credit" ? (
              <Col xs={12} className="mt-2">
                <Select
                  required
                  options={creditCardOptions}
                  name="id"
                  value={formik.values.id}
                  onChange={(e) => {
                    formik.setFieldValue("id", e);
                  }}
                />
              </Col>
            ) : (
              <Col xs={12} className="mt-2">
                <Select
                  required
                  options={bankOptions}
                  name="id"
                  value={formik.values.id}
                  onChange={(e) => {
                    formik.setFieldValue("id", e);
                  }}
                />
              </Col>
            )}
          </Row>
        </Row>
      </ModalBody>
      <ModalFooter>
        {loading && <Spinner color="primary" />}
        <Row className="justify-content-end">
          <Col xs={6}>
            <Button
              color="success"
              disabled={!formik.values.id || loading}
              type="submit"
            >
              {loading ? "Paying" : "Pay"}
            </Button>
          </Col>
          <Col xs={6}>
            <Button color="danger" onClick={toggle} disabled={loading}>
              Close
            </Button>
          </Col>
        </Row>
      </ModalFooter>
    </form>
  );
};

export default PayModal;
