import React, { useState, useEffect } from "react";

import {
  Button,
  Col,
  Form,
  Row,
  Table,
  Card,
  Label,
  Input,
  CardBody,
  FormGroup,
  CardHeader,
} from "reactstrap";

import LayoutWithBreadCrumb from "../Starter/LayoutWithBreadCrumb";
import AccountingService from "../../../services/AccountingServices/AccountingReportService";
import LedgersService from "../../../services/AccountingServices/LedgerService";

const LedgerStatement = () => {
  const [data, setData] = useState([]);
  const [selectedLedgerId, setSelectedLedgerId] = useState("");
  const [selectedDatefrom, setFromDate] = useState("");
  const [selectedDateto, setToDate] = useState("");
  const [MyDatalist, setMyDataList] = useState({
    id: 0,
    vmLedgerStmtDetail: [],
  });

  async function fetchLedgerPosts(id, fromDate, toDate) {
    try {
      const response = await AccountingService.LedgerStatement(
        id,
        fromDate,
        toDate
      );
      console.log("data");
      console.log(response);
      setMyDataList(response);
    } catch (error) {
      console.error("Error fetching ledger details:", error);
    }
  }

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await LedgersService.getList();
        console.log(response);
        setData(response);
      } catch (error) {
        console.error("Error fetching ledger details:", error);
      }
    }

    fetchPosts();
  }, []);

  const handleReportClick = () => {
    fetchLedgerPosts(selectedLedgerId, selectedDatefrom, selectedDateto);
  };

  return (
    <React.Fragment>
      <LayoutWithBreadCrumb
        title="Ledger Statement"
        pageTitle="Ledger Statement"
      >
        <Card>
          <CardBody>
            <Form>
              <Row>
                <Col sm={4}>
                  <Label>Ledger Selection</Label>

                  <select
                    className="form-control"
                    name="ledgerId"
                    value={selectedLedgerId}
                    onChange={(e) => setSelectedLedgerId(e.target.value)}
                  >
                    <option value="">Select Ledger</option>
                    {data.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.ledgerNameCode}
                      </option>
                    ))}
                  </select>
                </Col>

                <Col sm={4}>
                  <Label htmlFor="FromDate" className="form-label">
                    From Date
                  </Label>

                  <Input
                    type="date"
                    value={selectedDatefrom}
                    className="form-control"
                    onChange={(e) => setFromDate(e.target.value)}
                  />
                </Col>
                <Col sm={4}>
                  <Label htmlFor="ToDate" className="form-label">
                    To Date
                  </Label>

                  <Input
                    type="date"
                    value={selectedDateto}
                    className="form-control"
                    onChange={(e) => setToDate(e.target.value)}
                  />
                </Col>
              </Row>
            </Form>
            <div className="gap-2 mt-2">
              <Button onClick={handleReportClick}>Report</Button>
            </div>

            <Row>
              {/* Conditionally render this div based on MyDatalist.id */}
              {MyDatalist.ledgerID > 0 && (
                <Card>
                  <CardHeader>
                    <h5 className="card-title mb-3 text-center">
                      Ledger Information
                    </h5>
                    <div className="gap-3">
                      <Col lg={12}>
                        <FormGroup row>
                          <Col lg={3}>
                            <span className="font-weight-bold">Ledger:</span>{" "}
                          </Col>
                          <Col lg={3} className="text-end">
                            {MyDatalist.ledgerName}
                          </Col>
                        </FormGroup>
                      </Col>
                      <Col lg={12}>
                        <FormGroup row>
                          <Col lg={3}>
                            <span className="font-weight-bold ">
                              Parent General Ledger:
                            </span>{" "}
                          </Col>
                          <Col lg={3} className="text-end">
                            {MyDatalist.parentGLName}
                          </Col>
                        </FormGroup>
                      </Col>

                      <Col lg={12}>
                        <FormGroup row>
                          <Col lg={3}>
                            <span className="font-weight-bold">
                              Opening Balance:
                            </span>{" "}
                          </Col>
                          <Col lg={3} className="text-end">
                            {MyDatalist.openingBalance}
                          </Col>
                        </FormGroup>
                      </Col>
                      <Col lg={12}>
                        <FormGroup row>
                          <Col lg={3}>
                            <span className="font-weight-bold ">
                              Closing Balance:
                            </span>{" "}
                          </Col>
                          <Col lg={3} className="text-end">
                            {MyDatalist.closingBalance}
                          </Col>
                        </FormGroup>
                      </Col>
                    </div>
                  </CardHeader>

                  <CardBody>
                    <div className="table-responsive table-bordered">
                      <Table>
                        <thead className="ml-0 bg-light">
                          <tr>
                            <th>S.N</th>
                            <th>Voucher Number</th>
                            <th>Date</th>
                            <th>Narration</th>
                            <th>Balance</th>
                            <th>Debit</th>
                            <th>Credit</th>
                          </tr>
                        </thead>

                        <tbody>
                          {MyDatalist.vmLedgerStmtDetail &&
                            MyDatalist.vmLedgerStmtDetail.map((item, index) => (
                              <tr key={item.id}>
                                <td>{index + 1}</td>
                                <td>{item.voucherNo}</td>
                                <td>
                                  {item.valueDate
                                    .split("T")[0]
                                    .replace(
                                      /(\d{4})-(\d{2})-(\d{2})/,
                                      "$1-$2-$3"
                                    )
                                    .substring(0, 10)}
                                </td>
                                <td>{item.narration}</td>
                                <td>{item.balance}</td>
                                <td>{item.debit}</td>
                                <td>{item.credit}</td>
                              </tr>
                            ))}
                        </tbody>
                        <tfoot>
                          <tr>
                            <td></td>
                            <td colSpan="4"> Total</td>
                            {/* <td colSpan="2"> Total</td> */}
                            <td> {MyDatalist.totalDebit}</td>
                            <td> {MyDatalist.totalCredit}</td>
                          </tr>
                          <tr>
                            <td></td>
                            <td colSpan="5"> Total Difference</td>
                            <td>{MyDatalist.totalDifference}</td>
                          </tr>
                        </tfoot>
                      </Table>
                    </div>
                  </CardBody>
                </Card>
              )}
            </Row>
          </CardBody>
        </Card>
      </LayoutWithBreadCrumb>
    </React.Fragment>
  );
};

export default LedgerStatement;
