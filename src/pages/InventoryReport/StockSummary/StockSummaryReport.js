import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import LayoutWithBreadCrumb from "../../Pages/Starter/LayoutWithBreadCrumb";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { Card, CardBody, CardHeader, Col, Row, Table } from "reactstrap";
import ItemWiseTReportServices from "../../../services/Inventory Services/ItemWiseTReportServices";
import NumberWithCommas from "../../Pages/Starter/NumberWithCommas";

const StockSummaryReport = () => {
  const [reportData, setReportData] = useState([]);

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const fetchedStock = await ItemWiseTReportServices.GetStockSummary();
        console.log("fetch Stock", fetchedStock);
        setReportData(fetchedStock);
      } catch (error) {
        console.error("Error fetching stock:", error);
      }
    };

    fetchStock();
  }, []);

  return (
    <div>
      <React.Fragment>
        <LayoutWithBreadCrumb>
          <BreadCrumb title="Stock-Summary-Report" pageTitle="Stock_Report" />
          <Row>
            <Col>
              <Card>
                <CardHeader></CardHeader>
                <CardBody>
                  <Table striped bordered>
                    <thead>
                      <tr>
                        <th rowSpan={2}>S.N</th>
                        <th rowSpan={2}> Category</th>
                        <th rowSpan={2}>Product</th>
                        {/* <th>purchase_Qty</th>
                        <th>purchase_Amt</th> */}
                        <th colspan="2">Purchase</th>
                        <th colspan="2">Sales</th>
                        <th colspan="2">Balance</th>
                        {/* <th>sale_Qty</th>
                        <th>sale_Amt</th>
                        <th>balance_Qty</th>
                        <th>balance_Amt</th> */}
                        <th rowspan="2">Profit</th>
                      </tr>
                      <tr>
                        <th>Quantity</th>
                        <th>Amount</th>
                        <th>Quantity</th>
                        <th>Amount</th>
                        <th>Quantity</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.length > 0 ? (
                        reportData.map((customer, index) => (
                          <tr key={customer.id}>
                            <td>{index + 1}</td>
                            <td>
                              <Link
                                to={`/category/details/${customer.categoryID}`}
                              >
                                {customer.categoryName}
                              </Link>
                            </td>
                            <td>
                              <Link
                                to={`/product/details/${customer.productId}`}
                              >
                                {customer.productName}
                              </Link>
                            </td>
                            <td>
                            <NumberWithCommas
                                        number={customer.purchase_Qty} />
                                        </td>
                            <td>
                            <NumberWithCommas
                                        number={customer.purchase_Amt} />
                                        </td>
                            <td> <NumberWithCommas
                                        number={customer.sale_Qty} />
                                        </td>
                            <td>
                            <NumberWithCommas
                                        number={customer.sale_Amt} />
                                        </td>
                            <td>
                            <NumberWithCommas
                                        number={customer.balance_Qty} />
                                        </td>
                            <td>
                            <NumberWithCommas
                                        number={customer.balance_Amt} />
                                        </td>
                            <td>
                            <NumberWithCommas
                                        number={customer.profit} />
                                        </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="10">No data available</td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </LayoutWithBreadCrumb>
      </React.Fragment>
    </div>
  );
};

export default StockSummaryReport;
