import React, { useState } from "react";
import {
  Row,
  Col,
  Input,
  Label,
  CardHeader,
  Card,
  CardBody,
  Container,
  Button,
  Spinner,
} from "reactstrap";
import DatePicker from "react-flatpickr";
import "flatpickr/dist/themes/material_green.css";

import CustomerAust from "../../services/AustServices/Customeraust/CustomerAust";

const CustomerFilter = ({ setCustomer }) => {
  const [showFilter, setShowFilter] = useState(false);
  const [createdDateFrom, setCreatedDateFrom] = useState("");
  const [createdDateTo, setCreatedDateTo] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSystemVerified, setSystemVerified] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleFilter = () => {
    setShowFilter(!showFilter);
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const response = await CustomerAust.getCustomerList(
        userEmail,
        createdDateTo,
        createdDateFrom,
        userAddress,
        phoneNumber,
        isSystemVerified
      );
      console.log("Selected data:", response);
      setCustomer(response);
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Row className="mb-3 justify-content-end">
        <Col xs="auto">
          <Button onClick={toggleFilter} size="sm">
            {showFilter ? (
              <i className="ri ri-filter-3-line fs-18"> Filter</i>
            ) : (
              <i className="ri ri-filter-3-line fs-18">Filter</i>
            )}
          </Button>
        </Col>
      </Row>

      {showFilter && (
        <Card>
          <CardHeader style={{ height: "3rem", backgroundColor: "#5A72B8" }}>
            <h5 className="text-white">Search by Filter Panel</h5>
          </CardHeader>

          <CardBody>
            <Row className="pb-1">
              <Label sm={2}>Email:</Label>
              <Col sm={4}>
                <Input
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                />
              </Col>
              <Label sm={2}>Address:</Label>
              <Col sm={4}>
                <Input
                  value={userAddress}
                  onChange={(e) => setUserAddress(e.target.value)}
                />
              </Col>
            </Row>

            <Row className="pb-1">
              <Label sm={2}>Created From Date:</Label>
              <Col sm={4}>
                <Input
                  type="date"
                  className="form-control"
                  value={createdDateFrom}
                  onChange={(e) => setCreatedDateFrom(e.target.value)}
                />
              </Col>

              <Label sm={2}>Created To Date:</Label>
              <Col sm={4}>
                <Input
                  type="date"
                  className="form-control"
                  value={createdDateTo}
                  onChange={(e) => setCreatedDateTo(e.target.value)}
                />
              </Col>
            </Row>

            <Row className="pb-1">
              <Label sm={2}>Phone number:</Label>
              <Col sm={4}>
                <Input
                  type="text"
                  className="form-control"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </Col>

              <Label sm={2}>System Verified:</Label>
              <Col sm={4}>
                <Input
                  type="text"
                  className="form-control"
                  value={isSystemVerified}
                  onChange={(e) => setSystemVerified(e.target.value)}
                />
              </Col>
            </Row>

            <Row className="pb-1">
              <Col className="d-flex justify-content-end">
                <Button onClick={handleSearch} type="submit" disabled={loading}>
                  Search
                </Button>
                {loading && (
                  <Col className="my-auto align-items-center" xs={1}>
                    {loading && <Spinner color="primary">Loading...</Spinner>}
                  </Col>
                )}
              </Col>
            </Row>
          </CardBody>
        </Card>
      )}
    </Container>
  );
};

export default CustomerFilter;
