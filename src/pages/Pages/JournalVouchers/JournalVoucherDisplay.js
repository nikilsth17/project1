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
import JournalVouchersService from "../../../services/AccountingServices/VouchersServices";
import CreateButton from "../Starter/CreateButton";
import JournalUnApprove from "../UnApproved/UnApproveJournal";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import NumberWithCommas from "../Starter/NumberWithCommas";

const defVoucherData = {
  id: "VOU-BR01-0036",
  voucherNo: "VOU-BR01-0036",
  voucherType: "s",
  valueDate: "2023-10-30T00:00:00",
  manualVno: "JV0001",
  contraLedgerId: 20,
  remarks: "889",
  totalCredit: 0,
  totalDebit: 4000,
  status: 0,
  updatedName: "Admin",
  vmDetails: [
    {
      id: 171,
      ledgerId: 22,
      debit: 4000,
      credit: 0,
      description: "cash",
      chqNo: "1",
      balance: 0,
    },
  ],
};

const JournalVouchersDisplay = (props) => {
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
        const response = await JournalVouchersService.view(id);
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
      <div className="page-content">
        <BreadCrumb
          title="Journal Voucher Details"
          pageTitle="Journal Voucher"
        />

        <Container fluid>
          {/* <CreateButton to="/journal-vouchers" text="  Back to List" /> */}
          <Row>
            <Card>
              <Col xl={12}>
                <CardHeader>
                  <div className="row">
                    <div>
                      <JournalUnApprove />
                      <p className="h5 text-center mt-4">BRICK FACTORY</p>
                      <p className="h6 text-center">JOURNAL DETAILS</p>
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

                <div className="table-responsive">
                  <Table>
                    <thead className="ml-0 bg-light">
                      <tr>
                        <th>SN</th>
                        <th>LEDGER</th>
                        <th>DESCRIPTION</th>
                        <th>CHEQUE NUMBER</th>
                        <th>BALANCE</th>
                        <th>DEBIT</th>
                        <th>CREDIT</th>
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
                        <NumberWithCommas number={JournalDetails.totalDebit} />
                      </td>
                      <td>
                        <NumberWithCommas number={JournalDetails.totalCredit} />
                      </td>
                    </tfoot>
                  </Table>
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
                </div>
              </Col>
            </Card>
          </Row>
        </Container>
        {/* </LayoutWithBreadCrumb> */}
      </div>
    </React.Fragment>
  );
};

export default JournalVouchersDisplay;
