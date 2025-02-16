import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import LayoutWithBreadCrumb from "../../Pages/Starter/LayoutWithBreadCrumb";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  Table,
  Button,
  ButtonGroup,
} from "reactstrap";

import TablePagination from "../Starter/Pagination";
import NumberWithCommas from "../Starter/NumberWithCommas";
import EmployeeSettlementService from "../../../services/HRService/EmployeeSettlementService";

const EmployeeSettlementList = () => {
  const navigate = useNavigate();
  const [settlementList, setSettlementList] = useState([]);
  const [error, setError] = useState(null);
  const pageSize = 5; // Set the number of items per page
  const [currentPage, setCurrentPage] = useState(0);

  async function fetchsettlementList() {
    try {
      const fetchedsettlementList = await EmployeeSettlementService.getList();
      setSettlementList(fetchedsettlementList);
    } catch (err) {
      setError(err);
    }
  }

  const handleNavigationForm = () => {
    navigate("/settlement-form");
  };

  const handleDelete = async (productId) => {
    try {
      if (window.confirm("Do you really want to delete EmploySettlement?")) {
        const deletedProduct = await  EmployeeSettlementService.delete(productId);
        console.log(
          `Product deleted successfully: ${JSON.stringify(deletedProduct)}`
        );
        EmployeeSettlementService((prevProductList) =>
          prevProductList.filter((product) => product.id !== productId)
        );
      } else {
        // User canceled, do nothing or handle accordingly
      }
    } catch (error) {
      console.error("Error deleting product:", error);
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
    const maxPage = Math.ceil(settlementList.length / pageSize);
    if (currentPage < maxPage - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  useEffect(() => {
    fetchsettlementList();
  }, []);

  return (
    <div className="page-content">
      <BreadCrumb
        title="Employee Settlement List"
        pageTitle="Employee Settlement"
      />
      <Container fluid>
        <Row>
          <Col>
            <Card>
              <CardHeader>
                <Button
                  color="success"
                  onClick={handleNavigationForm}
                  className="float-end"
                >
                  <i className="ri-add-line align-bottom me-1"></i>Create
                  Employee Settlement List
                </Button>
              </CardHeader>
              <CardBody>
                <div className="table-responsive table-card mt-3 mb-1">
                  <table className="table align-middle table-nowrap">
                    <thead className="table-light">
                      <tr>
                        <th className="sort" data-sort="sn">
                          S.N
                        </th>
                        {/* <th className="sort" data-sort="_Date">
                          Date
                        </th> */}
                        <th className="sort" data-sort="settlement_Date">
                          Settlement Date
                        </th>
                        <th className="sort" data-sort="verified by">
                          Verified By
                        </th>

                        <th className="sort" data-sort="remarks">
                          Remarks
                        </th>
                        <th className="sort" data-sort="action">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {settlementList
                        .slice(
                          currentPage * pageSize,
                          (currentPage + 1) * pageSize
                        )
                        .map((item, index) => (
                          <tr key={item.id}>
                            <td className="sn">{index + 1}</td>
                            <td className="_Date">
                              {item._Date
                                .split("T")[0]
                                .replace(/(\d{4})-(\d{2})-(\d{2})/, "$1-$2-$3")
                                .substring(0, 10)}
                            </td>
                            {/* <td className="settlement_Date">
                              {item.settlement_Date}
                            </td> */}
                            <td className="verified by">{item.verified_By}</td>

                            <td className="remarks">{item.remarks}</td>
                            <td className="action">
                              <ButtonGroup>
                                <div className="d-flex gap-1">
                                  <Link
                                    to={`/settlement-form/details/${item.id}`}
                                  >
                                    <Button
                                      color="btn btn-soft-success"
                                      className="btn-sm gap-1"
                                    >
                                      <i className="bx bx-show" />
                                    </Button>
                                  </Link>
                                  <Link to={`/settlement-form/edit/${item.id}`}>
                                    <Button
                                      color="btn btn-soft-warning"
                                      className="btn-sm gap-1"
                                    >
                                      <i className="ri-edit-line"></i>
                                    </Button>
                                  </Link>
                                  <Button
                                    className="btn btn-soft-danger btn-sm gap-1"
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
                  pagesCount={Math.ceil(settlementList.length / pageSize)}
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
};

export default EmployeeSettlementList;
