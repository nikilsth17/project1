import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Table,
} from "reactstrap";
import { Link } from "react-router-dom";
import QuickFacts from "./components/QuickFacts";
import Details from "./components/Details";
import { useParams } from "react-router-dom";
import WantTo from "./components/WantTo/WantTo";
import toast from "react-hot-toast";
import QuickBookServices from "../../../services/QuickBookServices/QuickBookServices";
import InvoiceServices from "../../../services/AustServices/InvoiceServices/InvoiceServices";
import BreadCrumb from "../../../Components/Common/BreadCrumb";

const InvoiceDetails = () => {
  const { id } = useParams();
  const [invoice, setInvoice] = useState();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);
  let t = 0;

  const fetchInvoice = async () => {
    try {
      const response = await InvoiceServices.getSingleInvoice(id);
      setInvoice(response);
    } catch (error) {
      console.log(
        "🚀 ~ file: InvoiceDetails.js:36 ~ fetchInvoice ~ error:",
        error
      );
    }
  };

  useEffect(() => {
    fetchInvoice();
  }, []);

  const reCreateInoice = async () => {
    try {
      setLoading(true);
      const response = await QuickBookServices.recreateInvoice(id);
      setLoading(false);
      fetchInvoice();
      toast.success("Invoice has been recreated successfully!", {
        autoClose: 3000,
      });
    } catch (error) {
      console.log("🚀 ~ reCreateInoice ~ error:", error);
      setLoading(false);
    }
  };

  const breadcrumbItems = [
    { title: "Invoices Details", link: "/invoice-report" },
  ];

  return (
    <div className="page-content">
      <BreadCrumb
        title="Shipment Detail Page"
        pageTitle="Shipment Report"
        breadcrumbItems={breadcrumbItems}
      />
      <Container>
        {/* <Row className="mt-4 p-1">
          <Breadcrumbs items={breadcrumbItems1} />
        </Row> */}
        {invoice?.canReCreate && (
          <Col xs={6}>
            <Button
              outline
              className="mb-2"
              onClick={reCreateInoice}
              disabled={loading}
            >
              {loading ? "Recreating Invoice" : "Re-create Invoice"}
            </Button>
          </Col>
        )}

        {/* <Row>
          <Col lg={6}>
            <h4>Invoice#{invoice?.refNo}</h4>
          </Col>

          <Col lg={7}>
            <QuickFacts invoice={invoice} />
          </Col>
          <Col lg={5}>
            <WantTo invoice={invoice} fetchInvoice={fetchInvoice} />
          </Col>
        </Row> */}

        <Row className="mt-3">
          {/* <h4>Invoice Details</h4> */}
          <Col xs={12}>
            <Details invoice={invoice} />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default InvoiceDetails;
