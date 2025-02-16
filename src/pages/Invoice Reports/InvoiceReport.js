import React, { useState, useEffect } from "react";
import {
  Button,
  ButtonGroup,
  Col,
  Container,
  FormGroup,
  Input,
  Label,
  Row,
} from "reactstrap";
import InvoiceCard from "./InvoiceCard";
import InvoiceServices from "../../services/AustServices/InvoiceSev/InvoiceServices";
import InvoiceFilter from "./InvoiceFilter";
import { Triangle } from "react-loader-spinner";
import InvoiceTable from "./InvoiceTable";

const InvoiceReport = () => {
  const [invoice, setinvoice] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [gridView, setGridView] = useState(true);
  const [filters, setFilters] = useState({
    customerId: "",
    createdDateTo: "",
    createdDateFrom: "",
    totalAmountMin: null,
    totalAmountMax: null,
    isPaid: "",
    duePayment: "",
    refNumber: "",
    pageNumber: 1,
    pageSize: 12,
  });

  const [loading, setLoading] = useState(true);
  const fetchinvoiceDetails = async (filters) => {
    try {
      setLoading(true);
      const response = await InvoiceServices.invoiceGetList({
        ...filters,
        customerId: filters.customerId?.value,
      });
      setinvoice(response.data);
      setTotalData(response.totalData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching invoice details:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchinvoiceDetails(filters);
  }, []);

  return (
    <Container>
      <div className="page-content">
        <InvoiceFilter
          setinvoice={setinvoice}
          setFilters={setFilters}
          fetchinvoiceDetails={fetchinvoiceDetails}
          filters={filters}
          loading={loading}
          gridView={gridView}
          setGridView={setGridView}
        />

        <Row>
          {gridView ? (
            <InvoiceCard
              invoice={invoice}
              totalData={totalData}
              setFilters={setFilters}
              loading={loading}
              filters={filters}
              fetchinvoiceDetails={fetchinvoiceDetails}
            />
          ) : (
            <InvoiceTable
              invoice={invoice}
              totalData={totalData}
              setFilters={setFilters}
              loading={loading}
              filters={filters}
              fetchinvoiceDetails={fetchinvoiceDetails}
            />
          )}
        </Row>
        {/* )} */}
      </div>
    </Container>
  );
};

export default InvoiceReport;
