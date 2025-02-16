import React, { useState, useEffect } from "react";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Table, Container, Row, Col, Card, CardBody } from "reactstrap";
import CurrencyServices from "../../services/AustServices/CurrencySe/CurrencyServices";
import CreateButton from "../Pages/Starter/CreateButton";
import { Triangle } from "react-loader-spinner";

const CurrencyViewDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customerDetail, setCustomerDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to view item details
  const viewItem = async (itemId) => {
    try {
      const fetchedCustomer = await CurrencyServices.view(itemId);
      console.log("Fetched Item:", fetchedCustomer);
      setCustomerDetail(fetchedCustomer);
      setLoading(false);
    } catch (error) {
      console.error("Error viewing item:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    viewItem(id);
  }, [id]);

  const breadcrumbItems = [{ title: "Back to List", link: "/Currency" }];

  return (
    <Container fluid>
      <div className="page-content">
        <BreadCrumb
          title="Currency Detail"
          breadcrumbItems={breadcrumbItems}
          pageTitle="Currency "
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
                      <p className="mb-1 fs-14 text-muted"> Currency Code:</p>
                      <h6 className="fs-13  fw-bold">
                        {customerDetail?.currencyCode}
                      </h6>
                    </Col>

                    <Col lg={6} className="col-6 pb-2">
                      <p className="mb-1 fs-14 text-muted"> Name:</p>
                      <h6 className="fs-13  fw-bold">{customerDetail?.name}</h6>
                    </Col>
                  </Row>
                  <Row style={{ borderBottom: "1px solid #ddd" }}>
                    <Col lg={6} className="col-6 pb-2 ">
                      <p className="mb-1 fs-14 text-muted"> Exchange Rate:</p>
                      <h6 className="fs-13  fw-bold">
                        {customerDetail?.exchangeRate}
                      </h6>
                    </Col>

                    <Col lg={6} className="col-6 pb-2 ">
                      <p className="mb-1 fs-14 text-muted"> Description:</p>
                      <h6 className="fs-13  fw-bold">
                        {customerDetail?.description}
                      </h6>
                    </Col>
                  </Row>
                  <Row style={{ borderBottom: "1px solid #ddd" }}>
                    <Col lg={6} className="col-6 pb-2 ">
                      <p className="mb-1 fs-14 text-muted"> Status:</p>
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
    </Container>
  );
};

export default CurrencyViewDetail;
