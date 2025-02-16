import React, { useState, useEffect } from "react";
import {
  Button,
  Col,
  Container,
  FormGroup,
  Input,
  Label,
  Row,
} from "reactstrap";
import CustomerCard from "./CustomerCard";
import CustomerFilter from "./CustomerFilter";
import CustomerAust from "../../services/AustServices/Customeraust/CustomerAust";
import { Triangle } from "react-loader-spinner";
const CustomerReport = () => {
  const [customer, setCustomer] = useState([]);

  console.log(
    "🚀 ~ file: CustomerReport.js:17 ~ CustomerReport ~ customer:",
    customer
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchcustomerDetails = async () => {
      try {
        setLoading(true);
        const customerData = await CustomerAust.getCustomerList();
        setCustomer(customerData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching customer details:", error);
        setLoading(false);
      }
    };

    fetchcustomerDetails();
  }, []);

  return (
    <Container>
      <div className="page-content">
        <CustomerFilter setCustomer={setCustomer} />
        {loading ? (
          <Row className="justify-content-center">
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
              <h5 className="mt-2">Loading...</h5>
            </Col>
          </Row>
        ) : (
          <CustomerCard customer={customer} />
        )}
      </div>
    </Container>
  );
};

export default CustomerReport;
