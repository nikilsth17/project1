import React, { useState, useEffect } from "react";

import { Button, Col, Row, Card, CardBody } from "reactstrap";
import LayoutWithBreadCrumb from "../Starter/LayoutWithBreadCrumb";
import AccountingService from "../../../services/AccountingServices/AccountingReportService";

const BalanceSheet = () => {
  const [MyDatalist, setMyDataList] = useState({ vmBalanceSheetDetail: [] });

  async function fetchPosts(id) {
    try {
      const response = await AccountingService.BalanceSheet(id);
      console.log("data");
      console.log(response);
      setMyDataList(response);
    } catch (error) {
      console.error("Error fetching ledger details:", error);
    }
  }

  useEffect(() => {
    fetchPosts();
  }, []);
  return (
    <React.Fragment>
      <LayoutWithBreadCrumb
        title="Balance Sheet List"
        pageTitle="Balance Sheet"
      >
        {/* Conditionally render this div based on MyDatalist.id */}
        <Card>
          <CardBody>
            <table className="table table-bordered table-stripped">
              <thead>
                <tr>
                  <th className="table-primary">SN</th>

                  <th className="table-primary">Ledger</th>
                  <th className="table-primary">Balance</th>
                  <th className="table-primary">Debit</th>
                  <th className="table-primary">Credit</th>
                </tr>
              </thead>
              <tbody>
                {MyDatalist.accReportDetail &&
                  MyDatalist.accReportDetail.map((item, index) => (
                    <tr key={item.id}>
                      {/* {MyDatalist.accReportDetail.map((item, index) => (
                  <tr key={item.id}> */}
                      <td>{index + 1}</td>

                      <td>{item.ledgerName}</td>
                      <td>{item.balance}</td>
                      <td>{item.debit}</td>
                      <td>{item.credit}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <div>
              <Row>
                <Col md={3}>Total Debit: </Col>
                <Col md={9}>{MyDatalist.totalDebit}</Col>
              </Row>
              <Row>
                <Col md={3}>Total Credit: </Col>
                <Col md={9}>{MyDatalist.totalCredit}</Col>
              </Row>
              <Row>
                <Col md={3}>Total Difference: </Col>
                <Col md={9}>{MyDatalist.differnceAmt}</Col>
              </Row>
            </div>
          </CardBody>
        </Card>
      </LayoutWithBreadCrumb>
    </React.Fragment>
  );
};

export default BalanceSheet;
