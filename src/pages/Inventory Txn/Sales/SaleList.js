import React, { useState, useEffect } from "react";
import {
  Button,
  Table,
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  ButtonToggle,
  Label,
  ButtonGroup,
} from "reactstrap";
import SalesServices from "../../../services/Inventory Services/SalesServices";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import LayoutWithBreadCrumb from "../../Pages/Starter/LayoutWithBreadCrumb";
import { useNavigate, Link } from "react-router-dom";
import CreateButton from "../../Pages/Starter/CreateButton";
import Search from "../../Pages/Starter/Search";
import NumberWithCommas from "../../Pages/Starter/NumberWithCommas";
import TablePagination from "../../Pages/Starter/Pagination";
const SaleList = (props) => {
  const navigate = useNavigate();
  const [saleItems, setSaleItems] = useState([]);
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(0);

  async function fetchSaleItems() {
    try {
      const fetchedSaleProducts = await SalesServices.getList();
      console.log("Fetched Products:", fetchedSaleProducts);
      setSaleItems(fetchedSaleProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }



    const handleDelete = async (productId) => {
    try {
      if (window.confirm("Do you really want to delete this product?")) {
        const deletedProduct = await SalesServices.delete(productId);
        console.log(
          `Product deleted successfully: ${JSON.stringify(deletedProduct)}`
        );
        setSaleItems((prevProductList) =>
          prevProductList.filter((product) => product.id !== productId)
        );
      } else {
        // User canceled, do nothing or handle accordingly
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };
  useEffect(() => {
    console.log("triggered ....");
    // console.log('Refreshing and checking draw value: ', props.draw);
    // setChildDraw(props.draw);
    // Fetch posts when the component mounts
    fetchSaleItems();
  }, [props]);

  const maxPage = Math.ceil(saleItems.length / pageSize);

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
    <div className="page-content">
      
        <BreadCrumb title="Sales List" pageTitle="Sales" />
        <Container fluid>
          <Row>
            <Col>
              <Card>
                <CardHeader>
                  <CreateButton to="/sales/create" text="  + Create New Sale" />
                </CardHeader>
                <CardBody>
                  <div className="table-responsive table-card mt-3 mb-1">
                    <table
                      className="table align-middle table-nowrap"
                      id="customerTable"
                    >
                      <thead className="table-light">
                        <tr>
                          <th className="sort">S.N</th>
                          <th className="sort">Date</th>
                          <th className="sort">Customer</th>
                          <th className="sort">Invoice No.</th>
                        
                          <th className="sort">Remarks</th>
                          <th className="sort">Sub Total</th>
                          <th className="sort">Discount Amount</th>
                          <th className="sort">Total</th>
                          {/* <th className="sort">VAt Percentage</th>
                          <th className="sort">VAt Amount</th> */}
                          <th className="sort">Net Amount</th>
                          <th className="sort">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {saleItems
                          .slice(
                            currentPage * pageSize,
                            (currentPage + 1) * pageSize
                          )
                          .map((saleItem, index) => (
                            <tr key={saleItem.id}>
                              <td>{index + 1}</td>
                              <td >
                                {saleItem.date
                                  .split("T")[0]
                                  .replace(
                                    /(\d{4})-(\d{2})-(\d{2})/,
                                    "$1-$2-$3"
                                  )
                                  .substring(0, 10)}
                              </td>

                              <td>
                                
                                <Link
                                  to={`/customers/details/${saleItem.customerId}`}
                                >
                                  {saleItem.customerName}
                                </Link>
                              </td>
                              <td className="text-end">{saleItem.invoice_No}</td>
                              
                              <td>{saleItem.remarks}</td>
                              <td className="text-end">
                                <NumberWithCommas number={saleItem.sub_Total} />
                              </td>
                              <td className="text-end">
                                <NumberWithCommas number={saleItem.disc_Amt} />
                              </td>
                              <td className="text-end">
                                <NumberWithCommas number={saleItem.total} />
                              </td>
                              {/* <td>{saleItem.vaT_Per}</td>
                              <td>
                                <NumberWithCommas number={saleItem.vaT_Amt} />
                              </td> */}
                              <td className="text-end">
                                <NumberWithCommas number={saleItem.net_Amt} />
                              </td>
                              <td>
                                <ButtonGroup size="sm">
                                  <div className=" d-flex gap-1 ">
                                    <Link to={`/sales/details/${saleItem.id}`}>
                                      <Button
                                        color="btn btn-soft-success"
                                        className="btn-sm gap-1"
                                      >
                                        <i className="bx bx-show" />
                                      </Button>
                                    </Link>

                                    <Link to={`/sales/edit/${saleItem.id}`}>
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
                                      onClick={() => handleDelete(saleItem.id)}
                                    >
                                      <i className="ri-delete-bin-5-line" />
                                    </Button>
                                    {/* //for an edit data  */}
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
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
    
    </div>
    </React.Fragment>
  );
};

export default SaleList;
