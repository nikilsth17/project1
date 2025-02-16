import React, { useState, useEffect } from "react";
import { CardBody, Col, Card, FormGroup, Row } from "reactstrap";
import NumberWithCommas from "../Starter/NumberWithCommas";
import LayoutWithBreadCrumb from "../Starter/LayoutWithBreadCrumb";
import AccountingService from "../../../services/AccountingServices/AccountingReportService";
const Trial = () => {
  const [MyDatalist, setMyDataList] = useState({ vmTrialBalanceDetail: [] });

  async function fetchPosts(id) {
    try {
      const response = await AccountingService.TrialBalance(id);
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
        title="Trial Balance List"
        pageTitle=" Trial Balance"
      >
        <Card>
          <CardBody>
            <Row>
              <Col md={12}>
                <table className="table table-bordered table-stripped">
                  {/* Table header */}
                  <thead>
                    <tr>
                      <th className="table-primary">SN</th>
                      <th className="table-primary">Ledger Type</th>

                      <th className="table-primary">Ledger</th>
                      <th className="table-primary">Balance</th>
                      <th className="table-primary">Debit</th>
                      <th className="table-primary">Credit</th>
                    </tr>
                  </thead>

                  {/* Table body */}
                  <tbody>
                    {MyDatalist.accReportDetail &&
                      MyDatalist.accReportDetail.map((item, index) => (
                        <tr key={item.id}>
                          <td>{index + 1}</td>

                          <td>{item.ledgerType}</td>

                          <td>{item.displayField}</td>

                          <td>
                            <NumberWithCommas number={item.balance} />
                          </td>
                          <td>
                            <NumberWithCommas number={item.debit} />
                          </td>
                          <td>
                            <NumberWithCommas number={item.credit} />
                          </td>
                        </tr>
                      ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td></td>
                      <td colSpan="3"> Total</td>
                      {/* <td colSpan="2"> Total</td> */}
                      <td> {MyDatalist.totalDebit}</td>
                      <td> {MyDatalist.totalCredit}</td>
                    </tr>
                    <tr>
                      <td></td>
                      <td colSpan="4"> Total Difference</td>

                      <td> {MyDatalist.differnceAmt}</td>
                    </tr>
                  </tfoot>
                </table>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </LayoutWithBreadCrumb>
    </React.Fragment>
  );
};

export default Trial;
