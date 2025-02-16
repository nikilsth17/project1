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
import { Link } from "react-router-dom";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import EmployeeService from "../../../services/HRService/EmployeeService";
import { useNavigate } from "react-router-dom";

import TablePagination from "../Starter/Pagination";
function EmployeeList(props) {
  const [MyDatalist, setMyDatalist] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const pageSize = 5;
  const [currentPage, setCurrentPage] = useState(0);
  const navigate = useNavigate();

  const handleNavigationForm = () => {
    navigate("/employee-form"); // Replace with the actual path
  };

  async function fetchPosts() {
    try {
      const fetchedPosts = await EmployeeService.getList();
      setMyDatalist(fetchedPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  }

  const handleDelete = async (id) => {
    try {
      if (window.confirm("Do you really want to delete this EmployeeList?")) {
        await EmployeeService.delete(id);
        console.log("Deleted Successfully");
        // Refresh the data after deletion
        fetchPosts();
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
    const maxPage = Math.ceil(searchResults.length / pageSize);
    if (currentPage < maxPage - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  useEffect(() => {
    // Filter employees based on searchQuery
    const filteredEmployees = MyDatalist.filter((employee) =>
      employee.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    // Update the searchResults with the filtered data
    setSearchResults(filteredEmployees);
  }, [searchQuery, MyDatalist]);

  return (
    <React.Fragment>
      <div className="page-content">
        <BreadCrumb title="Employee List" pageTitle="Employee Form" />
        {/* <BreadCrumb
          title="Employee List"
          pageTitle="Employee Form"
          breadcrumbItems={[{ title: "Employee Form", link: "/employee-form" }]}
        /> */}
        <Container fluid>
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
                      <i className="ri-add-line align-bottom me-1"></i> Create
                      Employee List
                    </Button>
                  </div>
                </CardHeader>
                <CardBody>
                  <div id="customerList">
                    <Row className="g-4 mb-3">
                      <Col className="col-sm-auto"></Col>
                      <Col className="col-sm">
                        <div className="d-flex justify-content-sm-right">
                          <div className="search-box ms-2">
                            <input
                              type="text"
                              className="form-control search"
                              placeholder="Search..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <i className="ri-search-line search-icon"></i>
                          </div>
                        </div>
                      </Col>
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
                            <th className="sort" data-sort="employee_name">
                              Name
                            </th>
                            <th className="sort" data-sort="phoneno.">
                              PhoneNumber
                            </th>
                            <th className="sort" data-sort="email">
                              Email
                            </th>
                            <th className="sort" data-sort="address">
                              Address
                            </th>
                            <th className="sort" data-sort="dob">
                              Date of Birth
                            </th>
                            <th className="sort" data-sort="gender">
                              Gender
                            </th>
                            <th className="sort" data-sort="nationality">
                              Nationality
                            </th>
                            <th className="sort" data-sort="action">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody className="list form-check-all">
                          {searchResults
                            .slice(
                              currentPage * pageSize,
                              (currentPage + 1) * pageSize
                            )
                            .map((item, index) => (
                              <tr key={item.id}>
                                <td className="sn">{index + 1}</td>

                                <td className="employee_name">{item.name}</td>
                                <td className="phoneno">{item.phoneNumber}</td>
                                <td className="email">{item.email}</td>
                                <td className="address">{item.address}</td>
                                <td className="dob">
                                  {item.dob
                                    .split("T")[0]
                                    .replace(
                                      /(\d{4})-(\d{2})-(\d{2})/,
                                      "$1-$2-$3"
                                    )}
                                </td>

                                <td className="gender">
                                  <span
                                    className={`badge ${
                                      item.gender === "Male"
                                        ? "bg-danger"
                                        : "bg-success"
                                    }-subtle text-uppercase text-dark`}
                                  >
                                    {item.gender}
                                  </span>
                                </td>

                                <td className="nationality">
                                  {item.nationality}
                                </td>
                                <td className="action">
                                  <ButtonGroup>
                                    <div className="d-flex gap-1">
                                      <Link
                                        to={`/employee-form/viewdetails/${item.id}`}
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
                                        to={`/employee-form/edit/${item.id}`}
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
                      <TablePagination
                        pagesCount={Math.ceil(searchResults.length / pageSize)}
                        currentPage={currentPage}
                        handlePageClick={handlePageClick}
                        handlePreviousClick={handlePreviousClick}
                        handleNextClick={handleNextClick}
                      />
                    </div>
                    {/* <div className="d-flex justify-content-end">
                      <div className="pagination-wrap hstack gap-2">
                        <Link
                          className="page-item pagination-prev disabled"
                          to="#"
                        >
                          Previous
                        </Link>
                        <ul className="pagination listjs-pagination mb-0"></ul>
                        <Link className="page-item pagination-next" to="#">
                          Next
                        </Link>
                      </div>
                    </div> */}
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

export default EmployeeList;
