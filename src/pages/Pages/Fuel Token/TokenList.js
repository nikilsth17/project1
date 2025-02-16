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
import CreateButton from "../Starter/CreateButton";
import FuelTokenServices from "../../../services/HRService/FuelTokenServices";
import TablePagination from "../Starter/Pagination";
import NumberWithCommas from "../Starter/NumberWithCommas";

function TokenList() {
  const navigate = useNavigate();
  const [fuelList, setFuelList] = useState([]);
  const [error, setError] = useState(null);
  const pageSize = 5; // Set the number of items per page
  const [currentPage, setCurrentPage] = useState(0);

  async function fetchFuel() {
    try {
      const fetchedPurchase = await FuelTokenServices.getList();
      setFuelList(fetchedPurchase);
    } catch (err) {
      setError(err);
    }
  }

  useEffect(() => {
    fetchFuel();
  }, []);

 

  const handleDelete = async (productId) => {
    try {
      if (window.confirm("Do you really want to delete this product?")) {
        const deletedProduct = await FuelTokenServices.delete(productId);
        console.log(
          `Product deleted successfully: ${JSON.stringify(deletedProduct)}`
        );
        setFuelList((prevProductList) =>
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
    const maxPage = Math.ceil(fuelList.length / pageSize);
    if (currentPage < maxPage - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <BreadCrumb title="Fuel Token List" pageTitle="Fuel Token" />
        <Container fluid>
          <Row>
            <Col>
              <Card>
                <CardHeader>
                  <CreateButton
                    to="/Fuel_Token-list/create"
                    text="+ Create New Token"
                  />
                </CardHeader>
                <CardBody>
                  <div className="table-responsive table-card mt-3 mb-1">
                    <table className="table align-middle table-nowrap">
                      <thead className="table-light">
                        <tr>
                          <td className="sort">S.N</td>
                          <td className="sort">Driver</td>
                          <td className="sort">Vehicle.No</td>
                          <td className="sort">Fuel</td>
                          <td className="sort">Pump</td>
                          <td className="sort">Issue By</td>
                          <td className="sort">Issue Date</td>
                          <td className="sort">Issue Time</td>
                          <td className="sort">Quantity</td>
                          <td className="sort">Remarks</td>
                          <td className="sort">Actions</td>
                        </tr>
                      </thead>
                      <tbody>
                        {fuelList
                          .slice(
                            currentPage * pageSize,
                            (currentPage + 1) * pageSize
                          )
                          .map((token, index) => (
                            <tr key={token.id}>
                              <td>{index + 1}</td>
                              <td > {token.driverName}</td>
                              <td >{token.vehicleNo}
                                {/* <Link to={`/vehicle-form/details/${token.id}`}>
                                  {token.vehicleNo}
                                </Link> */}
                              </td>
                              <td >{token.fuelType}</td>
                              <td>{token.pumpName}
                                {/* <Link to={`/vendor/details/${token.id}`}>
                                  {token.pumpName}
                                </Link> */}
                              </td>
                              <td >{token.issued_By} </td>
                              <td >
                                {token._Issued_Date
                                  .split("T")[0]
                                  .replace(
                                    /(\d{4})-(\d{2})-(\d{2})/,
                                    "$1-$2-$3"
                                  )}
                              </td>
                              <td className="text-end">{token.issued_Time}</td>
                              <td className="text-end"> 
                              <NumberWithCommas
                              number={token.quantity}/>
                              </td>
                              <td >{token.remarks}</td>
                              <td className="text-center">
                                <ButtonGroup size="sm">
                                  <div className="d-flex gap-1">
                                    <Link
                                      to={`/Fuel_Token-list/details/${token.id}`}
                                      state={{ token }}
                                    >
                                      <Button
                                        color="btn btn-soft-success"
                                        className="btn-sm gap-1"
                                      >
                                        <i className="bx bx-show" />
                                      </Button>
                                    </Link>
                                    <Link
                                      to={`/Fuel_Token-list/edit/${token.id}`}
                                      state={{ token }}
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
                                      onClick={() => handleDelete(token.id)}
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
                  </div>
                  <TablePagination
                    pagesCount={Math.ceil(fuelList.length / pageSize)}
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
}

export default TokenList;
