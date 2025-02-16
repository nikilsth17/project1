import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardBody,
  Container,
  Row,
  Col,
  CardHeader,
  ButtonGroup,
} from "reactstrap";
import { useNavigate } from "react-router-dom";
import LayoutForCRUDListingPage from "../Starter/LayoutForCRUDListingPage";
import { Link } from "react-router-dom";
import IncomeService from "../../../services/AccountingServices/IncomeService";
import TablePagination from "../Starter/Pagination";
import NumberWithCommas from "../Starter/NumberWithCommas";
import BreadCrumb from "../../../Components/Common/BreadCrumb";

function IncomeList(props) {
  const [MyDatalist, setMyDatalist] = useState([]);
  const navigate = useNavigate();
  const pageSize = 5; // Set the number of items per page
  const [currentPage, setCurrentPage] = useState(0);

  const handleNavigation = () => {
    navigate("/income-vouchers/create"); // Replace with the actual path
  };

  async function fetchPosts() {
    try {
      const fetchedPosts = await IncomeService.getList();
      setMyDatalist(fetchedPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  }

  const handleDelete = async (voucherNo) => {
    try {
      if (window.confirm("Do you really want to delete this IncomeList?")) {
        await IncomeService.delete(voucherNo);
        setMyDatalist((prevData) =>
          prevData.filter((item) => item.voucherNo !== voucherNo)
        );
        console.log(`Item deleted successfully with id: ${voucherNo}`);
      } else {
        // User clicked Cancel or closed the dialog, do nothing or handle accordingly
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  // Handle page navigation
  const handlePageClick = (pageIndex) => {
    setCurrentPage(pageIndex);
  };

  const handlePreviousClick = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextClick = () => {
    const maxPage = Math.ceil(MyDatalist.length / pageSize);
    if (currentPage < maxPage - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [props]);

  return (
    <React.Fragment>
      <div className="page-content">
      <Container fluid>
        <BreadCrumb title="Income Vouchers" pageTitle="Income"/>
          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <div className="d-flex justify-content-sm-end">
                    <Button
                      color="success"
                      onClick={handleNavigation}
                      className="float-end"
                    >
                      <i className="ri-add-line align-bottom me-1"></i> Create
                      Income List
                    </Button>
                  </div>
                </CardHeader>
                <CardBody>
                  <div id="customerList">
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
                            <th className="sort" data-sort="voucherNo">
                              Voucher.No
                            </th>
                            <th className="sort" data-sort="voucherType">
                              Voucher Type
                            </th>
                            <th className="sort" data-sort="valueDate">
                              Value Date
                            </th>
                            <th className="sort" data-sort="manualVno">
                              Manual V.No
                            </th>
                            <th className="sort" data-sort="remarks">
                              Remarks
                            </th>
                            <th className="sort" data-sort="totalCredit">
                              Total Credit
                            </th>
                            <th className="sort" data-sort="action">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody className="list form-check-all">
                          {MyDatalist.slice(
                            currentPage * pageSize,
                            (currentPage + 1) * pageSize
                          ).map((item, index) => (
                            <tr key={item.id}>
                              <td className="sn">{index + 1}</td>
                              <td className="voucherNo">
                                <Link
                                  to={`/income-vouchers/details/${item.voucherNo}`}
                                >
                                  {item.voucherNo}
                                </Link>
                              </td>
                              <td className="voucherType">
                                {item.voucherType}
                              </td>
                              <td className="valueDate">
                                {item.valueDate
                                  .split("T")[0]
                                  .replace(
                                    /(\d{4})-(\d{2})-(\d{2})/,
                                    "$1-$2-$3"
                                  )
                                  .substring(0, 10)}
                              </td>
                              <td className="manualVno">{item.manualVno}</td>
                              <td className="remarks">{item.remarks}</td>
                              <td className="text-end totalCredit">
                                <NumberWithCommas number={item.totalCredit} />
                              </td>
                              <td className="action">
                                <ButtonGroup>
                                  <div className="d-flex gap-1">
                                    <Link
                                      to={`/income-vouchers/details/${item.voucherNo}`}
                                      state={{ item }}
                                    >
                                      <Button
                                        color="btn btn-soft-success"
                                        className="btn-sm gap-1"
                                      >
                                        <i className="bx bx-show" />
                                      </Button>
                                    </Link>
                                    <Link
                                      to={`/income-vouchers/edit/${item.voucherNo}`}
                                      state={{ item }}
                                    >
                                      <Button
                                        color="btn btn-soft-warning"
                                        className="btn-sm gap-1"
                                      >
                                        <i className="ri-edit-line"></i>
                                      </Button>
                                    </Link>
                                    <Button
                                      className="btn btn-soft-danger btn-sm gap-1"
                                      color="danger"
                                      onClick={() =>
                                        handleDelete(item.voucherNo)
                                      }
                                    >
                                      <i className="ri-delete-bin-2-line"></i>
                                    </Button>
                                  </div>
                                </ButtonGroup>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <TablePagination
                        pagesCount={Math.ceil(MyDatalist.length / pageSize)}
                        currentPage={currentPage}
                        handlePageClick={handlePageClick}
                        handlePreviousClick={handlePreviousClick}
                        handleNextClick={handleNextClick}
                      />
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
       
      </Container>
      </div>
    </React.Fragment>
  );
}

export default IncomeList;
