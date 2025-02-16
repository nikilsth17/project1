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
  Table,
} from "reactstrap";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import EmployeeSalaryService from "../../../services/HRService/EmployeeSalaryService";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import NumberWithCommas from "../Starter/NumberWithCommas";
import TablePagination from "../Starter/Pagination";

function EmployeeSalaryList(props) {
  const [MyDatalist, setMyDatalist] = useState([]);
  const pageSize = 5;
  const [currentPage, setCurrentPage] = useState(0);
  const navigate = useNavigate();

  const handleNavigationForm = () => {
    navigate("/employeesalary-form");
  };

  async function fetchPosts() {
    try {
      const fetchedPosts = await EmployeeSalaryService.getList();
      console.log("Fetched Posts:", fetchedPosts);
      setMyDatalist(fetchedPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  }

  const handleDelete = async (id) => {
    try {
      if (
        window.confirm("Do you really want to delete this EmployeeSalaryList?")
      ) {
        await EmployeeSalaryService.delete(id);
        console.log("Deleted Successfully");
        fetchPosts(); // Re-fetch data to refresh the list
      } else {
        // User clicked Cancel or closed the dialog, do nothing or handle accordingly
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      // Handle the error or notify the user about the error
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

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

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Employee Salary List" pageTitle="Employee" />
          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <div className="d-flex justify-content-sm-end">
                    <Button
                      color="success"
                      onClick={handleNavigationForm}
                      className="float-end"
                    >
                      <i className="ri-add-line align-bottom me-1"></i>Create
                      Employee Salary List
                    </Button>
                  </div>
                </CardHeader>

                <CardBody>
                  <div id="customerList">
                    <Row className="g-4 mb-3">
                      <Col className="col-sm-auto"></Col>
                    </Row>

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
                            <th className="sort" data-sort="employeeName">
                              Employee
                            </th>
                            <th className="sort" data-sort="basic">
                              Basic
                            </th>
                            <th className="sort" data-sort="grade">
                              Grade
                            </th>
                            <th className="sort" data-sort="sub_Total">
                              Total
                            </th>
                            <th className="sort" data-sort="allowance">
                              Allowance
                            </th>
                            <th className="sort" data-sort="deductions">
                              Deductions
                            </th>
                            <th className="sort" data-sort="net_Payable_Amt">
                              Net Amount
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
                              <td className="employeeName">
                            
                                {item.employeeName}
                              </td>
                              <td className="basic text-end">
                                <NumberWithCommas number={item.basic} />
                              </td>
                              <td className="grade text-end">
                                <NumberWithCommas number={item.grade} />
                              </td>
                              <td className="sub_Total text-end">
                                <NumberWithCommas number={item.sub_Total} />
                              </td>
                              <td className="allowance text-end">
                                <NumberWithCommas number={item.allowance} />
                              </td>
                              <td className="deductions text-end">
                                <NumberWithCommas number={item.deductions} />
                              </td>
                              <td className="net_Payable_Amt text-end">
                                <NumberWithCommas
                                  number={item.net_Payable_Amt}
                                />
                              </td>
                              <td className="action">
                                <ButtonGroup>
                                  <div className="d-flex gap-1">
                                    <Link
                                      to={`/employeesalary-form/details/${item.id}`}
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
                                      to={`/employeesalary-form/edit/${item.id}`}
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
                      pagesCount={Math.ceil(MyDatalist.length / pageSize)}
                      currentPage={currentPage}
                      handlePageClick={handlePageClick}
                      handlePreviousClick={handlePreviousClick}
                      handleNextClick={handleNextClick}
                    />
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

export default EmployeeSalaryList;
