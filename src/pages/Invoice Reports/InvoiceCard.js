import React from "react";
import { Link } from "react-router-dom";
import { Button, Card, CardBody, CardHeader, Col, Row } from "reactstrap";
import TablePagination from "../Pages/Starter/Pagination";
import { useState } from "react";
import { Triangle } from "react-loader-spinner";

const InvoiceCard = ({
  invoice,
  totalData,
  filters,
  setFilters,
  loading,
  fetchinvoiceDetails,
}) => {
  // State variables for pagination
  // const [currentPage, setCurrentPage] = useState(1);

  // // Calculate index of the first and last item to be displayed on the current page
  // const indexOfLastItem = currentPage * filters.pageSize;
  // const indexOfFirstItem = indexOfLastItem - filters.pageSize;
  // const currentInvoices = invoice.slice(indexOfFirstItem, indexOfLastItem);

  // Event handler for changing the current page
  const handlePageChange = (pageNumber) => {
    // setCurrentPage(pageNumber);
    setFilters((prev) => {
      return {
        ...prev,
        pageNumber: pageNumber,
      };
    });
    fetchinvoiceDetails({ ...filters, pageNumber: pageNumber });
  };

  return (
    <Row>
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
        <Row>
          {invoice?.map((invoiceItem, index) => (
            <Col key={index} xs={12} lg={4} className="flex-wrap">
              <Card className="rounded-4 pt-0">
                <CardBody>
                  <Row
                    style={{ borderBottom: "1px solid #ddd" }}
                    className="pt-2"
                  >
                    <Col xs={10}>
                      <h5 className="text-secondary">
                        {invoiceItem.customerName}
                      </h5>
                    </Col>
                    <Col lg={1}>
                      <Link to={`/invoice-report/detail/${invoiceItem.id}`}>
                        <h4>
                          <i className="bx bx-show text-primary" />
                        </h4>
                      </Link>
                    </Col>
                  </Row>
                  <Row className="pt-2">
                    <Col lg={6} className="col-6 ">
                      <p className=" mb-1  fw-bold fs-16">
                        {/* <i className="bx bx-globe" /> */}
                        Ref No:
                      </p>
                      <h6 className="fs-13 mb-0 text-muted">
                        {invoiceItem.refNo}
                      </h6>
                    </Col>

                    <Col lg={6} className="col-6 ">
                      <p className=" mb-1  fw-bold fs-16">
                        {/* <i className="bx bxs-city" /> */}
                        Invoice date:
                      </p>
                      <h6 className="fs-13 mb-0 text-muted">
                        {invoiceItem.invoiceDate
                          ? invoiceItem.invoiceDate.split("T")[0]
                          : ""}
                      </h6>
                    </Col>
                  </Row>
                  <Row className="pt-2">
                    <Col lg={6} className="col-6 pb-2 pb-2">
                      <p className=" mb-1  fw-bold fs-16">
                        {/* <i className="bx bxs-home" /> */}
                        Due Date:
                      </p>
                      <h6 className="fs-13 mb-0 text-muted">
                        {invoiceItem.dueDate
                          ? invoiceItem.dueDate.split("T")[0]
                          : ""}
                      </h6>
                    </Col>

                    <Col lg={6} className="col-6 pb-2 pb-2">
                      <p className=" mb-1  fw-bold fs-16">
                        {/* <i className="bx bxs-home" /> */}
                        Total:
                      </p>
                      <h6 className="fs-13 mb-0 text-muted">
                        {invoiceItem.totalAmount}
                      </h6>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {invoice && invoice.length === 0 && (
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

      <TablePagination
        pagesCount={Math.ceil(totalData / filters.pageSize)}
        currentPage={filters.pageNumber}
        handlePreviousClick={() => handlePageChange(currentPage - 1)}
        handleNextClick={() => handlePageChange(currentPage + 1)}
        handlePageClick={handlePageChange}
      />
    </Row>
  );
};

export default InvoiceCard;
