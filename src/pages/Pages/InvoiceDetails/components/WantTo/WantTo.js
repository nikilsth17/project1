import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
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
import PayModal from "./modals/PayModal";
// import QuickBookServices from "../../../../services/QuickBookServices/QuickBookServices";
// import CardServices from "../../../../services/CardServices/CardServices";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const WantTo = ({ invoice, fetchInvoice }) => {
  const [payOpen, setPayOpen] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const [creditCards, setCreditCards] = useState();
  const [bankAccounts, setBankAccounts] = useState();
  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      try {
        const response = await CardServices.getCreditCardList(userInfo.id);
        setCreditCards(response);
      } catch (error) {
        console.log("🚀 ~ error:", error);
      }
    })();

    (async () => {
      try {
        const response = await QuickBookServices.getBankAccounts(userInfo.id);
        setBankAccounts(response);
      } catch (error) {
        console.log("🚀 ~ error:", error);
      }
    })();
  }, []);

  const toggle = () => {
    setPayOpen(!payOpen);
  };
  const toggleEmail = () => {
    setEmailOpen(!emailOpen);
  };

  const downloadInvoice = async () => {
    try {
      const response = await QuickBookServices.downloadPDF({ id: invoice?.id });
      // console.log("🚀 ~ downloadInvoice ~ response:", response);
      // navigate(`/docs-viewer`, { state: { pdflink: response.data } });
      window.open(response.data, "_blank");
    } catch (error) {
      toast.error("An error had occured", {
        autoClose: 3000,
      });
      console.log("🚀 ~ downloadInvoice ~ error:", error);
    }
  };

  return (
    <Card>
      <CardHeader className=" bg-secondary">
        <h5 className="text-white">I Want To</h5>
      </CardHeader>
      <CardBody>
        <Row className="gap-2">
          {(!invoice?.isPaid || invoice.status !== "Cancelled") && (
            // <Col xs={1}>

            // </Col>
            <span>
              <Link onClick={toggle}>Pay Now</Link>
            </span>
          )}

          <span>
            <Link onClick={downloadInvoice}>Download Invoice</Link>
          </span>
          <span>
            <Link onClick={toggleEmail}>Email Invoice</Link>
          </span>
          <span>
            <Link>Download Documents</Link>
          </span>
        </Row>
      </CardBody>
      <Modal isOpen={payOpen} toggle={toggle}>
        <PayModal
          isOpen={payOpen}
          toggle={toggle}
          invoice={invoice}
          creditCards={creditCards}
          bankAccounts={bankAccounts}
          fetchInvoice={fetchInvoice}
        />
      </Modal>

      <Modal isOpen={emailOpen} toggle={toggleEmail}>
        <ModalHeader
          className="bg-secondary"
          close={
            <h2 className="cursor-pointer" onClick={toggleEmail}>
              <i className=" bx bx-x text-white " />
            </h2>
          }
        >
          <h5 className="text-white">Send Invoice</h5>
        </ModalHeader>
        <ModalBody>
          <Row>
            <FormGroup row>
              <Label xs={2}>To:</Label>
              <Col xs={10}>
                <Input placeholder="Email" name="invoiceEmail" type="email" />
              </Col>
            </FormGroup>

            <FormGroup row>
              <Label xs={2}>CC:</Label>
              <Col xs={10}>
                <Input name="invoiceCC" />
              </Col>
            </FormGroup>

            <FormGroup row>
              <Label xs={2}>Subject:</Label>
              <Col xs={10}>
                <Input defaultValue={"Invoice"} name="invoiceSubject" />
              </Col>
            </FormGroup>

            <Link download>Invoice</Link>
            <FormGroup>
              <Input
                id="exampleText"
                name="text"
                type="textarea"
                className="ml-2"
              />
            </FormGroup>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Row className="justify-content-end">
            <Col xs={6}>
              <Button onClick={toggleEmail}>Cancel</Button>
            </Col>
            <Col xs={6}>
              <Button>Send</Button>
            </Col>
          </Row>
        </ModalFooter>
      </Modal>
    </Card>
  );
};

export default WantTo;
