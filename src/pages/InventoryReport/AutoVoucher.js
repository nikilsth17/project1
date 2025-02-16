import React from "react";
import { useEffect } from "react";
import { Card, CardBody, CardHeader, Col, FormGroup, Table } from "reactstrap";
import { useState } from "react";
import { useParams } from "react-router-dom";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import InventoryDayBookService from "../../services/Inventory Services/InventoryDayBook";

const AutoVoucher = () => {
  const { selectedDate } = useParams();
  console.log(selectedDate);

  const [voucherData, setVoucherData] = useState(getTodayDate());

  async function fetchVoucher(selectedDate) {
    try {
      const response = await InventoryDayBookService.createAuto(selectedDate);

      console.log(response);
      setVoucherData(response);
    } catch (error) {
      console.error("Error fetching details:", error);
    }
  }

  function getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  useEffect(() => {
    // Fetch data when the component mounts
    fetchVoucher(selectedDate);
  }, [selectedDate]);

  return (
    <div className="page-content">
      <BreadCrumb title="Auto Voucher Report" pageTitle="Auto Voucher" />

      <Card>
        <CardHeader>
          <div className="row">
            <div className="mb-4">
              <p className="h5 text-center">BRICK FACTORY</p>
              <p className="h6 text-center">AUTO VOUCHER REPORT</p>
              <p></p>
            </div>
            <div className="gap-3">
              <Col lg={12}>
                <FormGroup row>
                  <Col lg={3}>
                    <span className="font-weight-bold text-uppercase">
                      Voucher Number:
                    </span>{" "}
                  </Col>
                  <Col lg={3} className="text-end">
                    {voucherData.voucherNo}
                  </Col>
                </FormGroup>
              </Col>
              <Col lg={12}>
                <FormGroup row>
                  <Col lg={3}>
                    <span className="font-weight-bold text-uppercase">
                      Date:
                    </span>{" "}
                  </Col>
                  <Col lg={3} className="text-end">
                    {voucherData.valueDate
                      ? new Date(voucherData.valueDate).toLocaleDateString()
                      : ""}
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
                    {voucherData.manualVno}
                  </Col>
                </FormGroup>
              </Col>
            </div>
          </div>
        </CardHeader>

        <CardBody>
          <div className="table-responsive">
            <Table className="table-borderless align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>SN</th>
                  <th>LEDGER CODE</th>
                  <th>DEBIT</th>
                  <th>CREDIT</th>
                </tr>
              </thead>
              <tbody>
                {voucherData.vmAutoVoucherDetail &&
                voucherData.vmAutoVoucherDetail.length > 0 ? (
                  voucherData.vmAutoVoucherDetail.map((record, index) => (
                    <tr key={record.id}>
                      <td>{index + 1}</td>
                      <td>{record.led_Code}</td>
                      <td>{record.dr}</td>
                      <td>{record.cr}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">No data available</td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr>
                  <td></td>
                  <td colSpan="1"> Total</td>
                  {/* <td colSpan="2"> Total</td> */}

                  <td> {voucherData.totalDebit}</td>
                  <td> {voucherData.totalCredit}</td>
                </tr>
              </tfoot>
            </Table>
            <div className="d-flex justify-content-end p-3">
              <div>
                <FormGroup row>
                  <Col lg={12} className="text-end">
                    <span className="px-5 font-weight-bold">UPDATED BY:</span>
                    {voucherData.updatedName}
                  </Col>
                </FormGroup>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default AutoVoucher;
