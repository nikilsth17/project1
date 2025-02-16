import React, { useState, useEffect } from "react";
import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Row,
} from "reactstrap";
import { useNavigate, Link } from "react-router-dom";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import PayrollService from "../../../services/HRService/PayrollService";
import TablePagination from "../Starter/Pagination";
import NumberWithCommas from "../Starter/NumberWithCommas";

function PayrollList(props) {
  const [payrollList, setPayrollList] = useState([]);
  const [error, setError] = useState(null);
  const pageSize = 5; // Set the number of items per page
  const [currentPage, setCurrentPage] = useState(0);
  const navigate = useNavigate();

  async function fetchPayrollList() {
    try {
      const fetchedList = await PayrollService.getList();
      setPayrollList(fetchedList);
    } catch (err) {
      setError(err);
    }
  }

  const handleNavigationForm = () => {
    navigate("/payroll-form");
  };

  const handleDelete = async (id) => {
    try {
      if (window.confirm("Do you want to delete this Payroll List?")) {
        await PayrollService.delete(id);
        setPayrollList((prevData) => prevData.filter((item) => item.id !== id));
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
    const maxPage = Math.ceil(payrollList.length / pageSize);
    if (currentPage < maxPage - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  useEffect(() => {
    fetchPayrollList();
  }, []);

  return (
    <div className="page-content">
      <BreadCrumb title="Payroll List" pageTitle="Payroll Records" />
      <Container fluid>
        <Row>
          <Col lg={12}>
            <Card>
              <CardHeader>
                <Button
                  color="success"
                  onClick={handleNavigationForm}
                  className="float-end"
                >
                  <i className="ri-add-line align-bottom me-1"></i>Create
                  Payroll List
                </Button>
              </CardHeader>
              <CardBody>
                <div className="table-responsive table-card mt-3 mb-1">
                  <table className="table align-middle table-nowrap">
                    <thead className="table-light">
                      <tr>
                        <th className="sort" data-sort="sn">
                          SN
                        </th>
                        <th className="sort" data-sort="transaction_Date">
                          Transaction Date
                        </th>
                        <th className="sort" data-sort="remarks">
                          Month
                        </th>
                        <th className="sort" data-sort="verified_By">
                          Verified By
                        </th>
                        <th className="sort" data-sort="total_Amt">
                          Total Amt
                        </th>
                        <th className="sort" data-sort="action">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="list form-check-all">
                      {payrollList
                        .slice(
                          currentPage * pageSize,
                          (currentPage + 1) * pageSize
                        )
                        .map((item, index) => (
                          <tr key={item.id}>
                            <td className="sn">{index + 1}</td>
                            <td className="transaction_Date">
                              {item.transaction_Date
                                .split("T")[0]
                                .replace(/(\d{4})-(\d{2})-(\d{2})/, "$1-$2-$3")
                                .substring(0, 10)}
                            </td>
                            <td className="remarks">{item.remarks}</td>
                            <td className="verified_By">{item.verified_By}</td>
                            <td className="text-end total_Amt">
                            <NumberWithCommas 
                                  number=
                              {item.total_Amt} />
                            </td>
                            <td className="action">
                              <ButtonGroup>
                                <div className="d-flex gap-1">
                                  <Link
                                    to={`/payroll-form/details/${item.id}`}
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
                                    to={`/payroll-form/edit/${item.id}`}
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
                                    onClick={() => handleDelete(item.id)}
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
                </div>
                <TablePagination
                  pagesCount={Math.ceil(payrollList.length / pageSize)}
                  currentPage={currentPage}
                  handlePageClick={handlePageClick}
                  handlePreviousClick={handlePreviousClick}
                  handleNextClick={handleNextClick}
                />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default PayrollList;
