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
import NumberWithCommas from "../../Pages/Starter/NumberWithCommas";
import PurchasesServices from "../../../services/Inventory Services/PurchasesServices";
import Search from "../../Pages/Starter/Search";
import CreateButton from "../../Pages/Starter/CreateButton";
import TablePagination from "../../Pages/Starter/Pagination";
const PurchaseList = () => {
  const navigate = useNavigate();
  const [purchaseList, setPurchaseList] = useState([]);
  const [error, setError] = useState(null);
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(0);

  async function fetchPurchase() {
    try {
      const fetchedPurchase = await PurchasesServices.getList();
      setPurchaseList(fetchedPurchase);
    } catch (err) {
      setError(err);
    }
  }



  
  const handleDelete = async (productId) => {
    try {
      if (window.confirm("Do you really want to delete this product?")) {
        const deletedProduct = await  PurchasesServices.delete(productId);
        console.log(
          `Product deleted successfully: ${JSON.stringify(deletedProduct)}`
        );
        setPurchaseList((prevProductList) =>
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
    fetchPurchase();
  }, []);

  const maxPage = Math.ceil(purchaseList.length / pageSize);

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
     
        <BreadCrumb title="Purchases" pageTitle="Purchases List" />
        <Container fluid>
          <Row>
            <Col>
              <Card>
                <CardHeader>
                  <CreateButton
                    to="/purchases/create"
                    text="+ New Purchase"
                    value="Purchases List"
                  />
                </CardHeader>
                <CardBody>
                  <div className="table-responsive table-card mt-3 mb-1">
                    <table className="table align-middle table-nowrap">
                      <thead className="table-light">
                        <tr>
                          <th className="sort" data-sort="sn">
                            S.N
                          </th>

                          <th className="sort" data-sort="vendor">
                            Vendor
                          </th>
                          <th className="sort" data-sort="date">
                            Date
                          </th>
                          <th className="sort" data-sort="invoice number">
                            Invoice No
                          </th>
                          <th className="sort" data-sort="remarks">
                            Sub Total
                          </th>
                          
                          <th className="sort" data-sort="remarks">
                            Disc Amount
                          </th>
                          <th className="sort" data-sort="total">
                            Total
                          </th>
                          <th className="sort" data-sort="net amount">
                            Net Amount
                          </th>
                          <th className="sort" data-sort="remarks">
                            Remarks
                          </th>
                          
                          {/* <th className="sort" data-sort="additional_Disc_Amt">additional_Disc_Amt</th> */}
                          
                          {/* <th className="sort" data-sort="vaT_Per">vaT_Per</th>
                          <th className="sort" data-sort="vaT_Amt">vaT_Amt</th> */}
                          
                          <th className="sort" data-sort="actions">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {purchaseList
                          .slice(
                            currentPage * pageSize,
                            (currentPage + 1) * pageSize
                          )
                          .map((Purchase, index) => (
                            <tr key={Purchase.id}>
                              <td>{index + 1}</td>

                              <td>
                                <Link
                                  to={`/vendor/details/${Purchase.vendorId}`}
                                >
                                  {Purchase.vendorName}
                                </Link>
                              </td>
                              <td className="month ">
                                {Purchase.date
                                  .split("T")[0]
                                  .replace(
                                    /(\d{4})-(\d{2})-(\d{2})/,
                                    "$1-$2-$3"
                                  )
                                  .substring(0, 10)}
                              </td>
                              <td className="text-end">{Purchase.invoice_No}</td>
                              
                              <td className="text-end">
                                
                              <NumberWithCommas
                                          number={Purchase.sub_Total}
                                        />
                                </td>
                              <td className="text-end">
                              <NumberWithCommas
                                          number= {Purchase.disc_Amt}
                                        />
                               </td>
                              {/* <td>{Purchase.additional_Disc_Amt}</td> */}
                              <td className="text-end">
                                       
                              <NumberWithCommas
                                          number={Purchase.total}
                                        />
                                </td>
                              {/* <td>{Purchase.vaT_Per}</td>
                              <td>{Purchase.vaT_Amt}</td> */}
                              <td className="text-end">
                              <NumberWithCommas
                                          number={Purchase.net_Amt}
                                        />
                                </td>
                              <td>{Purchase.remarks}</td>
                              
                              <td>
                                <ButtonGroup size="sm">
                                  <div className="d-flex gap-1">
                                    <Link
                                      to={`/purchases/details/${Purchase.id}`}
                                    >
                                      <Button
                                        color="btn btn-soft-success"
                                        className="btn-sm gap-1"
                                      >
                                        <i className="bx bx-show" />
                                      </Button>
                                    </Link>

                                    <Link to={`/purchases/edit/${Purchase.id}`}>
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
                                      onClick={() => handleDelete(Purchase.id)}
                                    >
                                      <i className="ri-delete-bin-5-fill"></i>
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
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
  
    </div>
    </React.Fragment>
  );
};

export default PurchaseList;
