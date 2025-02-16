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
  Badge,
} from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import ProductsServices from "../../../services/Inventory Services/ProductsServices";
import LayoutWithBreadCrumb from "../../Pages/Starter/LayoutWithBreadCrumb";
import StatusLabel from "../../../Components/sebscommon/StatusLabel";
import CreateButton from "../../Pages/Starter/CreateButton";
import Search from "../../Pages/Starter/Search";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import NumberWithCommas from "../../Pages/Starter/NumberWithCommas";
import TablePagination from "../../Pages/Starter/Pagination"; // Import the TablePagination component

const PList = (props) => {
  const [productList, setProductList] = useState([]);
  const [Draw, setChildDraw] = useState(1);
  const navigate = useNavigate();
  const pageSize = 5; // Set the number of items per page
  const [currentPage, setCurrentPage] = useState(0);

  async function fetchProducts() {
    try {
      const fetchedProducts = await ProductsServices.getList();
      console.log("Fetched Products:", fetchedProducts);
      setProductList(fetchedProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }

  const handleDelete = async (productId) => {
    try {
      if (window.confirm("Do you really want to delete this product?")) {
        const deletedProduct = await ProductsServices.delete(productId);
        console.log(
          `Product deleted successfully: ${JSON.stringify(deletedProduct)}`
        );
        setProductList((prevProductList) =>
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

  const paginatedProductList = productList.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );

  useEffect(() => {
    setChildDraw(props.draw);
    fetchProducts();
  }, [props]);

  return (
    <React.Fragment>
      <div className="page-content">
        <BreadCrumb title="Product List" pageTitle="Product " />
        <Container fluid>
          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <CreateButton
                    to="/product/create"
                    text=" + Create New Product"
                  />
                </CardHeader>
                <CardBody>
                  <div className="table-responsive table-card mt-3 mb-2">
                    <table
                      className="table align-middle table-nowrap"
                      id="Product Table"
                    >
                      <thead className="table-light">
                        <tr>
                          <th className="sort" data-sort="sn">
                            S.N
                          </th>
                          <th className="sort" data-sort="code">
                            Code
                          </th>
                          <th className="sort" data-sort="name">
                            Product
                          </th>
                          <th className="sort" data-sort="categoryId">
                            Category
                          </th>
                          <th className="sort" data-sort="UnitID">
                            Unit
                          </th>
                          <th className="sort text"  data-sort="Last_CP">
                            Cost Price
                          </th>
                          <th className="sort" data-sort="Last_SP">
                            Selling Price
                          </th>
                          <th className="sort" data-sort="Enable_Stock">
                            Stock
                          </th>
                          <th className="sort" data-sort="is_Taxable">
                            Taxable
                          </th>
                          <th className="sort" data-sort="Action">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedProductList.map((product, index) => (
                          <tr key={product.id}>
                            <td className="sn">{index + 1}</td>
                            <td className="code ">{product.code}</td>
                            <td className="name ">{product.name}</td>
                            <td className="categoryname ">
                              <Link
                                to={`/product-category/details/${product.categoryID}`}
                              >
                                {product.categoryName}
                              </Link>
                            </td>
                            <td className="unitname ">
                              <Link
                                to={`/product-unit/details/${product.unitID}`}
                              >
                                {product.unitName}
                              </Link>
                            </td>
                            <td className="last_CP text-end">
                              <NumberWithCommas number={product.last_CP} />
                            </td>
                            <td className="last_SP text-end">
                              <NumberWithCommas number={product.last_SP} />
                            </td>
                            <td className="enable_Stock ">
                              
                             
                              <span className={`badge ${product.enable_Stock  ? 'bg-success' : 'bg-danger'}-subtle text-uppercase text-dark`}>
    {product.enable_Stock  ? 'True' : 'False'}
  </span>
                            </td>
                            {/* <td className="enable_Stock">
  <span
    className={`badge ${
      product.enable_Stock === "True" ? "bg-danger" : "bg-success"
    }-subtle text-uppercase text-dark`}
  >
    {product.enable_Stock ? "True" : "False"}
  </span>
</td> */}

                            <td className="product.is_Taxable ">
                            <span className={`badge ${product.is_Taxable ? 'bg-success' : 'bg-danger'}-subtle text-uppercase text-dark`}>
    {product.is_Taxable ? 'Yes' : 'No'}
  </span>
                            </td>
                            <td >
                              <ButtonGroup size="sm">
                                <div className="d-flex gap-1">
                                  <Link to={`/product/details/${product.id}`}>
                                    <Button
                                      color="btn btn-soft-success"
                                      className="btn-sm gap-1"
                                    >
                                      <i className="bx bx-show" />
                                    </Button>
                                  </Link>

                                  <Link to={`/product/edit/${product.id}`}>
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
                                    onClick={() => handleDelete(product.id)}
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
                    pagesCount={Math.ceil(productList.length / pageSize)}
                    currentPage={currentPage}
                    handlePageClick={handlePageClick}
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

export default PList;
