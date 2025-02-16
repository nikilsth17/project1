import React, { useState, useEffect } from "react";
import {
  Button,
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  ButtonGroup,
} from "reactstrap";
import { Link } from "react-router-dom";
import Search from "../Starter/Search";
import TablePagination from "../Starter/Pagination";
import LedgersService from "../../../services/AccountingServices/LedgerService";

const LedgerList = (props) => {
  const [MyDatalist, setMyDataList] = useState([]);
  const [Draw, setChildDraw] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);

  async function fetchPosts() {
    try {
      const fetchedPosts = await LedgersService.getList();
      setMyDataList(fetchedPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  }

  const handleViewDetails = async (myObj) => {
    try {
      console.log("LedgerDetails:", myObj);
      if (typeof props.onViewClicked === "function") {
        props.onViewClicked(myObj);
      }
    } catch (error) {
      console.error("Error fetching item details:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      if (window.confirm("Do you really want to delete this LedgerList?")) {
        const deletedItem = await LedgersService.delete(id);
        console.log(
          `Item deleted successfully: ${JSON.stringify(deletedItem)}`
        );

        if (typeof props.onDeleteClick === "function") {
          props.onDeleteClick(deletedItem);
        }
      } else {
        // User clicked Cancel, do nothing or handle accordingly
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      // Handle the error or notify the user about the error
    }
  };

  const handleUpdate = async (aItem) => {
    try {
      if (typeof props.onEditClicked === "function") {
        props.onEditClicked(aItem);
      }
      console.log("ID sent to GLEditor:", aItem);
    } catch (error) {
      console.error("Error updating item:", error);
      // Handle the error or notify the user about the error
    }
  };

  useEffect(() => {
    console.log("triggered ....");
    console.log("Refreshing and checking draw value: ", props.draw);
    setChildDraw(props.draw);
    // Fetch posts when the component mounts
    fetchPosts();
  }, [props]);

  useEffect(() => {
    const filteredGeneral = MyDatalist.filter((ledger) =>
      ledger.ledgerName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(filteredGeneral);
  }, [searchQuery, MyDatalist]);

  const maxPage = Math.ceil(searchResults.length / pageSize);

  const handlePageClick = (pageIndex) => {
    setCurrentPage(pageIndex);
  };

  const handlePreviousClick = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextClick = () => {
    if (currentPage < maxPage - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <React.Fragment>
      <Container fluid>
        <Row>
          <Col lg={12}>
            <Card>
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
                            placeholder="Search.."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
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
                          <th className="sort" data-sort="ledgerName">
                            Ledger
                          </th>
                          <th className="sort" data-sort="code">
                            Code
                          </th>
                          <th className="sort" data-sort="parentGLID">
                            Parent General Ledger
                          </th>
                          <th className="sort" data-sort="glTypeName">
                            General Ledger Type
                          </th>
                          <th className="sort" data-sort="balance">
                            Balance
                          </th>
                          <th className="sort" data-sort="description">
                            Description
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
                              <td className="glName">{item.ledgerName}</td>
                              <td className="code">{item.code}</td>
                              <td className="parentGLID">
                                {item.parentGLName}
                              </td>
                              <td className="glTypeName">{item.glTypeName}</td>
                              <td className="balance">{item.balance}</td>
                              <td className="description">
                                {item.description}
                              </td>
                              <td className="action">
                                <ButtonGroup>
                                  <div className="d-flex gap-1">
                                    <Button
                                      color="btn btn-soft-success"
                                      className="btn-sm gap-1"
                                      onClick={() => handleViewDetails(item)}
                                    >
                                      <i className="bx bx-show" />
                                    </Button>
                                    <Button
                                      color="btn btn-soft-warning"
                                      className="btn-sm gap-1"
                                      onClick={() => handleUpdate(item)}
                                    >
                                      <i className="ri-edit-line"></i>
                                    </Button>
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
                      pagesCount={maxPage}
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
    </React.Fragment>
  );
};

export default LedgerList;
