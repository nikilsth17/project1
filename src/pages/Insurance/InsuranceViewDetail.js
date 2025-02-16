import React, { useEffect, useState } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  Table,
  Button,
  ButtonGroup,
  Form,
  FormGroup,
  Label,
  Input,
  ButtonToggle,
} from "reactstrap";
import toast from "react-hot-toast";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import TablePagination from "../Pages/Starter/Pagination";
import CreateButton from "../Pages/Starter/CreateButton";
import StatusLabel from "../../Components/sebscommon/StatusLabel";
import InsuranceServices from "../../services/AustServices/Insuranceservice/InsuranceServices";
import { Triangle } from "react-loader-spinner";
const InsuranceViewDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customerDetail, setCustomerDetail] = useState();
  const [loading, setLoading] = useState(true);
  // Function to view item details
  const viewItem = async (itemId) => {
    try {
      const fetchedCustomer = await InsuranceServices.view(itemId); // Replace with your API call
      console.log("Fetched Item:", fetchedCustomer);

      // Update the state to display the details of the selected item
      setCustomerDetail(fetchedCustomer);
      setLoading(false);
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

  const breadcrumbItems = [{ title: "Back to List ", link: "/Insurance" }];

  return (
    <div className="page-content">
      <BreadCrumb
        title="Insurance Detail"
        pageTitle="Insurance"
        breadcrumbItems={breadcrumbItems}
      />

      {loading ? (
        <Row className="justify-content-center align-items-center">
          <Col xs={2}>
            <Triangle
              visible={true}
              height="80"
              width="80"
              color="#5B71B9"
              ariaLabel="triangle-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
            <h6 className="mt-2">Loading...</h6>
          </Col>
        </Row>
      ) : customerDetail ? (
        <Row className="d-flex justify-content-center">
          <Col lg={6}>
            <Card>
              <CardBody>
                <Row style={{ borderBottom: "1px solid #ddd" }}>
                  <Col lg={6} className="col-6 pb-2 ">
                    <p className="fs-14 text-muted"> Title:</p>

                    <h6 className="fs-13  fw-bold">{customerDetail?.title}</h6>
                  </Col>

                  <Col lg={6} className="col-6 pb-2 ">
                    <p className="fs-14 text-muted"> Code:</p>

                    <h6 className="fs-13  fw-bold">{customerDetail?.code}</h6>
                  </Col>
                </Row>
                <Row style={{ borderBottom: "1px solid #ddd" }}>
                  <Col lg={6} className="col-6 pb-2">
                    <p className="fs-14 text-muted"> Description:</p>

                    <h6 className="fs-13  fw-bold">
                      {customerDetail?.description}
                    </h6>
                  </Col>

                  <Col lg={6} className="col-6 pb-2 ">
                    <p className="fs-14 text-muted"> Additional Charge:</p>

                    <h6 className="fs-13  fw-bold">
                      {customerDetail?.additionalCharge}
                    </h6>
                  </Col>
                </Row>
                <Row style={{ borderBottom: "1px solid #ddd" }}>
                  <Col lg={6} className="col-6 pb-2 ">
                    <p className="fs-14 text-muted"> Status:</p>

                    <h6 className="fs-13  fw-bold">
                      {customerDetail?.description}
                    </h6>
                  </Col>

                  <Col lg={6} className="col-6 pb-2 ">
                    <p className="fs-14 text-muted"> Additional Charge:</p>

                    <h6 className="fs-13  fw-bold">
                      {customerDetail?.status ? "Active" : "Inactive"}
                    </h6>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      ) : (
        <Row className="justify-content-center align-items-center">
          <p className="p-2 pt-5 justify-content-center align-item-center">
            <Col xs={12} className="text-center">
              <img
                src="blankdata.png"
                alt="No data available"
                style={{ width: "400", height: "300px" }}
              />
            </Col>
          </p>
        </Row>
      )}
    </div>
  );
};

export default InsuranceViewDetail;
