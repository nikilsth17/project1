import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import CustomerServices from "../../../services/Inventory Services/CustomerServices";
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
import CreateButton from "../../Pages/Starter/CreateButton";
import NumberWithCommas from "../../Pages/Starter/NumberWithCommas";
import TablePagination from "../../Pages/Starter/Pagination"; // Import the TablePagination component
import VendorsServices from "../../../services/Inventory Services/VendorServices";

const SaleCustomersLists = () => {
  const navigate = useNavigate();
  const [saleCustomers, setSaleCustomers] = useState([]);
  const [error, setError] = useState(null);
  const pageSize = 5; // Set the number of items per page
  const [currentPage, setCurrentPage] = useState(0);

  async function fetchCustomers() {
    try {
      const fetchedCustomers = await VendorsServices.getList();
      setSaleCustomers(fetchedCustomers);
    } catch (err) {
      setError(err);
    }
  }

  const handleDelete = async (productId) => {
    try {
      if (window.confirm("Do you really want to delete this vendor?")) {
        const deletedProduct = await VendorsServices.delete(productId);
        console.log(
          `Product deleted successfully: ${JSON.stringify(deletedProduct)}`
        );
        setSaleCustomers((prevProductList) =>
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

  const paginatedSaleCustomers = saleCustomers.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Vendor List" pageTitle="Vendor " />

          <Row>
            <Col>
              <Card>
                <CardHeader>
                  <CreateButton
                    to="/vendor/create"
                    text=" + Create New Vendor"
                  />
                </CardHeader>
                <CardBody>
                  <div className="table-responsive table-card mt-3 mb-2">
                    <table className="table align-middle table-nowrap">
                      <thead className="table-light">
                        <tr>
                          <th className="sort">S.N</th>
                          <th className="sort">Name</th>
                          <th className="sort">Address</th>
                          <th className="sort">Telephone No.</th>
                          <th className="sort">Opening Balance</th>
                          <th className="sort">Registration No.</th>

                          <th className="sort">Registered Date</th>
                          <th className="sort">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedSaleCustomers.map((customer, index) => (
                          <tr key={customer.id}>
                            <td>{index + 1}</td>
                            <td className="name">{customer.name}</td>
                            <td className="address">{customer.address}</td>
                            <td className="text-end">
                             
                               {customer.tel_No}
                             
                            </td>
                            <td className="text-end">
                              
                            <NumberWithCommas
                                          number=  {customer.opening_Balance}
                                        />
                            
                            </td>
                            <td  className="text-end">{customer.registration_No}</td>
                            
                            <td className="date">
                              {customer.registered_Date
                                .split("T")[0]
                                .replace(/(\d{4})-(\d{2})-(\d{2})/, "$1-$2-$3")
                                .substring(0, 10)}
                            </td>
                                  <td className="button">
                              <ButtonGroup size="sm">
                                <div className="d-flex gap-1">
                                  <Link to={`/vendor/viewdetails/${customer.id}`}>
                                    <Button
                                      color="btn btn-soft-success"
                                      className="btn-sm gap-1"
                                    >
                                      <i className="bx bx-show" />
                                    </Button>
                                  </Link>
                                  <Link to={`/vendor/edit/${customer.id}`}>
                                    <Button
                                      color="btn btn-soft-warning"
                                      className="btn-sm gap-1"
                                    >
                                      <i className="ri-edit-line" />
                                    </Button>
                                  </Link>
                                  <Button
                                    className="btn btn-soft-danger btn-sm gap-1"
                                    color="danger"
                                    onClick={() => handleDelete(customer.id)}
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
                    pagesCount={Math.ceil(saleCustomers.length / pageSize)}
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

export default SaleCustomersLists;
