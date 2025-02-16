import React, { useState, useEffect } from "react";
import {
  Container,
  Table,
  Button,
  ButtonGroup,
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
} from "reactstrap";
import { Link, useParams, useNavigate } from "react-router-dom";
import UnitsService from "../../../services/Inventory Services/UnitsService";
import LayoutWithBreadCrumb from "../../Pages/Starter/LayoutWithBreadCrumb";
import CreateButton from "../../Pages/Starter/CreateButton";
import Search from "../../Pages/Starter/Search";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import TablePagination from "../../Pages/Starter/Pagination";
import NumberWithCommas from "../../Pages/Starter/NumberWithCommas";

const PUList = (props) => {
  const navigate = useNavigate();
  const [DataList, setDataList] = useState([]);
  const pageSize = 5;
  const [currentPage, setCurrentPage] = useState(0);

  async function fetchPosts() {
    try {
      const fetchedPosts = await UnitsService.getList();
      console.log("Fetched Posts:", fetchedPosts);
      setDataList(fetchedPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  }

  // Function to handle item deletion
  // const deleteItem = async (itemId) => {
  //   try {
  //     await UnitsService.delete(itemId);

  //     setDataList((prevData) => prevData.filter((item) => item.id !== itemId));
  //   } catch (error) {
  //     console.error("Error deleting item:", error);
  //   }
  // };

  const handleDelete = async (itemId) => {
    try {
      const deletedItem = await UnitsService.delete(itemId);

      if (
        window.confirm("Do you really want to delete this Product Unit List?")
      ) {
        console.log(
          `Product deleted successfully: ${JSON.stringify(deletedItem)}`
        );
        setDataList((prevDataList) =>
          prevDataList.filter((product) => product.id !== itemId)
        );
      } else {
        // User clicked Cancel or closed the dialog, do nothing or handle accordingly
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handlePageClick = (pageIndex) => {
    setCurrentPage(pageIndex);
  };

  const handlePreviousClick = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextClick = () => {
    const maxPage = Math.ceil(DataList.length / pageSize);
    if (currentPage < maxPage - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const paginatedDataList = DataList.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );

  return (
    <React.Fragment>
      <div className="page-content">
        <BreadCrumb title="Product Unit List" pageTitle="Product_Unit" />
        <Container fluid>
          <Row>
            <Col>
              <Card>
                <CardHeader>
                  <CreateButton
                    to="/product-unit/create"
                    text="+ Create New Product Unit"
                  />
                </CardHeader>
                <CardBody>
                  <Row className="g-4 mb-3"></Row>

                  <div className="table-responsive table-card mt-3 mb-1">
                    <table
                      className="table align-middle table-nowrap"
                      id="ProductUnitTable"
                    >
                      <thead className="table-light">
                        <tr>
                          <th
                            className="sort"
                            data-sort="sn"
                            style={{ width: "30%" }}
                          >
                            SN
                          </th>
                          <th
                            className="sort"
                            data-sort="name"
                            style={{ width: "30%" }}
                          >
                            Unit
                          </th>
                          <th
                            className="sort"
                            data-sort="ratio"
                            style={{ width: "30%" }}
                          >
                            Ratio
                          </th>
                          <th
                            className="sort"
                            data-sort="action"
                            style={{ width: "50%" }}
                          >
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="list form-check-all">
                        {paginatedDataList.map((item, index) => (
                          <tr key={item.id}>
                            <td className="sn">{index + 1}</td>
                            <td className="name ">{item.name}</td>
                            <td className="ratio">
                         {item.ratio}
                                       </td>
                            <td>
                              <ButtonGroup size="sm">
                                <div className="d-flex gap-1">
                                  {/* <Link to={`/product-unit/details/${item.id}`}>
                                    <Button
                                      color="btn btn-soft-success"
                                      className="btn-sm gap-1"
                                    >
                                      <i className="bx bx-show" />
                                    </Button>
                                  </Link> */}

                                  <Link to={`/product-unit/edit/${item.id}`}>
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
                                    <i className="ri-delete-bin-5-line" />
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
                    pagesCount={Math.ceil(DataList.length / pageSize)}
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
    </React.Fragment>
  );
};

export default PUList;
