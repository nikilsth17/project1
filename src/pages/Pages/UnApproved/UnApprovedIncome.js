import React, { useState, useEffect, useMemo, useCallback } from "react";

import { Link, Navigate, useNavigate } from "react-router-dom";

import { Button, Card, CardBody } from "reactstrap";
import UnApprovedVoucherListService from "../../../services/AccountingServices/UnApprovedVoucherList";
import NumberWithCommas from "../Starter/NumberWithCommas";
import BreadCrumb from "../../../Components/Common/BreadCrumb";

const UnApprovedIncomeList = (props) => {
  const [MyDatalist, setMyDataList] = useState([]);
  const navigate = useNavigate();

  // // Assuming you want to navigate to JournalVouchersEditor when some event occurs
  // const handleNavigation = () => {
  //   navigate("/income-vouchers/create"); // Replace with the actual path
  // };

  // Example button that triggers the navigation

  async function fetchPosts(id) {
    try {
      const response = await UnApprovedVoucherListService.IncomegetList(id);
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
      {/* <Button color="success" onClick={handleNavigation} className="float-end">Create Income Vouchers</Button> */}
      <Card>
        <CardBody>
          <table className="table table-bordered table-stripped">
            <thead>
              <tr>
                <th className="table-primary">SN</th>
                <th className="table-primary">Vo.No</th>
                <th className="table-primary">Voucher Type</th>
                <th className="table-primary">Value Date</th>
                <th className="table-primary">Manual VNo</th>
                <th className="table-primary">Remarks</th>
                <th className="table-primary">Total Credit</th>
                <th className="table-primary">Total Debit</th>
              </tr>
            </thead>
            <tbody>
              {MyDatalist.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>
                    {" "}
                    <Link to={`/income-vouchers/details/${item.voucherNo}`}>
                      {item.voucherNo}
                    </Link>
                  </td>
                  <td>{item.voucherType}</td>
                  <td className="valueDate">
                    {item.valueDate
                      .split("T")[0]
                      .replace(/(\d{4})-(\d{2})-(\d{2})/, "$1-$2-$3")}
                  </td>
                  <td>{item.manualVno}</td>
                  <td>{item.remarks}</td>
                  <td className="text-end ">
                    <NumberWithCommas number={item.totalCredit} />
                  </td>
                  <td className="text-end ">
                    <NumberWithCommas number={item.totalDebit} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </React.Fragment>
  );
};
export default UnApprovedIncomeList;
