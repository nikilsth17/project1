import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Spinner,
} from "reactstrap";
import QuickBookServices from "../../../../services/QuickBookServices/QuickBookServices";
import toast from "react-hot-toast";

const Details = ({ invoice }) => {
  console.log("🚀 ~ Details ~ invoice:", invoice);
  const [invoiceLoading, setInvoiceLoading] = useState(false);

  const navigate = useNavigate();
  const downloadInvoice = async () => {
    try {
      setInvoiceLoading(true);
      const response = await QuickBookServices.downloadPDF({ id: invoice?.id });
      setInvoiceLoading(false);

      window.open(response.data, "_blank");
    } catch (error) {
      toast.error(error.response?.data, {
        autoClose: 3000,
      });
      console.log("🚀 ~ downloadInvoice ~ error:", error);
      setInvoiceLoading(false);
    }
  };

  const getLocalDate = ({ dateString, timeString }) => {
    let temp = dateString?.split("T")[0] + `T${timeString}`;

    let utcDate = new Date(temp);
    const timeZoneOffset = utcDate.getTimezoneOffset();
    const localDateTime = new Date(
      utcDate.getTime() - timeZoneOffset * 60 * 1000
    );

    return localDateTime;
  };
  return (
    <Card>
      <CardHeader style={{ height: "3rem" }} className="bg-secondary">
        <Row>
          <Col xs={9}>
            <h5 className="text-white pb-2">Invoice Details</h5>
          </Col>
          {/* <Col className="text-start">
            <Link onClick={downloadInvoice}>
              <span className="text-white">
                {invoiceLoading ? (
                  <>
                    <Spinner size="sm" color="light" className="me-2" /> Opening
                    Invoice...
                  </>
                ) : (
                  "View Invoice"
                )}
              </span>
            </Link>
          </Col> */}
        </Row>
      </CardHeader>
      <CardBody>
        <Row>
          <Col xs={6} md={3} className="mb-3">
            <Row>
              <span className="fw-bold">From</span>
              <span className="text-uppercase">{invoice?.fromCompanyName}</span>
            </Row>
          </Col>
          {invoice?.collectionDate && (
            <Col xs={6} md={3} className="mb-3">
              <span className="fw-bold">Collection Date</span>
              <Row className="mb-0">
                {invoice?.collectionDate ? (
                  <>
                    <span className="mr-2">
                      {new Date(invoice.collectionDate).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }
                      )}
                    </span>
                  </>
                ) : (
                  <span className="font-italic">No data available</span>
                )}
              </Row>
              {invoice?.collectionFromTime ? (
                <span>
                  {getLocalDate({
                    dateString: invoice?.collectionDate,
                    timeString: invoice?.collectionFromTime,
                  }).toLocaleTimeString()}
                </span>
              ) : (
                <span className="font-italic ">No data available</span>
              )}{" "}
              to{" "}
              {invoice?.collectionToTime ? (
                <span>
                  {" "}
                  {getLocalDate({
                    dateString: invoice?.collectionDate,
                    timeString: invoice?.collectionToTime,
                  })?.toLocaleTimeString()}
                </span>
              ) : (
                <span className="font-italic ">No data available</span>
              )}
            </Col>
          )}
          <Col xs={6} md={3} className="mb-3">
            <Row>
              <span className="fw-bold">Estimated Time of Arrival</span>
              <span>{invoice?.eta}</span>
            </Row>
          </Col>
          <Col xs={6} md={3} className="mb-3">
            <Row>
              <span className="fw-bold">Reference Number</span>
              <span>{invoice?.refNo}</span>
            </Row>
          </Col>
          <Col xs={6} md={3} className="mb-3">
            <Row>
              <span className="fw-bold">Order Total</span>
              <span>${invoice?.totalAmount} (inc taxes)</span>
            </Row>
          </Col>
          <Col xs={6} md={3} className="mb-3">
            <Row>
              <span className="fw-bold">To</span>
              <span className="text-uppercase">{invoice?.toCompanyName}</span>
            </Row>
          </Col>
          {/* <Col xs={6} md={3} className="mb-3">
            <Row>
              <span className="fw-bold"> Delivery date</span>
              <span>{new Date(invoice?.deliveryDate).toLocaleString()}</span>
            </Row>
          </Col> */}
          {/* <Col xs={6} md={3} className="mb-3">
            <Row>
              <span className="fw-bold"> Carrier Number</span>
              <span>{invoice?.carrierNumber}</span>
            </Row>
          </Col> */}
          <Col xs={6} md={3} className="mb-3">
            <Row>
              <span className="fw-bold">Status</span>
              {invoice?.isPaid ? (
                <h5>
                  <Badge color="success">Paid</Badge>
                </h5>
              ) : (
                <h5>
                  <Badge color="warning">Outstanding</Badge>
                </h5>
              )}
            </Row>
          </Col>
          <Col xs={6} md={3} className="mb-3">
            <Row>
              <span className="fw-bold">Issue Date</span>
              <span>
                {" "}
                {new Date(invoice?.invoiceDate).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </Row>
          </Col>
          <Col xs={6} md={3} className="mb-3">
            <Row>
              <span className="fw-bold">Due Date</span>
              <span>
                {new Date(invoice?.dueDate).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </Row>
          </Col>
          {/* <Col xs={6} md={3} className="mb-3">
            <Row>
              <span className="fw-bold">QuickBook Id</span>
              <span>{invoice?.quickBookId}</span>
            </Row>
          </Col> */}

          <Col xs={6} md={3}>
            <Button
              onClick={() => {
                navigate(`/shipmentdetail/${invoice?.shipmentId}`);
              }}
            >
              View Details
            </Button>
          </Col>
          <Col xs={6} md={3}>
            <Button onClick={downloadInvoice} color="success" size="sm">
              {invoiceLoading ? (
                <>
                  <Spinner size="sm" color="light" className="me-2" /> Opening
                  Invoice...
                </>
              ) : (
                "View Invoice"
              )}
            </Button>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default Details;
