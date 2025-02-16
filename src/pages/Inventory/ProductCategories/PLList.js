import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Container,
  ButtonGroup,
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
} from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import ProductCategoriesServices from "../../../services/Inventory Services/ProductCategoriesServices";
import LayoutWithBreadCrumb from "../../Pages/Starter/LayoutWithBreadCrumb";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import StatusLabel from "../../../Components/sebscommon/StatusLabel";
import CreateButton from "../../Pages/Starter/CreateButton";
import TablePagination from "../../Pages/Starter/Pagination";

const ProductCategoryList = (props) => {
  const navigate = useNavigate();
  const [formlist, setFormlist] = useState([]);
  const [Draw, setChildDraw] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 5;

  async function fetchPosts() {
    try {
      const fetchedPosts = await ProductCategoriesServices.getList();
      console.log("Fetched Posts:", fetchedPosts);
      setFormlist(fetchedPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  }

  // Function to handle item deletion
  const handleDelete = async (itemId) => {
    try {
      const deletedItem = await ProductCategoriesServices.delete(itemId);

      if (
        window.confirm(
          "Do you really want to delete this Product Category List?"
        )
      ) {
        console.log(
          `Product deleted successfully: ${JSON.stringify(deletedItem)}`
        );
        setFormlist((prevformlist) =>
          prevformlist.filter((product) => product.id !== itemId)
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
    const maxPage = Math.ceil(formlist.length / pageSize);
    if (currentPage < maxPage - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Filter the displayed results based on the search query
  const filteredFormlist = formlist.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    console.log("triggered ....");
    console.log("Refreshing and checking draw value: ", props.draw);
    setChildDraw(props.draw);
    fetchPosts();
  }, [props]);

  return (
    <React.Fragment>
      <div className="page-content">
        <BreadCrumb
          title="Product Category List"
          pageTitle="Product_Category"
        />
        <Container fluid>
          <Row>
            <Col lg={12}>
              <Card id="ProductCategory">
                <CardHeader>
                  <CreateButton
                    to="/product-category/create"
                    text="+ Create New ProductCategory"
                  />
                </CardHeader>
                <CardBody>
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
                            S.N
                          </th>
                          <th className="sort" data-sort="Code">
                            Code
                          </th>
                          <th className="sort" data-sort="Name">
                            Category
                          </th>
                          <th className="sort" data-sort="Status">
                            Status
                          </th>
                          <th className="sort" data-sort="Action">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="text align-center">
                        {filteredFormlist
                          .slice(
                            currentPage * pageSize,
                            (currentPage + 1) * pageSize
                          )
                          .map((item, index) => (
                            <tr key={item.id}>
                              <td className="sn">{index + 1}</td>
                              <td className="code ">{item.code}</td>
                              <td className="name ">{item.name}</td>
                              <td className="status ">
                              <StatusLabel  text={item.status ? 'Active' : 'InActive'} isTaxable={item.status} />
      {/* <StatusLabel value={item.status} /> */}
                              </td>
                              <td className=" ">
                                <ButtonGroup size="sm">
                                  <div className="d-flex gap-1 float-end">
                                    {/* <Link
                                      to={`/product-category/details/${item.id}`}
                                    >
                                      <Button
                                        color="btn btn-soft-success"
                                        className="btn-sm gap-1"
                                      >
                                        <i className="bx bx-show" />
                                      </Button>
                                    </Link> */}

                                    <Link
                                      to={`/product-category/edit/${item.id}`}
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
                    pagesCount={Math.ceil(filteredFormlist.length / pageSize)}
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

export default ProductCategoryList;
