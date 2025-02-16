import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Table,
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  ButtonToggle,
  Label,
  Input,
  UncontrolledTooltip,
} from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import CreateButton from "../Pages/Starter/CreateButton";
import InvoiceServices from "../../services/AustServices/InvoiceSev/InvoiceServices";

const InvoiceViewDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customerDetail, setCustomerDetail] = useState();

  // Function to view item details
  const viewItem = async (itemId) => {
    try {
      const fetchedCustomer = await InvoiceServices.view(itemId); // Replace with your API call
      console.log("Fetched Item:", fetchedCustomer);

      // Update the state to display the details of the selected item
      setCustomerDetail(fetchedCustomer);
      // Set loading to false after a successful fetch
    } catch (error) {
      console.error("Error viewing item:", error);
      // Set loading to false on error
    }
  };

  useEffect(() => {
    // Fetch the item details when the component mounts based on the id from the URL
    viewItem(id);
  }, [id]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  const breadcrumbItems = [{ title: "< Invoice ", link: "/Invoice" }];
  return (
    <div className="page-content">
      <BreadCrumb
        title="Invoice Detail"
        breadcrumbItems={breadcrumbItems}
        pageTitle="Invoice"
      />
      <CreateButton to="/Invoice " text="Back to List" />

      <Row className="d-flex justify-content-center">
        <Col lg={6}>
          <Card>
            <CardBody>
              {/* <p
                // id="UncontrolledTooltipExample"
                title={`Quickbook Id:${customerDetail?.quickBookId}`}
              >
                Invoice Details
              </p> */}

              <Row style={{ borderBottom: "1px solid #ddd" }}>
                <Col lg={6} className="col-6 pb-2 pb-2">
                  <p className="mb-1 fw-bold fs-15"> Customer:</p>

                  <h6 className="fs-12 mb-0 text-muted">
                    {customerDetail?.customerName}
                  </h6>
                </Col>

                <Col lg={6} className="col-6 pb-2 pb-2">
                  <p className="mb-1 fw-bold fs-15"> Reference No.:</p>

                  <h6 className="fs-12 mb-0 text-muted">
                    {customerDetail?.refNo}
                  </h6>
                </Col>
              </Row>

              <Row style={{ borderBottom: "1px solid #ddd" }}>
                <Col lg={6} className="col-6 pb-2 pb-2">
                  <p className="mb-1 fw-bold fs-15"> Invoice Date:</p>

                  <h6 className="fs-12 mb-0 text-muted">
                    {customerDetail?.invoiceDate.split("T")[0]}
                  </h6>
                </Col>

                <Col lg={6} className="col-6 pb-2 pb-2">
                  <p className="mb-1 fw-bold fs-15"> Due Date:</p>

                  <h6 className="fs-12 mb-0 text-muted">
                    {customerDetail?.dueDate.split("T")[0]}
                  </h6>
                </Col>
              </Row>
              <Row style={{ borderBottom: "1px solid #ddd" }}>
                <Col lg={6} className="col-6 pb-2 pb-2">
                  <p className="mb-1 fw-bold fs-15"> Invoice Date:</p>

                  <h6 className="fs-12 mb-0 text-muted">
                    {customerDetail?.invoiceDate.split("T")[0]}
                  </h6>
                </Col>

                <Col lg={6} className="col-6 pb-2 pb-2">
                  <p className="mb-1 fw-bold fs-15"> Total Amount:</p>

                  <h6 className="fs-12 mb-0 text-muted">
                    {customerDetail?.totalAmount}
                  </h6>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default InvoiceViewDetails;
