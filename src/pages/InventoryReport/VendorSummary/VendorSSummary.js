import React, { useEffect, useState } from "react";
import LayoutWithBreadCrumb from "../../Pages/Starter/LayoutWithBreadCrumb";
import {
  Card,
  CardBody,
  CardHeader,
  Row,
  Col,
  Table,
  Button,
  Label,
  FormGroup,
  ButtonGroup,
  Container,
} from "reactstrap";
import NumberWithCommas from "../../Pages/Starter/NumberWithCommas";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { useNavigate, useParams, Link } from "react-router-dom";
import ItemWiseTReportServices from "../../../services/Inventory Services/ItemWiseTReportServices";
import VendorsServices from "../../../services/Inventory Services/VendorServices";

const VendorSSummary = () => {
  const [selectVendor, setSelectVendor] = useState([]);
  const [VendorID, setVendorID] = useState("");
  const [reportData, setReportData] = useState({ Item_id: 0 });
  //fetch to get data for summary
  async function fetchReport(Item_id) {
    try {
      const fetchedReport =
        await ItemWiseTReportServices.VendorStatementSummary(Item_id);
      console.log("fetch details", fetchedReport);
      setReportData(fetchedReport);
    } catch (error) {
      console.log("error in fetch", error);
    }
  }

  useEffect(() => {
    async function fetchVendor() {
      try {
        const fetchedVendor = await VendorsServices.getList();
        console.log("fetchde Vendor", fetchedVendor);
        setSelectVendor(fetchedVendor);
      } catch (err) {
        console.log("fetch err", err);
      }
    }
    fetchVendor();
  }, []);

  const generateReport = () => {
    fetchReport(VendorID);
  };

  return (
    <div className="page-content">
      <React.Fragment>
        <BreadCrumb title="Vendor  Report" pageTitle="Vendor " />
        <Container fluid>
          <Row>
            <Col>
              <Card>
                <CardBody>
                  <Row>
                    <FormGroup row>
                      <Col sm={3}>
                        <Label for="customerID">Vendor:</Label>
                      </Col>
                      <Col sm={3}>
                        <select
                          value={VendorID}
                          className="form-control"
                          onChange={(e) => setVendorID(e.target.value)}
                        >
                          <option value="">Select Product</option>
                          {selectVendor.map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          ))}
                        </select>
                      </Col>
                    </FormGroup>
                    <Col sm={3}>
                      <Label></Label>
                    </Col>
                    <Col sm={3}>
                      <Button color="primary" onClick={generateReport}>
                        Generate Report
                      </Button>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
              <Card>
                <CardBody>
                  <div id="customerList">
                    <Row className="g-4 mb-3"></Row>

                    <div className="table-responsive table-card mt-3 mb-1">
                      <table
                        className="table align-middle table-nowrap"
                        id="employeeTable"
                      >
                        <thead className="table-light">
                          <tr>
                            <th className="sort" data-sort="sn">
                              SN
                            </th>

                            <th className="sort" data-sort="txnDate">
                              Transaction Date
                            </th>
                            <th className="sort" data-sort="bill_No">
                              Bill Number
                            </th>
                            <th className="sort" data-sort="total_Amt">
                              Total Amount
                            </th>
                            <th className="sort" data-sort="remarks">
                              Remarks
                            </th>
                            <th className="sort" data-sort="action">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {reportData.length > 0 ? (
                            reportData.map((transaction, index) => (
                              <tr key={transaction.id}>
                                <td>{index + 1}</td>
                                <td>{transaction._txnDate}</td>
                                <td className="text-end">
                               
                               {transaction.bill_No} </td>
                                <td className="text-end">
                                <NumberWithCommas
                                          number=  {transaction.total_Amt}
                                        />
                                  </td>
                                <td>{transaction.remarks}</td>
                                {/* for details button */}
                                <ButtonGroup size="sm">
                                  <Link
                                    to={`/vendosummary_report/details/${transaction.id}`}
                                  >
                                    <Button
                                      color="btn btn-soft-success"
                                      className="btn-sm gap-1"
                                    >
                                      <i className="bx bx-show" />
                                    </Button>
                                  </Link>
                                </ButtonGroup>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="8">No data available</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                    <div className="noresult" style={{ display: "none" }}>
                      <div className="text-center">
                        <lord-icon
                          src="https://cdn.lordicon.com/msoeawqm.json"
                          trigger="loop"
                          colors="primary:#121331,secondary:#08a88a"
                          style={{ width: "75px", height: "75px" }}
                        ></lord-icon>
                        <h5 className="mt-2">Sorry! No Result Found</h5>
                        <p className="text-muted mb-0">
                          We've searched more than 150+ Orders We did not find
                          any orders for you search.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="d-flex justify-content-end">
                    <div className="pagination-wrap hstack gap-2">
                      <Link
                        className="page-item pagination-prev disabled"
                        to="#"
                      >
                        Previous
                      </Link>
                      <ul className="pagination listjs-pagination mb-0"></ul>
                      <Link className="page-item pagination-next" to="#">
                        Next
                      </Link>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </React.Fragment>
    </div>
  );
};

export default VendorSSummary;
