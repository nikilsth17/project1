import React, { useEffect, useState } from "react";
import {
  Container,
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  FormGroup,
  Input,
  Label,
  Table,
  Button,
} from "reactstrap";
import { useNavigate, useParams } from "react-router-dom";
import LayoutWithBreadCrumb from "../Starter/LayoutWithBreadCrumb";
import NumberWithCommas from "../Starter/NumberWithCommas";
import ExpensesService from "../../../services/AccountingServices/ExpensesService";
import ExpenseUnApprove from "../UnApproved/UnApproveExpense";

const defVoucherData = {
  id: "VOU-BR01-0001",
  voucherNo: "VOU-BR01-0001",
  voucherType: "Journal",
  valueDate: "2023-10-17T04:34:51.549",
  manualVno: "JV0001",
  remarks: "bank",
  totalCredit: 2000,
  totalDebit: 0,
  status: 1,
  updatedName: "Admin",
  vmDetails: [
    {
      id: 21,
      ledgerId: 3,
      debit: 0,
      credit: 2000,
      description: "string",
      chqNo: "1",
      balance: 0,
    },
  ],
};

const ExpensesDisplay = (props) => {
  // Capture the 'voucherSN' parameter from the URL
  const { id } = useParams();
  console.log(id);
  const navigate = useNavigate();

  const [JournalDetails, setJournalDetails] = useState(defVoucherData);

  useEffect(() => {
    // Define an async function to fetch journal voucher details using the 'view' API call
    async function fetchJournalDetails() {
      try {
        // Use the 'voucherSN' parameter in the API call
        const response = await ExpensesService.view(id);
        console.log(response);
        setJournalDetails(response); // Assuming this is how you get the data
      } catch (error) {
        console.error("Error fetching journal details:", error);
      }
    }

    // Call the async function to fetch journal voucher details
    fetchJournalDetails();
  }, [id]);

  return (
    <React.Fragment>
      <LayoutWithBreadCrumb
        title=" Expenses Details"
        pageTitle="Expenses Voucher"
      >
        <Container fluid>
          {/* <Button
            className="btn btn-soft-success mb-3 left-align"
            // Adjust the marginLeft and marginRight
            onClick={() => navigate(`/expenses-vouchers`)}
          >
            Back to List
          </Button> */}
          <Row>
            <Col xl={12}>
              <Card>
                <CardHeader>
                  <div className="row">
                    <div className="mb-5">
                      <ExpenseUnApprove />
                      <p className="h5 text-center mt-4">BRICK FACTORY</p>
                      <p className="h6 text-center">EXPENSES DETAILS</p>
                    </div>
                    <div className="gap-2">
                      <Col lg={12}>
                        <FormGroup row>
                          <Col lg={3}>
                            <span className="font-weight-bold text-uppercase">
                              Voucher Number:
                            </span>{" "}
                          </Col>
                          <Col lg={3} className="text-end">
                            {JournalDetails.voucherNo}
                          </Col>

                          <Col lg={3}>
                            <span className="font-weight-bold text-uppercase">
                              Date:
                            </span>{" "}
                          </Col>
                          <Col lg={3} className="text-end">
                            {JournalDetails.valueDate
                              .split("T")[0]
                              .replace(/(\d{4})-(\d{2})-(\d{2})/, "$1-$2-$3")
                              .substring(0, 10)}
                          </Col>
                        </FormGroup>
                      </Col>

                      <Col lg={12}>
                        <FormGroup row>
                          <Col lg={3}>
                            <span className="font-weight-bold text-uppercase">
                              Manual Voucher Number:
                            </span>{" "}
                          </Col>
                          <Col lg={3} className="text-end">
                            {JournalDetails.manualVno}
                          </Col>

                          <Col lg={3}>
                            <span className="font-weight-bold text-uppercase">
                              Contra Ledger:
                            </span>{" "}
                          </Col>
                          <Col lg={3} className="text-end">
                            {JournalDetails.contraLedgerName}
                          </Col>
                        </FormGroup>
                      </Col>
                    </div>
                  </div>
                </CardHeader>

                <CardBody>
                  <div className="table-responsive">
                    <Table>
                      <thead className="ml-0 bg-light">
                        <tr>
                          <th>SN</th>
                          <th>Ledger</th>

                          <th>Description</th>
                          <th>Cheque Number</th>
                          <th>Balance</th>
                          <th>Debit</th>
                          <th>Credit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {JournalDetails.vmDetails.map((item, index) => (
                          <tr key={item.id}>
                            <td>{index + 1}</td>
                            <td>{item.ledgerName}</td>

                            <td>{item.description}</td>
                            <td>{item.chqNo}</td>
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
                      </tbody>{" "}
                      <tfoot>
                        <td></td>
                        <td colSpan="4"> Total</td>
                        {/* <td colSpan="2"> Total</td> */}
                        <td>
                          <NumberWithCommas
                            number={JournalDetails.totalDebit}
                          />
                        </td>
                        <td>
                          <NumberWithCommas
                            number={JournalDetails.totalCredit}
                          />
                        </td>
                      </tfoot>
                    </Table>
                  </div>
                  <div className="d-flex justify-content-end p-3">
                    <div>
                      <FormGroup row>
                        <Col lg={12} className="text-end">
                          <span className="px-5 font-weight-bold">
                            REMARKS:
                          </span>
                          {JournalDetails.remarks}
                        </Col>
                      </FormGroup>
                    </div>
                  </div>
                  <Col lg={12}>
                    <FormGroup row>
                      <Col lg={3}>
                        <span className="font-weight-bold text-uppercase">
                          CREATED BY:
                        </span>{" "}
                      </Col>
                      <Col lg={3} className="text-end">
                        {JournalDetails.createdName}
                      </Col>

                      <Col lg={3}>
                        <span className="font-weight-bold text-uppercase">
                          UPDATED BY:
                        </span>{" "}
                      </Col>
                      <Col lg={3} className="text-end">
                        {JournalDetails.updatedName}
                      </Col>
                    </FormGroup>
                  </Col>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </LayoutWithBreadCrumb>
    </React.Fragment>
  );
};

export default ExpensesDisplay;
